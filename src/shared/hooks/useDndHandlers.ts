import { useSensor, useSensors, PointerSensor, CollisionDetection, DragEndEvent, DragStartEvent } from '@dnd-kit/core';

interface UseDndHandlersOptions {
    onDragStart?: (event: DragStartEvent) => void;
    onDragEnd: (event: DragEndEvent) => void;
    collisionDetection?: CollisionDetection;
    distance?: number;
}

/**
 * A shared hook to consolidate dnd-kit sensor setup and handlers.
 * 
 * @param options DnD options including onDragEnd, collisionDetection, and distance constraint.
 */
export const useDndHandlers = (options: UseDndHandlersOptions) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: options.distance ?? 5
            }
        })
    );

    return {
        sensors,
        onDragStart: options.onDragStart,
        onDragEnd: options.onDragEnd,
        collisionDetection: options.collisionDetection
    };
};
