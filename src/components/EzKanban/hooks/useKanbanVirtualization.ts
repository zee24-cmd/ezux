import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { KanbanCard } from '../EzKanban.types';

export interface UseKanbanVirtualizationProps {
    cards: KanbanCard[];
    estimateSize?: number;
    overscan?: number;
}

/**
 * Hook for virtualizing Kanban cards in a column
 * Enables smooth scrolling with 10,000+ cards
 */
export const useKanbanVirtualization = ({
    cards,
    estimateSize = 120,
    overscan = 5,
}: UseKanbanVirtualizationProps) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: cards.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimateSize,
        overscan,
    });

    return {
        parentRef,
        virtualizer,
        virtualItems: virtualizer.getVirtualItems(),
        totalSize: virtualizer.getTotalSize(),
    };
};
