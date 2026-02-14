'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EzErrorBoundary } from '../shared/components/EzErrorBoundary';
import { EzKanbanErrorFallback } from './components/EzKanbanErrorFallback';
import { NotificationPanel } from '../../shared/components/NotificationPanel';
import type { EzKanbanProps, EzKanbanRef } from './EzKanban.types';
import { useEzKanban } from './useEzKanban';
import { useInitCoreServices } from '../../shared/hooks';
import { KanbanBoardComponent } from './components/KanbanBoard';
export * from './components/KanbanSwimlane';
export * from './views/KanbanTimelineView';
import { KanbanToolbar } from './components/KanbanToolbar';
import { CardEditorModal } from './components/CardEditorModal';
import { DeleteConfirmationModal } from '../../shared/components/DeleteConfirmationModal';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import type { KanbanCard } from './EzKanban.types';

const queryClient = new QueryClient();

/**
 * EzKanban is a powerful, flexible board management system designed for 
 * agile workflows and task visualization. It features a robust drag-and-drop 
 * engine and supports multiple viewing modes.
 * 

 * ### Key Features
 * - **Modular Architecture**: Built on `@dnd-kit` for performant and accessible drag-and-drop.
 * - **Multi-View Engine**: Switch between `standard` (basic columns), `swimlane` (grouped by team/priority), and `timeline` views.
 * - **Dynamic Columns**: Support for collapsible columns, WIP limits, and custom header rendering.
 * - **Enterprise Editing**: Integrated card editor modal with support for custom field extensions.
 * - **Change Tracking**: Built-in undo/redo stack for all board operations.
 * - **Extensibility**: Inversion of Control (IoC) via custom renderers for cards, headers, and editors.
 * 
 * ### Minimal Example
 * ```tsx
 * import { EzKanban } from 'ezux';
 * 
 * function TaskBoard() {
 *   return (
 *     <EzKanban
 *       board={initialBoardData}
 *       onBoardChange={(newBoard) => saveBoard(newBoard)}
 *     />
 *   );
 * }
 * ```
 * 
 * ### Advanced Config: Swimlanes & Timeline
 * ```tsx
 * <EzKanban
 *   board={engineeringBoard}
 *   view="swimlane"
 *   swimlaneSettings={{ collapsible: true }}
 *   onCardDoubleClick={(card) => openDetails(card)}
 * />
 * ```
 * 
 * @group Core Components
 */
export const EzKanban = forwardRef<EzKanbanRef, EzKanbanProps>((props, ref) => {
    const { className, readOnly, ...restProps } = props;

    // Initialize core services (I18n, Notifications, etc.)
    useInitCoreServices();

    return (
        <QueryClientProvider client={queryClient}>
            <EzErrorBoundary fallback={<EzKanbanErrorFallback />}>
                <EzKanbanInner ref={ref} className={className} readOnly={readOnly} {...restProps} />
            </EzErrorBoundary>
        </QueryClientProvider>
    );
});

EzKanban.displayName = 'EzKanban';

