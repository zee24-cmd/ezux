'use client';

import { useMemo, useState } from 'react';
import type {
    EzKanbanProps,
    EzKanbanRef,
    KanbanCard
} from './EzKanban.types';
import { useKanbanState } from './hooks/useKanbanState';
import { useKanbanCards } from './hooks/useKanbanCards';
import { useKanbanColumns } from './hooks/useKanbanColumns';
import { useKanbanSwimlanes } from './hooks/useKanbanSwimlanes';
import { useKanbanFilters } from './hooks/useKanbanFilters';
import { useKanbanDragDrop } from './hooks/useKanbanDragDrop';
import { useKeyboardNavigation } from '../../shared/hooks';
import { useServiceState } from '../../shared/hooks/useServiceState';
import { I18nState } from '../../shared/services/I18nService';

/**
 * The main orchestrator hook for EzKanban.
 * 
 * This hook coordinates specialized sub-hooks for board state, card management,
 * column management, swimlanes, filtering, and drag-and-drop.
 * 
 * @param props Props for the EzKanban component.
 * @param extraApi Optional API methods to merge into the returned object.
 * @group Hooks
 */
export const useEzKanban = <TCard = KanbanCard>(
    props: EzKanbanProps,
    extraApi: Record<string, unknown> = {}
) => {
    // Reactively track direction
    const i18nState = useServiceState<I18nState>('I18nService');
    const globalDir = i18nState?.dir || 'ltr';
    const effectiveDir = (props.dir === 'auto' || !props.dir) ? globalDir : props.dir;

    // Base API placeholder (removed useBaseComponent dependency)
    const baseApi = {
        showSpinner: () => { },
        hideSpinner: () => { },
    };
    const serviceRegistry = null;

    // 2. Board State
    const {
        board,
        setBoard,
        selectedCards,
        setSelectedCards,
        selectedColumnId,
        setSelectedColumnId,
        view,
        setView,
        undo,
        redo,
        canUndo,
        canRedo,
    } = useKanbanState(props);

    // Enterprise State
    const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);

    // 3. Card Management
    const {
        createCard,
        updateCard,
        deleteCard,
        moveCard,
        duplicateCard,
        archiveCard,
        restoreCard,
    } = useKanbanCards(props, board);

    // 4. Column Management
    const {
        createColumn,
        updateColumn,
        deleteColumn,
        reorderColumns,
        collapseColumn,
        expandColumn,
    } = useKanbanColumns(props, board);

    // 5. Swimlane Management
    const {
        createSwimlane,
        updateSwimlane,
        deleteSwimlane,
        reorderSwimlanes,
        collapseSwimlane,
        expandSwimlane,
    } = useKanbanSwimlanes(props, board);

    // 5. Drag & Drop
    const {
        draggedCard,
        dragOverColumn,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleDrop,
    } = useKanbanDragDrop(board, moveCard, props.wipStrict, props);

    // 6. Filtering & Search
    const {
        filteredCards,
        searchQuery,
        setSearchQuery,
        activeFilters,
        setActiveFilters,
        clearFilters,
    } = useKanbanFilters(board);

    // 6.5. Keyboard Navigation
    const { selectedIndex, setSelectedIndex } = useKeyboardNavigation({
        totalItems: filteredCards.length,
        columns: 1, // Simplified for now, though Kanban is a grid-ish
        enabled: !props.readOnly,
        onSelect: (index: number) => {
            const card = filteredCards[index];
            if (card) {
                setHighlightedCardId(card.id);
                // Optionally scroll into view
                const element = document.getElementById(card.id) || document.querySelector(`[data-card-id="${card.id}"]`);
                element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        },
        onAction: (index: number) => {
            const card = filteredCards[index];
            if (card && (extraApi as any).onCardClick) {
                (extraApi as any).onCardClick(card);
            }
        }
    });

    // 7. Imperative API
    const imperativeAPI = useMemo<EzKanbanRef<TCard>>(() => ({
        // Card operations
        addCard: createCard as unknown as (draft: Partial<TCard>) => Promise<TCard>,
        updateCard: updateCard as unknown as (cardId: string, updates: Partial<TCard>) => Promise<unknown>,
        deleteCard,
        moveCard,
        duplicateCard: duplicateCard as unknown as (cardId: string) => Promise<TCard>,
        archiveCard,
        restoreCard,
        getCard: (cardId: string) => board.cards.find(c => c.id === cardId) as unknown as TCard | undefined,
        getCards: () => board.cards as unknown as TCard[],
        getCardsInColumn: (columnId: string) => board.cards.filter(c => c.columnId === columnId) as unknown as TCard[],
        getOrderedCards: (columnId: string) => (board.cards.filter((c: KanbanCard) => c.columnId === columnId)
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) as unknown as TCard[]),

        // Column operations
        addColumn: createColumn,
        updateColumn,
        deleteColumn,
        reorderColumns,
        collapseColumn,
        expandColumn,
        getColumn: (columnId: string) => board.columns.find(c => c.id === columnId),
        getColumns: () => board.columns,

        // Swimlane operations
        addSwimlane: createSwimlane,
        updateSwimlane,
        deleteSwimlane,
        reorderSwimlanes,
        collapseSwimlane,
        expandSwimlane,
        getSwimlane: (swimlaneId: string) => board.swimlanes?.find(s => s.id === swimlaneId),
        getSwimlanes: () => board.swimlanes || [],

        // Selection operations
        selectCard: (cardId: string) => setSelectedCards([cardId]),
        selectCards: setSelectedCards,
        deselectCard: (cardId: string) => {
            const filtered = selectedCards.filter((id: string) => id !== cardId);
            setSelectedCards(filtered);
        },
        deselectAllCards: () => setSelectedCards([]),
        getSelectedCards: () => board.cards.filter((c: KanbanCard) => selectedCards.includes(c.id)) as unknown as TCard[],

        // UI Operations (Enterprise)
        focusCard: (cardId: string) => {
            // Try standard ID or data-attribute
            const element = document.getElementById(cardId) || document.querySelector(`[data-card-id="${cardId}"]`);
            if (element instanceof HTMLElement) {
                element.focus();
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },
        highlightCard: (cardId: string, duration = 2000) => {
            setHighlightedCardId(cardId);
            setTimeout(() => setHighlightedCardId(null), duration);
        },

        // View operations
        setView,
        getView: () => view,
        scrollToColumn: (columnId: string, options?: ScrollIntoViewOptions) => {
            const element = document.getElementById(`column-${columnId}`) || document.querySelector(`[data-column-id="${columnId}"]`);
            element?.scrollIntoView(options || { behavior: 'smooth', block: 'center', inline: 'center' });
        },
        scrollToCard: (cardId: string, options?: ScrollIntoViewOptions) => {
            const element = document.getElementById(cardId) || document.querySelector(`[data-card-id="${cardId}"]`);
            element?.scrollIntoView(options || { behavior: 'smooth', block: 'center' });
        },

        // Filter & search operations
        setSearchQuery,
        getSearchQuery: () => searchQuery,
        setActiveFilters,
        getActiveFilters: () => activeFilters,
        clearFilters,
        getFilteredCards: () => filteredCards as unknown as TCard[],

        // Board operations
        getBoard: () => board,
        setBoard,
        refresh: async () => { },
        reset: () => setBoard(props.board),

        // Utility methods
        showSpinner: baseApi.showSpinner,
        hideSpinner: baseApi.hideSpinner,
        forceUpdate: () => { },
        getStatistics: () => ({ totalCards: board.cards.length, totalColumns: board.columns.length }),
        validate: () => ({ isValid: true, errors: [] }),

        ...extraApi,
    }), [
        board, createCard, updateCard, deleteCard, moveCard, duplicateCard, archiveCard, restoreCard,
        createColumn, updateColumn, deleteColumn, reorderColumns, collapseColumn, expandColumn,
        createSwimlane, updateSwimlane, deleteSwimlane, reorderSwimlanes, collapseSwimlane, expandSwimlane,
        selectedCards, setSelectedCards, selectedColumnId, setSelectedColumnId,
        searchQuery, setSearchQuery, activeFilters, setActiveFilters, clearFilters, filteredCards,
        setBoard, props.board,
        baseApi, extraApi, view, props.wipStrict, props
    ]);

    return useMemo(() => ({
        // Base API / State
        /** The imperative API object. @group Methods */
        ...imperativeAPI,

        // Board State
        /** Current board data. @group State */
        board,
        /** Handler to update the board. @group Methods */
        setBoard,
        /** IDs of currently selected cards. @group State */
        selectedCards,
        /** Handler to set selected cards. @group Methods */
        setSelectedCards,
        /** ID of the currently highlighted card. @group State */
        highlightedCardId,
        /** ID of the currently selected column. @group State */
        selectedColumnId,
        /** Handler to set the selected column. @group Methods */
        setSelectedColumnId,
        /** Current view mode (standard, swimlane, timeline). @group State */
        view,
        /** Handler to change the view mode. @group Methods */
        setView,
        /** Text direction. @group State */
        dir: effectiveDir,

        // Card Management
        /** Create a new card. @group Methods */
        createCard,
        /** Update a card by ID. @group Methods */
        updateCard,
        /** Delete a card by ID. @group Methods */
        deleteCard,
        /** Move a card within the board. @group Methods */
        moveCard,
        /** Duplicate a card. @group Methods */
        duplicateCard,
        /** Archive a card. @group Methods */
        archiveCard,
        /** Restore an archived card. @group Methods */
        restoreCard,

        // Column Management
        /** Create a new column. @group Methods */
        createColumn,
        /** Update a column. @group Methods */
        updateColumn,
        /** Delete a column. @group Methods */
        deleteColumn,
        /** Reorder columns. @group Methods */
        reorderColumns,
        /** Collapse a column. @group Methods */
        collapseColumn,
        /** Expand a column. @group Methods */
        expandColumn,

        // Swimlane Management
        /** Create a new swimlane. @group Methods */
        createSwimlane,
        /** Update a swimlane. @group Methods */
        updateSwimlane,
        /** Delete a swimlane. @group Methods */
        deleteSwimlane,
        /** Reorder swimlanes. @group Methods */
        reorderSwimlanes,
        /** Collapse a swimlane. @group Methods */
        collapseSwimlane,
        /** Expand a swimlane. @group Methods */
        expandSwimlane,

        // Drag & Drop
        /** The card currently being dragged. @group State */
        draggedCard,
        /** The column currently being dragged over. @group State */
        dragOverColumn,
        /** Handler for drag start. @group Events */
        handleDragStart,
        /** Handler for drag over. @group Events */
        handleDragOver,
        /** Handler for drag end. @group Events */
        handleDragEnd,
        /** Handler for drop. @group Events */
        handleDrop,

        // Filtering & Search
        /** List of cards after filtering/search. @group State */
        filteredCards,
        /** Current search query string. @group State */
        searchQuery,
        /** Handler to update the search query. @group Methods */
        setSearchQuery,
        /** Current active filter configuration. @group State */
        activeFilters,
        /** Handler to update active filters. @group Methods */
        setActiveFilters,
        /** Clear all active filters. @group Methods */
        clearFilters,

        // Service Registry
        /** Access to the shared service registry. @group Services */
        serviceRegistry,

        // Keyboard Nav
        /** Currently selected card index via keyboard. @group State */
        selectedIndex,
        /** Handler to set the keyboard selected index. @group Methods */
        setSelectedIndex,

        // History
        /** Undo the last action. @group Methods */
        undo,
        /** Redo the previously undone action. @group Methods */
        redo,
        /** Whether undo is available. @group State */
        canUndo,
        /** Whether redo is available. @group State */
        canRedo,
    }), [
        baseApi, imperativeAPI, board, setBoard, selectedCards, setSelectedCards,
        highlightedCardId, selectedColumnId, setSelectedColumnId, view, setView, effectiveDir,
        createCard, updateCard, deleteCard, moveCard, duplicateCard, archiveCard, restoreCard,
        createColumn, updateColumn, deleteColumn, reorderColumns, collapseColumn, expandColumn,
        createSwimlane, updateSwimlane, deleteSwimlane, reorderSwimlanes, collapseSwimlane, expandSwimlane,
        draggedCard, dragOverColumn, handleDragStart, handleDragOver, handleDragEnd, handleDrop,
        filteredCards, searchQuery, setSearchQuery, activeFilters, setActiveFilters, clearFilters,
        serviceRegistry, selectedIndex, setSelectedIndex, undo, redo, canUndo, canRedo
    ]);
};
