import { useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { EzKanbanProps, KanbanBoard, KanbanCard, IKanbanService } from '../EzKanban.types';
import { globalServiceRegistry } from '../../../shared/services/ServiceRegistry';

/**
 * Hook for managing Kanban card operations with optimistic updates.
 * 
 * Supports CRUD, movements across columns, duplication, archiving, and restoration.
 * Integrates with KanbanService or component-level event handlers.
 * 
 * @param props Props for the EzKanban component.
 * @param board The current board state.
 * @group Hooks
 */
export const useKanbanCards = (props: EzKanbanProps, board: KanbanBoard) => {
    const queryClient = useQueryClient();

    const getService = (): IKanbanService | undefined => {
        return globalServiceRegistry.get<IKanbanService>('KanbanService');
    };

    const notify = (type: 'success' | 'error', message: string, duration = 3000) => {
        const notificationService = globalServiceRegistry.get<any>('NotificationService');
        if (notificationService) {
            notificationService.add({ type, message, duration });
        }
    };

    const updateBoardCache = (updatedBoard: KanbanBoard) => {
        queryClient.setQueryData(['board', board.id], updatedBoard);
        props.onBoardChange?.(updatedBoard);
    };

    // --- Create Card Mutation ---
    const createCardMutation = useMutation({
        mutationFn: async (card: KanbanCard) => {
            const service = getService();
            if (service) {
                await service.createCard(board.id, card);
            } else {
                await props.onCardCreate?.(card);
            }
            return card;
        },
        onMutate: async (newCard) => {
            await queryClient.cancelQueries({ queryKey: ['board', board.id] });
            const previousBoard = queryClient.getQueryData<KanbanBoard>(['board', board.id]);

            const updatedBoard = {
                ...board,
                cards: [...board.cards, newCard],
            };
            updateBoardCache(updatedBoard);

            return { previousBoard };
        },
        onError: (_err: Error, _newCard: KanbanCard, context: any) => {
            if (context?.previousBoard) {
                updateBoardCache(context.previousBoard);
            }
            notify('error', 'Failed to create card. Please try again.', 5000);
        },
        onSuccess: (data) => {
            notify('success', `Card "${data.title}" created successfully`);
        },
    });

    const createCard = useCallback(async (draft: Partial<KanbanCard>) => {
        const newCard: KanbanCard = {
            id: `card-${Date.now()}`,
            type: draft.type || 'standard',
            title: draft.title || 'New Card',
            description: draft.description,
            columnId: draft.columnId || board.columns[0]?.id || '',
            position: draft.position ?? board.cards.filter(c => c.columnId === draft.columnId).length,
            assignees: draft.assignees || [],
            tags: draft.tags || [],
            priority: draft.priority,
            metadata: draft.metadata || {},
            createdBy: 'current-user', // Should be replced by actual user info if available
            createdAt: new Date(),
            updatedBy: 'current-user',
            updatedAt: new Date(),
            ...draft,
        };

        return createCardMutation.mutateAsync(newCard);
    }, [board, createCardMutation]);


    // --- Update Card Mutation ---
    const updateCardMutation = useMutation({
        mutationFn: async ({ cardId, updates }: { cardId: string; updates: Partial<KanbanCard> }) => {
            const service = getService();
            if (service) {
                await service.updateCard(cardId, updates);
            } else {
                const card = board.cards.find(c => c.id === cardId);
                if (card) {
                    await props.onCardUpdate?.({ ...card, ...updates }, 'edit');
                }
            }
            return { cardId, updates };
        },
        onMutate: async ({ cardId, updates }) => {
            await queryClient.cancelQueries({ queryKey: ['board', board.id] });
            const previousBoard = queryClient.getQueryData<KanbanBoard>(['board', board.id]);

            const updatedCards = board.cards.map(card =>
                card.id === cardId ? { ...card, ...updates, updatedAt: new Date() } : card
            );
            const updatedBoard = { ...board, cards: updatedCards };
            updateBoardCache(updatedBoard);

            return { previousBoard };
        },
        onError: (_err: Error, _variables: any, context: any) => {
            if (context?.previousBoard) {
                updateBoardCache(context.previousBoard);
            }
            notify('error', 'Failed to update card', 5000);
        },
        onSuccess: () => {
            notify('success', 'Card updated successfully', 2000);
        },
    });

    const updateCard = useCallback(async (cardId: string, updates: Partial<KanbanCard>) => {
        return updateCardMutation.mutateAsync({ cardId, updates });
    }, [updateCardMutation]);


    // --- Delete Card Mutation ---
    const deleteCardMutation = useMutation({
        mutationFn: async (cardId: string) => {
            const service = getService();
            if (service) {
                await service.deleteCard(cardId);
            } else {
                await props.onCardDelete?.(cardId);
            }
            return cardId;
        },
        onMutate: async (cardId) => {
            await queryClient.cancelQueries({ queryKey: ['board', board.id] });
            const previousBoard = queryClient.getQueryData<KanbanBoard>(['board', board.id]);

            const updatedBoard = {
                ...board,
                cards: board.cards.filter(card => card.id !== cardId),
            };
            updateBoardCache(updatedBoard);

            return { previousBoard, deletedCardTitle: previousBoard?.cards.find(c => c.id === cardId)?.title };
        },
        onError: (_err: Error, _cardId: string, context: any) => {
            if (context?.previousBoard) {
                updateBoardCache(context.previousBoard);
            }
            notify('error', 'Failed to delete card', 5000);
        },
        onSuccess: (_cardId, _variables, context: any) => {
            const title = context?.deletedCardTitle || 'Card';
            notify('success', `Card "${title}" deleted`);
        },
    });

    const deleteCard = useCallback(async (cardId: string) => {
        return deleteCardMutation.mutateAsync(cardId);
    }, [deleteCardMutation]);


    // --- Move Card Mutation ---
    const moveCardMutation = useMutation({
        mutationFn: async (variables: {
            cardId: string, targetColumnId: string, targetSwimlaneId?: string, targetPosition?: number
        }) => {
            const { cardId, targetColumnId, targetSwimlaneId, targetPosition } = variables;
            const service = getService();
            if (service) {
                await service.moveCard(cardId, targetColumnId, targetSwimlaneId, targetPosition);
            } else {
                const card = board.cards.find(c => c.id === cardId);
                if (card) {
                    await props.onCardUpdate?.({
                        ...card,
                        columnId: targetColumnId,
                        swimlaneId: targetSwimlaneId
                    }, 'move');
                }
            }
        },
        onMutate: async ({ cardId, targetColumnId, targetSwimlaneId, targetPosition }) => {
            await queryClient.cancelQueries({ queryKey: ['board', board.id] });
            const previousBoard = queryClient.getQueryData<KanbanBoard>(['board', board.id]);

            const updatedCards = board.cards.map(card =>
                card.id === cardId
                    ? {
                        ...card,
                        columnId: targetColumnId,
                        swimlaneId: targetSwimlaneId,
                        position: targetPosition ?? card.position,
                        updatedAt: new Date()
                    }
                    : card
            );
            const updatedBoard = { ...board, cards: updatedCards };
            updateBoardCache(updatedBoard);

            return { previousBoard };
        },
        onError: (_err: Error, _variables: any, context: any) => {
            if (context?.previousBoard) {
                updateBoardCache(context.previousBoard);
            }
            notify('error', 'Failed to move card', 3000);
        },
    });

    const moveCard = useCallback(async (
        cardId: string,
        targetColumnId: string,
        targetSwimlaneId?: string,
        targetPosition?: number
    ) => {
        return moveCardMutation.mutateAsync({ cardId, targetColumnId, targetSwimlaneId, targetPosition });
    }, [moveCardMutation]);


    const duplicateCard = useCallback(async (cardId: string) => {
        const originalCard = board.cards.find(c => c.id === cardId);
        if (!originalCard) throw new Error('Card not found');

        const duplicatedCard: KanbanCard = {
            ...originalCard,
            id: `card-${Date.now()}`,
            title: `${originalCard.title} (Copy)`,
            position: (originalCard.position ?? 0) + 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return createCard(duplicatedCard); // Uses createCard which is already wrapped
    }, [board.cards, createCard]);

    const archiveCard = useCallback(async (cardId: string) => {
        return updateCard(cardId, { isArchived: true });
    }, [updateCard]);

    const restoreCard = useCallback(async (cardId: string) => {
        return updateCard(cardId, { isArchived: false });
    }, [updateCard]);

    return {
        /** Create a new card. @group Methods */
        createCard,
        /** Update an existing card. @group Methods */
        updateCard,
        /** Delete a card by ID. @group Methods */
        deleteCard,
        /** Move a card to a new column/swimlane. @group Methods */
        moveCard,
        /** Duplicate an existing card. @group Methods */
        duplicateCard,
        /** Archive a card. @group Methods */
        archiveCard,
        /** Restore an archived card. @group Methods */
        restoreCard,
    };
};
