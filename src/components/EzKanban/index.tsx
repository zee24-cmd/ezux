'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EzErrorBoundary } from '../shared/components/EzErrorBoundary';
import { EzKanbanErrorFallback } from './components/EzKanbanErrorFallback';
import { NotificationPanel } from '../../shared/components/NotificationPanel';
import type { EzKanbanProps, EzKanbanRef } from './EzKanban.types';
import { useEzKanban } from './useEzKanban';
import { useInitCoreServices } from '../../shared/hooks';
import { KanbanToolbar } from './components/KanbanToolbar';
import { CardEditorModal } from './components/CardEditorModal';
import { KanbanBoardComponent as KanbanBoardBoard } from './components/KanbanBoard';
import { KanbanColumn } from './components/KanbanColumn';
import { KanbanCard as KanbanCardComponent } from './components/KanbanCard';
import { KanbanSwimlane } from './components/KanbanSwimlane';
import { KanbanTimelineView } from './views/KanbanTimelineView';

// Export sub-components for modular use
export { KanbanToolbar, CardEditorModal, KanbanColumn, KanbanCardComponent as KanbanCard, KanbanSwimlane, KanbanTimelineView };
export { KanbanBoardBoard as KanbanBoard };
import { DeleteConfirmationModal } from '../../shared/components/DeleteConfirmationModal';
import { cn } from '../../lib/utils';
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

