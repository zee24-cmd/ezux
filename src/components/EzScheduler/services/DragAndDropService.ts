import { IService } from '../../../shared/services/ServiceRegistry';
import { SchedulerEvent } from '../EzScheduler.types';
import { DragEndEvent } from '@dnd-kit/core';

export class DragAndDropService implements IService {
    name = 'DragAndDropService';
    // Helper methods to calculate new times based on pixel deltas or slot IDs
    // Since we use dnd-kit, the main logic often resides in the component via sensors and modifiers.
    // However, this service can centralize the logic for snap-to-grid and validation.

    calculateNewTimes(
        event: SchedulerEvent,
        deltaMinutes: number
    ): { start: Date; end: Date } {
        const newStart = new Date(event.start.getTime() + deltaMinutes * 60000);
        const newEnd = new Date(event.end.getTime() + deltaMinutes * 60000);
        return { start: newStart, end: newEnd };
    }

    handleDragEnd(
        event: DragEndEvent,
        events: SchedulerEvent[],
        _slotDuration: number = 30 // minutes
    ): { eventId: string; newStart: Date; newEnd: Date } | null {
        // Logic to interpret dnd-kit event
        // This usually requires knowledge of the drop target (slot time)
        // If the drop target has data-time, we can parse it.
        const { active, over } = event;

        if (!over) return null;

        const draggedEventId = active.id;
        const targetSlotTime = over.data?.current?.date; // Assuming slot has this data

        if (!targetSlotTime) return null;

        const originalEvent = events.find(e => e.id === draggedEventId);
        if (!originalEvent) return null;

        const duration = originalEvent.end.getTime() - originalEvent.start.getTime();
        const newStart = new Date(targetSlotTime);
        const newEnd = new Date(newStart.getTime() + duration);

        return { eventId: String(draggedEventId), newStart, newEnd };
    }

    cleanup() { }
}
