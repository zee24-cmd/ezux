import React from 'react';
import { Row, TableState, Updater, ColumnDef, Table } from '@tanstack/react-table';
import { SharedBaseProps } from '../../../shared/types/BaseProps';
import { ToolbarItemType, ToolbarItem, SelectionSettings, EditSettings } from './EzTableEdit.types';
import { FilterSettings, SearchSettings, SortSettings, TextWrapSettings } from './EzTableFilter.types';
import { FilterGroup } from '../../../shared/types/common';

/**
 * Custom CSS class names for internal table elements.
 * @group Models
 */
export interface EzTableClassNames<TData = unknown> {
    /** Root container class. @group Properties */
    root?: string;
    /** Header class. @group Properties */
    header?: string;
    /** Body class. @group Properties */
    body?: string;
    /** Row class or function. @group Properties */
    row?: string | ((row: Row<TData>) => string);
    /** Cell class or function. @group Properties */
    cell?: string | ((cell: unknown) => string);
    /** Footer class. @group Properties */
    footer?: string;
}

/**
 * Custom icons for table elements.
 * @group Models
 */
export interface EzTableIcons {
    /** Sorting ascending icon. @group Properties */
    sortAsc?: React.ReactNode;
    /** Sorting descending icon. @group Properties */
    sortDesc?: React.ReactNode;
    /** Filter icon. @group Properties */
    filter?: React.ReactNode;
    /** Context menu trigger icon. @group Properties */
    contextMenu?: React.ReactNode;
    /** Expanded row/group icon. @group Properties */
    expanded?: React.ReactNode;
    /** Collapsed row/group icon. @group Properties */
    collapsed?: React.ReactNode;
    /** First page icon. @group Properties */
    firstPage?: React.ReactNode;
    /** Last page icon. @group Properties */
    lastPage?: React.ReactNode;
    /** Next page icon. @group Properties */
    nextPage?: React.ReactNode;
    /** Previous page icon. @group Properties */
    previousPage?: React.ReactNode;
}

/**
 * Localization strings for the table component.
 * @group Models
 */
export interface EzTableLocalization {
    /** "No records to display" label. @group Properties */
    noRowsLabel?: string;
    /** "Loading..." label. @group Properties */
    loadingLabel?: string;
    /** Column menu label. @group Properties */
    columnMenuLabel?: string;
    /** "Contains" filter operator label. @group Properties */
    filterOperatorContains?: string;
    // Pagination
    /** Next page label. @group Properties */
    nextPage?: string;
    /** Previous page label. @group Properties */
    previousPage?: string;
    /** First page label. @group Properties */
    firstPage?: string;
    /** Last page label. @group Properties */
    lastPage?: string;
    /** Search input placeholder. @group Properties */
    searchPlaceholder?: string;
    /** Rows per page label. @group Properties */
    rowsPerPageLabel?: string;
    /** Rows label. @group Properties */
    rowsLabel?: string;
    /** Total label. @group Properties */
    totalLabel?: string;
    /** Records label. @group Properties */
    recordsLabel?: string;
    /** Page label. @group Properties */
    pageLabel?: string;
    /** "of" label. @group Properties */
    ofLabel?: string;
    /** "Go to" label. @group Properties */
    goToLabel?: string;
    /** Pager status message. @group Properties */
    pagerMessage?: string;
}

/**
 * Custom component slots for override.
 * @group Models
 */
export interface EzTableSlots<TData = unknown> {
    /** Custom toolbar component. @group Properties */
    toolbar?: React.ComponentType<unknown>;
    /** Custom footer component. @group Properties */
    footer?: React.ComponentType<unknown>;
    /** Custom overlay for empty state. @group Properties */
    noRowsOverlay?: React.ComponentType<unknown>;
    /** Custom loading overlay. @group Properties */
    loadingOverlay?: React.ComponentType<unknown>;
    /** Custom header component. @group Properties */
    header?: React.ComponentType<unknown>;
    /** Custom row component. @group Properties */
    row?: React.ComponentType<{ row: Row<TData> }>;
    /** Custom empty record component. @group Properties */
    emptyRecord?: React.ComponentType<unknown>;
    /** Custom loading component. @group Properties */
    loading?: React.ComponentType<unknown>;
}

/**
 * Props for the EzTable component.
 * 
 * @example
 * ```tsx
 * import { EzTable, useEzTable } from 'ezux';
 * 
 * const table = useEzTable({
 *   data: [{ id: 1, name: 'John' }],
 *   columns: [{ accessorKey: 'name', header: 'Name' }]
 * });
 * 
 * return <EzTable table={table} />;
 * ```
 */
