import { IService } from '../../../shared/services/ServiceRegistry';
import { SchedulerEvent } from '../EzScheduler.types';

export class CollisionDetectionService implements IService {
    name = 'CollisionDetectionService';

    /**
     * Checks if a new event overlaps with any existing events.
     * @param event The event to check.
     * @param events List of existing events.
     * @returns True if overlap is found, otherwise false.
     */
    hasOverlap(event: SchedulerEvent, events: SchedulerEvent[]): boolean {
        return events.some(e => {
            if (e.id === event.id) return false; // Skip self

            // Check resource overlap if resources are used
            if (event.resourceId && e.resourceId && event.resourceId !== e.resourceId) {
                return false;
            }

            return (
                (event.start >= e.start && event.start < e.end) || // Starts inside
                (event.end > e.start && event.end <= e.end) ||     // Ends inside
                (event.start <= e.start && event.end >= e.end)     // Encompasses
            );
        });
    }

    /**
     * Groups events that overlap to determine rendering columns/positions.
     * @param events Sorted list of events.
     * @returns Array of event groups (arrays).
     */
    groupOverlappingEvents(events: SchedulerEvent[]): SchedulerEvent[][] {
        if (events.length === 0) return [];

        const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
        const groups: SchedulerEvent[][] = [];
        let currentGroup: SchedulerEvent[] = [sorted[0]];
        let groupEnd = sorted[0].end.getTime();

        for (let i = 1; i < sorted.length; i++) {
            const event = sorted[i];
            if (event.start.getTime() < groupEnd) {
                currentGroup.push(event);
                groupEnd = Math.max(groupEnd, event.end.getTime());
            } else {
                groups.push(currentGroup);
                currentGroup = [event];
                groupEnd = event.end.getTime();
            }
        }
        groups.push(currentGroup);
        return groups;
    }

    cleanup() {
        // No state to clean
    }
}
