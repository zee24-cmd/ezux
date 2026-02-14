import { useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { EzKanbanProps, KanbanBoard, KanbanColumn, IKanbanService } from '../EzKanban.types';
import { globalServiceRegistry } from '../../../shared/services/ServiceRegistry';

/**
 * Hook for managing Kanban column operations with optimistic updates.
 * 
 * Supports CRUD, reordering, and collapse/expand functionality.
 * 
 * @param props Props for the EzKanban component.
 * @param board The current board state.
 * @group Hooks
 */
export const useKanbanColumns = (props: EzKanbanProps, board: KanbanBoard) => {
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

    // --- Create Column Mutation ---
    const createColumnMutation = useMutation({
        mutationFn: async (column: KanbanColumn) => {
            const service = getService();
            if (service) {
                await service.createColumn(board.id, column);
            } else {
                await props.onColumnCreate?.(column);
            }
            return column;
        },
        onMutate: async (newColumn) => {
            await queryClient.cancelQueries({ queryKey: ['board', board.id] });
            const previousBoard = queryClient.getQueryData<KanbanBoard>(['board', board.id]);

            const updatedBoard = {
                ...board,
                columns: [...board.columns, newColumn],
            };
            updateBoardCache(updatedBoard);

            return { previousBoard };
        },
        onError: (_err: Error, _newColumn: KanbanColumn, context: any) => {
            if (context?.previousBoard) {
                updateBoardCache(context.previousBoard);
            }
            notify('error', 'Failed to create column', 5000);
        },
        onSuccess: (data) => {
            notify('success', `Column "${data.name}" added`);
        },
    });

    const createColumn = useCallback(async (draft: Partial<KanbanColumn>) => {
        const newColumn: KanbanColumn = {
            id: `column-${Date.now()}`,
            name: draft.name || 'New Column',
            color: draft.color,
            icon: draft.icon,
            wipLimit: draft.wipLimit,
            position: draft.position ?? board.columns.length,
            isCollapsed: false,
            ...draft,
        };
        return createColumnMutation.mutateAsync(newColumn);
    }, [board.columns.length, createColumnMutation]);


    // --- Update Column Mutation ---
    const updateColumnMutation = useMutation({
        mutationFn: async ({ columnId, updates }: { columnId: string; updates: Partial<KanbanColumn> }) => {
            const service = getService();
            if (service) {
                await service.updateColumn(columnId, updates);
            } else {
                const column = board.columns.find(c => c.id === columnId);
                if (column) {
                    await props.onColumnUpdate?.({ ...column, ...updates });
                }
            }
            return { columnId, updates };
        },
        onMutate: async ({ columnId, updates }) => {
            await queryClient.cancelQueries({ queryKey: ['board', board.id] });
            const previousBoard = queryClient.getQueryData<KanbanBoard>(['board', board.id]);

            const updatedBoard = {
                ...board,
                columns: board.columns.map(col =>
                    col.id === columnId ? { ...col, ...updates } : col
                ),
            };
            updateBoardCache(updatedBoard);

            return { previousBoard };
        },
        onError: (_err: Error, _variables: any, context: any) => {
            if (context?.previousBoard) {
                updateBoardCache(context.previousBoard);
            }
            notify('error', 'Failed to update column', 5000);
        },
    });

    const updateColumn = useCallback(async (columnId: string, updates: Partial<KanbanColumn>) => {
        return updateColumnMutation.mutateAsync({ columnId, updates });
    }, [updateColumnMutation]);


    // --- Delete Column Mutation ---
    const deleteColumnMutation = useMutation({
        mutationFn: async (columnId: string) => {
            const service = getService();
            if (service) {
                await service.deleteColumn(columnId);
            } else {
                await props.onColumnDelete?.(columnId);
            }
            return columnId;
        },
        onMutate: async (columnId) => {
            await queryClient.cancelQueries({ queryKey: ['board', board.id] });
            const previousBoard = queryClient.getQueryData<KanbanBoard>(['board', board.id]);

            const deletedColumn = previousBoard?.columns.find(c => c.id === columnId);

            const updatedBoard = {
                ...board,
                columns: board.columns.filter(col => col.id !== columnId),
                cards: board.cards.filter(card => card.columnId !== columnId), // Naive delete cascade
            };
            updateBoardCache(updatedBoard);

            return { previousBoard, deletedColumnName: deletedColumn?.name };
        },
        onError: (_err: Error, _columnId: string, context: any) => {
            if (context?.previousBoard) {
                updateBoardCache(context.previousBoard);
            }
            notify('error', 'Failed to delete column', 5000);
        },
        onSuccess: (_columnId, _variables, context: any) => {
            const name = context?.deletedColumnName || 'Column';
            notify('success', `Column "${name}" deleted`);
        },
    });

    const deleteColumn = useCallback(async (columnId: string) => {
        return deleteColumnMutation.mutateAsync(columnId);
    }, [deleteColumnMutation]);


    // --- Reorder Columns Mutation ---
    const reorderColumnsMutation = useMutation({
        mutationFn: async (columnIds: string[]) => {
            const service = getService();
            if (service) {
                // Update each column position? Or reorder API if exists?
                // Assuming service has no bulk reorder yet, loop promises
                const promises = columnIds.map((id, index) => service.updateColumn(id, { position: index }));
                await Promise.all(promises);
            } else {
                // No specific onColumnsReorder prop in types?
                // Maybe onBoardChange is enough?
                // But we should respect the pattern.
                // Fallback: update each column via props? No, too spammy.
                // Just rely on onBoardChange sync if no service.
            }
            return columnIds;
        },
        onMutate: async (columnIds) => {
            await queryClient.cancelQueries({ queryKey: ['board', board.id] });
            const previousBoard = queryClient.getQueryData<KanbanBoard>(['board', board.id]);

            const updatedBoard = {
                ...board,
                columns: columnIds.map((id, index) => {
                    const col = board.columns.find(c => c.id === id);
                    if (!col) throw new Error(`Column ${id} not found`);
                    return { ...col, position: index };
                }),
            };
            updateBoardCache(updatedBoard);

            return { previousBoard };
        },
        onError: (_err: Error, _variables: any, context: any) => {
            if (context?.previousBoard) {
                updateBoardCache(context.previousBoard);
            }
            notify('error', 'Failed to reorder columns', 3000);
        },
    });

    const reorderColumns = useCallback(async (columnIds: string[]) => {
        return reorderColumnsMutation.mutateAsync(columnIds);
    }, [reorderColumnsMutation]);


    const collapseColumn = useCallback((columnId: string) => {
        updateColumn(columnId, { isCollapsed: true });
    }, [updateColumn]);

    const expandColumn = useCallback((columnId: string) => {
        updateColumn(columnId, { isCollapsed: false });
    }, [updateColumn]);

    return {
        /** Create a new column. @group Methods */
        createColumn,
        /** Update an existing column. @group Methods */
        updateColumn,
        /** Delete a column by ID. @group Methods */
        deleteColumn,
        /** Reorder columns by providing new ordered IDs. @group Methods */
        reorderColumns,
        /** Collapse a column. @group Methods */
        collapseColumn,
        /** Expand a column. @group Methods */
        expandColumn,
    };
};