export interface EzTableProps<TData extends object> extends SharedBaseProps<TData> {
    /** 
     * The data to display in the table. 
     * Can be an array of objects or an empty array.
     * @group Properties 
     */
    data: TData[];
    /** 
     * Configuration for the table columns.
     * Defines headers, accessors, cell rendering, and other per-column options.
     * @group Properties 
     */
    columns: ColumnDef<TData>[];

    // --- 1. Controlled State ---
    /** 
     * Controlled state object for the table.
     * Use this to control pagination, sorting, filtering, etc. from outside.
     * @group Properties 
     */
    state?: Partial<TableState>;
    /** 
     * Initial state object for the table.
     * Use this to set the initial pagination, sorting, filtering, etc.
     * @group Properties 
     */
    initialState?: Partial<TableState>;
    /** 
     * Callback fired when the table state changes.
     * @group Events 
     */
    onStateChange?: (updater: Updater<TableState>) => void;

    // --- 2. Render Props / Slots ---
    /** 
     * Custom slots to override default internal components.
     * @group Properties 
     */
    slots?: EzTableSlots<TData>;
    /** 
     * Props to pass to the custom slots.
     * @group Properties 
     */
    slotProps?: Record<string, unknown>;

    // --- 3. Styling & Icons ---
    /** 
     * Custom class names for internal table elements.
     * Use strict mode class names or functions for dynamic styling.
     * @group Properties 
     */
    classNames?: EzTableClassNames<TData>;
    /** 
     * Custom icons for table elements (sort, filter, pagination, etc.).
     * @group Properties 
     */
    icons?: EzTableIcons;

    // --- 4. Data & Lifecycle ---
    /** 
     * Function to derive a unique ID for a row.
     * Defaults to looking for `id` property.
     * @group Properties 
     */
    getRowId?: (row: TData) => string;
    /** 
     * Callback to process a row update before it is committed.
     * Useful for validation or transformation.
     * @group Events 
     */
    onProcessRowUpdate?: (newRow: TData, oldRow: TData) => Promise<TData>;
    /** 
     * Alias for onDataRequest. Triggered when data needs to be fetched (e.g. pagination/sorting in server-side mode).
     * @group Events 
     */
    onFetchData?: (params: unknown) => void;

    // --- 6. Localization ---
    /** 
     * Localization strings for the table (e.g. pagination labels, no rows message).
     * @group Properties 
     */
    localization?: EzTableLocalization;

    /**
     * Estimated row height for virtualization.
     * Increase this if your rows are taller than 48px to improve scroll performance.
     * Default: 48
     * @group Properties
     */
    estimatedRowHeight?: number;

    /** 
     * Progressive rendering for large datasets.
     * Renders rows in chunks to keep the UI responsive.
     * @group Properties
     */
    progressiveRendering?: boolean;
    /** 
     * Distance in items to prefetch during scrolling.
     * @group Properties
     */
    prefetchDistance?: number;
    /** 
     * Number of items to render outside the visible area.
     * Higher values reduce blank space during fast scrolling but increase memory usage.
     * @group Properties
     */
    overscanCount?: number;
    /** 
     * Enable debug logging for virtualization.
     * @group Properties
     */
    debugVirtualization?: boolean;
    /** 
     * Enable adaptive sizing for dynamic item heights.
     * @group Properties
     */
    adaptiveSizing?: boolean;
    /** 
     * Scroll padding start (pixels) to offset sticky elements or top padding.
     * @group Properties
     */
    scrollPaddingStart?: number;
    /** 
     * Scroll padding end (pixels) to offset sticky elements.
     * @group Properties
     */
    scrollPaddingEnd?: number;
    /** 
     * Scroll margin (pixels) to apply to scroll container.
     * @group Properties
     */
    scrollMargin?: number;

    /**
     * Enable horizontal column virtualization.
     * Recommended for tables with many columns (e.g. 50+).
     * @group Properties
     */
    enableColumnVirtualization?: boolean;

    /**
     * Number of columns after which virtualization kicks in.
     * @group Properties
     */
    columnVirtualizationThreshold?: number;

    /**
     * Enable Infinite Scrolling.
     * If true, `onEndReached` will be called when the user scrolls to the bottom.
     * @group Properties
     */
    enableInfiniteScroll?: boolean;

