import { useState, useCallback, useMemo } from 'react';

/**
 * Configuration for the useSelection hook.
 * @group Properties
 */
export interface SelectionConfig<TData = any> {
    /** Selection mode: single, multiple, or range. @default 'multiple' @group Properties */
    mode?: 'single' | 'multiple' | 'range';
    /** Whether to enable keyboard interaction support. @group Properties */
    enableKeyboardNavigation?: boolean;
    /** Callback triggered when selection changes. @group Events */
    onSelectionChange?: (selectedIds: (string | number)[], selectedItems: TData[]) => void;
    /** Function to extract a unique ID from an item. @group Data */
    getItemId?: (item: TData) => string | number;
}

/**
 * Internal selection state.
 * @group State
 */
export interface SelectionState {
    /** Set of currently selected unique identifiers. @group State */
    selectedIds: Set<string | number>;
    /** ID of the node currently receiving focus. @group State */
    focusedId: string | number | null;
    /** ID of the node acting as the anchor for range selection. @group State */
    anchorId: string | number | null;
}

/**
 * Public API for selection management.
 * @group Methods
 */
export interface SelectionAPI<TData = any> {
    /** Selects a single item by ID. @group Methods */
    selectItem: (id: string | number) => void;
    /** Selects multiple items by ID. @group Methods */
    selectItems: (ids: (string | number)[]) => void;
    /** Deselects a single item by ID. @group Methods */
    deselectItem: (id: string | number) => void;
    /** Deselects multiple items by ID. @group Methods */
    deselectItems: (ids: (string | number)[]) => void;
    /** Toggles the selection state of an item. @group Methods */
    toggleItem: (id: string | number) => void;
    /** Selects all available items (multi-mode only). @group Methods */
    selectAll: () => void;
    /** Clears all current selections. @group Methods */
    clearSelection: () => void;
    /** Selects a range of items between two IDs. @group Methods */
    selectRange: (startId: string | number, endId: string | number) => void;

    /** Checks if a specific ID is selected. @group Methods */
    isSelected: (id: string | number) => boolean;
    /** Returns an array of all selected IDs. @group Methods */
    getSelectedIds: () => (string | number)[];
    /** Returns an array of all selected data items. @group Methods */
    getSelectedItems: () => TData[];
    /** Returns the total number of selected items. @group Methods */
    getSelectionCount: () => number;
    /** Returns whether any items are currently selected. @group Methods */
    hasSelection: () => boolean;

    /** Sets the focused item ID. @group Methods */
    setFocusedId: (id: string | number | null) => void;
    /** Gets the currently focused item ID. @group Methods */
    getFocusedId: () => string | number | null;
}

/**
 * Shared selection hook for table, tree, and scheduler components.
 * 
 * Provides standardized selection management (single/multiple/range) with support for
 * keyboard navigation and persistent focus.
 * 
 * @param items The list of items to manage selection for.
 * @param config Selection behavior configuration.
 * @group Hooks
 */
