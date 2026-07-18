import { useCallback, useTransition, useEffect, useRef } from 'react';
import { Table, ColumnFiltersState, Updater } from '@tanstack/react-table';
import { EzTableProps, EzGlobalFilterState } from '../EzTable.types';

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

    const handleColumnFiltersChange = useCallback((updater: Updater<ColumnFiltersState>) => {
        startTransition(() => {
            table.setColumnFilters(updater);
        });
    }, [table]);

    const handleGlobalFilterChange = useCallback((updater: Updater<EzGlobalFilterState>) => {
        startTransition(() => {
            table.setGlobalFilter(updater);
        });
    }, [table]);

    const columnFilters = table.getState().columnFilters;
    const globalFilter = table.getState().globalFilter;

    // React 19 concurrent-safe callback emission via useEffect
    const isInitialMount = useRef(true);
    const prevColumnFilters = useRef<ColumnFiltersState>(columnFilters);
    const prevGlobalFilter = useRef<EzGlobalFilterState>(globalFilter);

    useEffect(() => {
        if (isInitialMount.current) {
            return;
        }
        if (JSON.stringify(columnFilters) !== JSON.stringify(prevColumnFilters.current)) {
            props.onColumnFiltersChange?.(columnFilters);
            const filterRules = columnFilters.map((f) => ({
                id: f.id,
                field: f.id,
                operator: 'contains',
                value: f.value
            }));
            props.onFilter?.({ columns: filterRules as any, table });
            prevColumnFilters.current = columnFilters;
        }
    }, [columnFilters, props.onColumnFiltersChange, props.onFilter, table]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (globalFilter !== prevGlobalFilter.current) {
            props.onGlobalFilterChange?.(globalFilter);
            if (typeof globalFilter === 'string') {
                props.onSearch?.(globalFilter);
            }
            prevGlobalFilter.current = globalFilter;
        }
    }, [globalFilter, props.onGlobalFilterChange, props.onSearch]);

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
