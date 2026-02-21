import { useMemo, useRef } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getGroupedRowModel,
    getExpandedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    SortingState,
    ColumnFiltersState,
    PaginationState,
    RowSelectionState,
    GroupingState,
    ExpandedState,
    RowPinningState,
    ColumnPinningState,
    Table,
} from '@tanstack/react-table';
import { EzTableProps, EzGlobalFilterState } from '../EzTable.types';
import { useComponentState } from '../../../shared/hooks/useComponentState';
import { smartColumnFilterFn, advancedFilterFn } from '../filterUtils';
import { SmartCell } from '../SmartCell';

// Helper to resolve TanStack updates
const resolveUpdater = <T>(updater: any, old: T): T => {
    return typeof updater === 'function' ? updater(old) : updater;
};

/**
 * Core state and TanStack table instance initialization for EzTable.
 * Handles persistence and basic state synchronization via unified useComponentState.
 */
export const useTableState = <TData extends object>(props: EzTableProps<TData>, currentData: TData[]) => {
    const {
        columns,
        rowCount,
        pageCount,
        pagination,
        pageSize = 10,
        enableRowSelection,
        selectionSettings,
        enableGrouping,
        enableRowPinning,
        enableColumnPinning,
        enableTreeData,
        getSubRows,
        manualPagination,
        manualSorting,
        manualFiltering,
        enablePersistence,
        persistenceKey,
        defaultGrouping = [],
        getRowId,
    } = props;

    const isRemote = !!props.service || !!props.serviceName;

    // --- Unified State ---
    const { state, setState } = useComponentState({
        initialState: {
            sorting: [] as SortingState,
            columnFilters: [] as ColumnFiltersState,
            globalFilter: '' as EzGlobalFilterState,
            columnSizing: {},
            rowSelection: {} as RowSelectionState,
            grouping: defaultGrouping as GroupingState,
            expanded: {} as ExpandedState,
            rowPinning: { top: [], bottom: [] } as RowPinningState,
            pagination: { pageIndex: 0, pageSize: pageSize } as PaginationState,
            columnPinning: { left: [], right: [] } as ColumnPinningState,
            columnVisibility: {} as Record<string, boolean>,
            columnOrder: [] as string[]
        },
        persistenceKey: enablePersistence ? persistenceKey : undefined
    });

    const prevRowSelectionRef = useRef<RowSelectionState>({});

    // --- Setters (Proxies to unified state) ---

    const setSorting = (updater: any) => {
        setState(prev => {
            const newSorting = resolveUpdater<SortingState>(updater, prev.sorting);
            // Emit alias events
            setTimeout(() => {
                props.onSortingChange?.(newSorting);
                props.onSort?.({
                    columns: newSorting.map(s => ({
                        field: s.id,
                        direction: s.desc ? 'desc' : 'asc'
                    }))
                });
            }, 0);
            return { ...prev, sorting: newSorting };
        });
    };

    const setPaginationState = (updater: any) => {
        setState(prev => {
            const newPagination = resolveUpdater<PaginationState>(updater, prev.pagination);
            // Emit alias events
            setTimeout(() => {
                props.onPaginationChange?.(newPagination);
                props.onPageChange?.({
                    currentPage: newPagination.pageIndex + 1,
                    pageSize: newPagination.pageSize
                });
            }, 0);
            return { ...prev, pagination: newPagination };
        });
    };

    const setRowSelection = (updater: any) => {
        setState(prev => {
            const newSelection = resolveUpdater<RowSelectionState>(updater, prev.rowSelection);
            const prevSelection = prevRowSelectionRef.current;

            // Diffing logic
            const prevIds = Object.keys(prevSelection).filter(k => prevSelection[k]);
            const newIds = Object.keys(newSelection).filter(k => newSelection[k]);
            const addedIds = newIds.filter(id => !prevIds.includes(id));
            const removedIds = prevIds.filter(id => !newIds.includes(id));

            setTimeout(() => {
                props.onRowSelectionChange?.(newSelection);

                addedIds.forEach((id) => {
                    const rowIndex = parseInt(id);
                    if (!isNaN(rowIndex) && currentData[rowIndex]) {
                        props.onRowSelect?.({ data: currentData[rowIndex], rowIndex });
                    }
                });

                removedIds.forEach((id) => {
                    const rowIndex = parseInt(id);
                    if (!isNaN(rowIndex) && currentData[rowIndex]) {
                        props.onRowDeselect?.({ data: currentData[rowIndex], rowIndex });
                    }
                });
            }, 0);

            prevRowSelectionRef.current = newSelection;
            return { ...prev, rowSelection: newSelection };
        });
    };

    // Generic setters for others
    const setColumnFilters = (updater: any) => setState(prev => ({ ...prev, columnFilters: resolveUpdater(updater, prev.columnFilters) }));
    const setGlobalFilter = (updater: any) => setState(prev => ({ ...prev, globalFilter: resolveUpdater(updater, prev.globalFilter) }));
    const setColumnSizing = (updater: any) => setState(prev => ({ ...prev, columnSizing: resolveUpdater(updater, prev.columnSizing) }));
    const setGrouping = (updater: any) => setState(prev => ({ ...prev, grouping: resolveUpdater(updater, prev.grouping) }));
    const setExpanded = (updater: any) => setState(prev => ({ ...prev, expanded: resolveUpdater(updater, prev.expanded) }));
    const setRowPinning = (updater: any) => setState(prev => ({ ...prev, rowPinning: resolveUpdater(updater, prev.rowPinning) }));
    const setColumnPinning = (updater: any) => setState(prev => ({ ...prev, columnPinning: resolveUpdater(updater, prev.columnPinning) }));
    const setColumnVisibility = (updater: any) => setState(prev => ({ ...prev, columnVisibility: resolveUpdater(updater, prev.columnVisibility) }));
    const setColumnOrder = (updater: any) => {
        setState(prev => {
            const newOrder = resolveUpdater(updater, prev.columnOrder);
            setTimeout(() => props.onColumnOrderChange?.(newOrder), 0);
            return { ...prev, columnOrder: newOrder };
        });
    };

    // --- Table Instance ---
    const table: Table<TData> = useReactTable({
        data: currentData,
        columns,
        getRowId,
        rowCount,
        pageCount,
        state: useMemo(() => ({
            sorting: state.sorting,
            columnFilters: state.columnFilters,
            globalFilter: state.globalFilter,
            columnSizing: state.columnSizing,
            rowSelection: state.rowSelection,
            pagination: state.pagination,
            grouping: state.grouping,
            expanded: state.expanded,
            rowPinning: state.rowPinning,
            columnPinning: state.columnPinning,
            columnVisibility: state.columnVisibility,
            columnOrder: state.columnOrder,
            ...props.state
        }), [state, props.state]),

        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnSizingChange: setColumnSizing,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPaginationState,
        onGroupingChange: setGrouping,
        onExpandedChange: setExpanded,
        onRowPinningChange: setRowPinning,
        onColumnPinningChange: setColumnPinning,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,

        // Handlers
        globalFilterFn: advancedFilterFn,
        defaultColumn: { cell: SmartCell, filterFn: smartColumnFilterFn },

        // Options
        manualPagination: isRemote || manualPagination,
        manualSorting: isRemote || manualSorting,
        manualFiltering: isRemote || manualFiltering,
        enableRowSelection: (selectionSettings ? true : enableRowSelection) as boolean,
        enableMultiRowSelection: selectionSettings ? selectionSettings.type === 'Multiple' : true,
        enableGrouping,
        enableSorting: true,
        enableRowPinning,
        enableColumnPinning,
        columnResizeMode: 'onChange',
        enableColumnResizing: true,

        aggregationFns: {
            uniqueCount: (columnId, leafRows) => new Set(leafRows.map(row => row.getValue(columnId))).size,
        },
        getSubRows: enableTreeData ? getSubRows : undefined,

        // Models
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
        getGroupedRowModel: enableGrouping ? getGroupedRowModel() : undefined,
        getExpandedRowModel: (enableGrouping || enableTreeData) ? getExpandedRowModel() : undefined,
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),

        // Meta will be populated in the main hook to include extra context
        meta: {}
    });

    return {
        table,
        states: {
            sorting: state.sorting, setSorting,
            columnFilters: state.columnFilters, setColumnFilters,
            globalFilter: state.globalFilter, setGlobalFilter,
            rowSelection: state.rowSelection, setRowSelection,
            paginationState: state.pagination, setPaginationState,
            grouping: state.grouping, setGrouping,
            expanded: state.expanded, setExpanded,
            rowPinning: state.rowPinning, setRowPinning,
            columnPinning: state.columnPinning, setColumnPinning,
            columnVisibility: state.columnVisibility, setColumnVisibility,
            columnOrder: state.columnOrder, setColumnOrder
        }
    };
};
