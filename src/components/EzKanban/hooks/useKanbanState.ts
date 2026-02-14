import { useMemo, useEffect, useRef } from 'react';
import { useStore } from '@tanstack/react-store';
import type { EzKanbanProps } from '../EzKanban.types';
import { createKanbanStore, createKanbanActions } from '../state/kanban.store';

/**
 * Hook for managing Kanban board state using a centralized store.
 * 
 * Handles board data, selection, view modes, and history (undo/redo).
 * 
 * @param props Props for the EzKanban component.
 * @group Hooks
 */
export const useKanbanState = (props: EzKanbanProps) => {
    // Create store instance (memoized per board ID)
    const store = useMemo(() => createKanbanStore(props.board, props.view), [props.board.id, props.view]);
    const actions = useMemo(() => createKanbanActions(store), [store]);

    // Subscribe to store state
    const board = useStore(store, (state) => state.board);
    const selectedCards = useStore(store, (state) => state.selectedCards);
    const selectedColumnId = useStore(store, (state) => state.selectedColumnId);
    const view = useStore(store, (state) => state.view);
    const searchQuery = useStore(store, (state) => state.searchQuery);
    const activeFilters = useStore(store, (state) => state.activeFilters);

    // Sync external board changes to store
    const lastBoardStr = useRef(JSON.stringify(props.board));
    const lastView = useRef(props.view);

    useEffect(() => {
        const currentBoardStr = JSON.stringify(props.board);

        if (currentBoardStr !== lastBoardStr.current) {
            lastBoardStr.current = currentBoardStr;
            actions.setBoard(props.board);
        }

        if (props.view && props.view !== lastView.current) {
            lastView.current = props.view;
            actions.setView(props.view);
        }
    }, [props.board, props.view, actions]);

    return {
        // State
        /** The current board data. @group State */
        board,
        /** Currently selected card IDs. @group State */
        selectedCards,
        /** ID of the currently selected column. @group State */
        selectedColumnId,
        /** Current view mode. @group State */
        view,
        /** Current search query. @group State */
        searchQuery,
        /** Currently active filters. @group State */
        activeFilters,

        // Actions
        /** Replace the board data. @group Methods */
        setBoard: actions.setBoard,
        /** Set selected card IDs. @group Methods */
        setSelectedCards: actions.setSelectedCards,
        /** Set the selected column ID. @group Methods */
        setSelectedColumnId: actions.setSelectedColumnId,
        /** Change the view mode. @group Methods */
        setView: actions.setView,
        /** Set the search query. @group Methods */
        setSearchQuery: actions.setSearchQuery,
        /** Set active filters. @group Methods */
        setActiveFilters: actions.setActiveFilters,

        // Card actions
        /** Add a card. @group Methods */
        addCard: actions.addCard,
        /** Update a card. @group Methods */
        updateCard: actions.updateCard,
        /** Delete a card. @group Methods */
        deleteCard: actions.deleteCard,
        /** Move a card. @group Methods */
        moveCard: actions.moveCard,

        // Column actions
        /** Add a column. @group Methods */
        addColumn: actions.addColumn,
        /** Update a column. @group Methods */
        updateColumn: actions.updateColumn,
        /** Delete a column. @group Methods */
        deleteColumn: actions.deleteColumn,

        // History actions
        /** Undo the last action. @group Methods */
        undo: actions.undo,
        /** Redo the previously undone action. @group Methods */
        redo: actions.redo,
        /** Whether undo is available. @group State */
        canUndo: actions.canUndo(),
        /** Whether redo is available. @group State */
        canRedo: actions.canRedo(),

        // Store instance (for advanced usage)
        /** The underlying store instance. @group Internal */
        store,
        /** The compiled actions for the store. @group Internal */
        actions,
    };
};
