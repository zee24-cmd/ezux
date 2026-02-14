import { useState, useCallback, useMemo, useRef, type SetStateAction } from 'react';

/**
 * Supported action types for table history tracking.
 */
export type TableActionType = 'ADD_ROW' | 'DELETE_ROW' | 'EDIT_CELL';

/**
 * Represents a single action in the table history.
 * @group Models
 */
export interface TableAction<TData> {
    /** Type of action performed. @group Properties */
    type: TableActionType;
    /** Metadata about the action (row, column, values). @group Properties */
    payload: {
        rowIndex?: number;
        rowId?: string | number;
        columnId?: string;
        oldValue?: any;
        newValue?: any;
        row?: TData;
    };
    /** Execution timestamp. @group Properties */
    timestamp: number;
}

/**
 * State container for undo/redo history.
 * @group Models
 */
export interface HistoryState<TData> {
    /** List of past actions (undo stack). @group Properties */
    past: TableAction<TData>[];
    /** List of future actions (redo stack). @group Properties */
    future: TableAction<TData>[];
}

/**
 * Internal state structure for the history hook.
 * @group Models
 */
export interface TableHistoryState<TData> {
    /** Current table data. @group Properties */
    data: TData[];
    /** History stacks. @group Properties */
    history: HistoryState<TData>;
}

/**
 * Optimized hook for managing table data with undo/redo capabilities.
 * Tracks added, edited, and deleted rows relative to the initial dataset.
 * 
 * @param initialData - The baseline data for the table
 * @param idField - Field name used as a unique identifier (default: 'id')
 * @returns State and methods for data manipulation and history tracking
 * @group Hooks
 */
