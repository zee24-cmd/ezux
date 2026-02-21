import { SharedBaseProps } from '../../shared/types/BaseProps';
import {
    FilterOperator as SharedFilterOperator,
    FilterRule as SharedFilterRule,
    FilterGroup as SharedFilterGroup
} from '../../shared/types/commonTypes';
import { IService } from '../../shared/services/ServiceRegistry';
import {
    RowData,
    ColumnDef as TanStackColumnDef,
    RowSelectionState,
    GroupingState,
    Row,
    SortingState,
    ColumnFiltersState,
    PaginationState,
    TableState,
    Table,
    Column,
    Updater, // Import Updater
} from '@tanstack/react-table';

// Advanced Filter Types (Phase 6.2)
export type FilterOperator = SharedFilterOperator;
export type FilterRule = SharedFilterRule;
export type FilterGroup = SharedFilterGroup;

// Enterprise Settings Types
/**
 * Configuration for row/cell selection behavior.
 * @group Models
 */
export interface SelectionSettings {
    /** Selection mode. @group Properties */
    mode?: 'Row' | 'Cell' | 'Both';
    /** Selection type. @group Properties */
    type?: 'Single' | 'Multiple';
    /** Whether to allow selection only via checkbox. @group Properties */
    checkboxOnly?: boolean;
    /** Whether to persist selection across data updates. @group Properties */
    persistSelection?: boolean;
}

/**
 * Configuration for filtering behavior.
 * @group Models
 */
export interface FilterSettings {
    /** Filter UI type. @group Properties */
    type?: 'Menu' | 'CheckBox' | 'Excel';
    /** Whether to ignore accents during filtering. @group Properties */
    ignoreAccent?: boolean;
    /** Filter application mode. @group Properties */
    mode?: 'Immediate' | 'OnEnter';
    /** Whether to show the filter bar status. @group Properties */
    showFilterBarStatus?: boolean;
}

/**
 * Configuration for global search behavior.
 * @group Models
 */
export interface SearchSettings {
    /** Specific fields to search in. @group Properties */
    fields?: string[];
    /** Search operator. @group Properties */
    operator?: 'contains' | 'startsWith' | 'endsWith' | 'equal';
    /** Search key/term. @group Properties */
    key?: string;
    /** Whether to ignore case during search. @group Properties */
    ignoreCase?: boolean;
}

/**
 * Configuration for sorting behavior.
 * @group Models
 */
export interface SortSettings {
    /** Sort mode (single or multiple columns). @group Properties */
    mode?: 'Single' | 'Multiple';
    /** Whether to allow unsorting columns. @group Properties */
    allowUnsort?: boolean;
}

/**
 * Configuration for editing behavior.
 * @group Models
 */
export interface EditSettings {
    /** Whether to allow adding new rows. @group Properties */
    allowAdding?: boolean;
    /** Whether to allow editing existing rows. @group Properties */
    allowEditing?: boolean;
    /** Whether to allow deleting rows. @group Properties */
    allowDeleting?: boolean;
    /** Edit mode. @group Properties */
    mode?: 'Normal' | 'Dialog' | 'Batch';
    /** Position for newly added rows. @group Properties */
    newRowPosition?: 'Top' | 'Bottom';
    /** Whether to allow editing on double-click. @group Properties */
    allowEditOnDblClick?: boolean;
    /** Primary key field(s) for identification. @group Properties */
    primaryKey?: string | string[];
}

/**
 * Configuration for text wrapping.
 * @group Models
 */
export interface TextWrapSettings {
    /** Wrap mode for header, content or both. @group Properties */
    wrapMode?: 'Both' | 'Header' | 'Content';
}

export type ToolbarItemType = 'Search' | 'Print' | 'Export' | 'Add' | 'Edit' | 'Delete' | 'Update' | 'Cancel' | 'ColumnChooser' | string;

/**
 * Represents an item in the table toolbar.
 * @group Models
 */
export interface ToolbarItem {
    /** Display text for the item. @group Properties */
    text?: string;
    /** Tooltip text for the item. @group Properties */
    tooltipText?: string;
    /** Prefix icon for the item. @group Properties */
    prefixIcon?: string | React.ReactNode;
    /** Unique identifier for the item. @group Properties */
    id?: string;
    /** Alignment in the toolbar. @group Properties */
    align?: 'Left' | 'Right' | 'Center';
    /** Predefined or custom type. @group Properties */
    type?: ToolbarItemType;
    /** Custom template for rendering the item. @group Properties */
    template?: React.ReactNode;
    /** Callback when the item is clicked. @group Events */
    onClick?: (e: React.MouseEvent) => void;
}

