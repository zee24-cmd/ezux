import { useMemo, useRef, useEffect } from 'react';
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
    Updater,
} from '@tanstack/react-table';
import { EzTableProps, EzGlobalFilterState } from '../EzTable.types';
import { useComponentState } from '../../../shared/hooks/useComponentState';
import { smartColumnFilterFn, advancedFilterFn } from '../filterUtils';
import { SmartCell } from '../SmartCell';

// Helper to resolve TanStack updates
const resolveUpdater = <T>(updater: Updater<T>, old: T): T => {
    return typeof updater === 'function' ? (updater as (old: T) => T)(old) : updater;
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

    const setSorting = (updater: Updater<SortingState>) => {
        setState(prev => ({ ...prev, sorting: resolveUpdater(updater, prev.sorting) }));
    };

    const setPaginationState = (updater: Updater<PaginationState>) => {
        setState(prev => ({ ...prev, pagination: resolveUpdater(updater, prev.pagination) }));
    };

    const setRowSelection = (updater: Updater<RowSelectionState>) => {
        setState(prev => {
            const newSelection = resolveUpdater(updater, prev.rowSelection);
            prevRowSelectionRef.current = newSelection;
            return { ...prev, rowSelection: newSelection };
        });
    };

    // Generic setters for others
    const setColumnFilters = (updater: Updater<ColumnFiltersState>) => setState(prev => ({ ...prev, columnFilters: resolveUpdater(updater, prev.columnFilters) }));
    const setGlobalFilter = (updater: Updater<EzGlobalFilterState>) => setState(prev => ({ ...prev, globalFilter: resolveUpdater(updater, prev.globalFilter) }));
    const setColumnSizing = (updater: Updater<Record<string, number>>) => setState(prev => ({ ...prev, columnSizing: resolveUpdater(updater, prev.columnSizing) }));
    const setGrouping = (updater: Updater<GroupingState>) => setState(prev => ({ ...prev, grouping: resolveUpdater(updater, prev.grouping) }));
    const setExpanded = (updater: Updater<ExpandedState>) => setState(prev => ({ ...prev, expanded: resolveUpdater(updater, prev.expanded) }));
    const setRowPinning = (updater: Updater<RowPinningState>) => setState(prev => ({ ...prev, rowPinning: resolveUpdater(updater, prev.rowPinning) }));
    const setColumnPinning = (updater: Updater<ColumnPinningState>) => setState(prev => ({ ...prev, columnPinning: resolveUpdater(updater, prev.columnPinning) }));
    const setColumnVisibility = (updater: Updater<Record<string, boolean>>) => setState(prev => ({ ...prev, columnVisibility: resolveUpdater(updater, prev.columnVisibility) }));
    const setColumnOrder = (updater: Updater<string[]>) => {
        setState(prev => ({ ...prev, columnOrder: resolveUpdater(updater, prev.columnOrder) }));
    };

    // Event emitters via useEffect to prevent setTimeout inside updaters
    const isInitialMount = useRef(true);
    const prevSorting = useRef<SortingState>(state.sorting);
    const prevPagination = useRef<PaginationState>(state.pagination);
    const prevRowSelection = useRef<RowSelectionState>(state.rowSelection);
    const prevColumnOrder = useRef<string[]>(state.columnOrder);

    // Sorting
    useEffect(() => {
        if (isInitialMount.current) return;
        if (JSON.stringify(state.sorting) !== JSON.stringify(prevSorting.current)) {
            props.onSortingChange?.(state.sorting);
            props.onSort?.({
                columns: state.sorting.map((s: any) => ({
                    direction: s.desc ? 'Descending' : 'Ascending',
                    name: s.id
                })) as any
            });
            prevSorting.current = state.sorting;
        }
    }, [state.sorting, props.onSortingChange, props.onSort]);

    // Pagination
    useEffect(() => {
        if (isInitialMount.current) return;
        if (JSON.stringify(state.pagination) !== JSON.stringify(prevPagination.current)) {
            props.onPaginationChange?.(state.pagination);
            props.onPageChange?.({
                action: 'page',
                currentPage: state.pagination.pageIndex + 1
            } as any);
            prevPagination.current = state.pagination;
        }
    }, [state.pagination, props.onPaginationChange, props.onPageChange]);

    // Row Selection
    useEffect(() => {
        if (isInitialMount.current) return;
        if (JSON.stringify(state.rowSelection) !== JSON.stringify(prevRowSelection.current)) {
            props.onRowSelectionChange?.(state.rowSelection);

            const prevIds = Object.keys(prevRowSelection.current).filter(k => prevRowSelection.current[k]);
            const newIds = Object.keys(state.rowSelection).filter(k => state.rowSelection[k]);
            const addedIds = newIds.filter(id => !prevIds.includes(id));
            const removedIds = prevIds.filter(id => !newIds.includes(id));

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

            prevRowSelection.current = state.rowSelection;
        }
    }, [state.rowSelection, currentData, props.onRowSelectionChange, props.onRowSelect, props.onRowDeselect]);

    // Column Order
    useEffect(() => {
        if (isInitialMount.current) return;
        if (JSON.stringify(state.columnOrder) !== JSON.stringify(prevColumnOrder.current)) {
            props.onColumnOrderChange?.(state.columnOrder);
            prevColumnOrder.current = state.columnOrder;
        }
    }, [state.columnOrder, props.onColumnOrderChange]);

    useEffect(() => {
        isInitialMount.current = false;
    }, []);

    // --- Table Instance ---
    // Use refs for callbacks to avoid infinite loops when parent passes anonymous functions
    const onColumnFiltersChangeRef = useRef(props.onColumnFiltersChange);
    const onGlobalFilterChangeRef = useRef(props.onGlobalFilterChange);

    useEffect(() => {
        onColumnFiltersChangeRef.current = props.onColumnFiltersChange;
        onGlobalFilterChangeRef.current = props.onGlobalFilterChange;
    });

    // Side-effects for manual filtering
    useEffect(() => {
        if (manualFiltering && state.columnFilters.length >= 0) {
            onColumnFiltersChangeRef.current?.(state.columnFilters);
        }
    }, [state.columnFilters, manualFiltering]);

    useEffect(() => {
        if (manualFiltering) {
            onGlobalFilterChangeRef.current?.(state.globalFilter);
        }
    }, [state.globalFilter, manualFiltering]);

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