    /**
     * Callback when the table is scrolled to the bottom.
     * Used for Infinite Scroll to load more data.
     * @group Events
     */
    onEndReached?: () => void;

    /**
     * @deprecated Use `data` instead.
     * @remarks Providing `dataSource` without `data` will trigger a runtime warning.
     * @group Properties
     */
    dataSource?: TData[];

    /**
     * Configuration for pagination.
     * Defines page size, available page sizes, and initial page.
     * @group Properties
     */
    pageSettings?: {
        pageSize?: number;
        pageCount?: number;
        currentPage?: number;
        pageSizes?: number[];
    };

    /**
     * Configuration for column aggregates (e.g. Sum, Average).
     * Displayed in the table footer.
     * @group Properties
     */
    aggregates?: { field: string; type: 'Sum' | 'Average' | 'Min' | 'Max' | 'Count' | 'Custom'; footerTemplate?: string }[];

    /**
     * Text clipping mode for all columns.
     * - `clip`: Text is clipped.
     * - `ellipsis`: Text is truncated with an ellipsis.
     * - `ellipsis-tooltip`: Text is truncated and a tooltip is shown on hover.
     * @group Properties
     */
    clipMode?: 'clip' | 'ellipsis' | 'ellipsis-tooltip';

    /**
     * Total expected rows if knowing beforehand.
     * Crucial for server-side pagination to calculate total pages.
     * @group Properties
     */
    rowCount?: number;

    /**
     * Enable pagination.
     * @group Properties
     */
    pagination?: boolean;
    /** 
     * Number of rows per page.
     * @group Properties
     */
    pageSize?: number;
    // Server-Side Pagination
    // Enterprise Config Objects
    /** 
     * Grid line configuration.
     * @group Properties 
     */
    gridLines?: 'Both' | 'Horizontal' | 'Vertical' | 'None';
    /** 
     * Enable keyboard navigation features.
     * @group Properties 
     */
    allowKeyboard?: boolean;
    /** 
     * Enable alternating row background colors (zebra striping).
     * @group Properties 
     */
    enableAltRow?: boolean;
    /** 
     * Enable row hover effect.
     * @group Properties 
     */
    enableHover?: boolean;
    /** 
     * Enable HTML sanitizer for cell content.
     * @group Properties 
     */
    enableHtmlSanitizer?: boolean;

    // Dimension Settings
    /** 
     * Width of the table. 
     * Accepts pixel number or CSS string (e.g. '100%').
     * @group Properties 
     */
    width?: string | number;
    /** 
     * Height of the table. 
     * Accepts pixel number or CSS string (e.g. '500px').
     * @group Properties 
     */
    height?: string | number;
    /** 
     * Fixed row height for all rows.
     * Required for efficient virtualization.
     * @group Properties 
     */
    rowHeight?: number;

    // Structured Settings
    /** 
     * Configuration for row/cell selection behavior.
     * @group Properties 
     */
    selectionSettings?: SelectionSettings;
    /** 
     * Configuration for filtering behavior (UI type, mode, etc).
     * @group Properties 
     */
    filterSettings?: FilterSettings;
    /** 
     * Configuration for global search behavior.
     * @group Properties 
     */
    searchSettings?: SearchSettings;
    /** 
     * Configuration for sorting behavior.
     * @group Properties 
     */
    sortSettings?: SortSettings;
    /** 
     * Configuration for editing behavior (mode, new row position).
     * @group Properties 
     */
    editSettings?: EditSettings;
    /** 
     * Configuration for text wrapping in cells and headers.
     * @group Properties 
     */
    textWrapSettings?: TextWrapSettings;
    /** 
     * Toolbar items configuration.
     * Accepts an array of item names (strings) or detailed item objects.
     * @group Properties 
     */
    toolbar?: (ToolbarItemType | ToolbarItem)[];

    // Server-Side Query Config
    /** 
     * Generic query parameters for server-side operations.
     * Passed to `onDataRequest`.
     * @group Properties 
     */
    query?: unknown;

    // Lifecycle Events
    /** 
     * Callback when grid renders starts.
     * @group Events 
     */
    onGridRenderStart?: () => void;
    /** 
     * Callback when grid renders completes.
     * @group Events 
     */
    onGridRenderComplete?: () => void;