const EzKanbanInner = forwardRef<EzKanbanRef<KanbanCard>, EzKanbanProps>((props, ref) => {
    const { className, readOnly, onCardClick, onCardDoubleClick } = props;

    // Initialize the main hook
    const kanban = useEzKanban<KanbanCard>(props, ref as any);

    const { state, actions, dir, imperativeAPI } = kanban;

    // Modal State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<Partial<KanbanCard> | undefined>(undefined);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [cardToDeleteId, setCardToDeleteId] = useState<string | null>(null);

    // Expose imperative API
    useImperativeHandle(ref, () => imperativeAPI, [imperativeAPI]);

    // Handle add card
    const handleAddCard = (columnId?: string) => {
        const targetColumnId = columnId || state.selectedColumnId || state.board.columns[0]?.id;

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
            await actions.updateCard(cardData.id, cardData);
        } else {
            await actions.createCard(cardData);
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
            actions.deleteCard(cardId);
            setIsEditorOpen(false);
        }
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (cardToDeleteId) {
            await actions.deleteCard(cardToDeleteId);
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
        const column = state.board.columns.find(c => c.id === columnId);
        if (!column) return;

        if (column.isCollapsed) {
            actions.expandColumn(columnId);
        } else {
            actions.collapseColumn(columnId);
        }
    };

    // Handle swimlane collapse/expand
    const handleToggleSwimlaneCollapse = (swimlaneId: string) => {
        const swimlane = state.board.swimlanes?.find(s => s.id === swimlaneId);
        if (!swimlane) return;

        if (swimlane.isCollapsed) {
            actions.expandSwimlane(swimlaneId);
        } else {
            actions.collapseSwimlane(swimlaneId);
        }
    };

    return (
        <div className={cn('flex flex-col h-full bg-background', className)} dir={dir}>
            <NotificationPanel />
            <NotificationPanel />
            {/* Toolbar */}
            {!readOnly && (
                props.slots?.toolbar ? (
                    <props.slots.toolbar
                        {...({
                            searchQuery: state.searchQuery,
                            onSearchChange: actions.setSearchQuery,
                            onAddCardClick: () => handleAddCard(),
                            onAddColumn: () => {
                                actions.createColumn({
                                    name: 'New Column',
                                    position: state.board.columns.length,
                                }).then((newCol) => {
                                    actions.setSelectedColumnId(newCol.id);
                                });
                            },
                            activeFilters: state.activeFilters,
                            onFiltersChange: actions.setActiveFilters,
                            view: state.view,
                            onViewChange: actions.setView,
                            onUndo: actions.undo,
                            onRedo: actions.redo,
                            canUndo: state.canUndo,
                            canRedo: state.canRedo,
                            ...(props.slotProps?.toolbar || {})
                        } as any)}
                    />
                ) : (
                    <KanbanToolbar
                        searchQuery={state.searchQuery}
                        onSearchChange={actions.setSearchQuery}
                        onAddCardClick={() => handleAddCard()}
                        onAddColumn={() => {
                            actions.createColumn({
                                name: 'New Column',
                                position: state.board.columns.length,
                            }).then((newCol) => {
                                actions.setSelectedColumnId(newCol.id);
                            });
                        }}
                        activeFilters={state.activeFilters}
                        onFiltersChange={actions.setActiveFilters}
                        view={state.view}
                        onViewChange={actions.setView}
                        onUndo={actions.undo}
                        onRedo={actions.redo}
                        canUndo={state.canUndo}
                        canRedo={state.canRedo}
                    />
                )
            )}

            {/* Board */}
            <div className="flex-1 overflow-hidden h-full">
                {props.slots?.board ? (
                    <props.slots.board
                        {...({
                            board: state.board,
                            onCardClick: handleCardClick,
                            onCardDoubleClick: onCardDoubleClick,
                            onCardDragStart: actions.handleDragStart,
                            onCardDragEnd: actions.handleDragEnd,
                            onCardDrop: actions.handleDrop,
                            onAddCard: handleAddCard,
                            onToggleColumnCollapse: handleToggleColumnCollapse,
                            onToggleSwimlaneCollapse: handleToggleSwimlaneCollapse,
                            onDeleteColumn: actions.deleteColumn,
                            onUpdateColumn: actions.updateColumn,
                            onColumnClick: actions.setSelectedColumnId,
                            onCreateCard: handleSaveCard,
                            selectedColumnId: state.selectedColumnId,
                            draggedCardId: state.draggedCard?.id,
                            filteredCards: state.filteredCards,

                            slots: props.slots,
                            slotProps: props.slotProps,
                            view: state.view,
                            dir: dir,
                            className: "flex-1 h-full",
                            ...(props.slotProps?.board || {})
                        } as any)}
                    />
                ) : (
                    <KanbanBoardBoard
                        board={state.board}
                        onCardClick={handleCardClick}
                        onCardDoubleClick={onCardDoubleClick}
                        onCardDragStart={actions.handleDragStart}
                        onCardDragEnd={actions.handleDragEnd}
                        onCardDrop={actions.handleDrop}
                        onAddCard={handleAddCard}
                        onToggleColumnCollapse={handleToggleColumnCollapse}
                        onToggleSwimlaneCollapse={handleToggleSwimlaneCollapse}
                        onDeleteColumn={actions.deleteColumn}
                        onUpdateColumn={actions.updateColumn}
                        onColumnClick={actions.setSelectedColumnId}
                        onCreateCard={handleSaveCard}
                        selectedColumnId={state.selectedColumnId}
                        draggedCardId={state.draggedCard?.id}
                        filteredCards={state.filteredCards}

                        slots={props.slots}
                        slotProps={props.slotProps}
                        view={state.view}
                        dir={dir}
                        className="flex-1 h-full"
                    />
                )}
            </div>

            {/* Editor Modal */}
            {props.slots?.cardEditor ? (
                <props.slots.cardEditor
                    {...({
                        isOpen: isEditorOpen,
                        onClose: () => setIsEditorOpen(false),
                        onSave: handleSaveCard,
                        onDelete: handleDeleteRequest,
                        card: editingCard,
                        columns: state.board.columns,
                        ...(props.slotProps?.cardEditor || {})
                    } as any)}
                />
            ) : (
                <CardEditorModal
                    isOpen={isEditorOpen}
                    onClose={() => setIsEditorOpen(false)}
                    onSave={handleSaveCard}
                    onDelete={handleDeleteRequest}
                    card={editingCard}
                    columns={state.board.columns}
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
