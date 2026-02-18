import React, { useCallback, useRef, useEffect } from 'react';
import { useEzTable } from './useEzTable';
import { useEventHandlers } from '../../shared/hooks/useEventHandlers';
import { useContainerResize } from './hooks/useContainerResize';
import { useCellEventHandlers } from './hooks/useCellEventHandlers';
import { useDialogStateInitialization } from './hooks/useDialogStateInitialization';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EzErrorBoundary } from '../shared/components/EzErrorBoundary';
import { EzTableErrorFallback } from '../shared/components/EzTableErrorFallback';
import { globalServiceRegistry } from '../../shared/services/ServiceRegistry';
import { NotificationService } from '../../shared/services/NotificationService';
import { flexColumn, borderStyles } from '../../shared/utils/ezStyleUtils';
import { EzTableProps, EzTableRef } from './EzTable.types';
import { cn } from '../../lib/utils';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent
} from '@dnd-kit/core';
import { useImperativeAPI, useDndHandlers, useDialogState, useFieldValidation, useInitCoreServices } from '../../shared/hooks';
import { EzHeaderDragPreview } from './components/EzHeaderDragPreview';
const EzGroupingPanel = React.lazy(() => import('./EzGroupingPanel').then(m => ({ default: m.EzGroupingPanel })));
const EzTableEditDialog = React.lazy(() => import('./EzTableEditDialog').then(m => ({ default: m.EzTableEditDialog })));

// Modular: Lazy load default implementations to allow tree-shaking if slots are used
const EzTableToolbar = React.lazy(() => import('./EzTableToolbar').then(m => ({ default: m.EzTableToolbar })));
const EzTableFooter = React.lazy(() => import('./EzTableFooter').then(m => ({ default: m.EzTableFooter })));
import { EzTableStatusBar } from './EzTableStatusBar';

import { EzTableHeaderSection } from './components/EzTableHeaderSection';
import { EzTableBodySection } from './components/EzTableBodySection';
import { EzTablePaginationSection } from './components/EzTablePaginationSection';
import { useColumnSizeVars } from './hooks/useColumnSizeVars';
import { TooltipProvider } from '../ui/tooltip';

