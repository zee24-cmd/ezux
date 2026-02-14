import { useCallback } from 'react';

/**
 * Sort/Filter/Page event callbacks shared across components.
 */
export interface StateChangeCallbacks {
    onSort?: (args: { columns: { field: string; direction: 'asc' | 'desc' }[] }) => void;
    onPageChange?: (args: { currentPage: number; pageSize: number }) => void;
    onFilter?: (args: { columns: { field: string; operator: string; value: any }[] }) => void;
    onSearch?: (term: string) => void;
}

/**
 * Sort state from TanStack
 */
export interface SortingState {
    id: string;
    desc: boolean;
}

/**
 * Pagination state from TanStack
 */
export interface PaginationState {
    pageIndex: number;
    pageSize: number;
}

/**
 * Filter state from TanStack
 */
export interface ColumnFilterState {
    id: string;
    value: any;
}

/**
 * Shared hook for state change events (sort, page, filter).
 * Creates wrappers that emit aliased events alongside native TanStack callbacks.
 * Used by EzTable, EzScheduler, EzTreeView.
 * 
 * @example
 * const { wrapSortingChange, wrapPaginationChange } = useStateChangeEvents(props);
 * 
 * // Use in table config
 * onSortingChange: wrapSortingChange(setSorting)
 */
export const useStateChangeEvents = (callbacks: StateChangeCallbacks) => {
    /**
     * Wraps a sorting state setter to also emit onSort event
     */
    const wrapSortingChange = useCallback(<T extends (SortingState[] | ((old: SortingState[]) => SortingState[]))>(
        setter: (updater: T) => void,
        nativeCallback?: (state: SortingState[]) => void
    ) => {
        return (updater: T) => {
            setter(updater);
            // Fire callbacks after state update
            setTimeout(() => {
                const newState = typeof updater === 'function' ? [] : updater; // Simplified - actual state from getter
                nativeCallback?.(newState as SortingState[]);
                if (callbacks.onSort && Array.isArray(newState)) {
                    callbacks.onSort({
                        columns: (newState as SortingState[]).map(s => ({
                            field: s.id,
                            direction: s.desc ? 'desc' : 'asc'
                        }))
                    });
                }
            }, 0);
        };
    }, [callbacks.onSort]);

    /**
     * Wraps a pagination state setter to also emit onPageChange event
     */
    const wrapPaginationChange = useCallback((
        setter: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void,
        nativeCallback?: (state: PaginationState) => void
    ) => {
        return (updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
            setter(updater);
            setTimeout(() => {
                // Get actual state - for now emit with placeholder
                if (typeof updater === 'object') {
                    nativeCallback?.(updater);
                    callbacks.onPageChange?.({
                        currentPage: updater.pageIndex + 1,
                        pageSize: updater.pageSize
                    });
                }
            }, 0);
        };
    }, [callbacks.onPageChange]);

    /**
     * Emits sort event directly
     */
    const emitSort = useCallback((sorting: SortingState[]) => {
        callbacks.onSort?.({
            columns: sorting.map(s => ({
                field: s.id,
                direction: s.desc ? 'desc' : 'asc'
            }))
        });
    }, [callbacks.onSort]);

    /**
     * Emits page change event directly
     */
    const emitPageChange = useCallback((pagination: PaginationState) => {
        callbacks.onPageChange?.({
            currentPage: pagination.pageIndex + 1,
            pageSize: pagination.pageSize
        });
    }, [callbacks.onPageChange]);

    return {
        wrapSortingChange,
        wrapPaginationChange,
        emitSort,
        emitPageChange
    };
};
