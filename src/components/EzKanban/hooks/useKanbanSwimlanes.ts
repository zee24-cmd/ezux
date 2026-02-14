import { useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { EzKanbanProps, KanbanBoard, KanbanSwimlane, IKanbanService } from '../EzKanban.types';
import { globalServiceRegistry } from '../../../shared/services/ServiceRegistry';

/**
 * Hook for managing Kanban swimlane operations with optimistic updates.
 * 
 * Supports CRUD, reordering, and collapse/expand functionality.
 * 
 * @param props Props for the EzKanban component.
 * @param board The current board state.
 * @group Hooks
 */
export const useKanbanSwimlanes = (props: EzKanbanProps, board: KanbanBoard) => {
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

    // --- Create Swimlane Mutation ---
    const createSwimlaneMutation = useMutation({
        mutationFn: async (swimlane: KanbanSwimlane) => {
            const service = getService();
            if (service) {
                await service.createSwimlane(board.id, swimlane);
            } else {
                await props.onSwimlaneCreate?.(swimlane);
            }
            return swimlane;
        },
        onMutate: async (newSwimlane) => {
            await queryClient.cancelQueries({ queryKey: ['board', board.id] });
            const previousBoard = queryClient.getQueryData<KanbanBoard>(['board', board.id]);

            const updatedBoard = {
                ...board,
                swimlanes: [...(board.swimlanes || []), newSwimlane],
            };
            updateBoardCache(updatedBoard);

            return { previousBoard };
        },
        onError: (_err: Error, _newSwimlane: KanbanSwimlane, context: any) => {
            if (context?.previousBoard) {
                updateBoardCache(context.previousBoard);
            }
            notify('error', 'Failed to create swimlane', 5000);
        },
        onSuccess: (data) => {
            notify('success', `Swimlane "${data.name}" added`);
        },
    });

    const createSwimlane = useCallback(async (draft: Partial<KanbanSwimlane>) => {
        const newSwimlane: KanbanSwimlane = {
            id: `swimlane-${Date.now()}`,
            name: draft.name || 'New Swimlane',
            type: draft.type || 'custom',
            color: draft.color,
            position: draft.position ?? (board.swimlanes?.length || 0),
            isCollapsed: false,
            ...draft,
        };
        return createSwimlaneMutation.mutateAsync(newSwimlane);
    }, [board.swimlanes, createSwimlaneMutation]);


    // --- Update Swimlane Mutation ---
    const updateSwimlaneMutation = useMutation({
        mutationFn: async ({ swimlaneId, updates }: { swimlaneId: string; updates: Partial<KanbanSwimlane> }) => {
            const service = getService();
            if (service) {
                await service.updateSwimlane(swimlaneId, updates);
            } else {
                const swimlane = board.swimlanes?.find(s => s.id === swimlaneId);
                if (swimlane) {
                    await props.onSwimlaneUpdate?.({ ...swimlane, ...updates });
                }
            }
            return { swimlaneId, updates };
        },
        onMutate: async ({ swimlaneId, updates }) => {
            await queryClient.cancelQueries({ queryKey: ['board', board.id] });
            const previousBoard = queryClient.getQueryData<KanbanBoard>(['board', board.id]);

            const updatedBoard = {
                ...board,
                swimlanes: (board.swimlanes || []).map(sw =>
                    sw.id === swimlaneId ? { ...sw, ...updates } : sw
                ),
            };
            updateBoardCache(updatedBoard);

            return { previousBoard };
        },
        onError: (_err: Error, _variables: any, context: any) => {
            if (context?.previousBoard) {
                updateBoardCache(context.previousBoard);
            }
            notify('error', 'Failed to update swimlane', 5000);
        },
    });

    const updateSwimlane = useCallback(async (swimlaneId: string, updates: Partial<KanbanSwimlane>) => {
        return updateSwimlaneMutation.mutateAsync({ swimlaneId, updates });
    }, [updateSwimlaneMutation]);


    // --- Delete Swimlane Mutation ---
    const deleteSwimlaneMutation = useMutation({
        mutationFn: async (swimlaneId: string) => {
            const service = getService();
            if (service) {
                await service.deleteSwimlane(swimlaneId);
            } else {
                await props.onSwimlaneDelete?.(swimlaneId);
            }
            return swimlaneId;
        },
        onMutate: async (swimlaneId) => {
            await queryClient.cancelQueries({ queryKey: ['board', board.id] });
            const previousBoard = queryClient.getQueryData<KanbanBoard>(['board', board.id]);

            const deletedSwimlane = previousBoard?.swimlanes?.find(s => s.id === swimlaneId);

            const updatedBoard = {
                ...board,
                swimlanes: (board.swimlanes || []).filter(sw => sw.id !== swimlaneId),
                cards: board.cards.map(card => card.swimlaneId === swimlaneId ? { ...card, swimlaneId: undefined } : card),
            };
            updateBoardCache(updatedBoard);

            return { previousBoard, deletedSwimlaneName: deletedSwimlane?.name };
        },
        onError: (_err: Error, _swimlaneId: string, context: any) => {
            if (context?.previousBoard) {
                updateBoardCache(context.previousBoard);
            }
            notify('error', 'Failed to delete swimlane', 5000);
        },
        onSuccess: (_swimlaneId, _variables, context: any) => {
            const name = context?.deletedSwimlaneName || 'Swimlane';
            notify('success', `Swimlane "${name}" deleted`);
        },
    });

    const deleteSwimlane = useCallback(async (swimlaneId: string) => {
        return deleteSwimlaneMutation.mutateAsync(swimlaneId);
    }, [deleteSwimlaneMutation]);


    // --- Reorder Swimlanes Mutation ---
    const reorderSwimlanesMutation = useMutation({
        mutationFn: async (swimlaneIds: string[]) => {
            const service = getService();
            if (service) {
                const promises = swimlaneIds.map((id, index) => service.updateSwimlane(id, { position: index }));
                await Promise.all(promises);
            }
            return swimlaneIds;
        },
        onMutate: async (swimlaneIds) => {
            await queryClient.cancelQueries({ queryKey: ['board', board.id] });
            const previousBoard = queryClient.getQueryData<KanbanBoard>(['board', board.id]);

            const updatedBoard = {
                ...board,
                swimlanes: swimlaneIds.map((id, index) => {
                    const swimlane = board.swimlanes?.find(s => s.id === id);
                    return swimlane ? { ...swimlane, position: index } : null;
                }).filter(Boolean) as KanbanSwimlane[],
            };
            updateBoardCache(updatedBoard);

            return { previousBoard };
        },
        onError: (_err: Error, _variables: any, context: any) => {
            if (context?.previousBoard) {
                updateBoardCache(context.previousBoard);
            }
            notify('error', 'Failed to reorder swimlanes', 3000);
        },
    });

    const reorderSwimlanes = useCallback(async (swimlaneIds: string[]) => {
        return reorderSwimlanesMutation.mutateAsync(swimlaneIds);
    }, [reorderSwimlanesMutation]);


    const collapseSwimlane = useCallback((swimlaneId: string) => {
        updateSwimlane(swimlaneId, { isCollapsed: true });
        props.onSwimlaneToggle?.({ swimlaneId, isCollapsed: true });
    }, [updateSwimlane, props.onSwimlaneToggle]);

    const expandSwimlane = useCallback((swimlaneId: string) => {
        updateSwimlane(swimlaneId, { isCollapsed: false });
        props.onSwimlaneToggle?.({ swimlaneId, isCollapsed: false });
    }, [updateSwimlane, props.onSwimlaneToggle]);

    return {
        /** Create a new swimlane. @group Methods */
        createSwimlane,
        /** Update an existing swimlane. @group Methods */
        updateSwimlane,
        /** Delete a swimlane by ID. @group Methods */
        deleteSwimlane,
        /** Reorder swimlanes by providing new ordered IDs. @group Methods */
        reorderSwimlanes,
        /** Collapse a swimlane. @group Methods */
        collapseSwimlane,
        /** Expand a swimlane. @group Methods */
        expandSwimlane,
    };
};
