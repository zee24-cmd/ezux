import { IService } from '../../../shared/services/ServiceRegistry';
import { SchedulerEvent } from '../EzScheduler.types';
import { RRule } from 'rrule';

export class RecurrenceEngine implements IService {
    name = 'RecurrenceEngine';

    expandEvents(events: SchedulerEvent[], start: Date, end: Date): SchedulerEvent[] {
        const expanded: SchedulerEvent[] = [];

        events.forEach(event => {
            if (event.recurrenceRule || event.rrule) {
                try {
                    const ruleStr = event.recurrenceRule || event.rrule || '';
                    if (!ruleStr) return;

                    const eventStart = new Date(event.start);
                    const eventEnd = new Date(event.end);

                    const options = RRule.parseString(ruleStr);
                    options.dtstart = eventStart;

                    const rule = new RRule(options);

                    // Get all occurrences between start and end
                    // Optimization: pad the range slightly to catch edge cases
                    const occurrences = rule.between(start, end, true);

                    // Parse exceptions if present
                    const exceptions = new Set<number>();
                    if (event.exdate && Array.isArray(event.exdate)) {
                        event.exdate.forEach(ex => {
                            // Support both ISO strings and Date objects if mixed (legacy)
                            const exTime = new Date(ex).getTime();
                            if (!isNaN(exTime)) {
                                exceptions.add(exTime);
                            }
                        });
                    } else if (typeof event.recurrenceException === 'string') {
                        // Parse comma-separated ISO strings
                        event.recurrenceException.split(',').forEach(ex => {
                            const exTime = new Date(ex).getTime();
                            if (!isNaN(exTime)) {
                                exceptions.add(exTime);
                            }
                        });
                    }

                    occurrences.forEach(date => {
                        // Skip if date is in exceptions
                        // We check the exact start time of the occurrence
                        // Note: RRule usually returns dates with the same time as dtstart
                        if (exceptions.has(date.getTime())) return;

                        const duration = eventEnd.getTime() - eventStart.getTime();
                        if (isNaN(duration)) return;

                        const occurrenceEnd = new Date(date.getTime() + duration);

                        expanded.push({
                            ...event,
                            id: `${event.id}-${date.getTime()}`, // Synthetic ID for valid key
                            recurrenceId: String(event.id),
                            start: date,
                            end: occurrenceEnd,
                            originalStart: eventStart
                        });
                    });
                } catch (e) {
                    console.error(`Error processing recurrence rule for event ${event.id}:`, e);
                    // Fallback: just add original event
                    expanded.push(event);
                }
            } else {
                expanded.push(event);
            }
        });

        return expanded;
    }

    cleanup() { }
}