// --- DX Interfaces ---

/**
 * Custom CSS class names for internal table elements.
 * @group Models
 */
export interface EzTableClassNames {
    /** Root container class. @group Properties */
    root?: string;
    /** Header class. @group Properties */
    header?: string;
    /** Body class. @group Properties */
    body?: string;
    /** Row class or function. @group Properties */
    row?: string | ((row: Row<unknown>) => string);
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
export interface EzTableSlots {
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
    row?: React.ComponentType<{ row: Row<unknown> }>;
    /** Custom empty record component. @group Properties */
    emptyRecord?: React.ComponentType<unknown>;
    /** Custom loading component. @group Properties */
    loading?: React.ComponentType<unknown>;
}

// --- Service Interfaces ---

/**
 * Parameters for data request operations.
 * @group Models
 */
export interface TableParams {
    /** Page number (0-indexed). @group Properties */
    page?: number;
    /** Number of rows per page. @group Properties */
    pageSize?: number;
    /** Current sorting state. @group Properties */
    sorting?: SortingState;
    /** Current column filters. @group Properties */
    filters?: ColumnFiltersState;
    /** Search term. @group Properties */
    globalFilter?: string;
    [key: string]: unknown;
}

/**
 * Service interface for table data management.
 * @group Services
 */
export interface ITableService<T extends RowData = Record<string, unknown>> extends IService {
    /** Retrieves a page of data. @group Services */
    getData(params: TableParams): Promise<{
        data: T[];
        totalCount: number;
    }>;
    /** Adds a new row. @group Services */
    createRow(row: Partial<T>): Promise<T>;
    /** Updates an existing row. @group Services */
    updateRow(id: string | number, updates: Partial<T>): Promise<T>;
    /** Deletes a row. @group Services */
    deleteRow(id: string | number): Promise<void>;
    /** Initializes the service with local data. @group Services */
    initializeWithData?(data: T[]): void;
}

// Global Filter State can be string (simple) or object (advanced)
export type EzGlobalFilterState = string | {
    quickSearch?: string;
    advanced?: FilterGroup;
};

// Component-Driven Inversion (IoC) Types
/**
 * Props passed to custom cell renderers.
 * @group Models
 */
export interface EzTableCellProps<TData = Record<string, unknown>, TValue = unknown> {
    /** Returns the current cell value. @group Properties */
    getValue: () => TValue;
    /** The TanStack Row instance. @group Properties */
    row: Row<TData>;
    /** The TanStack Column instance. @group Properties */
    column: Column<TData, TValue>;
    /** The TanStack Table instance. @group Properties */
    table: Table<TData>;
}

/**
 * Props passed to custom editor components.
 * @group Models
 */
export interface EzTableEditorProps<TData = Record<string, unknown>, TValue = unknown> extends EzTableCellProps<TData, TValue> {
    /** Current value in the editor. @group Properties */
    value: TValue;
    /** Callback to update the value. @group Events */
    onChange: (value: TValue) => void;
    /** Callback when the editor loses focus. @group Events */
    onBlur: () => void;
}

/**
 * Extended metadata for EzTable columns, supporting rich features
 * like editor types, chart options, and formatting.
 * @group Models
 */
export type EzColumnMeta = {
    // Injected Components (IoC)
    /** Custom cell component. @group Components */
    Cell?: React.ComponentType<EzTableCellProps<Record<string, unknown>, unknown>>;
    /** Custom editor component. @group Components */
    Editor?: React.ComponentType<EzTableEditorProps<Record<string, unknown>, unknown>>;
    /** Custom filter component. @group Components */
    Filter?: React.ComponentType<unknown>;

    /** Filter UI variant. @group Properties */
    filterVariant?: 'text' | 'range' | 'select';
    /** Column content alignment. @group Properties */
    align?: 'left' | 'center' | 'right';
    /** Column header icon. @group Properties */
    icon?: React.ReactNode;
    /** Whether to wrap text in cells. @group Properties */
    wrapText?: boolean;
    /** Text clipping mode. @group Properties */
    clipMode?: 'clip' | 'ellipsis' | 'ellipsis-tooltip';
    /** Whether to automatically fit column width to content. @group Properties */
    autoFit?: boolean;
    /** Predefined column type for automatic formatting/editing. @group Properties */
    columnType?: 'text' | 'longtext' | 'number' | 'boolean' | 'date' | 'datetime' | 'select' | 'multiselect' | 'chart' | 'sparkline' | 'progress';

    /** Options for boolean columns. @group Properties */
    booleanOptions?: {
        trueLabel?: string;
        falseLabel?: string;
        nullLabel?: string;
        showIcon?: boolean;
        showLabel?: boolean;
        variant?: 'checkbox' | 'switch';
    };
    /** Options for chart/progress columns. @group Properties */
    chartOptions?: {
        color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
        size?: 'sm' | 'md' | 'lg'; // For progress
        showLabel?: boolean; // For progress
        height?: number; // For sparkline
        width?: number; // For sparkline
        showDots?: boolean; // For sparkline
    };
    /** Options for long text columns. @group Properties */
    longTextOptions?: {
        previewLength?: number;
    };
    /** Options for numeric columns. @group Properties */
    numberOptions?: {
        format?: 'integer' | 'float' | 'currency' | 'percentage';
        decimals?: number;
        currency?: string;
        locale?: string;
    };
    /** Options for date columns. @group Properties */
    dateOptions?: {
        format?: 'short' | 'medium' | 'long' | 'full';
        locale?: string;
    };
    /** Options for date-time columns. @group Properties */
    dateTimeOptions?: {
        format?: 'short' | 'medium' | 'long' | 'full' | 'relative';
        showIcon?: boolean;
        locale?: string;
    };
    /** Options for select/dropdown columns. @group Properties */
    selectOptions?: {
        options?: { value: unknown; label: string; color?: string; icon?: React.ReactNode }[];
        multiSelect?: boolean;
        variant?: 'dropdown' | 'radio' | 'combobox';
    };
    /** Grid lines configuration for this column. @group Properties */
    gridLines?: 'Both' | 'Horizontal' | 'Vertical' | 'None';
};

// Extend TanStack's ColumnMeta to include our custom properties
declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
        editingRows?: Record<string, boolean>;
        toggleRowEditing?: (rowIndex: number, editing?: boolean) => void;
        focusedCell?: { r: number; c: number } | null;
        setFocusedCell?: (cell: { r: number; c: number } | null) => void;
        navigateFocus?: (dr: number, dc: number) => void;
        enableEditing?: boolean;
        isRowEditable?: (row: TData) => boolean;
        isCellEditable?: (row: TData, columnId: string) => boolean;
        enableSearchHighlighting?: boolean;
        selectionSettings?: SelectionSettings;
        editSettings?: EditSettings;
        filterSettings?: FilterSettings;
        searchSettings?: SearchSettings;
        sortSettings?: SortSettings;
        textWrapSettings?: TextWrapSettings;
        classNames?: EzTableClassNames;
        icons?: EzTableIcons;
        slots?: EzTableSlots;
        slotProps?: Record<string, unknown>;
        localization?: EzTableLocalization;
        gridLines?: 'Both' | 'Horizontal' | 'Vertical' | 'None';
    }
    interface ColumnMeta<TData extends RowData, TValue> extends EzColumnMeta { }
}

