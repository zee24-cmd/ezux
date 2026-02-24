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
        if (props.serviceName) return _serviceRegistry.get(props.serviceName) as unknown as ITableService<TData>;
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
            const response = await service.getData({
                ...props,
                state: table.getState(),
                data: [], // Required by interface
                columns: [], // Required by interface
            });
            return response;
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
        state: {
            ...states,
            rows: table.getRowModel().rows,
            rangeSelection,
            canUndo,
            canRedo,
            changes,
            batchChanges,
            density,
            isPending: isFiltering || props.isLoading || isLoading,
            focusedCell,
            globalFilter: states.globalFilter,
            pagerMessage,
            internalLoading,
        },
        actions: {
            undo,
            redo,
            resetData,
            addRow: _addRow,
            deleteRows: _deleteRows,
            toggleRowEditing,
            autoFitColumn,
            onCellMouseDown,
            onCellMouseEnter,
            onRowClick: props.onRowClick,
            onRowDoubleClick: props.onRowDoubleClick,
            onCellFocus: props.onCellFocus,
            onToolbarItemClick: props.onToolbarItemClick,
            setFocusedCell,
            setGlobalFilter,
            handleColumnFiltersChange,
            handleGlobalFilterChange,
            setFilterModel,
            getData: () => data,
            getPrimaryKeyFieldNames: () => {
                const pk = props.editSettings?.primaryKey;
                return pk ? (Array.isArray(pk) ? pk : [pk]) : [];
            }
        },
        refs: {
            parentRef,
            rowVirtualizer,
            columnVirtualizer,
        },
        config: {
            paginationEnabled: pagination,
            exportEnabled: enableExport,
            enableStickyHeader,
            enableStickyPagination,
            enableChangeTracking,
            enableEditing,
            gridLines: props.gridLines,
            enableAltRow: props.enableAltRow,
            enableHover: props.enableHover,
            rowHeight: effectiveRowHeight,
            selectionSettings: props.selectionSettings,
            filterSettings: props.filterSettings,
            searchSettings: props.searchSettings,
            sortSettings: props.sortSettings,
            editSettings: props.editSettings,
        },
        services: {
        },
        table,
        dir,
        baseApi,
        imperativeAPI
    }) as any, [
        baseApi, imperativeAPI, states, parentRef, rowVirtualizer, columnVirtualizer, table, dir,
        pagination, enableExport, rangeSelection, onCellMouseDown, onCellMouseEnter,
        enableStickyHeader, enableStickyPagination, enableChangeTracking, undo, redo,
        canUndo, canRedo, changes, batchChanges, resetData, _addRow, _deleteRows, toggleRowEditing, density, isFiltering,
        props, data, handleColumnFiltersChange, handleGlobalFilterChange, setFilterModel, setGlobalFilter, pagerMessage,
        focusedCell, setFocusedCell, internalLoading
    ]);
};
