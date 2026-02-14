import { useState, useCallback } from 'react';

interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}

/**
 * Hook for managing Undo/Redo state history
 */
export const useHistory = <T>(initialPresent: T, limit: number = 50) => {
    const [state, setState] = useState<HistoryState<T>>({
        past: [],
        present: initialPresent,
        future: []
    });

    const canUndo = state.past.length > 0;
    const canRedo = state.future.length > 0;

    const undo = useCallback(() => {
        if (!canUndo) return;

        setState(curr => {
            const previous = curr.past[curr.past.length - 1];
            const newPast = curr.past.slice(0, curr.past.length - 1);

            return {
                past: newPast,
                present: previous,
                future: [curr.present, ...curr.future]
            };
        });
    }, [canUndo]);

    const redo = useCallback(() => {
        if (!canRedo) return;

        setState(curr => {
            const next = curr.future[0];
            const newFuture = curr.future.slice(1);

            return {
                past: [...curr.past, curr.present],
                present: next,
                future: newFuture
            };
        });
    }, [canRedo]);

    const pushState = useCallback((newPresent: T) => {
        setState(curr => {
            // Prevent pushing identical state if it's just a duplicate render
            if (curr.present === newPresent) return curr;

            const newPast = [...curr.past, curr.present];
            if (newPast.length > limit) {
                newPast.shift(); // Remove oldest
            }

            return {
                past: newPast,
                present: newPresent,
                future: [] // Clear future on new branch
            };
        });
    }, [limit]);

    const clear = useCallback((newInitialState?: T) => {
        setState({
            past: [],
            present: newInitialState !== undefined ? newInitialState : state.present,
            future: []
        });
    }, [state.present]);

    return {
        state: state.present,
        undo,
        redo,
        pushState,
        clear,
        canUndo,
        canRedo,
        historyCount: state.past.length
    };
};