// Re-export TanStack types for consumers
export type ColumnDef<TData, TValue = unknown> = TanStackColumnDef<TData, TValue>;

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
export interface EzTableProps<TData extends object> extends SharedBaseProps {
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
    slots?: EzTableSlots;
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
    classNames?: EzTableClassNames;
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
    /** 
     * Callback when data is loaded into the table.
     * @group Events 
     */
    onDataLoad?: (data: TData[]) => void;
    /** 
     * Callback to request data from the server.
     * Triggered by paging, sorting, filtering, etc.
     * @group Events 
     */
    onDataRequest?: (query: unknown) => void;
    /** 
     * Callback when a data change (add/edit/delete) is requested.
     * @group Events 
     */
    onDataChangeRequest?: (args: { action: 'add' | 'edit' | 'delete', data: TData }) => void;
    /** 
     * Callback when an internal error occurs.
     * @group Events 
     */
    onError?: (error: unknown) => void;
    /** 
     * Callback when the table is refreshed.
     * @group Events 
     */
    onRefresh?: () => void;

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
    /** 
     * Callback when a data change operation starts.
     * @group Events 
     */
    onDataChangeStart?: (args: { action: 'add' | 'edit' | 'delete', data: TData | TData[] }) => void;
    /** 
     * Callback when a data change operation completes.
     * @group Events 
     */
    onDataChangeComplete?: (args: { action: 'add' | 'edit' | 'delete', data: TData | TData[] }) => void;
    /** 
     * Callback when a data change operation is cancelled.
     * @group Events 
     */
    onDataChangeCancel?: (args: { action: 'add' | 'edit' | 'delete', row?: Row<TData> }) => void;
    /** 
     * Callback when batch changes are saved.
     * @group Events 
     */
    onBatchSave?: (changes: { addedRecords: TData[], changedRecords: TData[], deletedRecords: TData[] }) => void;
    /** 
     * Callback when batch changes are discarded.
     * @group Events 
     */
    onBatchDiscard?: () => void;

