import React, { useMemo, useState, useEffect, useRef } from 'react';
import { SchedulerEvent, Resource, ViewType, GroupModel } from '../EzScheduler.types';
import { format, startOfDay, differenceInMinutes, addMinutes, isSameDay } from 'date-fns';
import { cn } from '../../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { useDroppable } from '@dnd-kit/core';
import { useCurrentTime } from '../../../shared/hooks';
import { DraggableEvent } from '../components/dnd/DraggableEvent';

/**
 * Props for the TimelineView component.
 */
interface TimelineViewProps {
    /** 
     * The type of timeline view (day, week, month).
     * @group Properties 
     */
    view: ViewType;
    /** 
     * The currently displayed date.
     * @group Properties 
     */
    currentDate: Date;
    /** 
     * List of days to display in the timeline.
     * @group Properties 
     */
    daysInView: Date[];
    /** 
     * List of events to display.
     * @group Properties 
     */
    visibleEvents: SchedulerEvent[];
    /** 
     * List of resources to display as lanes.
     * @group Properties 
     */
    resources?: Resource[];
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
     * Callback when an event is deleted.
     * @group Events 
     */
    onEventDelete?: (eventId: string) => void;
    /** 
     * Callback when a range is selected.
     * @group Events 
     */
    onRangeSelect?: (start: Date, end: Date, resourceId?: string, position?: { x: number; y: number }) => void;
    /** 
     * Whether to show the current time indicator.
     * @group Properties 
     */
    currentTimeIndicator?: boolean;
    /** 
     * Whether to show resource header names.
     * @group Properties 
     */
    showResourceHeaders?: boolean;
    /** 
     * Grouping configuration.
     * @group Models 
     */
    group?: GroupModel;
    /** 
     * Whether to show an unassigned lane for events without a resource.
     * @group Properties 
     */
    showUnassignedLane?: boolean;
    /** 
     * Start hour for the timeline (e.g., "08:00").
     * @group Properties 
     */
    startHour?: string;
    /** 
     * End hour for the timeline (e.g., "18:00").
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
     * Reference to the scroll container for external control and auto-scrolling.
     * @group Properties
     */
    scrollRef?: React.RefObject<HTMLDivElement | null>;
    /** 
     * Text direction.
     * @group Appearance 
     */
    dir?: 'ltr' | 'rtl' | 'auto';
}

/**
 * A horizontal timeline view with resource lanes.
 * @group Views
 */
