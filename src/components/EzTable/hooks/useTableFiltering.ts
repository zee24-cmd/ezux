import { useCallback, useTransition } from 'react';
import { Table } from '@tanstack/react-table';
import { EzTableProps } from '../EzTable.types';

/**
 * Handles filtering and search logic for EzTable.
 * Integrates with useTransition for performance and fires legacy/modern events.
 *
 * @param props - Table properties of type {@link EzTableProps}
 * @param table - The TanStack Table instance
 * @returns Filtering state and handlers
 * @group Hooks
 */
export const useTableFiltering = <TData extends object>(
    props: EzTableProps<TData>,
    table: Table<TData>
) => {
    const [isPending, startTransition] = useTransition();

    const handleColumnFiltersChange = useCallback((updater: any) => {
        startTransition(() => {
            table.setColumnFilters((old: any) => {
                const newState = typeof updater === 'function' ? updater(old) : updater;

                // Fire callbacks in a timeout to avoid synchronous state transitions during render
                setTimeout(() => {
                    props.onColumnFiltersChange?.(newState);

                    // Alias: onFilter
                    const filterRules = newState.map((f: any) => ({
                        id: f.id,
                        field: f.id,
                        operator: 'contains',
                        value: f.value
                    }));
                    props.onFilter?.({ columns: filterRules as any });
                }, 0);

                return newState;
            });
        });
    }, [table, props.onColumnFiltersChange, props.onFilter]);

    const handleGlobalFilterChange = useCallback((updater: any) => {
        startTransition(() => {
            table.setGlobalFilter((old: any) => {
                const newState = typeof updater === 'function' ? (updater as Function)(old) : updater;

                setTimeout(() => {
                    props.onGlobalFilterChange?.(newState);
                    // Alias: onSearch
                    if (typeof newState === 'string') props.onSearch?.(newState);
                }, 0);

                return newState;
            });
        });
    }, [table, props.onGlobalFilterChange, props.onSearch]);

    return {
        /** Whether a filter/search transition is in progress. @group State */
        isFiltering: isPending,
        /** Handler for column filter changes. @group Events */
        handleColumnFiltersChange,
        /** Handler for global filter changes. @group Events */
        handleGlobalFilterChange,
        /** Programmatically set the filter model. @group Methods */
        setFilterModel: table.setColumnFilters,
        /** Programmatically set the global filter. @group Methods */
        setGlobalFilter: table.setGlobalFilter
    };
};