    // Edit Mode Events
    /** 
     * Callback when filters change.
     * @group Events 
     */
    onFilter?: (args: { columns: FilterRule[] }) => void;
    /** 
     * Callback when sorting changes.
     * @group Events 
     */
    onSort?: (args: { columns: { field: string, direction: 'asc' | 'desc' }[] }) => void;
    /** 
     * Callback when page changes.
     * @group Events 
     */
    onPageChange?: (args: { currentPage: number, pageSize: number }) => void;
    /** 
     * Callback when global search is performed.
     * @group Events 
     */
    onSearch?: (term: string) => void;

    /** 
     * Callback when the edit form is rendered.
     * @group Events 
     */
    onFormRender?: (args: { form: unknown, mode: 'Add' | 'Edit' }) => void;
    /** 
     * Function to validate a field during editing.
     * Return true if valid, or an error message string if invalid.
     * @group Properties 
     */
    validateField?: (args: { fieldName: string, value: unknown, data: TData }) => boolean | string;



    // Style Overrides (Deprecated in favor of classNames.row)
    rowClass?: string | ((row: Row<TData>) => string);

    // Existing Props Mapping (Preserved for compatibility)
    manualPagination?: boolean;
    /**
     * Total number of pages (0-indexed).
     * @group Properties
     */
    pageCount?: number;
    /** @group Events */
    onPaginationChange?: (pagination: PaginationState) => void;
    /** @group Properties */
    enableRowSelection?: boolean;
    /** @group Events */
    onRowSelectionChange?: (selection: RowSelectionState) => void;
    /**
     * Enable column filtering.
     * @group Properties
     */
    enableColumnFiltering?: boolean;
    /** @group Properties */
    /**
     * Whether filtering is handled manually (server-side).
     * @group Properties
     */
    manualFiltering?: boolean;
    /** @group Events */
    onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
    /** @group Events */
    onGlobalFilterChange?: (filter: EzGlobalFilterState) => void;
    /**
     * Enable row grouping.
     * @group Properties
     */
    enableGrouping?: boolean;
    /** @group Properties */
    /**
     * Initial grouping state.
     * @group Properties
     */
    defaultGrouping?: GroupingState;
    /** @group Events */
    onGroupingChange?: (grouping: GroupingState) => void;
    /** @group Properties */
    /**
     * Enable horizontal column reordering via drag-and-drop.
     * @group Features
     * @default true
     */
    enableColumnReorder?: boolean;
    /**
     * Callback when column order changes.
     * @group Events
     */
    onColumnOrderChange?: (columnOrder: string[]) => void;
    /**
     * Whether sorting is handled manually (server-side).
     * @group Properties
     */
    manualSorting?: boolean;
    /** @group Events */
    onSortingChange?: (sorting: SortingState) => void;
    /**
     * Enable inline or batch editing.
     * @group Properties
     */
    enableEditing?: boolean;
    /** @group Events */
    onDataChange?: (dataOrChanges: TData[] | { added: number; edited: number; deleted: number }) => void;
    /** @group Properties */
    /**
     * Function to check if a cell is editable.
     * @group Properties
     */
    isCellEditable?: (row: TData, columnId: string) => boolean;
    /**
     * Function to check if a row is editable.
     * @group Properties
     */
    isRowEditable?: (row: TData) => boolean;
    /** @group Properties */
    /**
     * Enable tree data (hierarchical rows).
     * @group Properties
     */
    enableTreeData?: boolean;
    /** @group Properties */
    /**
     * Function to get sub-rows for tree data.
     * @group Properties
     */
    getSubRows?: (originalRow: TData) => TData[] | undefined;
    /** @group Properties */
    /**
     * Enable pivoting mode.
     * @group Properties
     */
    enablePivoting?: boolean;
    /**
     * Enable data export (Excel, CSV, PDF).
     * @group Properties
     */
    enableExport?: boolean;
    /** @group Events */
    /**
     * Callback when Excel export is triggered.
     * @group Events
     */
    onExportExcel?: (table: Table<TData>) => void;
    /** @group Events */
    /**
     * Callback when CSV export is triggered.
     * @group Events
     */
    onExportCSV?: (table: Table<TData>) => void;
    /** @group Events */
    /**
     * Callback when PDF export is triggered.
     * @group Events
     */
    onExportPDF?: (table: Table<TData>) => void;
    /**
     * Enable context menu on right-click.
     * @group Properties
     */
    enableContextMenu?: boolean;
    /** @group Events */
    /**
     * Callback when a context menu item is clicked.
     * @group Events
     */
    onContextMenuItemClick?: (action: string, row: TData) => void;
    /** @group Properties */
    /**
     * Enable range selection (Excel-like selection).
     * @group Properties
     */
    enableRangeSelection?: boolean;

