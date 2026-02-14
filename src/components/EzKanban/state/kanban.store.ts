import { Store } from '@tanstack/store';
import type { KanbanBoard, KanbanCard, KanbanColumn, FilterConfig } from '../EzKanban.types';

export interface KanbanState {
    board: KanbanBoard;
    selectedCards: string[];
    selectedColumnId: string | null;
    view: 'standard' | 'swimlane' | 'timeline';
    searchQuery: string;
    activeFilters: FilterConfig;
    history: KanbanBoard[];
    historyIndex: number;
}

export const createKanbanStore = (initialBoard: KanbanBoard, initialView: 'standard' | 'swimlane' | 'timeline' = 'standard') => {
    return new Store<KanbanState>({
        board: initialBoard,
        selectedCards: [],
        selectedColumnId: null,
        view: initialView,
        searchQuery: '',
        activeFilters: {},
        history: [initialBoard],
        historyIndex: 0,
    });
};

// Actions
export const createKanbanActions = (store: Store<KanbanState>) => ({
    // Board actions
    setBoard: (board: KanbanBoard) => {
        store.setState((state) => {
            const newHistory = [...state.history.slice(0, state.historyIndex + 1), board];
            return {
                ...state,
                board,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        });
    },

    // Card actions
    addCard: (card: KanbanCard) => {
        store.setState((state) => {
            const newBoard = {
                ...state.board,
                cards: [...state.board.cards, card],
            };
            const newHistory = [...state.history.slice(0, state.historyIndex + 1), newBoard];
            return {
                ...state,
                board: newBoard,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        });
    },

    updateCard: (cardId: string, updates: Partial<KanbanCard>) => {
        store.setState((state) => {
            const newBoard = {
                ...state.board,
                cards: state.board.cards.map((card) =>
                    card.id === cardId ? { ...card, ...updates } : card
                ),
            };
            const newHistory = [...state.history.slice(0, state.historyIndex + 1), newBoard];
            return {
                ...state,
                board: newBoard,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        });
    },

    deleteCard: (cardId: string) => {
        store.setState((state) => {
            const newBoard = {
                ...state.board,
                cards: state.board.cards.filter((card) => card.id !== cardId),
            };
            const newHistory = [...state.history.slice(0, state.historyIndex + 1), newBoard];
            return {
                ...state,
                board: newBoard,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        });
    },

    moveCard: (cardId: string, targetColumnId: string) => {
        store.setState((state) => {
            const newBoard = {
                ...state.board,
                cards: state.board.cards.map((card) =>
                    card.id === cardId ? { ...card, columnId: targetColumnId } : card
                ),
            };
            const newHistory = [...state.history.slice(0, state.historyIndex + 1), newBoard];
            return {
                ...state,
                board: newBoard,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        });
    },

    // Column actions
    addColumn: (column: KanbanColumn) => {
        store.setState((state) => {
            const newBoard = {
                ...state.board,
                columns: [...state.board.columns, column],
            };
            const newHistory = [...state.history.slice(0, state.historyIndex + 1), newBoard];
            return {
                ...state,
                board: newBoard,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        });
    },

    updateColumn: (columnId: string, updates: Partial<KanbanColumn>) => {
        store.setState((state) => {
            const newBoard = {
                ...state.board,
                columns: state.board.columns.map((col) =>
                    col.id === columnId ? { ...col, ...updates } : col
                ),
            };
            const newHistory = [...state.history.slice(0, state.historyIndex + 1), newBoard];
            return {
                ...state,
                board: newBoard,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        });
    },

    deleteColumn: (columnId: string) => {
        store.setState((state) => {
            const newBoard = {
                ...state.board,
                columns: state.board.columns.filter((col) => col.id !== columnId),
                cards: state.board.cards.filter((card) => card.columnId !== columnId),
            };
            const newHistory = [...state.history.slice(0, state.historyIndex + 1), newBoard];
            return {
                ...state,
                board: newBoard,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        });
    },

    // Selection actions
    setSelectedCards: (cardIds: string[]) => {
        store.setState((state) => ({ ...state, selectedCards: cardIds }));
    },

    setSelectedColumnId: (columnId: string | null) => {
        store.setState((state) => ({ ...state, selectedColumnId: columnId }));
    },

    // View action
    setView: (view: 'standard' | 'swimlane' | 'timeline') => {
        store.setState((state) => ({ ...state, view }));
    },

    // Search and filter actions
    setSearchQuery: (query: string) => {
        store.setState((state) => ({ ...state, searchQuery: query }));
    },

    setActiveFilters: (filters: FilterConfig) => {
        store.setState((state) => ({ ...state, activeFilters: filters }));
    },

    // History actions (undo/redo)
    undo: () => {
        store.setState((state) => {
            if (state.historyIndex > 0) {
                return {
                    ...state,
                    board: state.history[state.historyIndex - 1],
                    historyIndex: state.historyIndex - 1,
                };
            }
            return state;
        });
    },

    redo: () => {
        store.setState((state) => {
            if (state.historyIndex < state.history.length - 1) {
                return {
                    ...state,
                    board: state.history[state.historyIndex + 1],
                    historyIndex: state.historyIndex + 1,
                };
            }
            return state;
        });
    },

    // Utility
    canUndo: () => {
        return store.state.historyIndex > 0;
    },

    canRedo: () => {
        return store.state.historyIndex < store.state.history.length - 1;
    },
});

export type KanbanActions = ReturnType<typeof createKanbanActions>;