export const useSelection = <TData = any>(
    items: TData[],
    config: SelectionConfig<TData> = {}
): SelectionAPI<TData> => {
    const {
        mode = 'multiple',
        onSelectionChange,
        getItemId = (item: any) => item.id
    } = config;

    const [state, setState] = useState<SelectionState>({
        selectedIds: new Set(),
        focusedId: null,
        anchorId: null
    });

    // Get item IDs for range selection
    const itemIds = useMemo(() => items.map(getItemId), [items, getItemId]);

    // Get selected items
    const getSelectedItems = useCallback((): TData[] => {
        return items.filter(item => state.selectedIds.has(getItemId(item)));
    }, [items, state.selectedIds, getItemId]);

    // Notify selection change
    const notifyChange = useCallback((newSelectedIds: Set<string | number>) => {
        if (onSelectionChange) {
            const selectedItems = items.filter(item => newSelectedIds.has(getItemId(item)));
            onSelectionChange(Array.from(newSelectedIds), selectedItems);
        }
    }, [items, getItemId, onSelectionChange]);

    // Select single item
    const selectItem = useCallback((id: string | number) => {
        setState(prev => {
            const newSelectedIds = mode === 'single'
                ? new Set([id])
                : new Set(prev.selectedIds).add(id);

            notifyChange(newSelectedIds);

            return {
                ...prev,
                selectedIds: newSelectedIds,
                focusedId: id,
                anchorId: id
            };
        });
    }, [mode, notifyChange]);

    // Select multiple items
    const selectItems = useCallback((ids: (string | number)[]) => {
        setState(prev => {
            const newSelectedIds = mode === 'single'
                ? new Set([ids[0]])
                : new Set([...prev.selectedIds, ...ids]);

            notifyChange(newSelectedIds);

            return {
                ...prev,
                selectedIds: newSelectedIds,
                focusedId: ids[ids.length - 1] || prev.focusedId,
                anchorId: ids[0] || prev.anchorId
            };
        });
    }, [mode, notifyChange]);

    // Deselect single item
    const deselectItem = useCallback((id: string | number) => {
        setState(prev => {
            const newSelectedIds = new Set(prev.selectedIds);
            newSelectedIds.delete(id);

            notifyChange(newSelectedIds);

            return {
                ...prev,
                selectedIds: newSelectedIds
            };
        });
    }, [notifyChange]);

    // Deselect multiple items
    const deselectItems = useCallback((ids: (string | number)[]) => {
        setState(prev => {
            const newSelectedIds = new Set(prev.selectedIds);
            ids.forEach(id => newSelectedIds.delete(id));

            notifyChange(newSelectedIds);

            return {
                ...prev,
                selectedIds: newSelectedIds
            };
        });
    }, [notifyChange]);

    // Toggle item selection
    const toggleItem = useCallback((id: string | number) => {
        setState(prev => {
            const newSelectedIds = new Set(prev.selectedIds);

            if (newSelectedIds.has(id)) {
                newSelectedIds.delete(id);
            } else {
                if (mode === 'single') {
                    newSelectedIds.clear();
                }
                newSelectedIds.add(id);
            }

            notifyChange(newSelectedIds);

            return {
                ...prev,
                selectedIds: newSelectedIds,
                focusedId: id,
                anchorId: id
            };
        });
    }, [mode, notifyChange]);

    // Select all items
    const selectAll = useCallback(() => {
        if (mode === 'single') return;

        setState(prev => {
            const newSelectedIds = new Set(itemIds);

            notifyChange(newSelectedIds);

            return {
                ...prev,
                selectedIds: newSelectedIds
            };
        });
    }, [mode, itemIds, notifyChange]);

    // Clear selection
    const clearSelection = useCallback(() => {
        setState(prev => {
            notifyChange(new Set());

            return {
                ...prev,
                selectedIds: new Set(),
                anchorId: null
            };
        });
    }, [notifyChange]);

    // Select range (for shift+click)
    const selectRange = useCallback((startId: string | number, endId: string | number) => {
        if (mode === 'single') return;

        const startIndex = itemIds.indexOf(startId);
        const endIndex = itemIds.indexOf(endId);

        if (startIndex === -1 || endIndex === -1) return;

        const [min, max] = startIndex < endIndex
            ? [startIndex, endIndex]
            : [endIndex, startIndex];

        const rangeIds = itemIds.slice(min, max + 1);

        setState(prev => {
            const newSelectedIds = new Set([...prev.selectedIds, ...rangeIds]);

            notifyChange(newSelectedIds);

            return {
                ...prev,
                selectedIds: newSelectedIds,
                focusedId: endId
            };
        });
    }, [mode, itemIds, notifyChange]);

    // Check if item is selected
    const isSelected = useCallback((id: string | number): boolean => {
        return state.selectedIds.has(id);
    }, [state.selectedIds]);

    // Get selected IDs
    const getSelectedIds = useCallback((): (string | number)[] => {
        return Array.from(state.selectedIds);
    }, [state.selectedIds]);

    // Get selection count
    const getSelectionCount = useCallback((): number => {
        return state.selectedIds.size;
    }, [state.selectedIds]);

    // Check if has selection
    const hasSelection = useCallback((): boolean => {
        return state.selectedIds.size > 0;
    }, [state.selectedIds]);

    // Set focused ID
    const setFocusedId = useCallback((id: string | number | null) => {
        setState(prev => ({ ...prev, focusedId: id }));
    }, []);

    // Get focused ID
    const getFocusedId = useCallback((): string | number | null => {
        return state.focusedId;
    }, [state.focusedId]);

    return {
        selectItem,
        selectItems,
        deselectItem,
        deselectItems,
        toggleItem,
        selectAll,
        clearSelection,
        selectRange,
        isSelected,
        getSelectedIds,
        getSelectedItems,
        getSelectionCount,
        hasSelection,
        setFocusedId,
        getFocusedId
    };
};