    /**
     * Enable row pinning (sticky rows).
     * @group Properties
     */
    enableRowPinning?: boolean;
    /** @group Methods */
    setPagerMessage?: (message: string) => void; // Prop to pass function? No, usually method. Kept as maybe prop for initial state? user asked for Method `setPagerMessage`.
    /**
     * Enable advanced filtering (Excel-like).
     * @group Properties
     */
    enableAdvancedFiltering?: boolean;
    /** @group Properties */
    /**
     * Function to render a detail panel for expanding rows.
     * @group Properties
     */
    renderDetailPanel?: (props: { row: Row<TData> }) => React.ReactNode;
    /** @group Properties */
    /**
     * Enable sticky header.
     * @group Properties
     */
    enableStickyHeader?: boolean;
    /** @group Properties */
    /**
     * Enable sticky pagination at the bottom.
     * @group Properties
     */
    enableStickyPagination?: boolean;
    /**
     * Enable change tracking for batch editing.
     * @group Properties
     */
    enableChangeTracking?: boolean;
    /**
     * Enable column pinning (sticky columns).
     * @group Properties
     */
    enableColumnPinning?: boolean;
    /** @group Properties */
    /**
     * Enable state persistence (save settings to local storage).
     * @group Properties
     */
    enablePersistence?: boolean;
    /** @group Properties */
    /**
     * Key to use for state persistence.
     * @group Properties
     */
    persistenceKey?: string;
    /**
     * Enable group footers (aggregates).
     * @group Properties
     */
    enableGroupFooters?: boolean;
    /**
     * Enable drag-and-drop row reordering.
     * @group Properties
     */
    enableRowReordering?: boolean;
    /** @group Events */
    onRowReorder?: (newOrder: string[]) => void;
    /** @group Properties */
    /**
     * Enable highlighting of search terms in cells.
     * @group Properties
     */
    enableSearchHighlighting?: boolean;
    /** @group Properties */
    /**
     * Display density of the table.
     * @group Properties
     */
    density?: 'compact' | 'standard' | 'comfortable';
    /** @group Properties */
    /**
     * Whether the table is in a loading state.
     * @group Properties
     */
    isLoading?: boolean;
    /** @group Properties */
    /**
     * Scroll behavior for the table (auto or smooth).
     * @group Properties
     */
    scrollBehavior?: 'auto' | 'smooth';
    /** @group Properties */
    /**
     * Custom overlay to render when there are no rows.
     * @group Properties
     */
    renderNoRowsOverlay?: () => React.ReactNode;
    /** @group Events */
    /**
     * Callback when a cell is clicked.
     * @group Events
     */
    onCellClick?: (params: { row: TData, columnId: string, cellValue: unknown, event: React.MouseEvent }) => void;
    /** @group Events */
    /**
     * Callback when a cell is double-clicked.
     * @group Events
     */
    onCellDoubleClick?: (params: { row: TData, columnId: string, cellValue: unknown, event: React.MouseEvent }) => void;