const EzTableImpl = React.forwardRef(<TData extends object>(props: EzTableProps<TData>, ref: React.ForwardedRef<EzTableRef<TData>>) => {
    const tableRes = useEzTable(props);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const containerSizeRef = useRef({ width: 0, height: 0 });
    const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useContainerResize({
        containerRef: scrollContainerRef,
        containerSizeRef,
        resizeTimeoutRef,
        onResize: () => {
            if (tableRes.rowVirtualizer) {
                tableRes.rowVirtualizer.measure();
            }
        }
    }, [tableRes.rowVirtualizer]);



    const {
        parentRef,
        rowVirtualizer,
        rows,
        table,
        dir,

        rangeSelection,
        onCellMouseDown,
        onCellMouseEnter,
        globalFilter,
        setGlobalFilter,
        enableStickyHeader,
        enableChangeTracking,
        undo,
        redo,
        canUndo,
        canRedo,
        changes,
        batchChanges,
        resetData,
        enableEditing,
        toggleRowEditing,
        density,
        isPending,
        autoFitColumn,
        columnVirtualizer,
        pagerMessage,
        addRecord,
        updateRecord,
        getData,
        onRowClick: onRowClickProp,
        onRowDoubleClick: onRowDoubleClickProp,
        focusedCell,
        editSettings
    } = tableRes;



    // Use shared validation hook - call it early to be available for handlers
    const { validate, validateForm } = useFieldValidation({
        validateField: props.validateField,
        editSettings
    });

    // Track if user has attempted to save, to control when to show validation errors
    const [validationAttempted, setValidationAttempted] = React.useState(false);

    // Navigation Guard for unsaved changes
    useEffect(() => {
        const hasChanges = (changes.added + changes.edited + changes.deleted) > 0;

        if (hasChanges && enableEditing) {
            const handleBeforeUnload = (e: BeforeUnloadEvent) => {
                e.preventDefault();
                e.returnValue = '';
                return '';
            };

            window.addEventListener('beforeunload', handleBeforeUnload);
            return () => window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, [changes, enableEditing]);

    // Notify parent of change state for external routing guards
    useEffect(() => {
        if (props.onDataChange) {
            props.onDataChange(changes);
        }
    }, [changes, props.onDataChange]);

    const { onRowClick, onRowDoubleClick, onCellClick, onCellDoubleClick } = useCellEventHandlers({
        table,
        editSettings,
        toggleRowEditing,
        onRowClickProp,
        onRowDoubleClickProp
    });

    const columnSizeVars = useColumnSizeVars(table);

    const dialogState = useDialogState({ initialMode: 'view' });
    useDialogStateInitialization({
        dialogState,
        isDialogMode: editSettings?.mode === 'Dialog',
        rows,
        table
    });

    const handleDialogSave = useCallback((data: any) => {
        if (dialogState.mode === 'create') {
            addRecord(data);
        } else {
            updateRecord(dialogState.meta.index!, data);
            toggleRowEditing(dialogState.meta.index!, false);
        }
        dialogState.close();
    }, [dialogState, addRecord, updateRecord, toggleRowEditing]);

    const handleAdd = useCallback(() => {
        if (editSettings?.mode === 'Dialog') {
            dialogState.open('create', {});
        } else {
            addRecord({});
        }
    }, [editSettings?.mode, addRecord]);

    const handleSave = useCallback(() => {
        if (props.onBatchSave) {
            // 1. Perform global validation before saving
            const allChangedRecords = [...batchChanges.addedRecords, ...batchChanges.changedRecords];
            const visibleColumns = table.getVisibleLeafColumns();
            // Explicitly cast to prevent implicit any error
            const fieldsToValidate = visibleColumns.map((col: any) => col.id).filter((id: string) => id !== 'select' && id !== 'actions');

            for (const record of allChangedRecords) {
                const results = validateForm(record, fieldsToValidate);
                if (!results['__form'].isValid) {
                    // Prevent save and trigger validation feedback
                    setValidationAttempted(true);
                    return;
                }
            }

            props.onBatchSave(batchChanges);

            // Send Notification
            const service = globalServiceRegistry.get<NotificationService>('NotificationService');
            if (service) {
                service.add({
                    type: 'success',
                    message: `Successfully saved ${batchChanges.addedRecords.length + batchChanges.changedRecords.length} changes.`,
                    duration: 5000
                });
            }

            // Clear internal tracking state once we transition to saving
            resetData();
            setValidationAttempted(false); // Reset validation state on successful save
            // Clear any active row editing states
            if (table.options.meta?.toggleRowEditing) {
                // In Normal/Batch mode, clearing editingRows is desired after save
                const editingRows = table.options.meta.editingRows || {};
                Object.keys(editingRows).forEach(idx => {
                    table.options.meta?.toggleRowEditing?.(parseInt(idx), false);
                });
            }
        }
    }, [props.onBatchSave, batchChanges, resetData, table.options.meta, validateForm, table]);

    const handleDiscard = useCallback(() => {
        if (props.onBatchDiscard) {
            props.onBatchDiscard();
        }
        resetData();
        setValidationAttempted(false); // Reset validation state on discard
        // Clear any active row editing states
        if (table.options.meta?.toggleRowEditing) {
            const editingRows = table.options.meta.editingRows || {};
            Object.keys(editingRows).forEach(idx => {
                table.options.meta?.toggleRowEditing?.(parseInt(idx), false);
            });
        }
    }, [props.onBatchDiscard, resetData, table.options.meta]);




    const api = React.useMemo(() => {
        const { ...api } = tableRes;
        return {
            ...api,
            validateField: (field: string) => {
                let rowData: any = {};
                if (editSettings?.mode === 'Dialog' && dialogState.isOpen) {
                    rowData = dialogState.data;
                } else {
                    const editingRows = table.options.meta?.editingRows || {};
                    const editingId = Object.keys(editingRows).find(k => editingRows[k]);
                    if (editingId) {
                        const rowIndex = parseInt(editingId);
                        const currentData = getData();
                        if (currentData && currentData[rowIndex]) {
                            rowData = currentData[rowIndex];
                        }
                    }
                }

                const { isValid } = validate(field, rowData[field], rowData);
                return isValid;
            },
            validateEditForm: () => {
                const visibleColumns = table.getVisibleLeafColumns();
                let isValid = true;
                visibleColumns.forEach((col: any) => {
                    const fieldName = col.id;
                    let rowData: any = {};
                    if (editSettings?.mode === 'Dialog' && dialogState.isOpen) {
                        rowData = dialogState.data;
                    } else {
                        const editingRows = table.options.meta?.editingRows || {};
                        const editingId = Object.keys(editingRows).find(k => editingRows[k]);
                        if (editingId && getData()[parseInt(editingId)]) {
                            rowData = getData()[parseInt(editingId)];
                        }
                    }

                    const { isValid: fieldValid } = validate(fieldName, rowData[fieldName], rowData);
                    if (!fieldValid) isValid = false;
                });
                return isValid;
            }
        } as EzTableRef<TData>;
    }, [tableRes, getData, editSettings, dialogState, table, validate]);

    table.options.meta = {
        ...table.options.meta,
        ...props,
        validate,
        validationAttempted // Expose validation state to cells
    } as any;

    useImperativeAPI(ref, api);

    const [activeDragHeaderId, setActiveDragHeaderId] = React.useState<string | null>(null);

    const { handleDragEnd, handleKeyDown, handleDragStart } = useEventHandlers({
        onDragStart: (event: DragStartEvent) => {
            setActiveDragHeaderId(event.active.id as string);
        },
        onDragEnd: (event: DragEndEvent) => {
            setActiveDragHeaderId(null);
            const { active, over } = event;
            if (!over) return;
            const columnId = active.id as string;
            const currentGrouping = [...table.getState().grouping];

            if (over.id === 'grouping-panel') {
                if (!currentGrouping.includes(columnId)) table.setGrouping([...currentGrouping, columnId]);
            } else if (typeof over.id === 'string' && over.id.startsWith('header-')) {
                const overColumnId = over.id.replace('header-', '');
                if (columnId !== overColumnId) {
                    let newGrouping = [...currentGrouping];
                    if (!newGrouping.includes(overColumnId)) newGrouping.push(overColumnId);
                    if (newGrouping.includes(columnId)) newGrouping = newGrouping.filter(id => id !== columnId);
                    const overIndex = newGrouping.indexOf(overColumnId);
                    newGrouping.splice(overIndex + 1, 0, columnId);
                    table.setGrouping(newGrouping);
                }
            }
        },
        onKeyDown: (e: React.KeyboardEvent) => {
            const meta = table.options.meta;
            if (!meta?.navigateFocus) return;

            if ((e.target as HTMLElement).tagName === 'INPUT') {
                if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLInputElement).blur(); meta.navigateFocus(1, 0); }
                if (e.key === 'Tab') { e.preventDefault(); (e.target as HTMLInputElement).blur(); meta.navigateFocus(0, e.shiftKey ? -1 : 1); }
                return;
            }

            switch (e.key) {
                case 'ArrowUp': e.preventDefault(); meta.navigateFocus(-1, 0); break;
                case 'ArrowDown': e.preventDefault(); meta.navigateFocus(1, 0); break;
                case 'ArrowLeft': e.preventDefault(); meta.navigateFocus(0, -1); break;
                case 'ArrowRight': e.preventDefault(); meta.navigateFocus(0, 1); break;
                case 'Tab': e.preventDefault(); meta.navigateFocus(0, e.shiftKey ? -1 : 1); break;
                case 'Enter': e.preventDefault(); meta.navigateFocus(1, 0); break;
            }
        }
    });

    const isCellSelected = useCallback((rowIndex: number, colIndex: number) => {
        if (!rangeSelection) return false;
        const { start, end } = rangeSelection;
        return rowIndex >= Math.min(start.r, end.r) && rowIndex <= Math.max(start.r, end.r) &&
            colIndex >= Math.min(start.c, end.c) && colIndex <= Math.max(start.c, end.c);
    }, [rangeSelection]);

    const { sensors, onDragEnd, onDragStart } = useDndHandlers({
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        distance: 5
    });


    return (
        <EzErrorBoundary fallback={<EzTableErrorFallback />}>
            <TooltipProvider>
                <DndContext sensors={sensors} onDragEnd={onDragEnd} onDragStart={onDragStart}>
                    <div className={cn(flexColumn, "w-full min-h-0 gap-3", props.className, props.classNames?.root)} dir={dir}>

                        {props.enableGrouping && (
                            <React.Suspense fallback={null}>
                                <EzGroupingPanel grouping={table.getState().grouping} onGroupingChange={table.setGrouping} columns={table.getAllColumns()} />
                            </React.Suspense>
                        )}


                        {/* Modular Slot: Toolbar */}
                        {props.slots?.toolbar ? (
                            <props.slots.toolbar
                                table={table}
                                globalFilter={globalFilter}
                                setGlobalFilter={setGlobalFilter}
                                isPending={isPending}
                                columns={table.getAllColumns()}
                                {...props.slotProps?.toolbar}
                            />
                        ) : (
                            <React.Suspense fallback={<div className="h-10 w-full animate-pulse bg-muted/20 rounded-md" />}>
                                <EzTableToolbar
                                    globalFilter={globalFilter}
                                    setGlobalFilter={setGlobalFilter}
                                    enableAdvancedFiltering={props.enableAdvancedFiltering}
                                    enableExport={props.enableExport}
                                    onExportExcel={props.onExportExcel ? () => props.onExportExcel!(table) : undefined}
                                    onExportCSV={props.onExportCSV ? () => props.onExportCSV!(table) : undefined}
                                    onExportPDF={props.onExportPDF ? () => props.onExportPDF!(table) : undefined}
                                    enableChangeTracking={enableChangeTracking}
                                    canUndo={canUndo}
                                    canRedo={canRedo}
                                    undo={undo}
                                    redo={redo}
                                    columns={table.getAllColumns()}
                                    isPending={isPending}
                                    onAdd={editSettings?.allowAdding ? handleAdd : undefined}
                                    onSave={handleSave}
                                    onDiscard={handleDiscard}
                                    enableEditing={enableEditing}
                                    changes={changes}
                                    table={table}
                                />
                            </React.Suspense>
                        )}

                        <div
                            ref={(el) => {
                                parentRef.current = el;
                                scrollContainerRef.current = el;
                            }}
                            id={props.id ? `ez-table-${props.id}` : "ez-table-default"}
                            className={cn(
                                "flex-1 w-full overflow-auto rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/20",
                                borderStyles.default
                            )}
                            dir={dir}
                            onScroll={(e) => {
                                if (props.enableInfiniteScroll) {
                                    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                                    // Threshold of 50px
                                    if (scrollHeight - scrollTop - clientHeight < 50) {
                                        if (table.getCanNextPage() && !props.isLoading) {
                                            table.nextPage();
                                        }
                                    }
                                }
                            }}
                            role="table"
                            style={{
                                overflowAnchor: 'none', // Disable browser scroll anchoring to prevent jitter with virtualizer
                                scrollBehavior: props.scrollBehavior ?? 'smooth',
                                height: '100%',
                                position: 'relative',
                                minHeight: '0'
                            }}
                            onKeyDown={handleKeyDown}
                        >
                            <div className="flex flex-col relative w-full min-w-max flex-1" role="presentation" style={{ ...columnSizeVars, height: '100%' }}>

                                <EzTableHeaderSection
                                    table={table}
                                    enableStickyHeader={enableStickyHeader}
                                    classNames={props.classNames}
                                    density={density}
                                    autoFitColumn={autoFitColumn}
                                    slots={props.slots}
                                    columnPinning={table.getState().columnPinning}
                                    columnSizing={table.getState().columnSizing}
                                    sorting={table.getState().sorting}
                                    grouping={table.getState().grouping}
                                    columnVisibility={table.getState().columnVisibility}
                                />

                                <EzTableBodySection
                                    table={table}
                                    rows={rows}
                                    rowVirtualizer={rowVirtualizer}
                                    columnVirtualizer={columnVirtualizer}
                                    density={density}
                                    classNames={props.classNames}
                                    isLoading={props.isLoading}
                                    enableInfiniteScroll={props.enableInfiniteScroll}
                                    isPending={isPending}
                                    renderNoRowsOverlay={props.renderNoRowsOverlay}
                                    slots={props.slots}
                                    localization={props.localization}
                                    enableContextMenu={props.enableContextMenu}
                                    onContextMenuItemClick={props.onContextMenuItemClick}
                                    isCellSelected={isCellSelected}
                                    focusedCell={focusedCell}
                                    onCellMouseDown={onCellMouseDown}
                                    onCellMouseEnter={onCellMouseEnter}
                                    onCellClick={onCellClick}
                                    onCellDoubleClick={onCellDoubleClick}
                                    renderDetailPanel={props.renderDetailPanel}
                                    onRowClick={onRowClick}
                                    onRowDoubleClick={onRowDoubleClick}
                                />

                                {props.slots?.footer ? (
                                    <props.slots.footer table={table} {...props.slotProps?.footer} />
                                ) : (
                                    <React.Suspense fallback={null}>
                                        <EzTableFooter table={table} columnVirtualizer={columnVirtualizer} density={density} />
                                    </React.Suspense>
                                )}
                            </div>
                        </div>

                        {props.pagination && (
                            <EzTablePaginationSection
                                table={table}
                                pagerMessage={pagerMessage}
                                enableStickyPagination={props.enableStickyPagination}
                                classNames={props.classNames}
                                localization={props.localization}
                                changes={changes}
                            />
                        )}

                        <EzTableStatusBar
                            table={table}
                            selectionInfo={(changes.added + changes.edited + changes.deleted) > 0 ? `${changes.added + changes.edited + changes.deleted} pending changes` : undefined}
                        />

                        {editSettings?.mode === 'Dialog' && (
                            <React.Suspense fallback={null}>
                                <EzTableEditDialog
                                    open={dialogState.isOpen}
                                    onClose={() => {
                                        dialogState.close();
                                        if (dialogState.mode !== 'create' && dialogState.meta.index !== undefined) {
                                            toggleRowEditing(dialogState.meta.index, false);
                                        }
                                    }}
                                    onSave={handleDialogSave}
                                    columns={table.getAllColumns()}
                                    initialData={dialogState.data}
                                    isNew={dialogState.mode === 'create'}
                                    onFormRender={props.onFormRender}
                                />
                            </React.Suspense>
                        )}
                        <DragOverlay dropAnimation={null}>
                            {activeDragHeaderId ? (
                                <EzHeaderDragPreview
                                    header={table.getImageHeaders().find((h: any) => h.id === activeDragHeaderId) || table.getLeafHeaders().find((h: any) => h.id === activeDragHeaderId) as any}
                                    density={density}
                                />
                            ) : null}
                        </DragOverlay>
                    </div>
                </DndContext>
            </TooltipProvider>
        </EzErrorBoundary>
    );
});

