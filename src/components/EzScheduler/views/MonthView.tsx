import { SchedulerEvent, EzSchedulerComponents } from '../EzScheduler.types';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { cn } from '../../../lib/utils';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

/**
 * Props for the MonthView component.
 */
interface MonthViewProps {
    /** 
     * The currently displayed date.
     * @group Properties 
     */
    currentDate: Date;
    /** 
     * List of days to display in the grid.
     * @group Properties 
     */
    daysInView: Date[];
    /** 
     * List of events to display.
     * @group Properties 
     */
    visibleEvents: SchedulerEvent[];
    /** 
     * Callback when a slot is clicked.
     * @group Events 
     */
    onSlotClick?: (date: Date) => void;
    /** 
     * Callback when a slot is double-clicked.
     * @group Events 
     */
    onSlotDoubleClick?: (date: Date) => void;
    /** 
     * Callback when an event is clicked.
     * @group Events 
     */
    onEventClick?: (event: SchedulerEvent) => void;
    /** 
     * Custom components for injection.
     * @group Properties 
     */
    components?: EzSchedulerComponents;
    /** 
     * Callback when the "more events" indicator is clicked.
     * @group Events 
     */
    moreEventsClick?: (data: { date: Date; event?: SchedulerEvent }) => void;
    /** 
     * Number of months to display.
     * @group Properties 
     */
    monthsCount?: number;
    /** 
     * Text direction.
     * @group Appearance 
     */
    dir?: 'ltr' | 'rtl' | 'auto';
}

/**
 * A monthly grid view of events.
 * @group Views
 */
export const MonthView: React.FC<MonthViewProps> = ({
    currentDate,
    daysInView,
    visibleEvents,
    onSlotClick,
    onSlotDoubleClick,
    onEventClick,
    components,
    moreEventsClick,
    // monthsCount = 1,
    dir
}) => {
    const isRtl = dir === 'rtl';
    const CustomEvent = components?.event;
    const CustomSlot = components?.timeSlot;
    // Standard Month Grid usually has 7 cols x 5 or 6 rows.
    // daysInView passed from useEzScheduler is already calculated as full weeks (Sun-Sat) covering the month.

    // We group events by day for rendering in cells
    const getEventsForDay = (day: Date) => {
        return visibleEvents.filter(e => isSameDay(e.start, day));
    };

    return (
        <TooltipProvider>
            <div className="flex flex-col h-full w-full bg-background rounded-xl border border-border overflow-hidden shadow-sm">
                {/* Header Row */}
                <div className="grid grid-cols-7 border-b border-border bg-muted/30">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, i) => (
                        <div key={i} className="py-3 text-center text-xs font-semibold uppercase text-muted-foreground tracking-widest">
                            {dayName}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 grid-rows-6 flex-1 min-h-0 bg-muted/20 gap-px">
                    {daysInView.map((day) => {
                        const dayEvents = getEventsForDay(day).filter(e => !e.isBlock); // Filter out blocked slots
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isToday = isSameDay(day, new Date());

                        // Limit shown events
                        const MAX_EVENTS = 4;
                        const shownEvents = dayEvents.slice(0, MAX_EVENTS);
                        const hiddenCount = dayEvents.length - MAX_EVENTS;
                        const totalCount = dayEvents.length;

                        return (
                            <div
                                key={day.toISOString()}
                                onClick={() => onSlotClick?.(day)}
                                onDoubleClick={() => onSlotDoubleClick?.(day)}
                                className={cn(
                                    "relative flex flex-col p-2 transition-colors group bg-background focus-visible:z-10",
                                    !isCurrentMonth && "bg-muted/5 text-muted-foreground/50",
                                    isCurrentMonth && "hover:bg-muted/30",
                                    "min-h-[100px]"
                                )}
                            >
                                {CustomSlot ? (
                                    <CustomSlot date={day} />
                                ) : (
                                    <>
                                        {/* Date Number & Count */}
                                        <div className={cn("flex items-center mb-2 pointer-events-none", isRtl ? "flex-row-reverse" : "justify-between")}>
                                            <span
                                                className={cn(
                                                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-all",
                                                    isToday
                                                        ? "bg-primary text-primary-foreground shadow-sm font-bold scale-110"
                                                        : "text-foreground group-hover:bg-muted/50",
                                                    !isCurrentMonth && "text-muted-foreground opacity-50"
                                                )}
                                            >
                                                {format(day, 'd')}
                                            </span>
                                            {totalCount > 0 && (
                                                <span className="text-[10px] text-muted-foreground font-medium px-1.5 py-0.5 rounded-full bg-muted/50">
                                                    {totalCount}
                                                </span>
                                            )}
                                        </div>

                                        {/* Events List */}
                                        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                                            {shownEvents.map((event) => (
                                                <Tooltip key={event.id} delayDuration={300}>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onEventClick?.(event);
                                                            }}
                                                            className={cn(
                                                                "group/event relative",
                                                                !CustomEvent && "flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium cursor-pointer transition-all shadow-sm hover:shadow-md border border-transparent hover:border-border/50 overflow-hidden bg-card hover:bg-accent/50",
                                                                !CustomEvent && !isCurrentMonth && "opacity-60 grayscale"
                                                            )}
                                                            style={!CustomEvent ? {
                                                                [isRtl ? 'borderRight' : 'borderLeft']: `3px solid ${event.color || 'oklch(var(--primary))'}`
                                                            } : undefined}
                                                        >
                                                            {CustomEvent ? (
                                                                <CustomEvent event={event} />
                                                            ) : (
                                                                <>
                                                                    <div className="flex-1 truncate leading-tight">
                                                                        {event.title}
                                                                    </div>
                                                                    {event.start && (
                                                                        <span className="text-[10px] text-muted-foreground/70 tabular-nums shrink-0">
                                                                            {format(event.start, 'h:mm a')}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="p-3 max-w-xs bg-popover/95 backdrop-blur-sm border-border/50 shadow-xl" sideOffset={5}>
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center gap-2 border-b border-border/50 pb-1.5">
                                                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: event.color || 'oklch(var(--primary))' }} />
                                                                <span className="font-semibold text-sm truncate">{event.title}</span>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground space-y-0.5">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="font-medium text-foreground/80">Time:</span>
                                                                    <span>
                                                                        {format(event.start, 'MMM d, h:mm a')} - {format(event.end, 'h:mm a')}
                                                                    </span>
                                                                </div>
                                                                {event.location && (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="font-medium text-foreground/80">Location:</span>
                                                                        <span>{event.location}</span>
                                                                    </div>
                                                                )}
                                                                {event.description && (
                                                                    <div className="pt-1 mt-1 border-t border-border/30 text-muted-foreground/80 line-clamp-3">
                                                                        {event.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}

                                            {hiddenCount > 0 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        moreEventsClick?.({ date: day });
                                                    }}
                                                    className="mt-auto self-start text-[10px] bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground font-medium px-2 py-1 rounded-md transition-colors w-full text-left"
                                                >
                                                    +{hiddenCount} more
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </TooltipProvider>
    );
};
