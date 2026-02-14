import React, { useEffect, useState, useRef, useMemo } from 'react';
import { SchedulerEvent, Resource, ViewType, EzSchedulerComponents, GroupModel } from '../EzScheduler.types';
import { isSameDay, areIntervalsOverlapping, addMinutes } from 'date-fns';
import { cn } from '../../../lib/utils';
import { Clock } from 'lucide-react';
import { Virtualizer } from '@tanstack/react-virtual';
import { format } from 'date-fns';
import { DraggableEvent } from '../components/dnd/DraggableEvent';
import { DroppableSlot } from '../components/dnd/DroppableSlot';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { useMediaQuery, useCurrentTime } from '../../../shared/hooks';
import { renderTemplate } from '../utils/sanitizeHtml';
import { getWeekNumber } from '../utils/getWeekNumber';

/**
 * Props for the DayWeekView component.
 */
interface DayWeekViewProps {
    /** 
     * List of days to display in the view.
     * @group Properties 
     */
    daysInView: Date[];
    /** 
     * List of events to display.
     * @group Properties 
     */
    visibleEvents: SchedulerEvent[];
    /** 
     * Virtualizer for efficient row rendering.
     * @group Properties 
     */
    rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
    /** 
     * List of resources to display as columns (in day view).
     * @group Properties 
     */
    resources?: Resource[];
    /** 
     * Whether to show resources as separate columns in day view.
     * @group Properties 
     */
    showResourcesInDayView?: boolean;
    /** 
     * Callback when a slot is clicked.
     * @group Events 
     */
    onSlotClick?: (date: Date, resourceId?: string) => void;
    /** 
     * Callback when a slot is double-clicked.
     * @group Events 
     */
    onSlotDoubleClick?: (date: Date, resourceId?: string) => void;
    /** 
     * Callback when an event is clicked.
     * @group Events 
     */
    onEventClick?: (event: SchedulerEvent) => void;
    /** 
     * Callback when an event is double-clicked.
     * @group Events 
     */
    onEventDoubleClick?: (event: SchedulerEvent) => void;
    /** 
     * Callback when an event is deleted.
     * @group Events 
     */
    onEventDelete?: (eventId: string) => void;
    /** 
     * ID of the currently active event.
     * @group Properties 
     */
    activeEventId?: string;
    /** 
     * Reference to the scroll container.
     * @group Properties 
     */
    scrollRef?: React.RefObject<HTMLDivElement | null>;
    /** 
     * Callback when the view mode changes.
     * @group Events 
     */
    onViewChange?: (view: ViewType) => void;
    /** 
     * Callback when the selected date changes.
     * @group Events 
     */
    onDateChange?: (date: Date) => void;
    /** 
     * Locale for date formatting.
     * @group Properties 
     */
    locale?: string;
    /** 
     * Custom components for injection.
     * @group Properties 
     */
    components?: EzSchedulerComponents;
    /** 
     * Callback when a range is selected.
     * @group Events 
     */
    onRangeSelect?: (start: Date, end: Date, resourceId?: string, position?: { x: number; y: number }) => void;
    /** 
     * Template for the date header.
     * @group Models 
     */
    dateHeaderTemplate?: string | ((props: any) => React.ReactNode);
    /** 
     * Whether to show week numbers.
     * @group Properties 
     */
    showWeekNumber?: boolean;
    /** 
     * Rule for calculating week numbers.
     * @group Properties 
     */
    weekRule?: 'FirstDay' | 'FirstFourDayWeek' | 'FirstFullWeek';
    /** 
     * Time formatting string (e.g., "HH:mm").
     * @group Properties 
     */
    timeFormat?: string;
    /** 
     * Template for cells.
     * @group Models 
     */
    cellTemplate?: (data: any) => React.ReactNode;
    /** 
     * Whether to enable HTML sanitization for templates.
     * @group Properties 
     */
    enableHtmlSanitizer?: boolean;
    /** 
     * Callback when hovering over an event.
     * @group Events 
     */
    hover?: (event: SchedulerEvent) => void;
    /** 
     * Whether to show an unassigned lane for events without a resource.
     * @group Properties 
     */
    showUnassignedLane?: boolean;
    /** 
     * Start hour for the view (e.g., "08:00").
     * @group Properties 
     */
    startHour?: string;
    /** 
     * End hour for the view (e.g., "18:00").
     * @group Properties 
     */
    endHour?: string;
    /** 
     * Duration of each slot in minutes.
     * @group Properties 
     */
    slotDuration?: number;
    /** 
     * Use 24-hour time format.
     * @group Properties 
     */
    is24Hour?: boolean;
    /** 
     * Callback to toggle 24-hour time format.
     * @group Methods 
     */
    setIs24Hour?: (is24: boolean) => void;
    /** 
     * Grouping configuration.
     * @group Models 
     */
    group?: GroupModel;
    /** 
     * Callback for cell context menu.
     * @group Events 
     */
    onCellContextMenu?: (args: { date: Date; x: number; y: number }) => void;
    /** 
     * Text direction.
     * @group Appearance 
     */
    dir?: 'ltr' | 'rtl' | 'auto';
}

