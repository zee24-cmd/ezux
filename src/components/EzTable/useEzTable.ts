import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EzTableProps, EzTableRef } from './EzTable.types';
import { useTableHistory } from './hooks/useTableHistory';
import { useAutoFit } from './hooks/useAutoFit';
import { useTableState } from './hooks/useTableState';
import { useTableVirtualization } from './hooks/useTableVirtualization';
import { useTableSelection } from './hooks/useTableSelection';
import { useTableFiltering } from './hooks/useTableFiltering';
import { useTableImperative } from './hooks/useTableImperative';
import { useServiceState } from '../../shared/hooks/useServiceState';
import { I18nState } from '../../shared/services/I18nService';

import { useBaseComponent, BaseComponentProps } from '../../shared/hooks/useBaseComponent';
import { useLifecycleEvents } from '../../shared/hooks/useLifecycleEvents';
import { globalServiceRegistry } from '../../shared/services/ServiceRegistry';
import { ITableService } from './EzTable.types';

const EMPTY_ARRAY: any[] = [];

/**
 * Main hook for EzTable that coordinates specialized sub-hooks.
 * Centrally managed via useBaseComponent and modular sub-hooks.
 * 
 * Responsibilities:
 * - Data fetching and synchronization
 * - State management (pagination, sorting, filtering)
 * - History tracking (undo/redo)
 * - Editing state and validation
 * - Virtualization setup
 * 
 * @param props - Table properties
 * @param ref - Forwarded ref for imperative API
 * @param extraApi - Additional imperative methods
 */
