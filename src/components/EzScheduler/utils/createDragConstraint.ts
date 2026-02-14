import { Modifier } from '@dnd-kit/core';

/**
 * Creates a drag constraint modifier that restricts dragging to a specified area
 * @param selector - CSS selector for the constraint boundary element
 * @returns Modifier function or undefined if no selector provided
 */
export function createDragConstraint(selector?: string): Modifier | undefined {
    if (!selector) return undefined;

    return ({ transform, draggingNodeRect }) => {
        if (!draggingNodeRect) return transform;

        const constraintElement = document.querySelector(selector);
        if (!constraintElement) return transform;

        const bounds = constraintElement.getBoundingClientRect();

        // Calculate the constrained position
        const constrainedX = Math.max(
            bounds.left - draggingNodeRect.left,
            Math.min(transform.x, bounds.right - draggingNodeRect.right)
        );

        const constrainedY = Math.max(
            bounds.top - draggingNodeRect.top,
            Math.min(transform.y, bounds.bottom - draggingNodeRect.bottom)
        );

        return {
            ...transform,
            x: constrainedX,
            y: constrainedY
        };
    };
}