// Helper to calculate event style
const calculateEventStyle = (
    event: SchedulerEvent,
    dayIndex: number,
    resourceIndex: number,
    numResources: number,
    colWidthPercent: number,
    column: number,
    totalColumns: number,
    startHour: number,
    slotDuration: number,
    groupByDate: boolean = true,
    isRtl: boolean = false
): React.CSSProperties => {
    let leftVal = 0;
    let widthVal = 0;

    if (groupByDate) {
        const resourceColWidth = colWidthPercent / numResources;
        const eventWidth = resourceColWidth / totalColumns;
        leftVal = (dayIndex * colWidthPercent) + (resourceIndex * resourceColWidth) + (column * eventWidth);
        widthVal = eventWidth * 0.98;
    } else {
        const subColWidth = colWidthPercent / numResources;
        const eventWidth = subColWidth / totalColumns;
        leftVal = (resourceIndex * colWidthPercent) + (dayIndex * subColWidth) + (column * eventWidth);
        widthVal = eventWidth * 0.98;
    }

    const totalMinutesFromStart = (event.start.getHours() - startHour) * 60 + event.start.getMinutes();
    const top = (totalMinutesFromStart / slotDuration) * 64;
    const durationMinutes = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
    const height = (durationMinutes / slotDuration) * 64;

    return {
        top: `${top}px`,
        height: `${Math.max(height, 24)}px`,
        [isRtl ? 'right' : 'left']: `${leftVal}%`,
        width: `${widthVal}%`,
        [isRtl ? 'borderRightWidth' : 'borderLeftWidth']: '4px',
        borderColor: event.color || 'hsl(var(--primary))',
    };
};

const CurrentTimeIndicator = ({ startHour, slotDuration, isRtl }: { startHour: number, slotDuration: number, isRtl?: boolean }) => {
    const now = useCurrentTime();
    const totalMinutesFromStart = (now.getHours() - startHour) * 60 + now.getMinutes();
    const top = (totalMinutesFromStart / slotDuration) * 64;

    // Don't show if outside visible range
    if (top < 0) return null;

    return (
        <div
            className={cn("absolute inset-x-0 z-50 pointer-events-none flex items-center")}
            style={{ top: `${top}px` }}
        >
            <div className="w-full border-t-2 border-primary" />
            <div className={cn("absolute w-3 h-3 bg-primary rounded-full shadow-sm ring-2 ring-background", isRtl ? "-right-1.5" : "-left-1.5")} />
        </div>
    );
};

