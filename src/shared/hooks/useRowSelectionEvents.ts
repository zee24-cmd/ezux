import { useCallback, useRef, useEffect } from 'react';

/**
 * Row selection event callbacks shared across components.
 */
export interface RowSelectionCallbacks<TData = any> {
    onRowSelect?: (args: { row: any; data: TData; rowIndex: number; originalEvent?: React.SyntheticEvent }) => void;
    onRowDeselect?: (args: { row: any; data: TData; rowIndex: number }) => void;
    onSelectionChange?: (selection: { selectedIds: (string | number)[]; mode?: 'single' | 'multiple' }) => void;
}

/**
 * Row selection state for tracking changes
 */
export interface RowSelectionState {
    [key: string]: boolean;
}

/**
 * Shared hook for row selection events.
 * Tracks selection changes and emits per-row select/deselect events.
 * Used by EzTable, EzScheduler, EzTreeView.
 * 
 * @example
 * const { handleSelectionChange } = useRowSelectionEvents(props, getRowData);
 * 
 * // On selection state change
 * handleSelectionChange(newSelection, event);
 */
export const useRowSelectionEvents = <TData = any>(
    callbacks: RowSelectionCallbacks<TData>,
    getRowData: (rowId: string | number, index: number) => { row: any; data: TData } | undefined
) => {
    const prevSelectionRef = useRef<RowSelectionState>({});

    const handleSelectionChange = useCallback((
        newSelection: RowSelectionState,
        originalEvent?: React.SyntheticEvent
    ) => {
        const prevSelection = prevSelectionRef.current;
        const prevIds = Object.keys(prevSelection).filter(k => prevSelection[k]);
        const newIds = Object.keys(newSelection).filter(k => newSelection[k]);

        // Find newly selected rows
        const addedIds = newIds.filter(id => !prevIds.includes(id));
        // Find newly deselected rows
        const removedIds = prevIds.filter(id => !newIds.includes(id));

        // Emit onRowSelect for each newly selected row
        addedIds.forEach((id, idx) => {
            const rowInfo = getRowData(id, idx);
            if (rowInfo && callbacks.onRowSelect) {
                callbacks.onRowSelect({
                    row: rowInfo.row,
                    data: rowInfo.data,
                    rowIndex: parseInt(id) || idx,
                    originalEvent
                });
            }
        });

        // Emit onRowDeselect for each deselected row
        removedIds.forEach((id, idx) => {
            const rowInfo = getRowData(id, idx);
            if (rowInfo && callbacks.onRowDeselect) {
                callbacks.onRowDeselect({
                    row: rowInfo.row,
                    data: rowInfo.data,
                    rowIndex: parseInt(id) || idx
                });
            }
        });

        // Emit overall selection change
        if (callbacks.onSelectionChange) {
            callbacks.onSelectionChange({
                selectedIds: newIds,
                mode: newIds.length > 1 ? 'multiple' : 'single'
            });
        }

        // Update ref
        prevSelectionRef.current = newSelection;
    }, [callbacks, getRowData]);

    // Reset on unmount
    useEffect(() => {
        return () => {
            prevSelectionRef.current = {};
        };
    }, []);

    return {
        handleSelectionChange,
        getPreviousSelection: () => prevSelectionRef.current
    };
};
