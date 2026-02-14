import { useCallback, useState } from 'react';
import { DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { TreeNode } from '../EzTreeView.types';

interface UseTreeDragDropProps {
    onDragEnd: (node: TreeNode, targetNode: TreeNode, position: 'before' | 'after' | 'inside') => void;
    onDragStart?: (node: TreeNode) => void;
}

/**
 * Hook for managing tree-specific drag-and-drop logic using @dnd-kit.
 * 
 * Handles drag start, over (calculating drop position), and end events.
 * 
 * @param props Configuration and callbacks for drag-and-drop operations.
 * @group Hooks
 */
export const useTreeDragDrop = ({ onDragEnd, onDragStart }: UseTreeDragDropProps) => {
    const [activeNode, setActiveNode] = useState<TreeNode | null>(null);
    const [dragOverNode, setDragOverNode] = useState<TreeNode | null>(null);
    const [dragPosition, setDragPosition] = useState<'before' | 'after' | 'inside'>('inside');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        const node = active.data.current?.node as TreeNode;
        if (node) {
            setActiveNode(node);
            onDragStart?.(node);
        }
    }, [onDragStart]);

    const handleDragOver = useCallback((event: any) => {
        event.preventDefault();
        const { active, over } = event;
        if (!over) return;

        const draggedNode = active.data.current?.node as TreeNode;
        const targetNode = over.data.current?.node as TreeNode;

        if (draggedNode && targetNode && draggedNode.id !== targetNode.id) {
            const rect = over.rect;
            const midY = rect.top + rect.height / 2;

            if (midY < rect.top + 10) {
                setDragPosition('before');
            } else if (midY > rect.bottom - 10) {
                setDragPosition('after');
            } else {
                setDragPosition('inside');
            }

            setDragOverNode(targetNode);
        }
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (active && over && activeNode && dragOverNode) {
            onDragEnd(activeNode, dragOverNode, dragPosition);
        }

        setActiveNode(null);
        setDragOverNode(null);
        setDragPosition('inside');
    }, [activeNode, dragOverNode, dragPosition, onDragEnd]);

    return {
        /** Sensors for dnd-kit interaction. @group Properties */
        sensors,
        /** The node currently being dragged. @group State */
        activeNode,
        /** The node currently being dragged over. @group State */
        dragOverNode,
        /** The relative drop position (before/after/inside). @group State */
        dragPosition,
        /** Internal handler for drag start. @group Events */
        handleDragStart,
        /** Internal handler for drag over. @group Events */
        handleDragOver,
        /** Internal handler for drag end. @group Events */
        handleDragEnd,
    };
};