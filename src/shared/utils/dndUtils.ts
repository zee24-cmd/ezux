import { DragEndEvent } from '@dnd-kit/core';

/**
 * Shared DnD utilities for components.
 */

/**
 * Basic arrayMove implementation to avoid dependency on @dnd-kit/sortable
 */
export const arrayMove = <T>(array: T[], from: number, to: number): T[] => {
    const newArray = array.slice();
    newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
    return newArray;
};

/**
 * Helper to handle basic array reordering after drag and drop
 */
export const reorderArray = <T>(items: T[], event: DragEndEvent): T[] => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((item: any) => item.id === active.id);
        const newIndex = items.findIndex((item: any) => item.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(items, oldIndex, newIndex);
        }
    }
    return items;
};

/**
 * Checks if a drop is valid based on types
 */
export const isValidDrop = (activeType: string, overType: string, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(activeType) && activeType === overType;
};
