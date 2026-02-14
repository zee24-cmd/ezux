import { useState, useCallback } from 'react';
import type { KanbanBoard, KanbanCard, EzKanbanProps } from '../EzKanban.types';
import { globalServiceRegistry } from '../../../shared/services/ServiceRegistry';

type DragEvents = Pick<EzKanbanProps, 'onCardDragStart' | 'onCardDragStop' | 'onCardDragEnter' | 'onCardDragLeave'>;

/**
 * Hook for managing Kanban drag-and-drop state and logic.
 * 
 * Tracks the dragged card, columns/swimlanes being dragged over,
 * and handles WIP limit checks and event propagation.
 * 
 * @param board The current board state.
 * @param onCardMove Callback to commit a card move.
 * @param wipStrict Whether to enforce hard WIP limits.
 * @param events Optional drag-and-drop events from props.
 * @group Hooks
 */
export const useKanbanDragDrop = (
    board: KanbanBoard,
    onCardMove: (cardId: string, targetColumnId: string, targetSwimlaneId?: string) => void,
    wipStrict: boolean = false,
    events?: DragEvents
) => {
    const [draggedCard, setDraggedCard] = useState<KanbanCard | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
    const [dragOverSwimlane, setDragOverSwimlane] = useState<string | null>(null);

    const handleDragStart = useCallback((card: KanbanCard) => {
        if (events?.onCardDragStart) {
            const args = { card, columnId: card.columnId, cancel: false };
            events.onCardDragStart(args);
            if (args.cancel) return;
        }
        setDraggedCard(card);
    }, [events?.onCardDragStart]);

    const handleDragOver = useCallback((columnId: string, swimlaneId?: string) => {
        if (draggedCard && dragOverColumn !== columnId) {
            // Leave old column
            if (dragOverColumn && events?.onCardDragLeave) {
                events.onCardDragLeave({ card: draggedCard, targetColumnId: dragOverColumn });
            }
            // Enter new column
            if (events?.onCardDragEnter) {
                events.onCardDragEnter({ card: draggedCard, targetColumnId: columnId });
            }
        }
        setDragOverColumn(columnId);
        if (swimlaneId) setDragOverSwimlane(swimlaneId);
    }, [draggedCard, events, dragOverColumn]);

    const handleDragEnd = useCallback(() => {
        if (draggedCard && events?.onCardDragStop) {
            // Drag stop usually means cancelled or dropped without success? 
            // Or just finished. We'll fire it here.
            events.onCardDragStop({ card: draggedCard, columnId: draggedCard.columnId });
        }
        setDraggedCard(null);
        setDragOverColumn(null);
        setDragOverSwimlane(null);
    }, [draggedCard, events?.onCardDragStop]);

    const handleDrop = useCallback((targetColumnId: string, targetSwimlaneId?: string) => {
        if (!draggedCard) return;

        // Check WIP limits
        const targetColumn = board.columns.find(col => col.id === targetColumnId);
        if (targetColumn?.wipLimit) {
            const cardsInColumn = board.cards.filter(c => c.columnId === targetColumnId && !c.isArchived);

            if (cardsInColumn.length >= targetColumn.wipLimit && (draggedCard.columnId !== targetColumnId || draggedCard.swimlaneId !== targetSwimlaneId)) {
                // WIP limit exceeded
                const notificationService = globalServiceRegistry.get<any>('NotificationService');
                if (notificationService) {
                    notificationService.add({
                        type: 'warning',
                        message: `WIP limit reached for "${targetColumn.name}" (${targetColumn.wipLimit} cards)`,
                        duration: 4000
                    });
                }

                // Still allow the move (soft limit), but warn user
                // For hard limit, you would return here instead
                if (wipStrict) {
                    notificationService?.add({
                        type: 'error',
                        message: `Cannot move card: "${targetColumn.name}" is full (Strict WIP)`,
                        duration: 4000
                    });
                    setDraggedCard(null);
                    setDragOverColumn(null);
                    setDragOverSwimlane(null);
                    return;
                }
            }
        }

        // Enterprise Event: Drag Stop with success implied? Or just allow blocking Drop?
        // Let's assume onCardDragStop covers the end of the operation.
        // We probably want an onCardDrop event too, but the types requested onCardDragStop.

        onCardMove(draggedCard.id, targetColumnId, targetSwimlaneId);

        // Firing drag stop after move
        if (events?.onCardDragStop) {
            events.onCardDragStop({ card: draggedCard, columnId: targetColumnId });
        }

        setDraggedCard(null);
        setDragOverColumn(null);
        setDragOverSwimlane(null);
    }, [draggedCard, board, onCardMove, events?.onCardDragStop]);

    return {
        /** The card currently being dragged. @group State */
        draggedCard,
        /** ID of the column being dragged over. @group State */
        dragOverColumn,
        /** ID of the swimlane being dragged over. @group State */
        dragOverSwimlane,
        /** Handler for drag start. @group Events */
        handleDragStart,
        /** Handler for drag over. @group Events */
        handleDragOver,
        /** Handler for drag end (cancel/finish). @group Events */
        handleDragEnd,
        /** Handler for drop (commit move). @group Events */
        handleDrop,
    };
};
