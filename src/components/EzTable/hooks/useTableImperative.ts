
import { useMemo } from 'react';
import { useComponentImperativeAPI } from '../../../shared/hooks/useComponentImperativeAPI';
import { Table } from '@tanstack/react-table';
import { EzTableProps } from '../EzTable.types';
import {
    createSpinnerMethods,
    createRefreshMethods,
    createSelectionMethods,
    createNavigationMethods,
    createExportMethods
} from '../../../shared/utils/imperativeApiUtils';


import { EzTableRef } from '../EzTable.types';
import { globalServiceRegistry } from '../../../shared/services/ServiceRegistry';
import { NotificationService } from '../../../shared/services/NotificationService';

/**
 * Consolidates the massive imperative API for EzTable using shared factory utilities.
 * Reduces boilerplate and ensures consistent naming conventions.
 */
export const useTableImperative = <TData extends object>(
    props: EzTableProps<TData>,
    table: Table<TData>,
    data: TData[],
    methods: {
        refresh: () => void;
        setData: React.Dispatch<React.SetStateAction<TData[]>>;
        performEdit: (rowIndex: number, columnId: string, value: unknown) => void;
        showSpinner: () => void;
        hideSpinner: () => void;
        scrollToIndex: (index: number) => void;
        toggleRowEditing: (rowIndex: number, editing?: boolean) => void;
        forceUpdate: () => void;
        resetData: () => void;
        setPagerMessage: (msg: string | undefined) => void;
        batchChanges: { addedRecords: TData[]; changedRecords: TData[]; deletedRecords: TData[] };
        changes: { added: number; edited: number; deleted: number };
        addRow: (row: TData, index?: number) => void;
        deleteRows: (indices: number[]) => void;
        setFocusedCell: (cell: { r: number; c: number } | null) => void;
        autoFitColumn: (columnId: string, options?: { onlyVisible?: boolean; maxWidth?: number }) => void;

        // Service Integration
        addMutation?: any;
        updateMutation?: any;
        deleteMutation?: any;
        service?: any;
    },
    ref: React.Ref<EzTableRef<TData>>,
    extraApi: any = {}
) => {
    const { rows } = table.getRowModel();

    const api = useMemo<EzTableRef<TData>>(() => { // Force type to ensure adherence to EzTableRef
        // ... (existing helper methods)
        const refreshMethods = createRefreshMethods(methods.refresh, methods.forceUpdate);
        const spinnerMethods = createSpinnerMethods(methods.showSpinner, methods.hideSpinner);
        const selectionMethods = createSelectionMethods(
            (index: number | string) => {
                const idx = typeof index === 'string' ? parseInt(index) : index;
                const row = rows[idx];
                if (row?.getCanSelect()) row.toggleSelected(true);
            },
            (indices: (number | string)[]) => {
                const newSelection: Record<string, boolean> = {};
                indices.forEach(i => {
                    const idx = typeof i === 'string' ? parseInt(i) : i;
                    const row = rows[idx];
                    if (row) newSelection[row.id] = true;
                });
                table.setRowSelection(newSelection);
            },
            () => table.resetRowSelection(),
            () => table.toggleAllRowsSelected(true),
            () => table.getSelectedRowModel().rows.map(r => r.original),
            (start: number | string, _end: number | string) => {
                const s = typeof start === 'string' ? parseInt(start) : start;
                methods.scrollToIndex(s);
            }
        );
        const navigationMethods = createNavigationMethods(methods.scrollToIndex, (page) => table.setPageIndex(page));
        const exportMethods = createExportMethods(
            () => props.onExportCSV?.(table),
            () => props.onExportExcel?.(table),
            () => { window.print(); }
        );

        return {
            /** Refreshes current table data. @group Methods */
            ...refreshMethods,
            /** Shows/hides the loading spinner. @group Methods */
            ...spinnerMethods,
            /** Returns current table data. @group Methods */
            getData: () => data,

            /** Sets a specific cell value. @group Methods */
            setCellValue: (key: string, field: string, value: any) => {
                const idx = parseInt(key);
                if (!isNaN(idx)) methods.performEdit(idx, field, value);
            },
            /** Updates entire row data. @group Methods */
            setRowData: (key: string, newData: any) => {
                const idx = parseInt(key);
                if (!isNaN(idx)) methods.setData((old: TData[]) => {
                    const next = [...old];
                    next[idx] = { ...next[idx], ...newData };
                    return next;
                });
            },
            /** Adds a new record. @group Methods */
            addRecord: async (record?: any) => {
                const newRecord = record || {};
                const pk = props.editSettings?.primaryKey;
                const idField = pk ? (Array.isArray(pk) ? pk[0] : pk) : 'id';
                let tempId = (newRecord as any)[idField];

                if (tempId === undefined) {
                    tempId = `_temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    (newRecord as any)[idField] = tempId;
                }

                if (methods.service) {
                    try {
                        const result = await methods.addMutation.mutateAsync(newRecord);
                        const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                        service?.show({ type: 'success', message: 'Row Added Successfully!', duration: 3000 });

                        // Select and edit the new row
                        setTimeout(() => {
                            const rowId = (result as any)[idField] || tempId;
                            table.setRowSelection({ [rowId]: true });
                            const rowIndex = data.findIndex(r => (r as any)[idField] === rowId);
                            if (rowIndex !== -1) {
                                methods.toggleRowEditing(rowIndex, true);
                                methods.scrollToIndex(rowIndex);
                            }
                        }, 100);
                        return;
                    } catch (e) {
                        const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                        service?.show({ type: 'error', message: 'Failed to Add Row', duration: 3000 });
                        throw e;
                    }
                }

                props.onDataChangeStart?.({ action: 'add', data: newRecord });
                props.onRowAddStart?.({ data: newRecord });
                methods.addRow(newRecord, 0);
                props.onDataChangeComplete?.({ action: 'add', data: newRecord });

                const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                service?.show({ type: 'success', message: 'Row Added Successfully!', duration: 3000 });

                setTimeout(() => {
                    table.resetRowSelection();
                    table.setRowSelection({ [tempId]: true });
                    methods.toggleRowEditing(0, true);
                    methods.scrollToIndex(0);
                }, 50);
            },
            /** Updates an existing record. @group Methods */
            updateRecord: async (key: string | number, newData: any) => {
                const idx = typeof key === 'number' ? key : parseInt(key);
                const pk = props.editSettings?.primaryKey;
                const idField = pk ? (Array.isArray(pk) ? pk[0] : pk) : 'id';
                const rowId = (data[idx] as any)?.[idField];

                if (methods.service && rowId) {
                    try {
                        await methods.updateMutation.mutateAsync({ id: rowId, updates: newData });
                        const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                        service?.show({ type: 'success', message: 'Row Updated Successfully!', duration: 3000 });
                        return;
                    } catch (e) {
                        const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                        service?.show({ type: 'error', message: 'Failed to Update Row', duration: 3000 });
                        throw e;
                    }
                }

                props.onDataChangeStart?.({ action: 'edit', data: newData });
                methods.setData((old: TData[]) => {
                    const next = [...old];
                    next[idx] = { ...next[idx], ...newData };

                    const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                    service?.show({ type: 'success', message: 'Row Updated Successfully!', duration: 3000 });

                    return next;
                });
            },
            /** Deletes a record by key or index. @group Methods */
            deleteRecord: async (key: string | number) => {
                const idx = typeof key === 'number' ? key : parseInt(key);
                const deletedRecord = data[idx];
                const pk = props.editSettings?.primaryKey;
                const idField = pk ? (Array.isArray(pk) ? pk[0] : pk) : 'id';
                const rowId = (deletedRecord as any)?.[idField];

                if (methods.service && rowId) {
                    try {
                        await methods.deleteMutation.mutateAsync(rowId);
                        const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                        service?.show({ type: 'success', message: 'Row Deleted Successfully!', duration: 3000 });
                        return;
                    } catch (e) {
                        const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                        service?.show({ type: 'error', message: 'Failed to Delete Row', duration: 3000 });
                        throw e;
                    }
                }

                props.onDataChangeStart?.({ action: 'delete', data: deletedRecord });
                methods.deleteRows([idx]);

                const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                service?.show({ type: 'success', message: 'Row Deleted Successfully!', duration: 3000 });
            },
            /** Deletes multiple records. @group Methods */
            deleteRecords: async (indices: number[]) => {
                if (methods.service) {
                    const pk = props.editSettings?.primaryKey;
                    const idField = pk ? (Array.isArray(pk) ? pk[0] : pk) : 'id';

                    try {
                        for (const idx of indices) {
                            const rowId = (data[idx] as any)?.[idField];
                            if (rowId) await methods.deleteMutation.mutateAsync(rowId);
                        }
                        const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                        service?.show({ type: 'success', message: `${indices.length} Rows Deleted Successfully!`, duration: 3000 });
                        return;
                    } catch (e) {
                        const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                        service?.show({ type: 'error', message: 'Failed to Delete Rows', duration: 3000 });
                        throw e;
                    }
                }

                props.onDataChangeStart?.({ action: 'delete', data: indices.map(i => data[i]) });
                methods.deleteRows(indices);

                const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                service?.show({ type: 'success', message: `${indices.length} Rows Deleted Successfully!`, duration: 3000 });
            },
            /** Returns TanStack row metadata. @group Methods */
            getRowInfo: (key: string | number) => {
                const idx = typeof key === 'number' ? key : parseInt(key);
                return rows[idx];
            },
            /** Puts a record into edit mode. @group Methods */
            editRecord: (key: string | number) => {
                const idx = typeof key === 'number' ? key : parseInt(key);
                methods.toggleRowEditing(idx, true);
            },
            /** Commits multi-row batch changes. @group Methods */
            saveDataChanges: () => {
                props.onDataChangeComplete?.({ action: 'edit', data: methods.batchChanges.changedRecords });
                const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                service?.show({ type: 'success', message: 'Changes Saved Successfully!', duration: 3000 });
            },
            /** Reverts all uncommitted changes. @group Methods */
            cancelDataChanges: () => {
                methods.resetData();
                props.onDataChangeCancel?.({ action: 'edit' });
                const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                service?.show({ type: 'info', message: 'Changes Discarded', duration: 3000 });
            },
            /** Returns batched changes object. @group Methods */
            getBatchChanges: () => methods.batchChanges,
            /** Alias for getBatchChanges. @group Methods */
            getChanges: () => methods.batchChanges,
            /** History state access. @group State */
            history: {
                changes: methods.changes,
                batchChanges: methods.batchChanges
            },

            // Selection
            /** Selection action methods. @group Methods */
            ...selectionMethods,
            /** Returns indices of selected rows. @group Methods */
            getSelectedRowIndexes: () => Object.keys(table.getState().rowSelection).map(Number),
            /** Clears all row selection. @group Methods */
            clearRowSelection: () => table.resetRowSelection(),

            // Navigation
            /** Pagination and navigation methods. @group Methods */
            ...navigationMethods,

            // FilteringSorting
            /** Performs global search. @group Methods */
            search: (val: string) => table.setGlobalFilter(val),
            /** Filters by specific column. @group Methods */
            filterByColumn: (field: string, op: string, val: any) => table.getColumn(field)?.setFilterValue({ operator: op, value: val }),
            /** Clears specific or all filters. @group Methods */
            clearFilter: (field?: string) => field ? table.getColumn(field)?.setFilterValue(undefined) : table.resetColumnFilters(),
            /** Sorts by specific column. @group Methods */
            sortByColumn: (field: string, dir: 'asc' | 'desc') => table.setSorting([{ id: field, desc: dir === 'desc' }]),
            /** Clears all sorting. @group Methods */
            clearSort: () => table.resetSorting(),
            /** Removes sort from specific column. @group Methods */
            removeSortColumn: (field: string) => table.setSorting(old => old.filter(s => s.id !== field)),

            // Columns
            /** Returns visible column definitions. @group Methods */
            getVisibleColumns: () => table.getVisibleLeafColumns().map(c => c.columnDef),
            /** Returns hidden column definitions. @group Methods */
            getHiddenColumns: () => table.getAllLeafColumns().filter(c => !c.getIsVisible()).map(c => c.columnDef),
            /** Returns a column definition by field name. @group Methods */
            getColumnByField: (field: string) => table.getColumn(field)?.columnDef || null,
            /** Returns all column definitions. @group Methods */
            getColumns: () => table.getAllLeafColumns().map(c => c.columnDef),
            /** Programmatically set column visibility. @group Methods */
            setColumnVisibility: (model: Record<string, boolean>) => table.setColumnVisibility(model),

            // Enterprise Methods
            /** Copies table data to clipboard. @group Methods */
            copyToClipboard: async (withHeaders = true) => {
                if (!navigator?.clipboard) return;
                const visibleColumns = table.getVisibleLeafColumns();
                const visibleData = table.getRowModel().rows;

                const headers = withHeaders ? visibleColumns.map(c => c.id).join('\t') + '\n' : '';
                const body = visibleData.map(row =>
                    visibleColumns.map(col => {
                        const cellValue = row.getValue(col.id);
                        return cellValue === null || cellValue === undefined ? '' : String(cellValue);
                    }).join('\t')
                ).join('\n');

                try {
                    await navigator.clipboard.writeText(headers + body);
                    const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                    service?.show({ type: 'success', message: 'Copied to Clipboard!', duration: 2000 });
                } catch (err) {
                    console.error('Failed to copy', err);
                    const service = globalServiceRegistry.get<NotificationService>('NotificationService');
                    service?.show({ type: 'error', message: 'Failed to Copy', duration: 3000 });
                }
            },
            /** Automatically fits visible columns to content. @group Methods */
            autoFitColumns: () => {
                table.getVisibleLeafColumns().forEach(col => {
                    methods.autoFitColumn(col.id);
                });
            },
            /** Expands all grouped rows. @group Methods */
            expandAllGroups: () => table.toggleAllRowsExpanded(true),
            /** Collapses all grouped rows. @group Methods */
            collapseAllGroups: () => table.toggleAllRowsExpanded(false),

            // UI Controls
            /** Whether the table is using remote data. @group Properties */
            isRemote: () => !!(props.manualPagination || props.onDataRequest),
            /** Returns the raw TanStack table and data module. @group Internal */
            getDataModule: () => ({ table, data }),
            /** Sets the pager status message. @group Methods */
            setPagerMessage: (msg: string) => methods.setPagerMessage(msg),
            /** Stub for form validation. @group Methods */
            validateEditForm: () => true, // Stub
            /** Returns primary key field names. @group Methods */
            getPrimaryKeyFieldNames: () => {
                const pk = props.editSettings?.primaryKey;
                return pk ? (Array.isArray(pk) ? pk : [pk]) : [];
            },

            // Exporting
            /** Export action methods. @group Methods */
            ...exportMethods,

            // Extra
            /** Additional injected API methods. @group Methods */
            ...extraApi
        };
    }, [props, table, data, rows, methods, extraApi]);

    useComponentImperativeAPI(ref, api);
    return api;
};