export const DayWeekView: React.FC<DayWeekViewProps> = ({
    daysInView,
    visibleEvents,
    rowVirtualizer,
    resources = [],
    showResourcesInDayView = false,
    onEventClick,
    onEventDoubleClick,
    onEventDelete,
    scrollRef,
    onViewChange,
    onDateChange,
    locale,
    components,
    onRangeSelect,
    onSlotClick,
    onSlotDoubleClick,
    dateHeaderTemplate,
    showWeekNumber = false,
    weekRule = 'FirstDay' as const,
    // timeFormat,  // Unused
    cellTemplate,
    enableHtmlSanitizer = true,
    showUnassignedLane = false,
    startHour = '00:00',
    slotDuration = 30,
    is24Hour = true,
    setIs24Hour,
    // endHour, // Handled by rowVirtualizer
    group,
    onCellContextMenu,
    dir
}) => {
    const isRtl = dir === 'rtl';
    const now = useCurrentTime();
    const startHourInt = parseInt(startHour.split(':')[0], 10);
    const [selection, setSelection] = useState<{ start: Date; end: Date; resourceId?: string } | null>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const selectionRef = useRef<typeof selection>(null);

    const checkIsBlocked = (start: Date, end: Date, resourceId?: string) => {
        // 1. Check if the day is a Holiday or Fully Booked
        // Is the date explicitly marked as 'isHoliday' or 'isFullyBooked' in the event data?
        const isBlockedDate = visibleEvents.some(ev =>
            (ev.isHoliday || ev.isFullyBooked) &&
            isSameDay(ev.start, start)
        );
        if (isBlockedDate) return true;

        // 2. Check for manual block events
        // Does an event with 'isBlock' flag overlap with the requested interval?
        return visibleEvents.some(ev =>
            ev.isBlock &&
            // Check resource constraint: applies to specific resource, or globally if neither has resourceId
            (ev.resourceId === resourceId || (!ev.resourceId && !resourceId)) &&
            areIntervalsOverlapping({ start: ev.start, end: ev.end }, { start, end })
        );
    };

    const handleMouseDown = (date: Date, resourceId?: string) => {
        // Check if slot is blocked
        const end = addMinutes(date, slotDuration); // Dynamic duration

        if (checkIsBlocked(date, end, resourceId)) return;

        setIsMouseDown(true);
        const newSelection = { start: date, end, resourceId };
        setSelection(newSelection);
        selectionRef.current = newSelection;
    };

    const handleMouseEnter = (date: Date) => {
        if (!isMouseDown || !selectionRef.current) return;
        const newEnd = new Date(date.getTime() + slotDuration * 60 * 1000);
        const newSelection = { ...selectionRef.current, end: newEnd };
        setSelection(newSelection);
        selectionRef.current = newSelection;
    };

    useEffect(() => {
        const handleGlobalMouseUp = (e: MouseEvent) => {
            if (isMouseDown && selectionRef.current) {
                const { start: s, end: e_date, resourceId } = selectionRef.current;
                const start = s < e_date ? s : e_date;
                const end = s < e_date ? e_date : s;

                // Validate entire range against blocked slots
                if (!checkIsBlocked(start, end, resourceId)) {
                    onRangeSelect?.(start, end, resourceId, { x: e.clientX, y: e.clientY });
                    onSlotClick?.(start, resourceId); // Might need to check if it was a drag or click? usually handled by logic inside hooks/parents
                }
            }
            setIsMouseDown(false);
            setSelection(null);
            selectionRef.current = null;
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isMouseDown, onRangeSelect, onSlotClick]);

    const isMobile = useMediaQuery('(max-width: 768px)');
    const effectiveResources = useMemo(() => {
        let res = (showResourcesInDayView && resources.length > 0) ? [...resources] : [];
        if (showUnassignedLane || (showResourcesInDayView && res.length === 0)) {
            if (!res.find(r => r.id === '' || r.id === 'unassigned')) {
                res.unshift({ id: 'unassigned', name: 'Unassigned', type: 'Global Inbox', color: 'hsl(var(--muted-foreground))' } as Resource);
            }
        }
        return res.length > 0 ? res : [{ id: '', name: '' } as unknown as Resource];
    }, [resources, showResourcesInDayView, showUnassignedLane]);
    const isMobileResView = isMobile && showResourcesInDayView && effectiveResources.length > 1;
    // Lowered threshold to trigger horizontal scroll when it gets crowded (e.g. Week view with resources)
    const isDesktopResView = !isMobile && (effectiveResources.length > 3 || (daysInView.length > 3 && effectiveResources.length > 1));
    const isHorizontalScroll = isMobileResView || isDesktopResView;

    // Width Logic
    // On Mobile/Desktop with many resources: We want a minimum width per resource column.
    // baseColumnWidth: The minimum width for a single day (if no resources) or a single resource.
    const baseColumnWidth = 150; // Minimum px width for a resource column
    const totalResourceColumns = daysInView.length * effectiveResources.length;

    // We compute the total inner width needed. If it exceeds 100%, we use it.
    // This allows the container to naturally scroll horizontally.
    // calculatedWidth = (Number of Days * Number of Resources) * Minimum Column Width
    const calculatedWidth = totalResourceColumns * baseColumnWidth;
    const gridInnerStyle: React.CSSProperties = {
        width: isHorizontalScroll ? (calculatedWidth > 0 ? `${calculatedWidth}px` : '100%') : '100%',
        minWidth: '100%'
    };

    // colWidthPercent is relative to the total inner width.
    // colWidthPercent is relative to the total inner width.
    // const colWidthPercent = 100 / daysInView.length; // Unused

    // Resource sub-column width (minimum 80px if multiple resources)
    // const resColWidthPercent = 100 / effectiveResources.length; // Unused

    const dayFormatter = new Intl.DateTimeFormat(locale, { day: 'numeric' });

    // Grouping Logic
    const groupByDate = group?.byDate ?? true;
    // Primary items loop
    const primaryItems = groupByDate ? daysInView : effectiveResources;
    // Secondary items loop
    const secondaryItems = groupByDate ? effectiveResources : daysInView;

    // Use any[] to handle mixed types in loop
    const primaryLoop = primaryItems as any[];
    const secondaryLoop = secondaryItems as any[];

    const primaryColWidthPercent = 100 / primaryLoop.length;
    const secondaryColWidthPercent = 100 / secondaryLoop.length;

    return (
        <div
            ref={scrollRef}
            data-testid="scheduler-scroll-container"
            data-view="day-week"
            style={{ scrollbarGutter: 'stable' }}
            className={cn(
                "flex-1 flex flex-col min-h-0 relative overflow-auto bg-background select-none border border-border rounded-lg",
                isHorizontalScroll && "snap-x snap-mandatory"
            )}
        >
            {/* Sticky Header */}
            <div
                className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border flex shrink-0"
                style={gridInnerStyle}
            >
                {/* Week Number Column (optional) */}
                {showWeekNumber && (
                    <div className={cn(
                        "w-12 shrink-0 sticky z-50 bg-background border-e border-border flex items-center justify-center",
                        isRtl ? "right-0" : "left-0"
                    )}>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">WK</span>
                    </div>
                )}
                <div
                    className={cn(
                        "w-24 shrink-0 sticky bg-background border-e border-border z-50 cursor-pointer hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-1 group",
                        showWeekNumber ? (isRtl ? "right-12" : "left-12") : (isRtl ? "right-0" : "left-0")
                    )}
                    onClick={() => setIs24Hour?.(!is24Hour)}
                    title="Toggle 24h / AM-PM format"
                >
                    <Clock className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[9px] font-bold uppercase text-muted-foreground/60 group-hover:text-primary/70">
                        {is24Hour ? '24 Hours' : 'AM / PM'}
                    </span>
                </div>
                <div className="flex flex-1" style={isHorizontalScroll ? { width: '100%' } : undefined}>
                    {primaryLoop.map((primaryItem) => {
                        const isDay = groupByDate;
                        const day = isDay ? primaryItem : null;
                        const resource = !isDay ? primaryItem : null;
                        const isToday = isDay && isSameDay(day, new Date());

                        return (
                            <div
                                key={isDay ? day.toISOString() : resource.id}
                                style={{ width: `${primaryColWidthPercent}%` }}
                                className="flex flex-col border-e border-border last:border-e-0"
                            >
                                {/* Top Header Cell */}
                                <div
                                    className={cn(
                                        "flex flex-col items-center justify-center py-3 transition-colors shrink-0 border-e-2 border-foreground/20",
                                        isToday && "bg-background"
                                    )}
                                >
                                    {isDay ? (() => {
                                        const dayInfo = visibleEvents.find(ev => (ev.isHoliday || ev.isFullyBooked) && isSameDay(ev.start, day));
                                        return (
                                            <div className="flex flex-col items-center relative w-full">
                                                {dayInfo?.isHoliday && (
                                                    <span className="absolute -top-1 px-1.5 py-0.5 bg-destructive/10 text-destructive text-[9px] font-black uppercase tracking-tighter rounded-full border border-destructive/20 mb-1 leading-none shadow-sm">Holiday</span>
                                                )}
                                                {dayInfo?.isFullyBooked && (
                                                    <span className="absolute -top-1 px-1.5 py-0.5 bg-amber-500/10 text-amber-600 text-[9px] font-black uppercase tracking-tighter rounded-full border border-amber-500/20 mb-1 leading-none shadow-sm">Fully Booked</span>
                                                )}
                                                {dateHeaderTemplate ? (
                                                    <div className="h-full w-full flex items-center justify-center pt-2">
                                                        {typeof dateHeaderTemplate === 'function'
                                                            ? dateHeaderTemplate({ date: day, type: 'Day', text: dayFormatter.format(day) })
                                                            : dateHeaderTemplate}
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="flex flex-col items-center cursor-pointer hover:bg-muted/50 transition-colors pt-2"
                                                        onClick={() => { if (onViewChange && onDateChange) { onDateChange(day); onViewChange('day'); } }}
                                                    >
                                                        {daysInView.length > 1 && (
                                                            <>
                                                                <span className={cn("text-base font-medium mt-0.5", isToday ? "text-primary font-bold" : "text-foreground")}>
                                                                    {format(day, 'dd MMM yyyy')}
                                                                </span>
                                                                <span className={cn("text-sm font-medium uppercase tracking-wider", isToday ? "text-primary" : "text-muted-foreground/80")}>
                                                                    {format(day, 'EEE')}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })() : (
                                        // Resource Header Logic (New Top Level)
                                        <div className="flex items-center gap-2 px-2">
                                            <Avatar className="h-8 w-8 shadow-sm border border-background">
                                                {resource.avatar && <AvatarImage src={resource.avatar} />}
                                                <AvatarFallback className="text-xs font-bold">{resource.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold truncate">{resource.name}</span>
                                                <span className="text-[10px] text-muted-foreground truncate">{resource.type || 'Resource'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Secondary Header Row (Sub-columns) */}
                                {secondaryLoop.length > 0 && (
                                    <div className="flex w-full border-t border-border bg-background h-10 shrink-0">
                                        {secondaryLoop.map((secItem, sIdx) => {
                                            const secDay = !isDay ? secItem : null;
                                            const secRes = isDay ? secItem : null;

                                            const holidayInfo = secDay ? visibleEvents.find(ev => ev.isHoliday && isSameDay(ev.start, secDay)) : null;
                                            const fullyBookedInfo = secDay ? visibleEvents.find(ev => ev.isFullyBooked && isSameDay(ev.start, secDay)) : null;

                                            return (
                                                <div
                                                    key={secDay ? secDay.toISOString() : secRes.id}
                                                    style={{ width: `${secondaryColWidthPercent}%` }}
                                                    className={cn(
                                                        "flex items-center justify-center px-1 border-e border-border/30 last:border-e-0 group",
                                                        isHorizontalScroll && "snap-center",
                                                        sIdx % 2 === 0 ? "bg-background" : "bg-background"
                                                    )}
                                                >
                                                    {isDay ? (
                                                        // Secondary: Resource (Existing logic)
                                                        <>
                                                            <Avatar className="h-4 w-4 me-1 shadow-sm border border-background">
                                                                {secRes.avatar && <AvatarImage src={secRes.avatar} />}
                                                                <AvatarFallback className="text-[7px] font-bold">{secRes.name?.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-[9px] font-bold text-muted-foreground truncate group-hover:text-foreground transition-colors">{secRes.name}</span>
                                                        </>
                                                    ) : (
                                                        // Secondary: Day (New Logic)
                                                        <div className="flex flex-col items-center justify-center">
                                                            {holidayInfo && (
                                                                <span className="text-xs font-black uppercase tracking-wider text-destructive bg-destructive/10 px-2 py-0.5 rounded-sm mb-0.5">
                                                                    Holiday
                                                                </span>
                                                            )}
                                                            {fullyBookedInfo && (
                                                                <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-sm mb-0.5">
                                                                    Fully Booked
                                                                </span>
                                                            )}
                                                            <span className={cn(
                                                                "text-[10px] font-bold text-muted-foreground uppercase",
                                                                holidayInfo && "text-destructive",
                                                                fullyBookedInfo && "text-amber-600"
                                                            )}>{format(secDay, 'EEE d')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Virtual Body */}
            <div
                data-testid="scheduler-virtual-body"
                className="relative shrink-0"
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    ...gridInnerStyle
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const totalMinutes = virtualRow.index * slotDuration;
                    const hour = startHourInt + Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;

                    let timeLabel = "";
                    if (is24Hour) {
                        timeLabel = `${hour < 10 ? '0' + hour : hour}:${minutes < 10 ? '0' + minutes : minutes}`;
                    } else {
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const displayHour = hour % 12 || 12;
                        const paddedHour = displayHour < 10 ? '0' + displayHour : displayHour;
                        timeLabel = `${paddedHour}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
                    }

                    return (
                        <div
                            key={virtualRow.index}
                            className="absolute left-0 w-full flex"
                            style={{
                                height: '64px',
                                top: `${virtualRow.start}px`
                            }}
                        >
                            {/* Sticky Time Label with Week Number */}
                            <div className={cn(
                                "w-24 shrink-0 flex flex-col items-end justify-center pe-3 border-e border-border bg-background z-50 sticky backdrop-blur-md",
                                isRtl ? "right-0" : "left-0"
                            )}>
                                {timeLabel && <span className="text-sm text-foreground font-black bg-background px-1 relative z-50 uppercase tracking-tighter tabular-nums">{timeLabel}</span>}
                                {showWeekNumber && hour === 0 && (
                                    <span className="text-[9px] text-muted-foreground/60 font-semibold mt-1">W{getWeekNumber(daysInView[0], weekRule)}</span>
                                )}
                            </div>

                            {/* Grid Content */}
                            <div className="flex flex-1 relative" style={{ height: '64px' }}>
                                <div className="absolute bottom-0 left-0 w-full border-b border-border/40" />
                                <div className="absolute top-1/2 left-0 w-full border-b border-dashed border-border/20 h-px" />
                                {primaryLoop.map((pItem) => (
                                    <div key={groupByDate ? pItem.toISOString() : pItem.id} style={{ width: `${primaryColWidthPercent}%` }} className="h-full flex relative border-e-2 border-foreground/20 last:border-e-0">
                                        {secondaryLoop.map((sItem, sIdx) => {
                                            const day = groupByDate ? pItem : sItem;
                                            const res = groupByDate ? sItem : pItem;

                                            // Ensure we are working with correct indices for callbacks if needed
                                            // The logic below uses `day` and `res` which are correct references.

                                            const currentHour = virtualRow.index + startHourInt;
                                            const dayOfWeek = day.getDay();
                                            const holidayInfo = visibleEvents.find(ev => ev.isHoliday && isSameDay(ev.start, day));
                                            const fullyBookedInfo = visibleEvents.find(ev => ev.isFullyBooked && isSameDay(ev.start, day));
                                            // const isBlockedDate = !!holidayInfo || !!fullyBookedInfo;

                                            let isWorkHour = true;
                                            if (res.workingHours) {
                                                isWorkHour = res.workingHours.days.includes(dayOfWeek) &&
                                                    currentHour >= res.workingHours.start &&
                                                    currentHour < res.workingHours.end;
                                            } else {
                                                isWorkHour = dayOfWeek !== 0 && dayOfWeek !== 6 && currentHour >= 9 && currentHour < 17;
                                            }

                                            // If it's a blocked date, it's effectively not a work hour for selection
                                            // const effectiveIsWorkHour = isWorkHour && !isBlockedDate;

                                            const slotDate = new Date(new Date(day).setHours(hour, minutes, 0, 0));
                                            const isToday = isSameDay(day, new Date());
                                            const isSelecting = !!selection && selection.resourceId === res.id && slotDate >= selection.start && slotDate < selection.end;
                                            // isLast logic might need adjustment if loop order changes layout
                                            // const isLast = (pIdx === primaryLoop.length - 1) && (sIdx === secondaryLoop.length - 1); // Unused

                                            return (
                                                <DroppableSlot
                                                    key={groupByDate ? (res.id || sIdx) : (day.toISOString() || sIdx)}
                                                    date={slotDate}
                                                    resourceId={res.id}
                                                    isWorkHour={isWorkHour}
                                                    isSelected={isSelecting}
                                                    onMouseDown={() => handleMouseDown(slotDate, res.id)}
                                                    onMouseEnter={() => handleMouseEnter(slotDate)}
                                                    onDoubleClick={() => {
                                                        const end = addMinutes(slotDate, slotDuration);
                                                        if (!checkIsBlocked(slotDate, end, res.id)) {
                                                            onSlotDoubleClick?.(slotDate, res.id);
                                                        }
                                                    }}
                                                    onContextMenu={(e: React.MouseEvent) => {
                                                        e.preventDefault();
                                                        onCellContextMenu?.({ date: slotDate, x: e.clientX, y: e.clientY });
                                                    }}
                                                    style={{
                                                        width: `${secondaryColWidthPercent}%`,
                                                        minWidth: 'auto', // Fix minWidth logic later if needed
                                                        height: '100%'
                                                    }}
                                                    className={cn(
                                                        "border-e border-border/30 relative cursor-pointer hover:bg-primary/5 transition-colors pointer-events-auto",
                                                        sIdx === secondaryLoop.length - 1 && "border-e-0", // Remove border for last sub-column only
                                                        isHorizontalScroll && "snap-center",
                                                        holidayInfo && "bg-[repeating-linear-gradient(-45deg,hsl(var(--destructive)/0.05)_0px,hsl(var(--destructive)/0.05)_10px,transparent_10px,transparent_20px)] bg-destructive/[0.02]",
                                                        fullyBookedInfo && "bg-[repeating-linear-gradient(-45deg,theme(colors.amber.500/0.05)_0px,theme(colors.amber.500/0.05)_10px,transparent_10px,transparent_20px)] bg-amber-500/[0.02]",
                                                        !holidayInfo && !fullyBookedInfo && "bg-background"
                                                    )}
                                                >
                                                    {cellTemplate ? (() => {
                                                        const templateData = { date: slotDate, resourceId: res.id, isWorkHour, isToday };
                                                        const content = renderTemplate(cellTemplate, templateData, enableHtmlSanitizer);
                                                        if (content && typeof content === 'object' && '__html' in content) {
                                                            return <div className="w-full h-full" dangerouslySetInnerHTML={content} />;
                                                        }
                                                        return <div className="w-full h-full">{content}</div>;
                                                    })() : components?.timeSlot ? (
                                                        <components.timeSlot date={slotDate} isWorkHour={isWorkHour} />
                                                    ) : null}
                                                </DroppableSlot>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Overlay Layer (Events & Indicators) */}
                <div
                    className="absolute top-0 h-full z-10"
                    style={{
                        width: 'calc(100% - 6rem)',
                        [isRtl ? 'right' : 'left']: '6rem',
                        pointerEvents: 'none'
                    }}
                >
                    <CurrentTimeIndicator startHour={startHourInt} slotDuration={slotDuration} isRtl={isRtl} />
                    {daysInView.map((day, dayIndex) => {
                        const dayEvents = visibleEvents.filter(event => isSameDay(day, event.start));
                        dayEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
                        const laneGroups = new Map<number, SchedulerEvent[]>();
                        dayEvents.forEach(ev => {
                            let rId = ev.resourceId;
                            if (!rId && showUnassignedLane) rId = 'unassigned';

                            let rIdx = effectiveResources.findIndex((r: Resource) => r.id === rId);
                            // If not found, and we have resources, it doesn't belong here (unless it's the only lane)
                            if (rIdx === -1) {
                                if (effectiveResources.length === 1 && (effectiveResources[0].id === '' || !showResourcesInDayView)) {
                                    rIdx = 0; // Fallback to only available lane
                                } else {
                                    return; // Skip events that don't belong to any visible resource lane
                                }
                            }

                            if (!laneGroups.has(rIdx)) laneGroups.set(rIdx, []);
                            laneGroups.get(rIdx)!.push(ev);
                        });

                        return [...laneGroups.entries()].map(([rIdx, events]) => {
                            // Clustering & Stacking Algorithm
                            const clusters: SchedulerEvent[][] = [];
                            events.forEach(ev => {
                                let placedInCluster = false;
                                for (const cluster of clusters) {
                                    if (cluster.some(cEv => areIntervalsOverlapping({ start: cEv.start, end: cEv.end }, { start: ev.start, end: ev.end }))) {
                                        cluster.push(ev);
                                        placedInCluster = true;
                                        break;
                                    }
                                }
                                if (!placedInCluster) {
                                    clusters.push([ev]);
                                }
                            });

                            return clusters.map(cluster => {
                                const columns: SchedulerEvent[][] = [];
                                cluster.forEach(ev => {
                                    let placedInColumn = false;
                                    for (let i = 0; i < columns.length; i++) {
                                        if (!columns[i].some(cEv => areIntervalsOverlapping({ start: cEv.start, end: cEv.end }, { start: ev.start, end: ev.end }))) {
                                            columns[i].push(ev);
                                            placedInColumn = true;
                                            break;
                                        }
                                    }
                                    if (!placedInColumn) {
                                        columns.push([ev]);
                                    }
                                });

                                return cluster.map(ev => {
                                    const colIdx = columns.findIndex(col => col.includes(ev));
                                    const style = calculateEventStyle(
                                        ev,
                                        dayIndex,
                                        rIdx,
                                        groupByDate ? effectiveResources.length : daysInView.length,
                                        primaryColWidthPercent,
                                        colIdx,
                                        columns.length,
                                        startHourInt,
                                        slotDuration,
                                        groupByDate,
                                        isRtl
                                    );

                                    return (
                                        <DraggableEvent
                                            key={ev.id}
                                            event={ev}
                                            style={style}
                                            onClick={onEventClick}
                                            onDoubleClick={onEventDoubleClick}
                                            onDelete={onEventDelete}
                                            components={components}
                                            orientation='vertical'
                                            resizable={true}
                                            isBlocked={ev.isBlock}
                                            isPast={ev.end < now}
                                            slotDuration={slotDuration}
                                            pixelsPerSlot={64}
                                        />
                                    );
                                });
                            });
                        });
                    })}
                </div>
            </div>
        </div>
    );
};
