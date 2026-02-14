import { useMemo } from 'react';
import { SchedulerEvent } from '../EzScheduler.types';
import { rrulestr } from 'rrule';

export const useRecurrence = (events: SchedulerEvent[], rangeStart: Date, rangeEnd: Date) => {
    return useMemo(() => {
        const expandedEvents: SchedulerEvent[] = [];

        events.forEach(event => {
            if (!event.rrule) {
                // Non-recurring event: add if it overlaps deeply or is just in range logic handled by caller?
                // The caller usually filters visible events. But if we expand, we should probably return *all* instances in range.
                // Let's assume the caller expects a list of *instances* in the view.

                // Simple check if it's within range (though useEzScheduler already somewhat filters, 
                // but useEzScheduler filters *based on the original event*. 
                // For valid expansion, we need to check if the *instance* is in range.)
                if (event.end >= rangeStart && event.start <= rangeEnd) {
                    expandedEvents.push(event);
                }
                return;
            }

            try {
                // Parse RRule
                const duration = event.end.getTime() - event.start.getTime();
                const rule = rrulestr(event.rrule, {
                    dtstart: event.start, // RFC 5545 requires UTC usually, but rrule.js handles local dates if consistent
                });

                // Get instances between range
                // rrule.between(after, before, inclusive)
                const instances = rule.between(rangeStart, rangeEnd, true);

                instances.forEach(date => {
                    // Filter exclusions if any (simple implementation)
                    if (event.exdate && event.exdate.includes(date.toISOString())) {
                        return;
                    }

                    expandedEvents.push({
                        ...event,
                        id: `${event.id}_${date.getTime()}`,
                        recurrenceId: event.id,
                        originalStart: event.start,
                        start: date,
                        end: new Date(date.getTime() + duration),
                        rrule: undefined, // Instance shouldn't have rrule itself
                    });
                });
            } catch (err) {
                console.error(`Failed to parse recurrence for event ${event.id}`, err);
                // Fallback: show original if in range
                if (event.end >= rangeStart && event.start <= rangeEnd) {
                    expandedEvents.push(event);
                }
            }
        });

        return expandedEvents;
    }, [events, rangeStart, rangeEnd]);
};
