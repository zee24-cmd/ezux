import { useCallback } from 'react';
import { SchedulerEvent } from '../EzScheduler.types';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

interface UseSchedulerEventHandlersProps {
    events: SchedulerEvent[];
    onEventChange?: (updatedEvent: SchedulerEvent) => void;
    slotDuration?: number;
}

export const useSchedulerEventHandlers = ({
    events,
    onEventChange,
    slotDuration = 30
}: UseSchedulerEventHandlersProps) => {
    const handleDragEnd = useCallback((event: any) => {
        const { active, over, delta } = event;

        // Find the event being dragged or resized
        const draggedEvent = events.find(e =>
            e.id === active.id ||
            e.id === (active.data?.current?.eventId || active.data?.current?.id)
        );

        if (!draggedEvent) return;

        // Handle Resize - Does not require 'over'
        if (active.data?.current?.type?.startsWith('resize-')) {
            const type = active.data.current.type;
            const data = active.data.current;
            const orientation = data?.orientation || 'vertical';
            const pixelsPerSlot = data?.pixelsPerSlot || 64;
            const deltaVal = orientation === 'vertical' ? delta.y : delta.x;
            const minutesDelta = Math.round(deltaVal / pixelsPerSlot) * slotDuration;

            if (minutesDelta === 0) return;

            if (type === 'resize-bottom') {
                const newEnd = new Date(draggedEvent.end.getTime() + minutesDelta * 60 * 1000);

                // Ensure end is at least slotDuration minutes after start
                const minEnd = new Date(draggedEvent.start.getTime() + slotDuration * 60 * 1000);
                const finalEnd = newEnd < minEnd ? minEnd : newEnd;

                onEventChange?.({
                    ...draggedEvent,
                    end: finalEnd
                });
            } else if (type === 'resize-top') {
                const newStart = new Date(draggedEvent.start.getTime() + minutesDelta * 60 * 1000);

                // Ensure start is at least slotDuration minutes before end
                const maxStart = new Date(draggedEvent.end.getTime() - slotDuration * 60 * 1000);
                const finalStart = newStart > maxStart ? maxStart : newStart;

                onEventChange?.({
                    ...draggedEvent,
                    start: finalStart
                });
            }
            return;
        }

        // Handle Dropping on a Slot
        if (typeof over.id === 'string' && over.id.startsWith('slot-')) {
            // Format: slot-ISOString-resourceId
            // The ISOString might contain dashes, so we should be careful. 
            // Better: use over.data.current
            const targetDate = over.data?.current?.date;
            const targetResourceId = over.data?.current?.resourceId;

            if (targetDate) {
                const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
                const newStart = new Date(targetDate);
                const newEnd = new Date(newStart.getTime() + duration);

                onEventChange?.({
                    ...draggedEvent,
                    start: newStart,
                    end: newEnd,
                    resourceId: targetResourceId === 'none' ? undefined : targetResourceId
                });
            }
            return;
        }

        // Handle Legacy Header-based dropping (if still used)
        const targetColumnId = typeof over.id === 'string' && over.id.startsWith('header-')
            ? over.id.replace('header-', '')
            : null;

        if (targetColumnId) {
            const updatedEvent = {
                ...draggedEvent,
                resourceId: targetColumnId
            };
            onEventChange?.(updatedEvent);
        }
    }, [events, onEventChange, slotDuration]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    return {
        sensors,
        handleDragEnd
    };
};
