import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
    SortingStrategy
} from '@dnd-kit/sortable';

interface EzSortableListProps<T> {
    items: T[];
    onReorder: (items: T[]) => void;
    renderItem: (item: T, index: number) => React.ReactNode;
    getId: (item: T) => string;
    strategy?: SortingStrategy;
    className?: string;
}

export function EzSortableList<T>({
    items,
    onReorder,
    renderItem,
    getId,
    strategy = verticalListSortingStrategy,
    className
}: EzSortableListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Avoid accidental drags on clicks
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => getId(item) === active.id);
            const newIndex = items.findIndex((item) => getId(item) === over.id);

            onReorder(arrayMove(items, oldIndex, newIndex));
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(getId)}
                strategy={strategy}
            >
                <div className={className}>
                    {items.map((item, index) => renderItem(item, index))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

// Export strategies for convenience
export { verticalListSortingStrategy, horizontalListSortingStrategy };