    // Enterprise Settings
    /** @group Properties */
    /**
     * Configuration for clipboard operations (copy/paste).
     * @group Properties
     */
    clipboardSettings?: {
        enable?: boolean;
        mode?: 'Copy' | 'Paste' | 'Both';
        copyHeaders?: boolean;
    };
    /** @group Properties */
    /**
     * Configuration for grouping UI.
     * @group Properties
     */
    groupSettings?: {
        showDropArea?: boolean;
        showGroupedColumn?: boolean;
        captionTemplate?: string;
    };
    /** @group Properties */
    /**
     * Print mode (Current Page or All Pages).
     * @group Properties
     */
    printMode?: 'CurrentPage' | 'AllPages';

    // Enterprise Events
    /** @group Events */
    /**
     * Callback when data is pasted from clipboard.
     * @group Events
     */
    onPaste?: (args: { data: unknown[][]; rowIndex: number; colIndex: number }) => void;
    /** @group Events */
    /**
     * Callback when a cell is saved (async).
     * @group Events
     */
    onCellSave?: (args: { value: unknown; oldValue: unknown; cancel: boolean }) => Promise<void>;
    /** @group Events */
    /**
     * Callback when context menu is opened.
     * @group Events
     */
    onContextMenuOpen?: (args: { row: Row<TData>; column: Column<TData, unknown>; items: unknown[] }) => void;
    /** @group Events */
    /**
     * Callback when export completes.
     * @group Events
     */
    onExportComplete?: (args: { blob: Blob }) => void;

    // Service Integration
    /**
     * Data service instance for remote operations.
     * @group Properties
     */
    service?: ITableService<TData>;
    /**
     * Name of the registered service.
     * @group Properties
     */
    serviceName?: string;
}

// Imperative Handle Interface
export interface EzTableRef<TData = Record<string, unknown>> {
    // ... existing methods
    // Data Operations
    /** 
     * Refreshes the table data.
     * @group Methods 
     */
    refresh: () => void;
    /** 
     * Returns the current data displayed in the table.
     * @group Methods 
     */
    getData: () => TData[];
    /** 
     * Sets a value for a specific cell.
     * @group Methods 
     */
    setCellValue: (key: string, field: string, value: unknown) => void;
    /** 
     * Updates the data for a specific row.
     * @group Methods 
     */
    setRowData: (key: string, data: Partial<TData>) => void;
    /** 
     * Saves any pending data changes (batch mode).
     * @group Methods 
     */
    saveDataChanges: () => void | Promise<void>;
    /** 
     * Cancels any pending data changes.
     * @group Methods 
     */
    cancelDataChanges: () => void | Promise<void>;
    /** 
     * Validates the current edit form.
     * @group Methods 
     */
    validateEditForm: () => boolean;
    /** 
     * Returns the field names used as primary keys.
     * @group Methods 
     */
    getPrimaryKeyFieldNames: () => string[];

    /** 
     * Selects a row by its index or ID.
     * @group Methods 
     */
    selectRow: (index: number | string) => void;
    /** 
     * Selects multiple rows by their indices or IDs.
     * @group Methods 
     */
    selectRows: (indices: (number | string)[]) => void;
    /** 
     * Clears the current selection.
     * @group Methods 
     */
    clearSelection: () => void;
    /** 
     * Selects all rows in the table.
     * @group Methods 
     */
    selectAll: () => void;
    /** 
     * Returns the currently selected records.
     * @group Methods 
     */
    getSelectedRecords: () => TData[];
    /** 
     * Returns the indexes of currently selected rows.
     * @group Methods 
     */
    getSelectedRowIndexes: () => number[];

    /** 
     * Navigates to a specific page.
     * @group Methods 
     */
    goToPage: (page: number) => void;

    /** 
     * Performs a global search.
     * @group Methods 
     */
    search: (key: string) => void;
    /** 
     * Filters the table by a specific column.
     * @group Methods 
     */
    filterByColumn: (fieldName: string, operator: string, value: unknown) => void;
    /** 
     * Clears the filter for a specific column or all columns.
     * @group Methods 
     */
    clearFilter: (fieldName?: string) => void;
    /** 
     * Sorts the table by a specific column.
     * @group Methods 
     */
    sortByColumn: (fieldName: string, direction: 'asc' | 'desc') => void;
    /** 
     * Clears the current sort.
     * @group Methods 
     */
    clearSort: () => void;

