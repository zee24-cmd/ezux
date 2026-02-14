import React from 'react';
import { SchedulerEvent, EzSchedulerComponents } from '../EzScheduler.types';
import { format, isSameDay } from 'date-fns';
import { cn } from '../../../lib/utils';
import { EzContextMenu } from '../../../shared/components/EzContextMenu';

/**
 * Props for the AgendaView component.
 */
interface AgendaViewProps {
    /** 
     * List of days to display in the agenda.
     * @group Properties 
     */
    daysInView: Date[];
    /** 
     * List of events to display.
     * @group Properties 
     */
    visibleEvents: SchedulerEvent[];
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
}

/**
 * A linear list view of events, grouped by day.
 * @group Views
 */
export const AgendaView: React.FC<AgendaViewProps> = ({
    daysInView,
    visibleEvents,
    onEventClick,
    components
}) => {
    const CustomEvent = components?.event;

    return (
        <div
            data-testid="scheduler-scroll-container"
            className="flex flex-col h-full w-full bg-background overflow-y-auto border border-border rounded-lg">
            {daysInView.map((day) => {
                const dayEvents = visibleEvents
                    .filter(ev => isSameDay(ev.start, day))
                    .sort((a, b) => a.start.getTime() - b.start.getTime());

                /* If no events, we can skip or show empty state. 
                   Usually Agenda view shows empty days or just days with events. 
                   Standard Outlook shows all days in range. */

                const isToday = isSameDay(day, new Date());

                return (
                    <div key={day.toISOString()} className="flex flex-col border-b border-border pb-2 last:border-b-0">
                        {/* Day Header */}
                        <div className={cn(
                            "flex items-center px-4 py-2 sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border",
                            isToday && "text-primary font-semibold"
                        )}>
                            <div className="flex flex-col items-center mr-4 w-12 shrink-0">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">{format(day, 'EEE')}</span>
                                <span className="text-xl font-bold leading-none">{format(day, 'd')}</span>
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">
                                {format(day, 'MMMM yyyy')}
                            </div>
                        </div>

                        {/* Events List */}
                        <div className="flex flex-col px-2 py-1 gap-2">
                            {dayEvents.length === 0 ? (
                                <div className="text-sm text-muted-foreground px-4 py-2 italic opacity-50">
                                    No events
                                </div>
                            ) : (
                                dayEvents.map(event => (
                                    <EzContextMenu key={event.id} contextId="scheduler-event" data={event}>
                                        <div
                                            data-testid={`scheduler-event-${event.id}`}
                                            className={cn(
                                                "flex items-center p-3 rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer hover:bg-muted/50 transition-colors",
                                                event.color && `border-l-4 border-l-[${event.color}]`
                                            )}
                                            style={{ borderLeftColor: event.color }}
                                            onClick={() => onEventClick?.(event)}
                                        >
                                            <div className="flex flex-col mr-4 min-w-[80px] shrink-0">
                                                <span className="text-sm font-bold">{format(event.start, 'h:mm a')}</span>
                                                <span className="text-xs text-muted-foreground">{format(event.end, 'h:mm a')}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold truncate">
                                                    {CustomEvent ? <CustomEvent event={event} /> : event.title}
                                                </div>
                                                {event.description && <div className="text-xs text-muted-foreground truncate">{event.description}</div>}
                                            </div>
                                            {event.resourceId && (
                                                <div className="hidden sm:block ml-2 px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">
                                                    {event.resourceId}
                                                    {/* In a real app we'd map ID to name */}
                                                </div>
                                            )}
                                        </div>
                                    </EzContextMenu>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
