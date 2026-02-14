import { useCallback, useRef } from 'react';

/**
 * Data change event callbacks shared across components.
 */
export interface DataChangeCallbacks<TData = any> {
    onDataChangeStart?: (args: { action: 'add' | 'edit' | 'delete'; data: TData | TData[] }) => void;
    onDataChangeComplete?: (args: { action: 'add' | 'edit' | 'delete'; data: TData | TData[] }) => void;
    onDataChangeCancel?: (args: { action: 'add' | 'edit' | 'delete'; row?: any }) => void;
    onDataChangeRequest?: (args: { action: 'add' | 'edit' | 'delete'; data: TData }) => void;
    onRowAddStart?: (args: { data: Partial<TData> }) => void;
    onRowEditStart?: (args: { row: any; data: TData }) => void;
}

/**
 * Shared hook for data change lifecycle events.
 * Used by EzTable, EzScheduler, EzTreeView to emit consistent data mutation events.
 * 
 * @example
 * const { emitDataChangeStart, emitDataChangeComplete, withDataChange } = useDataChangeEvents(props);
 * 
 * // Wrap a mutation
 * withDataChange('add', newRecord, () => {
 *   addRecordToState(newRecord);
 * });
 */
export const useDataChangeEvents = <TData = any>(callbacks: DataChangeCallbacks<TData>) => {
    const pendingActionRef = useRef<{ action: 'add' | 'edit' | 'delete'; data: TData | TData[] } | null>(null);

    const emitDataChangeStart = useCallback((action: 'add' | 'edit' | 'delete', data: TData | TData[]) => {
        pendingActionRef.current = { action, data };
        callbacks.onDataChangeStart?.({ action, data });
    }, [callbacks.onDataChangeStart]);

    const emitDataChangeComplete = useCallback((action: 'add' | 'edit' | 'delete', data: TData | TData[]) => {
        callbacks.onDataChangeComplete?.({ action, data });
        pendingActionRef.current = null;
    }, [callbacks.onDataChangeComplete]);

    const emitDataChangeCancel = useCallback((action: 'add' | 'edit' | 'delete', row?: any) => {
        callbacks.onDataChangeCancel?.({ action, row });
        pendingActionRef.current = null;
    }, [callbacks.onDataChangeCancel]);

    const emitDataChangeRequest = useCallback((action: 'add' | 'edit' | 'delete', data: TData) => {
        callbacks.onDataChangeRequest?.({ action, data });
    }, [callbacks.onDataChangeRequest]);

    const emitRowAddStart = useCallback((data: Partial<TData>) => {
        callbacks.onRowAddStart?.({ data });
    }, [callbacks.onRowAddStart]);

    const emitRowEditStart = useCallback((row: any, data: TData) => {
        callbacks.onRowEditStart?.({ row, data });
    }, [callbacks.onRowEditStart]);

    /**
     * Wraps a data mutation with start/complete event emissions.
     */
    const withDataChange = useCallback(<R,>(
        action: 'add' | 'edit' | 'delete',
        data: TData | TData[],
        mutation: () => R
    ): R => {
        emitDataChangeStart(action, data);
        try {
            const result = mutation();
            emitDataChangeComplete(action, data);
            return result;
        } catch (error) {
            emitDataChangeCancel(action);
            throw error;
        }
    }, [emitDataChangeStart, emitDataChangeComplete, emitDataChangeCancel]);

    return {
        emitDataChangeStart,
        emitDataChangeComplete,
        emitDataChangeCancel,
        emitDataChangeRequest,
        emitRowAddStart,
        emitRowEditStart,
        withDataChange,
        pendingAction: pendingActionRef.current
    };
};