    // Interaction Events
    /** 
     * Callback when a cell is focused.
     * @group Events 
     */
    onCellFocus?: (args: { cell: unknown, row: Row<TData> }) => void;
    /** 
     * Callback when a toolbar item is clicked.
     * @group Events 
     */
    onToolbarItemClick?: (args: { item: ToolbarItem, originalEvent: React.MouseEvent }) => void;
    /** 
     * Callback when a row is deselected.
     * @group Events 
     */
    onRowDeselect?: (args: { row?: Row<TData>, data: TData, rowIndex: number }) => void;
    /** 
     * Callback when a row is clicked.
     * @group Events 
     */
    onRowClick?: (args: { row: Row<TData>, data: TData, rowIndex: number, originalEvent: React.MouseEvent }) => void;
    /** 
     * Callback when a row is selected.
     * @group Events 
     */
    onRowSelect?: (args: { row?: Row<TData>, data: TData, rowIndex: number, originalEvent?: React.SyntheticEvent }) => void;
    /** 
     * Callback when a row is double-clicked.
     * @group Events 
     */
    onRowDoubleClick?: (args: { row: Row<TData>, data: TData, rowIndex: number, originalEvent: React.MouseEvent }) => void;
    /** 
     * Callback before a new row is added. Return false to cancel.
     * @group Events 
     */
    onRowAddStart?: (args: { data: Partial<TData> }) => void;
    /** 
     * Callback before a row is edited. Return false to cancel.
     * @group Events 
     */
    onRowEditStart?: (args: { row: Row<TData>, data: TData }) => void;

    // Data Change Lifecycle
    // The data change events are inherited from SharedBaseProps<TData>
    /** 
     * Callback when batch changes are saved.
     * @group Events 
     */
    onBatchSave?: (changes: { addedRecords: TData[], changedRecords: TData[], deletedRecords: TData[] }) => void;
    /** 
     * Callback when a record fails validation before saving.
     * @group Events 
     */
    onActionFailure?: (args: { error: unknown }) => void;
    /** 
     * Callback when a record is successfully saved.
     * @group Events 
     */
    onActionComplete?: (args: { action: 'add' | 'edit' | 'delete', data: TData }) => void;

    // Callbacks for dynamic customization
    /** 
     * Formats cell data on the fly.
     * @group Events 
     */
    queryCellInfo?: (args: { row: Row<TData>, data: TData, column: ColumnDef<TData>, cell: unknown }) => void;
    /** 
     * Sets class names for specific rows.
     * @group Events 
     */
    setRowClass?: (row: Row<TData>) => string;

    /**
     * Component validation hook for custom validation.
     */
    validateField?: (params: any) => string | boolean;

    // missing boolean flags
    enableSearchHighlighting?: boolean;
    enableEditing?: boolean;
    isRowEditable?: (row: TData) => boolean;
    isCellEditable?: (row: TData, columnId: string) => boolean;
    enableAdvancedFiltering?: boolean;
    enableExport?: boolean;
    onExportExcel?: (table: Table<TData>) => void;
    onExportCSV?: (table: Table<TData>) => void;
    onExportPDF?: (table: Table<TData>) => void;
    enableStickyHeader?: boolean;
    enableStickyPagination?: boolean;
    enableChangeTracking?: boolean;
    enableColumnPinning?: boolean;
    enableTreeData?: boolean;
    getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
    manualPagination?: boolean;
    manualSorting?: boolean;
    manualFiltering?: boolean;
    enablePersistence?: boolean;
    persistenceKey?: string;
    defaultGrouping?: string[];
    onSortingChange?: (updaterOrValue: Updater<import('@tanstack/react-table').SortingState>) => void;
    onSort?: (args: { columns: { direction: 'Ascending' | 'Descending' | 'None', name: string }[] }) => void;
    onPaginationChange?: (updaterOrValue: Updater<import('@tanstack/react-table').PaginationState>) => void;
    onPageChange?: (args: { action: string, currentPage: number }) => void;
    onRowSelectionChange?: (updaterOrValue: Updater<import('@tanstack/react-table').RowSelectionState>) => void;
    onColumnOrderChange?: (updaterOrValue: Updater<string[]>) => void;
    onColumnFiltersChange?: (updaterOrValue: Updater<import('@tanstack/react-table').ColumnFiltersState>) => void;
    onGlobalFilterChange?: (updaterOrValue: Updater<any>) => void;
    onFilter?: (args: { columns: any }) => void;
    onSearch?: (query: string) => void;
    onActionBegin?: (args: any) => void;
    enableRangeSelection?: boolean;
    pageCount?: number;
    enableRowSelection?: boolean;
    enableRowPinning?: boolean;
    density?: 'standard' | 'comfortable' | 'compact';
    service?: ITableService<TData>;
    serviceName?: string;
    isLoading?: boolean;
    onBatchDiscard?: () => void;
    enableContextMenu?: boolean;
    onContextMenuItemClick?: (item: unknown) => void;
    renderDetailPanel?: (row: Row<TData>) => React.ReactNode;
    enableGrouping?: boolean;
    enableColumnReorder?: boolean;
    onFormRender?: (props: unknown) => React.ReactNode;
    scrollBehavior?: ScrollBehavior;
    renderNoRowsOverlay?: () => React.ReactNode;
    /**
     * Whether to show the status bar at the bottom of the table.
     * Defaults to true.
     * @group Properties
     */
    enableStatusBar?: boolean;
}