export const useEzTable = <TData extends object>(
    props: EzTableProps<TData>,
    ref?: React.Ref<EzTableRef<TData>>,
    extraApi: any = {}
) => {
    // 1. Base component functionality
    const base = useBaseComponent(props as unknown as BaseComponentProps);
    const { api: baseApi, serviceRegistry: _serviceRegistry } = base;
    const queryClient = useQueryClient();

    const {
        dataSource,
        data: initialDataProp,
        onRefresh,
        onDataRequest,
        onDataLoad,
        onError,
        enableEditing,
        isRowEditable,
        isCellEditable,
        pagination = false,
        enableExport = false,
        enableStickyHeader = false,
        enableStickyPagination = false,
        enableChangeTracking = false,
        density = 'standard',
        dir: propDir,
    } = props;

    // 1.1 Reactive I18n State
    const i18nState = useServiceState<I18nState>('I18nService');
    const dir = (propDir === 'auto' || !propDir) ? (i18nState?.dir || 'ltr') : propDir;

    const initialData = dataSource || initialDataProp || EMPTY_ARRAY;

    // 2. Data & History Tracking
    const idField = useMemo(() => {
        const pk = props.editSettings?.primaryKey;
        return pk ? (Array.isArray(pk) ? pk[0] : pk) : 'id';
    }, [props.editSettings?.primaryKey]);

    const {
        data,
        setData,
        performEdit,
        addRow: _addRow,
        deleteRows: _deleteRows,
        undo,
        redo,
        canUndo,
        canRedo,
        changes,
        batchChanges,
        resetData
    } = useTableHistory(initialData, idField);



    // 2a. Pager Message State
    const [pagerMessage, setPagerMessage] = useState<string | undefined>(undefined);

    // 3. Resolve Service
    const service = useMemo(() => {
        if (props.service) return props.service;
        if (props.serviceName) return globalServiceRegistry.get(props.serviceName) as ITableService<TData>;
        return null;
    }, [props.service, props.serviceName]);

    // 4. Base Table Instance & States
    const { table, states } = useTableState(props, data);

    // 5. Data Fetching (Server-Side)
    const paginationState = table.getState().pagination;
    const sortingState = table.getState().sorting;
    const columnFiltersState = table.getState().columnFilters;
    const globalFilterState = table.getState().globalFilter;

    const queryKey = useMemo(() => [
        'table-data',
        props.serviceName || 'local',
        paginationState.pageIndex,
        paginationState.pageSize,
        sortingState,
        columnFiltersState,
        globalFilterState
    ], [props.serviceName, paginationState, sortingState, columnFiltersState, globalFilterState]);

    const { data: fetchedData, isLoading: queryLoading, error: queryError } = useQuery({
        queryKey,
        queryFn: async () => {
            if (!service) return { data: initialData, totalCount: initialData.length };
            return service.getData({
                page: paginationState.pageIndex,
                pageSize: paginationState.pageSize,
                sorting: sortingState,
                filters: columnFiltersState,
                globalFilter: globalFilterState ? String(globalFilterState) : undefined
            });
        },
        // Enable query only if service is present
        enabled: !!service,
        // Provide initial data as placeholder to avoid layout shift
        placeholderData: { data: initialData, totalCount: initialData.length } as any
    });

    const serverData = (fetchedData as any)?.data || initialData;
    const serverTotalCount = (fetchedData as any)?.totalCount ?? initialData.length;

    // Sync server data to local state if not dirty
    useEffect(() => {
        if (service && serverData && !changes.added && !changes.edited && !changes.deleted) {
            setData(serverData);
        }
    }, [serverData, service, setData, changes.added, changes.edited, changes.deleted]);

    // 6. Mutations
    const addMutation = useMutation({
        mutationFn: (row: Partial<TData>) => service!.createRow(row),
        onSuccess: () => queryClient.invalidateQueries({ queryKey })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string | number, updates: Partial<TData> }) =>
            service!.updateRow(id, updates),
        onSuccess: () => queryClient.invalidateQueries({ queryKey })
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string | number) => service!.deleteRow(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey })
    });

    // 7. Loading Transitions
    const [internalLoading, setInternalLoading] = useState(false);
    const isLoading = queryLoading || internalLoading;

    // 8. Filtering & Search
    const {
        isFiltering,
        handleColumnFiltersChange,
        handleGlobalFilterChange,
        setFilterModel,
        setGlobalFilter
    } = useTableFiltering(props, table);

    // 6. Virtualization (Rows & Columns)
    const {
        parentRef,
        rowVirtualizer,
        columnVirtualizer,
        effectiveRowHeight
    } = useTableVirtualization(props, table, dir);

    // 7. Selection & Range Selection
    const {
        rangeSelection,
        onCellMouseDown,
        onCellMouseEnter,
        selectRowByRange: _selectRowByRange
    } = useTableSelection(props, table);

    // 8. Focus & Navigation State
    const [focusedCell, setFocusedCell] = useState<{ r: number; c: number } | null>(null);

    const navigateFocus = useCallback((dr: number, dc: number) => {
        setFocusedCell(prev => {
            if (!prev) return { r: 0, c: 0 };
            const rowsCount = table.getRowModel().rows.length;
            const nextR = Math.max(0, Math.min(rowsCount - 1, prev.r + dr));
            const nextC = Math.max(0, Math.min(table.getVisibleLeafColumns().length - 1, prev.c + dc));
            return { r: nextR, c: nextC };
        });
    }, [table]);

    // 9. Editing State
    const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});
    const toggleRowEditing = useCallback((rowIndex: number, editing?: boolean) => {
        const isStartingEdit = editing === true || (editing === undefined && !editingRows[rowIndex]);

        if (isStartingEdit && data[rowIndex]) {
            props.onRowEditStart?.({ row: table.getRowModel().rows[rowIndex], data: data[rowIndex] });
        }

        setEditingRows(prev => {
            // "Normal" mode (Excel-like) should be exclusive
            if (isStartingEdit && (props.editSettings?.mode === 'Normal' || !props.editSettings?.mode)) {
                return { [String(rowIndex)]: true };
            }
            return {
                ...prev,
                // If editing is undefined, toggle. Otherwise set specific value.
                [rowIndex]: editing !== undefined ? editing : !prev[rowIndex]
            };
        });

        // Synchronize visual focus when starting an edit
        if (isStartingEdit) {
            setFocusedCell(prev => ({ r: rowIndex, c: prev?.c ?? 0 }));
        }
    }, [data, editingRows, props.onRowEditStart, props.editSettings?.mode, table]);

    const updateData = useCallback((rowIndex: number, columnId: string, value: unknown) => {
        if (!enableEditing) return;
        const row = data[rowIndex];
        if (isRowEditable && !isRowEditable(row)) return;
        if (isCellEditable && !isCellEditable(row, columnId)) return;
        performEdit(rowIndex, columnId, value);
    }, [enableEditing, performEdit, data, isRowEditable, isCellEditable]);

    // 9. Auto Fit
    const { autoFitColumn } = useAutoFit(table);

    // 11. Refresh Logic
    const refresh = useCallback(async () => {
        if (service) {
            await queryClient.invalidateQueries({ queryKey });
        } else if (onDataRequest) {
            setInternalLoading(true);
            try {
                onDataRequest(table.getState());
            } catch (e) {
                if (onError) onError(e);
            } finally {
                setInternalLoading(false);
            }
        }
        table.reset();
        onRefresh?.();
    }, [onDataRequest, table, onRefresh, onError, service, queryClient, queryKey]);

    useEffect(() => {
        if (queryError && onError) onError(queryError);
    }, [queryError, onError]);

    useEffect(() => {
        if (service && serverTotalCount !== undefined) {
            table.setOptions(prev => ({
                ...prev,
                rowCount: serverTotalCount
            }));
        }
    }, [serverTotalCount, table, service]);

    // 12. Consolidated Imperative API
    const imperativeAPI = useTableImperative(props, table, data, {
        refresh,
        setData,
        performEdit,
        showSpinner: () => setInternalLoading(true),
        hideSpinner: () => setInternalLoading(false),
        scrollToIndex: (idx) => rowVirtualizer.scrollToIndex(idx, { align: 'center' }),
        toggleRowEditing,
        forceUpdate: () => {
            setInternalLoading(prev => !prev);
            setTimeout(() => setInternalLoading(prev => !prev), 0);
        },
        resetData,
        setPagerMessage,
        batchChanges,
        changes,
        addRow: _addRow,
        deleteRows: _deleteRows,
        setFocusedCell,
        autoFitColumn,
        // Service mutations
        addMutation,
        updateMutation,
        deleteMutation,
        service
    }, ref as any, extraApi);

    // 10. Meta Injection for Cells/Rows - Memoize to prevent unnecessary re-renders
    const tableMeta = useMemo(() => ({
        updateData,
        editingRows,
        toggleRowEditing,
        focusedCell,
        setFocusedCell,
        navigateFocus,
        addRecord: imperativeAPI.addRecord,
        deleteRecord: imperativeAPI.deleteRecord,
        deleteRecords: imperativeAPI.deleteRecords,
        enableEditing: props.enableEditing && (props.editSettings?.allowEditing ?? true),
        isRowEditable,
        isCellEditable,
        enableSearchHighlighting: props.enableSearchHighlighting,
        selectionSettings: props.selectionSettings,
        editSettings: props.editSettings,
        classNames: props.classNames,
        icons: props.icons,
        slots: props.slots,
        slotProps: props.slotProps,
        localization: props.localization,
        dir,
        containerRef: parentRef
    }), [
        updateData,
        editingRows,
        toggleRowEditing,
        focusedCell,
        imperativeAPI.addRecord,
        imperativeAPI.deleteRecord,
        imperativeAPI.deleteRecords,
        props.enableEditing,
        props.editSettings,
        isRowEditable,
        isCellEditable,
        props.enableSearchHighlighting,
        props.selectionSettings,
        props.editSettings,
        props.classNames,
        props.icons,
        props.slots,
        props.slotProps,
        props.localization,
        parentRef
    ]);

    table.options.meta = tableMeta;

    // 13. Lifecycle Callbacks
    useEffect(() => {
        if (onDataLoad) onDataLoad(data);
    }, [data, onDataLoad]);

    // 14. Grid Lifecycle Events (shared hook)
    useLifecycleEvents({
        onRenderStart: props.onGridRenderStart,
        onRenderComplete: props.onGridRenderComplete
    });


    // Combined Return Object
    return useMemo(() => ({
        /** Base API from useBaseComponent. @group Base */
        ...baseApi,
        /** Imperative API methods. @group Methods */
        ...imperativeAPI,
        /** Table state (pagination, sorting, etc). @group State */
        ...states,
        /** Reference to the table parent container. @group Properties */
        parentRef,
        /** Row virtualizer instance. @group Properties */
        rowVirtualizer,
        /** Column virtualizer instance. @group Properties */
        columnVirtualizer,
        /** Currently rendered rows. @group Properties */
        rows: table.getRowModel().rows,
        /** The TanStack Table instance. @group Properties */
        table,
        /** Current text direction. @group Properties */
        dir,
        /** Whether pagination is enabled. @group Properties */
        paginationEnabled: pagination,
        /** Whether export is enabled. @group Properties */
        exportEnabled: enableExport,
        /** Range selection state. @group State */
        rangeSelection,
        /** Callback for cell mouse down. @group Events */
        onCellMouseDown,
        /** Callback for cell mouse enter. @group Events */
        onCellMouseEnter,
        /** Whether sticky header is enabled. @group Properties */
        enableStickyHeader,
        /** Whether sticky pagination is enabled. @group Properties */
        enableStickyPagination,
        /** Whether change tracking is enabled. @group Properties */
        enableChangeTracking,
        /** Undo the last change. @group Methods */
        undo,
        /** Redo the previously undone change. @group Methods */
        redo,
        /** Whether undo is possible. @group State */
        canUndo,
        /** Whether redo is possible. @group State */
        canRedo,
        /** Current changes tracking object. @group State */
        changes,
        /** Batch changes for batch editing mode. @group State */
        batchChanges,
        /** Reset all data changes. @group Methods */
        resetData,
        /** Add a new row. @group Methods */
        addRow: _addRow,
        /** Delete specific rows. @group Methods */
        deleteRows: _deleteRows,
        /** Toggle editing for a row. @group Methods */
        toggleRowEditing,
        /** Whether editing is enabled. @group Properties */
        enableEditing,
        /** Current table density. @group Properties */
        density,
        /** Whether the table is in a pending/loading state. @group State */
        isPending: isFiltering || props.isLoading || isLoading,
        /** Automatically fit a specific column. @group Methods */
        autoFitColumn,

        // Settings Exposure
        /** Current grid lines configuration. @group Properties */
        gridLines: props.gridLines,
        /** Whether alternating row colors are enabled. @group Properties */
        enableAltRow: props.enableAltRow,
        /** Whether row hover effect is enabled. @group Properties */
        enableHover: props.enableHover,
        /** Effective row height. @group Properties */
        rowHeight: effectiveRowHeight,
        /** Selection settings. @group Properties */
        selectionSettings: props.selectionSettings,
        /** Filter settings. @group Properties */
        filterSettings: props.filterSettings,
        /** Search settings. @group Properties */
        searchSettings: props.searchSettings,
        /** Sort settings. @group Properties */
        sortSettings: props.sortSettings,
        /** Edit settings. @group Properties */
        editSettings: props.editSettings,

        // Templates
        /** Row template for customization. @group Components */
        rowTemplate: props.rowTemplate,
        /** Template for empty record state. @group Components */
        emptyRecordTemplate: props.emptyRecordTemplate,
        /** Template for loading state. @group Components */
        loadingTemplate: props.loadingTemplate,

        // Common Events
        /** Row click handler. @group Events */
        onRowClick: props.onRowClick,
        /** Row double-click handler. @group Events */
        onRowDoubleClick: props.onRowDoubleClick,
        /** Cell focus handler. @group Events */
        onCellFocus: props.onCellFocus,
        /** Toolbar item click handler. @group Events */
        onToolbarItemClick: props.onToolbarItemClick,

        // Internal State Access (for components)
        /** Currently focused cell coordinates. @group State */
        focusedCell,
        /** Update the focused cell. @group Methods */
        setFocusedCell,
        /** Current global filter state. @group State */
        globalFilter: states.globalFilter,
        /** Update the global filter. @group Methods */
        setGlobalFilter,
        /** Handler for column filter changes. @group Events */
        handleColumnFiltersChange,
        /** Handler for global filter changes. @group Events */
        handleGlobalFilterChange,
        /** Programmatically set the filter model. @group Methods */
        setFilterModel,

        // Data helpers
        /** Returns current table data. @group Methods */
        getData: () => data,
        /** Returns primary key field names. @group Methods */
        getPrimaryKeyFieldNames: () => {
            const pk = props.editSettings?.primaryKey;
            return pk ? (Array.isArray(pk) ? pk : [pk]) : [];
        },
        /** Pager status message. @group State */
        pagerMessage,
    } as any), [
        baseApi, imperativeAPI, states, parentRef, rowVirtualizer, columnVirtualizer, table, dir,
        pagination, enableExport, rangeSelection, onCellMouseDown, onCellMouseEnter,
        enableStickyHeader, enableStickyPagination, enableChangeTracking, undo, redo,
        canUndo, canRedo, changes, batchChanges, resetData, _addRow, _deleteRows, toggleRowEditing, density, isFiltering,
        props, data, handleColumnFiltersChange, handleGlobalFilterChange, setFilterModel, setGlobalFilter, pagerMessage,
        focusedCell, setFocusedCell, internalLoading
    ]);
};