    /** 
     * Shows the loading spinner.
     * @group Methods 
     */
    showSpinner: () => void;
    /** 
     * Hides the loading spinner.
     * @group Methods 
     */
    hideSpinner: () => void;
    /** 
     * Returns the list of visible columns.
     * @group Methods 
     */
    getVisibleColumns: () => any[];
    /** 
     * Returns the list of hidden columns.
     * @group Methods 
     */
    getHiddenColumns: () => any[];
    /** 
     * Returns a column definition by its field name.
     * @group Methods 
     */
    getColumnByField: (field: string) => ColumnDef<TData> | undefined;

    /** 
     * Adds a new record to the table.
     * @group Methods 
     */
    addRecord: (data?: Partial<TData>) => void | Promise<void>;
    /** 
     * Deletes a record from the table.
     * @group Methods 
     */
    deleteRecord: (key?: string | number) => void | Promise<void>;
    /** 
     * Puts a record into edit mode.
     * @group Methods 
     */
    editRecord: (key: string | number) => void | Promise<void>;
    /** 
     * Updates an existing record.
     * @group Methods 
     */
    updateRecord: (key: string | number, data: Partial<TData>) => void | Promise<void>;
    /** 
     * Deletes multiple records.
     * @group Methods 
     */
    deleteRecords: (indices: number[]) => void | Promise<void>;

    /** 
     * Returns all column definitions.
     * @group Methods 
     */
    getColumns: () => ColumnDef<TData>[];
    /** 
     * Returns the underlying data module (internal use).
     * @group Methods 
     */
    getDataModule: () => unknown;
    /** 
     * Returns row information for a specific key.
     * @group Methods 
     */
    getRowInfo: (key: string | number) => Row<TData> | undefined;
    /** 
     * Checks if the table is in remote data mode.
     * @group Methods 
     */
    isRemote: () => boolean;
    /** 
     * Removes a sort column.
     * @group Methods 
     */
    removeSortColumn: (field: string) => void;
    /** 
     * Selects a range of rows.
     * @group Methods 
     */
    selectRowByRange: (startIndex: number | string, endIndex: number | string) => void;
    /** 
     * Sets a message in the pager.
     * @group Methods 
     */
    setPagerMessage: (message: string) => void;
    /** 
     * Clears row selection (Alias for clearSelection).
     * @group Methods 
     */
    clearRowSelection: () => void;
    /** 
     * Validates a specific field.
     * @group Methods 
     */
    validateField: (field: string) => boolean;
    /** 
     * Returns batch changes (added, changed, deleted).
     * @group Methods 
     */
    getBatchChanges: () => { addedRecords: TData[]; changedRecords: TData[]; deletedRecords: TData[] };
    /** 
     * Returns changes (Alias for getBatchChanges).
     * @group Methods 
     */
    getChanges: () => { addedRecords: TData[]; changedRecords: TData[]; deletedRecords: TData[] };

    /** 
     * Copies table data to clipboard.
     * @group Methods 
     */
    copyToClipboard: (withHeaders?: boolean) => void;
    /** 
     * Automatically fits columns to content.
     * @group Methods 
     */
    autoFitColumns: () => void;
    /** 
     * Expands all groups.
     * @group Methods 
     */
    expandAllGroups: () => void;
    /** 
     * Collapses all groups.
     * @group Methods 
     */
    collapseAllGroups: () => void;

    /** 
     * Scrolls to a specific row index.
     * @group Methods 
     */
    scrollToIndex: (index: number) => void;
    /** 
     * Forces a re-render of the table.
     * @group Methods 
     */
    forceUpdate: () => void;
    /** 
     * Exports data as CSV.
     * @group Methods 
     */
    exportDataAsCsv: (options?: Record<string, unknown>) => void;
    /** 
     * Sets the filter model programmatically.
     * @group Methods 
     */
    setFilterModel: (model: ColumnFiltersState) => void;
    /** 
     * Sets column visibility programmatically.
     * @group Methods 
     */
    setColumnVisibility: (model: Record<string, boolean>) => void;
}