export const TimelineView: React.FC<TimelineViewProps> = ({
    view,
    daysInView,
    visibleEvents,
    resources = [],
    onSlotClick,
    onSlotDoubleClick,
    onEventClick,
    onEventDelete,
    onRangeSelect,
    currentTimeIndicator,
    showResourceHeaders = true,
    group,
    showUnassignedLane = false,
    startHour = '00:00',
    endHour = '24:00',
    slotDuration: propSlotDuration = 60,
    is24Hour = false,
    scrollRef,
    dir
}) => {
    const isRtl = dir === 'rtl';
    // Current time state for the indicator
    const now = useCurrentTime();

    // Parse hours
    const startHourInt = startHour ? parseInt(startHour.split(':')[0], 10) : 0;
    const endHourInt = endHour ? parseInt(endHour.split(':')[0], 10) : 24;
    const hoursPerDay = endHourInt - startHourInt;

    // Selection state for drag-to-define
    const [selection, setSelection] = useState<{ startSlot: number; endSlot: number; resourceId: string } | null>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const selectionRef = useRef<typeof selection>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    // Slot config based on view granularity
    const isMonthView = view === 'timeline-month';
    const slotDuration = isMonthView ? 1440 : propSlotDuration;

    const slotsPerHour = 60 / slotDuration;
    const slotsPerDay = isMonthView ? 1 : (hoursPerDay * slotsPerHour);
    const totalSlots = daysInView.length * slotsPerDay;

    const slotWidth = isMonthView ? 120 : 80; // wider slots for daily view
    const totalWidth = totalSlots * slotWidth;

    const baseResources = useMemo(() => {
        const res = resources.length > 0 ? [...resources] : [];
        if (showUnassignedLane || res.length === 0) {
            // Check if unassigned already exists
            if (!res.find(r => r.id === 'unassigned')) {
                res.unshift({ id: 'unassigned', name: 'Unassigned', type: 'Global Inbox', color: 'hsl(var(--muted-foreground))' });
            }
        }
        return res;
    }, [resources, showUnassignedLane]);

    // --- Grouping Logic ---
    const groupedData = useMemo(() => {
        // console.log('[TimelineView] Grouping Logic:', { group, baseResourcesLength: baseResources.length });
        if (!group || !group.resources || group.resources.length === 0) {
            return {
                isGrouped: false,
                groups: [{ name: 'All', resources: baseResources }]
            };
        }

        const groupField = group.resources[0];
        const groupsMap = new Map<string, Resource[]>();

        baseResources.forEach(r => {
            const groupValue = (r[groupField as keyof Resource] as string) || 'Unassigned';
            if (!groupsMap.has(groupValue)) groupsMap.set(groupValue, []);
            groupsMap.get(groupValue)?.push(r);
        });

        const groups: Array<{ name: string; resources: Resource[] }> = [];
        groupsMap.forEach((resources, name) => {
            groups.push({ name, resources });
        });

        return { isGrouped: true, groups };
    }, [baseResources, group]);

    const effectiveResources = useMemo(() => {
        return groupedData.groups.flatMap(g => g.resources);
    }, [groupedData]);

    // Convert slot index to Date
    const slotToDate = (slotIndex: number): Date => {
        if (isMonthView) {
            return startOfDay(daysInView[slotIndex]);
        }
        const dayIndex = Math.floor(slotIndex / slotsPerDay);
        const slotInDay = slotIndex % slotsPerDay;
        const dayStart = startOfDay(daysInView[dayIndex]);
        return addMinutes(dayStart, startHourInt * 60 + slotInDay * slotDuration);
    };

    // Helper to map date to pixel position
    const dateToPos = (date: Date) => {
        if (isMonthView) {
            const dayIdx = daysInView.findIndex(d => isSameDay(d, startOfDay(date)));
            return dayIdx !== -1 ? dayIdx * slotWidth : -1;
        }

        const dateStart = startOfDay(date);
        const dayIdx = daysInView.findIndex(d => isSameDay(d, dateStart));
        if (dayIdx === -1) return -1;

        const minutesInDay = differenceInMinutes(date, dateStart);
        const visibleMinutesInDay = minutesInDay - (startHourInt * 60);

        return (dayIdx * hoursPerDay * 60 + visibleMinutesInDay) / slotDuration * slotWidth;
    };

    // Calculate current time indicator position
    const getTimeIndicatorPosition = () => {
        if (isMonthView) {
            const viewStart = startOfDay(daysInView[0]);
            const viewEnd = startOfDay(daysInView[daysInView.length - 1]);
            if (now < viewStart || now > viewEnd) return null;
            return dateToPos(now);
        }

        const pos = dateToPos(now);
        // Check if current time is within visible hours
        const hour = now.getHours();
        if (pos === -1 || hour < startHourInt || hour >= endHourInt) return null;
        return pos;
    };

    const timeIndicatorPos = getTimeIndicatorPosition();
    const hasInitialScrolled = useRef(false);

    // Initial scroll to today/now
    useEffect(() => {
        if (scrollRef?.current && timeIndicatorPos !== null && !hasInitialScrolled.current) {
            // Give a small timeout for layout to settle, though useEffect should be fine
            setTimeout(() => {
                if (scrollRef.current) {
                    if (isRtl) {
                        scrollRef.current.scrollLeft = -timeIndicatorPos;
                    } else {
                        scrollRef.current.scrollLeft = timeIndicatorPos;
                    }
                    hasInitialScrolled.current = true;
                }
            }, 50);
        }
    }, [scrollRef, timeIndicatorPos, view]);

    // Handle mouse events for drag selection
    const handleSlotMouseDown = (slotIndex: number, resourceId: string) => {
        const slotDate = slotToDate(slotIndex);
        const isBlocked = visibleEvents.some(ev =>
            (ev.isHoliday || ev.isFullyBooked) &&
            isSameDay(ev.start, slotDate)
        );
        if (isBlocked) return;

        setIsMouseDown(true);
        const newSelection = { startSlot: slotIndex, endSlot: slotIndex, resourceId };
        setSelection(newSelection);
        selectionRef.current = newSelection;
    };

    const handleSlotMouseEnter = (slotIndex: number) => {
        if (!isMouseDown || !selectionRef.current) return;
        const newSelection = { ...selectionRef.current, endSlot: slotIndex };
        setSelection(newSelection);
        selectionRef.current = newSelection;
    };

    // Window-level mouseup for robust selection capture
    useEffect(() => {
        const handleGlobalMouseUp = (e: MouseEvent) => {
            if (isMouseDown && selectionRef.current) {
                const { startSlot, endSlot, resourceId } = selectionRef.current;
                const minSlot = Math.min(startSlot, endSlot);
                const maxSlot = Math.max(startSlot, endSlot);

                const start = slotToDate(minSlot);
                const end = slotToDate(maxSlot + 1); // +1 to include the end slot

                // Final check against blocked dates
                const isRangeBlocked = visibleEvents.some(ev =>
                    (ev.isHoliday || ev.isFullyBooked) &&
                    isSameDay(ev.start, start)
                );

                if (!isRangeBlocked) {
                    onRangeSelect?.(start, end, resourceId, { x: e.clientX, y: e.clientY });
                    onSlotClick?.(start, resourceId);
                }
            }
            setIsMouseDown(false);
            setSelection(null);
            selectionRef.current = null;
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isMouseDown, onRangeSelect, onSlotClick, daysInView]);

    // Check if a slot is within current selection
    const isSlotSelected = (slotIndex: number, resourceId: string): boolean => {
        if (!selection || selection.resourceId !== resourceId) return false;
        const minSlot = Math.min(selection.startSlot, selection.endSlot);
        const maxSlot = Math.max(selection.startSlot, selection.endSlot);
        return slotIndex >= minSlot && slotIndex <= maxSlot;
    };

    const { resourceMap, maxLevels } = useMemo(() => {
        const map = new Map<string, (SchedulerEvent & { level: number })[]>();
        const levelCounts = new Map<string, number>();
        effectiveResources.forEach(r => {
            map.set(r.id, []);
            levelCounts.set(r.id, 1);
        });

        visibleEvents.forEach(event => {
            const rId = event.resourceId || 'unassigned';
            const rIdStr = String(rId);
            if (map.has(rIdStr)) {
                map.get(rIdStr)?.push(event as any);
            } else if (map.has('unassigned') && !rId) {
                map.get('unassigned')?.push(event as any);
            }
        });

        // Apply stacking logic for each resource
        map.forEach((resourceEvents, key) => {
            const sorted = [...resourceEvents].sort((a, b) => a.start.getTime() - b.start.getTime());
            const levels: number[] = [];

            const stacked = sorted.map(event => {
                let level = 0;
                // Add a small buffer (5 mins) to avoid overlapping edges
                const buffer = 5 * 60 * 1000;
                while (levels[level] !== undefined && levels[level] > (event.start.getTime() + buffer)) {
                    level++;
                }
                levels[level] = event.end.getTime();
                return { ...event, level };
            });
            map.set(key, stacked);
            levelCounts.set(key, levels.length || 1);
        });

        return { resourceMap: map, maxLevels: levelCounts };
    }, [visibleEvents, effectiveResources]);

    const getEventStyle = (event: SchedulerEvent & { level: number }) => {
        const startPos = dateToPos(event.start);
        const endPos = dateToPos(event.end);

        if (startPos === -1 && endPos === -1) return { display: 'none' };

        const left = Math.max(0, startPos);
        const right = endPos === -1 ? totalWidth : Math.min(totalWidth, endPos);
        const width = Math.max(0, right - left);

        if (width <= 4) return { display: 'none' }; // Hide if too small or outside range

        // Pill styling: 32px height, 8px gap
        const eventHeight = 36; // Increased height
        const gap = 10;
        const top = 20 + (event.level * (eventHeight + gap));

        const baseColor = event.color || 'hsl(var(--primary))';

        return {
            [isRtl ? 'right' : 'left']: `${left}px`,
            width: `${Math.max(width, 4)}px`, // Min width
            top: `${top}px`,
            height: `${eventHeight}px`,
            // Modern Glassmorphic Look
            background: `linear-gradient(135deg, color-mix(in srgb, ${baseColor} 20%, transparent), color-mix(in srgb, ${baseColor} 10%, transparent))`,
            backdropFilter: 'blur(4px)',
            [isRtl ? 'borderRight' : 'borderLeft']: `4px solid ${baseColor}`,
            borderTop: `1px solid color-mix(in srgb, ${baseColor} 30%, transparent)`,
            [isRtl ? 'borderLeft' : 'borderRight']: `1px solid color-mix(in srgb, ${baseColor} 30%, transparent)`,
            borderBottom: `1px solid color-mix(in srgb, ${baseColor} 30%, transparent)`,
            color: 'hsl(var(--foreground))',
            borderRadius: '6px',
            boxShadow: '0 2px 8px -2px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
            fontWeight: '600',
            paddingInlineStart: '12px',
            paddingInlineEnd: '8px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 20 + event.level,
            cursor: 'pointer'
        } as React.CSSProperties;
    };


    const groupColWidth = 40; // Width of the group header column
    const resColWidth = 240;  // Width of the resource header column
    const sidebarWidth = showResourceHeaders ? (groupedData.isGrouped ? (groupColWidth + resColWidth) : resColWidth) : 0;

    return (
        <div className="flex flex-col h-full w-full overflow-hidden border border-border/40 rounded-xl bg-background shadow-sm">
            {/* Timeline Header Row (Sticky) */}
            <div className="flex bg-background z-40 sticky top-0 border-b border-border/40 shadow-[0_1px_2px_rgba(0,0,0,0.03)] items-center">
                {showResourceHeaders && groupedData.isGrouped && (
                    <div className={cn(
                        "w-[40px] shrink-0 border-e border-border/40 p-1 flex items-center justify-center bg-background select-none sticky z-50",
                        isRtl ? "right-0" : "left-0"
                    )}>
                        <div className="writing-mode-vertical rotate-180 font-bold text-[10px] uppercase tracking-widest text-muted-foreground/70">
                            Group
                        </div>
                    </div>
                )}
                {showResourceHeaders && (
                    <div className={cn(
                        "w-[240px] shrink-0 border-e border-border/40 px-6 py-4 font-bold text-[11px] uppercase tracking-widest flex items-center bg-background text-muted-foreground select-none sticky z-50",
                        groupedData.isGrouped ? (isRtl ? "right-[40px]" : "left-[40px]") : (isRtl ? "right-0" : "left-0")
                    )}>
                        RESOURCES
                    </div>
                )}

                <div ref={headerRef} className="overflow-hidden flex-1 relative">
                    <div className="flex" style={{ width: totalWidth }}>
                        {daysInView.map(day => {
                            const isSingleDay = daysInView.length === 1;
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                            if (isMonthView) {
                                return (
                                    <div key={day.toISOString()} className={cn(
                                        "flex shrink-0 border-e border-border/30 h-14 flex-col justify-center items-center transition-colors select-none",
                                        isWeekend ? "bg-muted/10" : "bg-transparent hover:bg-muted/5"
                                    )} style={{ width: slotWidth }}>
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase mb-0.5 tracking-wider",
                                            isWeekend ? "text-muted-foreground" : "text-primary"
                                        )}>
                                            {format(day, 'EEE')}
                                        </span>
                                        <span className={cn(
                                            "text-xs font-semibold",
                                            isWeekend ? "text-muted-foreground/70" : "text-foreground/80"
                                        )}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>
                                );
                            }

                            return (
                                <div key={day.toISOString()} className="flex shrink-0 border-e border-border/40" style={{ width: totalWidth / daysInView.length }}>
                                    {Array.from({ length: slotsPerDay }).map((_, sIdx) => {
                                        const totalMinutes = sIdx * slotDuration;
                                        const hour = startHourInt + Math.floor(totalMinutes / 60);
                                        const minutes = totalMinutes % 60;
                                        const date = new Date(new Date().setHours(hour, minutes, 0, 0));

                                        let timeLabel = "";
                                        if (is24Hour) {
                                            timeLabel = format(date, 'HH:mm');
                                        } else {
                                            // Only show minutes if slotDuration < 60 or if it's not the top of the hour
                                            timeLabel = (slotDuration < 60 || minutes !== 0) ? format(date, 'h:mm a') : format(date, 'ha');
                                        }

                                        return (
                                            <div key={sIdx} className="flex flex-col justify-end pb-2 border-e border-border/10 last:border-e-0 relative h-14" style={{ width: slotWidth }}>
                                                {!isSingleDay && sIdx === 0 && (
                                                    <div className={cn("absolute top-2 px-2 py-0.5 rounded text-[10px] font-bold text-foreground/80 bg-muted/50 border border-border/20 whitespace-nowrap", isRtl ? "right-2" : "left-2")}>
                                                        {format(day, 'EEE, MMM d')}
                                                    </div>
                                                )}
                                                <span className="text-[11px] font-black text-foreground text-center px-1 select-none tabular-nums truncate">
                                                    {timeLabel}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Timeline Body Area */}
            <div
                ref={scrollRef}
                data-testid="scheduler-scroll-container"
                className="flex-1 overflow-auto relative custom-scrollbar bg-background"
                onScroll={(e) => {
                    if (headerRef.current) {
                        headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
                    }
                }}
            >
                <div className="relative min-w-max" style={{ width: totalWidth + sidebarWidth, minHeight: '100%' }}>
                    {/* Time Indicator Line Layer (Spans full height) */}
                    {timeIndicatorPos !== null && currentTimeIndicator !== false && (
                        <div
                            className="current-time-indicator z-50 pointer-events-none"
                            style={{ [isRtl ? 'right' : 'left']: `${timeIndicatorPos + sidebarWidth}px`, height: '100%' }}
                        >
                            <div className="absolute top-0 -translate-x-1/2 w-[2px] h-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                            <div className="absolute top-0 -translate-x-1/2 -mt-1 w-2.5 h-2.5 rounded-full bg-red-500 shadow-md border-2 border-background" />
                        </div>
                    )}

                    {groupedData.groups.map((group) => (
                        <div key={group.name} className="flex border-b border-border/30 relative">
                            {/* Group Header Column (Sticky Left 0) */}
                            {showResourceHeaders && groupedData.isGrouped && (
                                <div
                                    className={cn(
                                        "w-[40px] shrink-0 sticky z-30 bg-background border-e border-border/40 flex items-center justify-center p-1",
                                        isRtl ? "right-0" : "left-0"
                                    )}
                                    style={{ height: 'auto' }}
                                >
                                    <div className="absolute inset-0 bg-background/80" />
                                    <div className="relative writing-mode-vertical transform rotate-180 text-[10px] font-bold uppercase tracking-wide text-foreground/70 whitespace-nowrap py-2 overflow-hidden text-ellipsis max-h-full">
                                        {group.name}
                                    </div>
                                </div>
                            )}

                            {/* Resources Column (Sticky Left Offset) */}
                            <div className="flex flex-col w-full">
                                {group.resources.map((resource, idx) => {
                                    const levels = maxLevels.get(resource.id) || 1;
                                    const rowHeight = (levels * 46) + 40; // Adjusted for new event height

                                    return (
                                        <div
                                            key={resource.id}
                                            className={cn(
                                                "flex border-b border-border/30 last:border-b-0 group/row hover:bg-muted/5 transition-colors",
                                                idx % 2 === 0 ? "bg-background" : "bg-background"
                                            )}
                                            style={{ height: `${rowHeight}px` }}
                                        >
                                            <div
                                                className={cn(
                                                    "w-[240px] shrink-0 sticky z-30 bg-background/95 backdrop-blur border-e border-border/40 px-6 py-4 flex items-center gap-4 transition-all shadow-[1px_0_4px_rgba(0,0,0,0.02)]",
                                                    groupedData.isGrouped
                                                        ? (isRtl ? "right-[40px]" : "left-[40px]")
                                                        : (isRtl ? "right-0" : "left-0"),
                                                    !showResourceHeaders && "hidden"
                                                )}
                                            >
                                                <>
                                                    <Avatar className="h-9 w-9 border border-border/60 shadow-sm">
                                                        {resource.avatar && <AvatarImage src={resource.avatar} alt={resource.name} className="object-cover" />}
                                                        <AvatarFallback className="text-xs font-bold bg-primary/5 text-primary">
                                                            {resource.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-[13px] font-semibold truncate text-foreground/90 tracking-tight leading-none mb-1.5">{resource.name}</span>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className={cn(
                                                                "w-1.5 h-1.5 rounded-full",
                                                                resource.type === 'Internal' ? "bg-primary shadow-[0_0_6px_var(--primary)]/50" : "bg-success shadow-[0_0_6px_var(--success)]/50"
                                                            )} />
                                                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{resource.type || 'Available'}</span>
                                                        </div>
                                                    </div>
                                                </>
                                            </div>

                                            <TimelineRow
                                                resource={resource}
                                                totalSlots={totalSlots}
                                                slotWidth={slotWidth}
                                                totalWidth={totalWidth}
                                                slotToDate={slotToDate}
                                                onSlotMouseDown={handleSlotMouseDown}
                                                onSlotMouseEnter={handleSlotMouseEnter}
                                                onSlotDoubleClick={onSlotDoubleClick}
                                                isSlotSelected={isSlotSelected}
                                                resourceMap={resourceMap}
                                                getEventStyle={getEventStyle}
                                                onEventClick={onEventClick}
                                                onEventDelete={onEventDelete}
                                                slotDuration={slotDuration}
                                                now={now}
                                                visibleEvents={visibleEvents}
                                                slotsPerDay={slotsPerDay}
                                                daysInView={daysInView}
                                                dir={dir}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface TimelineRowProps {
    resource: Resource;
    totalSlots: number;
    slotWidth: number;
    totalWidth: number;
    slotToDate: (index: number) => Date;
    onSlotMouseDown: (index: number, resourceId: string) => void;
    onSlotMouseEnter: (index: number) => void;
    onSlotDoubleClick?: (date: Date, resourceId?: string) => void;
    isSlotSelected: (index: number, resourceId: string) => boolean;
    resourceMap: Map<string, (SchedulerEvent & { level: number })[]>;
    getEventStyle: (event: SchedulerEvent & { level: number }) => React.CSSProperties;
    onEventClick?: (event: SchedulerEvent) => void;
    onEventDelete?: (eventId: string) => void;
    slotDuration: number;
    now: Date;
    visibleEvents: SchedulerEvent[];
    slotsPerDay: number;
    daysInView: Date[];
    dir?: 'ltr' | 'rtl' | 'auto';
}

const TimelineRow: React.FC<TimelineRowProps> = ({
    resource,
    totalSlots,
    slotWidth,
    totalWidth,
    slotToDate,
    onSlotMouseDown,
    onSlotMouseEnter,
    onSlotDoubleClick,
    isSlotSelected,
    resourceMap,
    getEventStyle,
    onEventClick,
    onEventDelete,
    slotDuration,
    now,
    visibleEvents,
    slotsPerDay,
    daysInView,
    dir
}) => {
    const isRtl = dir === 'rtl';
    const { setNodeRef, isOver } = useDroppable({
        id: `row-${resource.id}`,
        data: { resourceId: resource.id }
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "relative flex-1 group/interactive",
                isOver && "bg-primary/5 shadow-inner"
            )}
            style={{ width: totalWidth }}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const slotIndex = isRtl ? Math.floor((rect.width - x) / slotWidth) : Math.floor(x / slotWidth);
                if (slotIndex >= 0 && slotIndex < totalSlots) onSlotMouseEnter(slotIndex);
            }}
            onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const slotIndex = isRtl ? Math.floor((rect.width - x) / slotWidth) : Math.floor(x / slotWidth);
                if (slotIndex >= 0 && slotIndex < totalSlots) onSlotMouseDown(slotIndex, resource.id);
            }}
            onDoubleClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const slotIndex = isRtl ? Math.floor((rect.width - x) / slotWidth) : Math.floor(x / slotWidth);
                if (slotIndex >= 0 && slotIndex < totalSlots) {
                    const slotDate = slotToDate(slotIndex);
                    const isBlocked = visibleEvents.some(ev =>
                        (ev.isHoliday || ev.isFullyBooked) &&
                        isSameDay(ev.start, slotDate)
                    );
                    if (!isBlocked) {
                        onSlotDoubleClick?.(slotDate, resource.id);
                    }
                }
            }}
        >
            {/* Optimized Grid Lines Layer (CSS only) */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `repeating-linear-gradient(${isRtl ? 'to left' : 'to right'}, transparent, transparent ${slotWidth - 1}px, hsl(var(--border) / 0.1) ${slotWidth - 1}px, hsl(var(--border) / 0.1) ${slotWidth}px)`,
                    backgroundSize: `${slotWidth}px 100%`
                }}
            />

            {/* Blocked Dates Background Layer */}
            <div className="absolute inset-0 pointer-events-none flex">
                {daysInView.map((day, i) => {
                    const holidayInfo = visibleEvents.find(ev => ev.isHoliday && isSameDay(ev.start, day));
                    const fullyBookedInfo = visibleEvents.find(ev => ev.isFullyBooked && isSameDay(ev.start, day));

                    if (!holidayInfo && !fullyBookedInfo) {
                        return <div key={i} style={{ width: slotsPerDay * slotWidth }} />;
                    }

                    return (
                        <div
                            key={i}
                            style={{ width: slotsPerDay * slotWidth }}
                            className={cn(
                                "h-full border-e border-border/10",
                                holidayInfo && "bg-[repeating-linear-gradient(-45deg,hsl(var(--destructive)/0.05)_0px,hsl(var(--destructive)/0.05)_10px,transparent_10px,transparent_20px)] bg-destructive/[0.02]",
                                fullyBookedInfo && "bg-[repeating-linear-gradient(-45deg,theme(colors.amber.500/0.05)_0px,theme(colors.amber.500/0.05)_10px,transparent_10px,transparent_20px)] bg-amber-500/[0.02]"
                            )}
                        />
                    );
                })}
            </div>

            {/* Selection Highlight Layer - Optimized to only render visible selections */}
            <SelectionLayer
                totalSlots={totalSlots}
                resourceId={resource.id}
                slotWidth={slotWidth}
                isSlotSelected={isSlotSelected}
                isRtl={isRtl}
            />

            {/* Events Layer */}
            {resourceMap.get(resource.id)?.map((event: SchedulerEvent & { level: number }) => (
                <DraggableEvent
                    key={event.id}
                    event={event}
                    style={getEventStyle(event)}
                    onClick={onEventClick}
                    onDelete={onEventDelete}
                    orientation="horizontal"
                    resizable={true}
                    isBlocked={event.isBlock}
                    isPast={event.end < now}
                    slotDuration={slotDuration}
                    pixelsPerSlot={slotWidth}
                />
            ))}
        </div>
    );
};

interface SelectionLayerProps {
    totalSlots: number;
    resourceId: string;
    slotWidth: number;
    isSlotSelected: (index: number, resourceId: string) => boolean;
    isRtl?: boolean;
}

const SelectionLayer: React.FC<SelectionLayerProps> = React.memo(({
    totalSlots,
    resourceId,
    slotWidth,
    isSlotSelected,
    isRtl
}) => {
    // Collect contiguous selected slots into ranges for even fewer DOM nodes
    const selectedRanges: { start: number; length: number }[] = [];
    let currentRange: { start: number; length: number } | null = null;

    for (let i = 0; i < totalSlots; i++) {
        if (isSlotSelected(i, resourceId)) {
            if (!currentRange) {
                currentRange = { start: i, length: 1 };
                selectedRanges.push(currentRange);
            } else {
                currentRange.length++;
            }
        } else {
            currentRange = null;
        }
    }

    return (
        <>
            {selectedRanges.map((range, idx) => (
                <div
                    key={idx}
                    className="absolute top-0 bottom-0 bg-primary/20 border-x border-primary/30 z-10 pointer-events-none"
                    style={{
                        [isRtl ? 'right' : 'left']: `${range.start * slotWidth}px`,
                        width: `${range.length * slotWidth}px`
                    }}
                />
            ))}
        </>
    );
});