export const useTableHistory = <TData extends object>(initialData: TData[], idField: string = 'id') => {
    // Keep a stable reference to initial data IDs for tracking
    const initialDataMap = useMemo(() => {
        const map = new Map<string | number, TData>();
        initialData.forEach((row) => {
            const id = (row as any)[idField];
            if (id !== undefined) map.set(id, row);
        });
        return map;
    }, [initialData, idField]);

    const [state, setState] = useState<TableHistoryState<TData>>({
        data: initialData,
        history: { past: [], future: [] }
    });

    // Track which rows have been modified to optimize change counting
    const dirtyRowIds = useRef<Set<string | number>>(new Set());

    // Detect initialData change and reset state during render to avoid transient dirty state
    const lastInitialData = useRef(initialData);
    if (lastInitialData.current !== initialData) {
        lastInitialData.current = initialData;
        setState({
            data: initialData,
            history: { past: [], future: [] }
        });
        dirtyRowIds.current.clear();
    }

    const setData = useCallback((action: SetStateAction<TData[]>) => {
        setState(prev => ({
            ...prev,
            data: typeof action === 'function' ? (action as any)(prev.data) : action,
            // When setting whole data, we usually want to clear history if it matches initialData
            // but for now we keep it simple as this is used by imperative API too
        }));
    }, []);

    const performEdit = useCallback((rowIndex: number, columnId: string, newValue: any) => {
        setState(prev => {
            const row = prev.data[rowIndex];
            if (!row) return prev;

            const oldValue = (row as any)[columnId];
            if (oldValue === newValue) return prev;

            const rowId = (row as any)[idField];
            if (rowId !== undefined) dirtyRowIds.current.add(rowId);

            const action: TableAction<TData> = {
                type: 'EDIT_CELL',
                payload: { rowIndex, rowId, columnId, oldValue, newValue },
                timestamp: Date.now()
            };

            const newData = [...prev.data];
            newData[rowIndex] = { ...row, [columnId]: newValue };

            return {
                data: newData,
                history: {
                    past: [...prev.history.past, action],
                    future: []
                }
            };
        });
    }, [idField]);

    const addRow = useCallback((newRow: TData, index: number = 0) => {
        setState(prev => {
            // Ensure unique ID for new row if not present
            let rowWithId = { ...newRow };
            if ((rowWithId as any)[idField] === undefined) {
                const tempId = `_temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                (rowWithId as any)[idField] = tempId;
            }

            const rowId = (rowWithId as any)[idField];
            if (rowId !== undefined) dirtyRowIds.current.add(rowId);

            const action: TableAction<TData> = {
                type: 'ADD_ROW',
                payload: { rowIndex: index, rowId, row: rowWithId },
                timestamp: Date.now()
            };

            const newData = [...prev.data];
            newData.splice(index, 0, rowWithId);

            return {
                data: newData,
                history: {
                    past: [...prev.history.past, action],
                    future: []
                }
            };
        });
    }, [idField]);

    const deleteRows = useCallback((rowIndices: number[]) => {
        setState(prev => {
            const sortedIndices = [...rowIndices].sort((a, b) => b - a);
            const newPast = [...prev.history.past];
            const newData = [...prev.data];

            sortedIndices.forEach(idx => {
                const row = prev.data[idx];
                if (!row) return;

                const rowId = (row as any)[idField];
                if (rowId !== undefined) dirtyRowIds.current.add(rowId);

                newPast.push({
                    type: 'DELETE_ROW',
                    payload: { rowIndex: idx, rowId, row },
                    timestamp: Date.now()
                });
                newData.splice(idx, 1);
            });

            return {
                data: newData,
                history: {
                    past: newPast,
                    future: []
                }
            };
        });
    }, [idField]);

    const undo = useCallback(() => {
        setState(prev => {
            if (prev.history.past.length === 0) return prev;

            const action = prev.history.past[prev.history.past.length - 1];
            const newPast = prev.history.past.slice(0, -1);
            const newData = [...prev.data];

            if (action.type === 'EDIT_CELL') {
                const { rowId, columnId, oldValue } = action.payload;
                const idx = newData.findIndex(r => (r as any)[idField] === rowId);
                if (idx !== -1 && columnId) {
                    newData[idx] = { ...newData[idx], [columnId]: oldValue };
                }
            } else if (action.type === 'ADD_ROW') {
                const { rowId } = action.payload;
                const idx = newData.findIndex(r => (r as any)[idField] === rowId);
                if (idx !== -1) newData.splice(idx, 1);
            } else if (action.type === 'DELETE_ROW') {
                const { rowIndex, row } = action.payload;
                if (row && rowIndex !== undefined) {
                    newData.splice(rowIndex, 0, row);
                }
            }

            return {
                data: newData,
                history: {
                    past: newPast,
                    future: [action, ...prev.history.future]
                }
            };
        });
    }, [idField]);

    const redo = useCallback(() => {
        setState(prev => {
            if (prev.history.future.length === 0) return prev;

            const action = prev.history.future[0];
            const newFuture = prev.history.future.slice(1);
            const newData = [...prev.data];

            if (action.type === 'EDIT_CELL') {
                const { rowId, columnId, newValue } = action.payload;
                const idx = newData.findIndex(r => (r as any)[idField] === rowId);
                if (idx !== -1 && columnId) {
                    newData[idx] = { ...newData[idx], [columnId]: newValue };
                }
            } else if (action.type === 'ADD_ROW') {
                const { rowIndex, row } = action.payload;
                if (row && rowIndex !== undefined) {
                    newData.splice(rowIndex, 0, row);
                }
            } else if (action.type === 'DELETE_ROW') {
                const { rowId } = action.payload;
                const idx = newData.findIndex(r => (r as any)[idField] === rowId);
                if (idx !== -1) newData.splice(idx, 1);
            }

            return {
                data: newData,
                history: {
                    past: [...prev.history.past, action],
                    future: newFuture
                }
            };
        });
    }, [idField]);

    const { data } = state;
    const canUndo = state.history.past.length > 0;
    const canRedo = state.history.future.length > 0;

    // Optimized change counting using dirtyRowIds
    const changes = useMemo(() => {
        // Quick exit if data hasn't changed from initial setup
        if (data === initialData) {
            return { added: 0, edited: 0, deleted: 0 };
        }

        const currentDataMap = new Map<string | number, TData>();
        data.forEach(row => {
            const id = (row as any)[idField];
            if (id !== undefined) currentDataMap.set(id, row);
        });

        let added = 0;
        let edited = 0;
        let deleted = 0;

        // Count added and edited
        data.forEach(row => {
            const id = (row as any)[idField];
            if (id === undefined || !initialDataMap.has(id)) {
                added++;
            } else {
                const original = initialDataMap.get(id);
                // If same reference, definitely not edited
                if (row === original) return;

                // Robust equality check for editing
                const isEdited = Object.keys(row).some(key => {
                    // Skip internal keys often added by frameworks/hooks
                    if (key.startsWith('_')) return false;
                    return (row as any)[key] !== (original as any)[key];
                });
                if (isEdited) edited++;
            }
        });

        // Count deleted
        initialDataMap.forEach((_val, id) => {
            if (!currentDataMap.has(id)) {
                deleted++;
            }
        });

        return { added, edited, deleted };
    }, [data, initialData, initialDataMap, idField]);

    const batchChanges = useMemo(() => {
        // Quick exit if data hasn't changed from initial setup
        if (data === initialData) {
            return { addedRecords: [], changedRecords: [], deletedRecords: [] };
        }

        const currentDataMap = new Map<string | number, TData>();
        data.forEach(row => {
            const id = (row as any)[idField];
            if (id !== undefined) currentDataMap.set(id, row);
        });

        const addedRecords: TData[] = [];
        const changedRecords: TData[] = [];
        const deletedRecords: TData[] = [];

        data.forEach(row => {
            const id = (row as any)[idField];
            if (id === undefined || !initialDataMap.has(id)) {
                addedRecords.push(row);
            } else {
                const original = initialDataMap.get(id);
                if (row === original) return;

                const isEdited = Object.keys(row).some(key => {
                    if (key.startsWith('_')) return false;
                    return (row as any)[key] !== (original as any)[key];
                });
                if (isEdited) changedRecords.push(row);
            }
        });

        initialDataMap.forEach((val, id) => {
            if (!currentDataMap.has(id)) {
                deletedRecords.push(val);
            }
        });

        return { addedRecords, changedRecords, deletedRecords };
    }, [data, initialData, initialDataMap, idField]);

    const resetData = useCallback(() => {
        dirtyRowIds.current.clear();
        setState({ data: initialData, history: { past: [], future: [] } });
    }, [initialData]);

    return {
        /** Current table data including uncommitted changes. @group State */
        data,
        /** Programmatically set the table data. @group Methods */
        setData,
        /** Perform a cell edit at a specific coordinate. @group Methods */
        performEdit,
        /** Add a new row to the data. @group Methods */
        addRow,
        /** Delete one or more rows by index. @group Methods */
        deleteRows,
        /** Undo the last recorded action. @group Methods */
        undo,
        /** Redo the last undone action. @group Methods */
        redo,
        /** Whether undo is currently available. @group State */
        canUndo,
        /** Whether redo is currently available. @group State */
        canRedo,
        /** Dictionary of change counts (added, edited, deleted) relative to initialData. @group State */
        changes,
        /** Detailed lists of added, changed, and deleted records. @group State */
        batchChanges,
        /** Reset all changes back to the initial state. @group Methods */
        resetData
    };
};
