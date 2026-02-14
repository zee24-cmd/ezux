import { useState, useMemo } from 'react';
import type { KanbanBoard, FilterConfig } from '../EzKanban.types';

/**
 * Hook for managing Kanban board filtering and search logic.
 * 
 * Computes the filtered list of cards based on search query and active filter config.
 * 
 * @param board The current board state.
 * @group Hooks
 */
export const useKanbanFilters = (board: KanbanBoard) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<FilterConfig>({});

    const filteredCards = useMemo(() => {
        return board.cards.filter(card => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    card.title.toLowerCase().includes(query) ||
                    card.description?.toLowerCase().includes(query) ||
                    card.tags.some(tag => tag.name.toLowerCase().includes(query));
                if (!matchesSearch) return false;
            }

            // Tag filter
            if (activeFilters.tags && activeFilters.tags.length > 0) {
                const hasTag = card.tags.some(tag => activeFilters.tags?.includes(tag.id));
                if (!hasTag) return false;
            }

            // Assignee filter
            if (activeFilters.assignees && activeFilters.assignees.length > 0) {
                const hasAssignee = card.assignees.some(a => activeFilters.assignees?.includes(a.id));
                if (!hasAssignee) return false;
            }

            // Priority filter
            if (activeFilters.priority && activeFilters.priority.length > 0) {
                if (card.priority && !activeFilters.priority.includes(card.priority)) {
                    return false;
                }
            }

            // Column filter
            if (activeFilters.columns && activeFilters.columns.length > 0) {
                if (!activeFilters.columns.includes(card.columnId)) {
                    return false;
                }
            }

            return true;
        });
    }, [board.cards, searchQuery, activeFilters]);

    const clearFilters = () => {
        setSearchQuery('');
        setActiveFilters({});
    };

    return {
        /** List of cards after applying search and filters. @group State */
        filteredCards,
        /** Current search query string. @group State */
        searchQuery,
        /** Handler to update the search query. @group Methods */
        setSearchQuery,
        /** Current active filter configuration. @group State */
        activeFilters,
        /** Handler to update active filters. @group Methods */
        setActiveFilters,
        /** Clear all active filters and search query. @group Methods */
        clearFilters,
    };
};