const EzKanbanInner = forwardRef<EzKanbanRef, EzKanbanProps>((props, ref) => {
    const { className, readOnly, onCardClick, onCardDoubleClick } = props;

    // Initialize the main hook
    const kanban = useEzKanban(props, ref);

    // Modal State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<Partial<KanbanCard> | undefined>(undefined);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [cardToDeleteId, setCardToDeleteId] = useState<string | null>(null);

    // Expose imperative API
    useImperativeHandle(ref, () => ({
        addCard: kanban.createCard,
        updateCard: kanban.updateCard,
        deleteCard: kanban.deleteCard,
        moveCard: kanban.moveCard,
        duplicateCard: kanban.duplicateCard,
        archiveCard: kanban.archiveCard,
        restoreCard: kanban.restoreCard,
        getCard: kanban.getCard,
        getCards: kanban.getCards,
        getCardsInColumn: kanban.getCardsInColumn,

        addColumn: kanban.createColumn,
        updateColumn: kanban.updateColumn,
        deleteColumn: kanban.deleteColumn,
        reorderColumns: kanban.reorderColumns,
        collapseColumn: kanban.collapseColumn,
        expandColumn: kanban.expandColumn,
        getColumn: kanban.getColumn,
        getColumns: kanban.getColumns,

        addSwimlane: kanban.createSwimlane,
        updateSwimlane: kanban.updateSwimlane,
        deleteSwimlane: kanban.deleteSwimlane,
        reorderSwimlanes: kanban.reorderSwimlanes,
        collapseSwimlane: kanban.collapseSwimlane,
        expandSwimlane: kanban.expandSwimlane,
        getSwimlane: kanban.getSwimlane,
        getSwimlanes: kanban.getSwimlanes,

        selectCard: kanban.selectCard,
        selectCards: kanban.selectCards,
        deselectCard: kanban.deselectCard,
        deselectAllCards: kanban.deselectAllCards,
        getSelectedCards: kanban.getSelectedCards,

        setView: kanban.setView,
        getView: kanban.getView,
        scrollToColumn: kanban.scrollToColumn,
        scrollToCard: kanban.scrollToCard,

        setSearchQuery: kanban.setSearchQuery,
        getSearchQuery: kanban.getSearchQuery,
        setActiveFilters: kanban.setActiveFilters,
        getActiveFilters: kanban.getActiveFilters,
        clearFilters: kanban.clearFilters,
        getFilteredCards: kanban.getFilteredCards,

        getBoard: kanban.getBoard,
        setBoard: kanban.setBoard,
        refresh: kanban.refresh,
        reset: kanban.reset,

        showSpinner: kanban.showSpinner,
        hideSpinner: kanban.hideSpinner,
        forceUpdate: kanban.forceUpdate,
        getStatistics: kanban.getStatistics,
        validate: kanban.validate,

        // Enterprise Methods
        getOrderedCards: kanban.getOrderedCards,
        focusCard: kanban.focusCard,
        highlightCard: kanban.highlightCard,
    }), [kanban]);

    // Handle add card
    const handleAddCard = (columnId?: string) => {
        const targetColumnId = columnId || kanban.selectedColumnId || kanban.board.columns[0]?.id;

        setEditingCard({
            columnId: targetColumnId,
            title: '',
            description: '',
            priority: 'medium',
        });
        setIsEditorOpen(true);
    };

    // Handle card save
    const handleSaveCard = async (cardData: Partial<KanbanCard>) => {
        if (cardData.id) {
            await kanban.updateCard(cardData.id, cardData);
        } else {
            await kanban.createCard(cardData);
        }
        setIsEditorOpen(false);
    };

    // Handle delete request
    const handleDeleteRequest = (cardId: string) => {
        if (props.confirmOnDelete !== false) { // Default to true
            setCardToDeleteId(cardId);
            setIsDeleteConfirmOpen(true);
            setIsEditorOpen(false); // Close editor if open
        } else {
            kanban.deleteCard(cardId);
            setIsEditorOpen(false);
        }
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (cardToDeleteId) {
            await kanban.deleteCard(cardToDeleteId);
            setIsDeleteConfirmOpen(false);
            setCardToDeleteId(null);
        }
    };

    // Handle card click (Edit)
    const handleCardClick = (card: KanbanCard) => {
        if (!readOnly) {
            setEditingCard(card);
            setIsEditorOpen(true);
        }
        onCardClick?.(card);
    };

    // Handle column collapse/expand
    const handleToggleColumnCollapse = (columnId: string) => {
        const column = kanban.board.columns.find(c => c.id === columnId);
        if (!column) return;

        if (column.isCollapsed) {
            kanban.expandColumn(columnId);
        } else {
            kanban.collapseColumn(columnId);
        }
    };

    // Handle swimlane collapse/expand
    const handleToggleSwimlaneCollapse = (swimlaneId: string) => {
        const swimlane = kanban.board.swimlanes?.find(s => s.id === swimlaneId);
        if (!swimlane) return;

        if (swimlane.isCollapsed) {
            kanban.expandSwimlane(swimlaneId);
        } else {
            kanban.collapseSwimlane(swimlaneId);
        }
    };

    return (
        <div className={cn('flex flex-col h-full bg-background', className)} dir={kanban.dir}>
            <NotificationPanel />
            {/* Toolbar */}
            {!readOnly && (
                <KanbanToolbar
                    searchQuery={kanban.searchQuery}
                    onSearchChange={kanban.setSearchQuery}
                    onAddCardClick={() => handleAddCard()}
                    onAddColumn={() => {
                        kanban.createColumn({
                            name: 'New Column',
                            position: kanban.board.columns.length,
                        }).then((newCol) => {
                            kanban.setSelectedColumnId(newCol.id);
                        });
                    }}
                    activeFilters={kanban.activeFilters}
                    onFiltersChange={kanban.setActiveFilters}
                    view={kanban.view}
                    onViewChange={kanban.setView}
                    onUndo={kanban.undo}
                    onRedo={kanban.redo}
                    canUndo={kanban.canUndo}
                    canRedo={kanban.canRedo}
                />
            )}

            {/* Board */}
            <div className="flex-1 overflow-hidden h-full">
                <KanbanBoardComponent
                    board={kanban.board}
                    onCardClick={handleCardClick}
                    onCardDoubleClick={onCardDoubleClick}
                    onCardDragStart={kanban.handleDragStart}
                    onCardDragEnd={kanban.handleDragEnd}
                    onCardDrop={kanban.handleDrop}
                    onAddCard={handleAddCard}
                    onToggleColumnCollapse={handleToggleColumnCollapse}
                    onToggleSwimlaneCollapse={handleToggleSwimlaneCollapse}
                    onDeleteColumn={kanban.deleteColumn}
                    onUpdateColumn={kanban.updateColumn}
                    onColumnClick={kanban.setSelectedColumnId}
                    onCreateCard={handleSaveCard}
                    selectedColumnId={kanban.selectedColumnId}
                    draggedCardId={kanban.draggedCard?.id}
                    filteredCards={kanban.filteredCards}
                    customRenderers={props.customRenderers}
                    view={kanban.view}
                    dir={kanban.dir}
                    className="flex-1 h-full"
                />
            </div>

            {/* Editor Modal */}
            {props.customRenderers?.cardEditor ? (
                props.customRenderers.cardEditor({
                    isOpen: isEditorOpen,
                    card: editingCard,
                    onClose: () => setIsEditorOpen(false),
                    onSave: handleSaveCard,
                    onDelete: handleDeleteRequest,
                    columns: kanban.board.columns,
                })
            ) : (
                <CardEditorModal
                    isOpen={isEditorOpen}
                    onClose={() => setIsEditorOpen(false)}
                    onSave={handleSaveCard}
                    onDelete={handleDeleteRequest}
                    card={editingCard}
                    columns={kanban.board.columns}
                />
            )}

            {/* Delete Confirmation Modal */}
            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this card?"
                description="This action cannot be undone."
            />
        </div>
    );
});

EzKanbanInner.displayName = 'EzKanbanInner';

export default EzKanban;
