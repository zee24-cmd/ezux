import { useCallback } from 'react';
import { DragEventArgs, ResizeEventArgs, Resource, SchedulerEvent } from '../EzScheduler.types';
import { DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

interface UseSchedulerEventHandlersProps {
    events: SchedulerEvent[];
    resources?: Resource[];
    onEventChange?: (updatedEvent: SchedulerEvent) => void;
    onBeforeEventDrop?: (args: DragEventArgs) => boolean | void;
    onBeforeEventResize?: (args: ResizeEventArgs) => boolean | void;
    slotDuration?: number;
}

export const useSchedulerEventHandlers = ({
    events,
    resources = [],
    onEventChange,
    onBeforeEventDrop,
    onBeforeEventResize,
    slotDuration = 30
}: UseSchedulerEventHandlersProps) => {
    const getResource = useCallback((resourceId?: string) => {
        if (!resourceId) return undefined;
        return resources.find(resource => String(resource.id) === String(resourceId));
    }, [resources]);

    const shouldCancel = (result: boolean | void, args: { cancel: boolean }) => result === false || args.cancel;

    const handleDragEnd = useCallback((event: DragEndEvent) => {
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

            let updatedEvent: SchedulerEvent | undefined;
            let resizeEdge: 'start' | 'end' | undefined;

            if (type === 'resize-bottom') {
                const newEnd = new Date(draggedEvent.end.getTime() + minutesDelta * 60 * 1000);

                // Ensure end is at least slotDuration minutes after start
                const minEnd = new Date(draggedEvent.start.getTime() + slotDuration * 60 * 1000);
                const finalEnd = newEnd < minEnd ? minEnd : newEnd;

                resizeEdge = 'end';
                updatedEvent = { ...draggedEvent, end: finalEnd };
            } else if (type === 'resize-top') {
                const newStart = new Date(draggedEvent.start.getTime() + minutesDelta * 60 * 1000);

                // Ensure start is at least slotDuration minutes before end
                const maxStart = new Date(draggedEvent.end.getTime() - slotDuration * 60 * 1000);
                const finalStart = newStart > maxStart ? maxStart : newStart;

                resizeEdge = 'start';
                updatedEvent = { ...draggedEvent, start: finalStart };
            }

            if (!updatedEvent) return;

            const args: ResizeEventArgs = {
                data: draggedEvent,
                event: updatedEvent,
                originalEvent: draggedEvent,
                proposedEvent: updatedEvent,
                sourceResourceId: draggedEvent.resourceId,
                targetResourceId: updatedEvent.resourceId,
                sourceResource: getResource(draggedEvent.resourceId),
                targetResource: getResource(updatedEvent.resourceId),
                sourceTime: draggedEvent.start,
                targetTime: updatedEvent.start,
                resizeEdge,
                cancel: false
            };

            if (shouldCancel(onBeforeEventResize?.(args), args)) return;
            onEventChange?.(updatedEvent);
            return;
        }

        if (!over) return;

        const dropData = over.data?.current;

        // Handle dropping on a time slot in day/week views.
        if (dropData?.kind === 'time-slot' || (typeof over.id === 'string' && over.id.startsWith('slot-'))) {
            const targetDate = dropData?.date;
            const targetResourceId = dropData?.resourceId;

            if (targetDate) {
                const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
                const newStart = new Date(targetDate);
                const newEnd = new Date(newStart.getTime() + duration);

                const updatedEvent: SchedulerEvent = {
                    ...draggedEvent,
                    start: newStart,
                    end: newEnd,
                    resourceId: targetResourceId === 'none' ? undefined : targetResourceId,
                    resourceIds: targetResourceId && targetResourceId !== 'none' ? [targetResourceId] : draggedEvent.resourceIds
                };
                const args: DragEventArgs = {
                    data: draggedEvent,
                    event: updatedEvent,
                    originalEvent: draggedEvent,
                    proposedEvent: updatedEvent,
                    sourceResourceId: draggedEvent.resourceId,
                    targetResourceId: updatedEvent.resourceId,
                    sourceResource: getResource(draggedEvent.resourceId),
                    targetResource: getResource(updatedEvent.resourceId),
                    sourceTime: draggedEvent.start,
                    targetTime: newStart,
                    cancel: false
                };

                if (shouldCancel(onBeforeEventDrop?.(args), args)) return;
                onEventChange?.(updatedEvent);
            }
            return;
        }

        // Handle timeline rows. Keep the pointer movement continuous and snap to slot width.
        if (dropData?.kind === 'timeline-row') {
            const slotWidth = dropData.slotWidth || 80;
            const targetResourceId = dropData.resourceId;
            const isRtl = !!dropData.isRtl;
            const directionMultiplier = isRtl ? -1 : 1;
            const minutesDelta = Math.round((delta.x * directionMultiplier) / slotWidth) * slotDuration;
            const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
            const newStart = new Date(draggedEvent.start.getTime() + minutesDelta * 60 * 1000);
            const newEnd = new Date(newStart.getTime() + duration);

            const updatedEvent: SchedulerEvent = {
                ...draggedEvent,
                start: newStart,
                end: newEnd,
                resourceId: targetResourceId === 'none' ? undefined : targetResourceId,
                resourceIds: targetResourceId && targetResourceId !== 'none' ? [targetResourceId] : draggedEvent.resourceIds
            };
            const args: DragEventArgs = {
                data: draggedEvent,
                event: updatedEvent,
                originalEvent: draggedEvent,
                proposedEvent: updatedEvent,
                sourceResourceId: draggedEvent.resourceId,
                targetResourceId: updatedEvent.resourceId,
                sourceResource: getResource(draggedEvent.resourceId),
                targetResource: getResource(updatedEvent.resourceId),
                sourceTime: draggedEvent.start,
                targetTime: newStart,
                cancel: false
            };

            if (shouldCancel(onBeforeEventDrop?.(args), args)) return;
            onEventChange?.(updatedEvent);
            return;
        }

        // Handle Legacy Header-based dropping (if still used)
        const targetColumnId = typeof over.id === 'string' && over.id.startsWith('header-')
            ? over.id.replace('header-', '')
            : null;

        if (targetColumnId) {
            const updatedEvent: SchedulerEvent = {
                ...draggedEvent,
                resourceId: targetColumnId
            };
            const args: DragEventArgs = {
                data: draggedEvent,
                event: updatedEvent,
                originalEvent: draggedEvent,
                proposedEvent: updatedEvent,
                sourceResourceId: draggedEvent.resourceId,
                targetResourceId: updatedEvent.resourceId,
                sourceResource: getResource(draggedEvent.resourceId),
                targetResource: getResource(updatedEvent.resourceId),
                sourceTime: draggedEvent.start,
                targetTime: updatedEvent.start,
                cancel: false
            };

            if (shouldCancel(onBeforeEventDrop?.(args), args)) return;
            onEventChange?.(updatedEvent);
        }
    }, [events, getResource, onBeforeEventDrop, onBeforeEventResize, onEventChange, slotDuration]);

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