EzTableImpl.displayName = 'EzTableImpl';
export const EzTablePrimitive = EzTableImpl;

const queryClient = new QueryClient();

/**
 * EzTable is a high-performance, enterprise-grade data grid engine.
 * Built on TanStack Table v8, it combines lightweight core logic with powerful
 * features like virtualization, advanced filtering, and modular editing.
 * 

 * ### Core Capabilities
 * - **Superior Performance**: Row and column virtualization for smooth handling of 100k+ records.
 * - **Smart Data Fetching**: Support for infinite scroll, server-side pagination, and caching via React Query.
 * - **Flexible Editing**: Choose between `Normal` (inline), `Dialog` (form-based), or `Batch` editing modes.
 * - **Advanced Interactivity**: Range selection, drag-and-drop column reordering, and context menus.
 * - **Data Intelligence**: Built-in export (Excel/CSV/PDF), column pinning, and grouping.
 * 
 * ### Minimal Example
 * ```tsx
 * <EzTable
 *   data={employees}
 *   columns={[
 *     { accessorKey: 'name', header: 'Name' },
 *     { accessorKey: 'role', header: 'Role' }
 *   ]}
 *   pagination
 *   enableFiltering
 * />
 * ```
 * 
 * ### Advanced Config: Editing & Persistence
 * ```tsx
 * <EzTable
 *   data={data}
 *   columns={columns}
 *   editSettings={{
 *     allowEditing: true,
 *     mode: 'Batch',
 *     primaryKey: 'id'
 *   }}
 *   enablePersistence
 *   persistenceKey="user-table-grid"
 *   onBatchSave={(changes) => saveToDatabase(changes)}
 * />
 * ```
 * 
 * @group Core Components
 */
export const EzTable = React.forwardRef(<TData extends object>(
    props: EzTableProps<TData>,
    ref: React.ForwardedRef<EzTableRef<TData>>
) => {
    // Initialize core services (I18n, Notifications, etc.)
    useInitCoreServices();

    return (
        <QueryClientProvider client={queryClient}>
            <EzTableImpl {...(props as any)} ref={ref as any} />
        </QueryClientProvider>
    );
}) as <TData extends object>(
    props: EzTableProps<TData> & { ref?: React.ForwardedRef<EzTableRef<TData>> }
) => React.ReactElement;

export * from './context/EzTableContext';