/**
 * Shared state parameters passed between internal hooks.
 * @internal
 */
export interface TableParams<TData extends object> {
    data: TData[];
    columns: ColumnDef<TData>[];
    state?: Partial<TableState>;
    initialState?: Partial<TableState>;
    onStateChange?: (updater: Updater<TableState>) => void;
    filterSettings?: FilterSettings;
    searchSettings?: SearchSettings;
    sortSettings?: SortSettings;
    pagination?: boolean;
    enableColumnVirtualization?: boolean;
    columnVirtualizationThreshold?: number;
    rowCount?: number;
    progressiveRendering?: boolean;
    prefetchDistance?: number;
    overscanCount?: number;
    debugVirtualization?: boolean;
    adaptiveSizing?: boolean;
    scrollPaddingStart?: number;
    scrollPaddingEnd?: number;
    scrollMargin?: number;
    pageSettings?: {
        pageSize?: number;
        pageCount?: number;
        currentPage?: number;
        pageSizes?: number[];
    };
    pageSize?: number;
    enableInfiniteScroll?: boolean;
    onEndReached?: () => void;
    selectionSettings?: SelectionSettings;
    getRowId?: (row: TData) => string;
    onRowSelect?: (args: { row?: Row<TData>, data: TData, rowIndex: number, originalEvent?: React.SyntheticEvent }) => void;
    onRowDeselect?: (args: { row?: Row<TData>, data: TData, rowIndex: number }) => void;
    enableChangeTracking?: boolean;
    editSettings?: EditSettings;
    onDataChange?: (changes: any) => void;
    onFetchData?: (params: unknown) => void;
}

// Global Filter State can be string (simple) or object (advanced)
export type EzGlobalFilterState = string | {
    quickSearch?: string;
    advanced?: FilterGroup;
};

// Component-Driven Inversion (IoC) Types
export interface EzTableColumnProps<TData extends object> {
    field?: keyof TData | string;
    headerText?: string;
    width?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
    textAlign?: 'Left' | 'Center' | 'Right' | 'Justify';
    format?: string;
    visible?: boolean;
    allowSorting?: boolean;
    allowFiltering?: boolean;
    allowEditing?: boolean;
    allowSearching?: boolean;
    allowReordering?: boolean;
    allowResizing?: boolean;
    isPrimaryKey?: boolean;
    editType?: 'textedit' | 'numericedit' | 'datepickeredit' | 'dropdownedit' | 'booleanedit';
    showColumnMenu?: boolean;
    template?: React.ReactNode | ((props: unknown) => React.ReactNode);
    editTemplate?: React.ReactNode | ((props: unknown) => React.ReactNode);
    filterTemplate?: React.ReactNode | ((props: unknown) => React.ReactNode);
    // Custom properties
    [key: string]: unknown;
}

// Ensure the props definition matches the actual runtime type
export interface EzTableColumnDef {
    children?: React.ReactNode;
}

export interface EzTableRef<TData extends object> {
    getState: () => TableState;
    getSelectedRows: () => TData[];
    saveChanges: () => Promise<void>;
    cancelChanges: () => void;
    getChanges: () => any;
    validateField: (field: string) => boolean;
    validateEditForm: () => boolean;
    [key: string]: any; // Allow calling custom table API methods
}

export interface ITableService<TData extends object> {
    fetchData: (query: unknown) => Promise<{ data: TData[], rowCount?: number }>;
    getData: (params: TableParams<TData>) => Promise<{ data: TData[], rowCount?: number } | { data: TData[], totalCount: number }>;
    createRow: (row: Partial<TData>) => Promise<TData>;
    updateRow: (id: string | number, updates: Partial<TData>) => Promise<TData>;
    deleteRow: (id: string | number) => Promise<void>;
}
