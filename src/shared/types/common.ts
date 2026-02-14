/**
 * Shared type definitions used across components
 */

/**
 * Common class names for component styling
 */
export interface ComponentClassNames {
    root?: string;
    header?: string;
    body?: string;
    footer?: string;
    toolbar?: string;
    row?: string | ((row: any) => string);
    cell?: string | ((cell: any) => string);
}

/**
 * Common slots for component customization
 */
export interface ComponentSlots<TData = any> {
    header?: React.ComponentType<{ data?: TData;[key: string]: any }>;
    footer?: React.ComponentType<{ data?: TData;[key: string]: any }>;
    toolbar?: React.ComponentType<{ data?: TData;[key: string]: any }>;
    noData?: React.ComponentType<{ [key: string]: any }>;
    loading?: React.ComponentType<{ [key: string]: any }>;
}

/**
 * Common localization strings
 */
export interface ComponentLocalization {
    noData?: string;
    loading?: string;
    search?: string;
    filter?: string;
    sort?: string;
    export?: string;
    print?: string;
    refresh?: string;
    add?: string;
    edit?: string;
    delete?: string;
    save?: string;
    cancel?: string;
    selectAll?: string;
    clearSelection?: string;
    [key: string]: string | undefined;
}

/**
 * Common density options
 */
export type Density = 'compact' | 'standard' | 'comfortable';

/**
 * Common alignment options
 */
export type Alignment = 'left' | 'center' | 'right';

/**
 * Common pinned positions
 */
export type PinnedPosition = 'left' | 'right' | false;

/**
 * Common sort direction
 */
export type SortDirection = 'asc' | 'desc' | false;

/**
 * Common filter operator
 */
export type FilterOperator =
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'notContains'
    | 'startsWith'
    | 'endsWith'
    | 'greaterThan'
    | 'lessThan'
    | 'greaterThanOrEqual'
    | 'lessThanOrEqual'
    | 'between'
    | 'in'
    | 'notIn';

/**
 * Common filter model
 */
export interface FilterModel {
    field: string;
    operator: FilterOperator;
    value: any;
    condition?: 'and' | 'or';
}

/**
 * Common sort model
 */
export interface SortModel {
    field: string;
    direction: SortDirection;
}

/**
 * Common pagination model
 */
export interface PaginationModel {
    pageIndex: number;
    pageSize: number;
    totalRows?: number;
}

/**
 * Common selection model
 */
export interface SelectionModel {
    selectedIds: (string | number)[];
    mode?: 'single' | 'multiple';
}

/**
 * Common edit mode
 */
export type EditMode = 'inline' | 'dialog' | 'batch';

/**
 * Common edit settings
 */
export interface EditSettings {
    mode?: EditMode;
    allowAdding?: boolean;
    allowEditing?: boolean;
    allowDeleting?: boolean;
    showDeleteConfirm?: boolean;
}

/**
 * Common validation result
 */
export interface ValidationResult {
    isValid: boolean;
    errors?: Record<string, string>;
}

/**
 * Common event callback types
 * Contains ONLY events that are truly shared across components with identical signatures.
 * Component-specific events (onCellClick, onRowClick, etc) should be defined in each component's types.
 */
export interface ComponentEventCallbacks<TData = any> {
    // Lifecycle Events (truly universal)
    /** 
     * Callback when component is created.
     * @group Events 
     */
    onCreated?: () => void;
    /** 
     * Callback when component is destroyed.
     * @group Events 
     */
    onDestroyed?: () => void;

    // Render Lifecycle (Grid/Component Render)
    /** 
     * Callback when grid/component render starts.
     * @group Events 
     */
    onGridRenderStart?: () => void;
    /** 
     * Callback when grid/component render completes.
     * @group Events 
     */
    onGridRenderComplete?: () => void;

    // Data Events (shared interface)
    /** 
     * Callback when data changes.
     * @group Events 
     */
    onDataChange?: (data: TData[]) => void;
    /** 
     * Callback when data loads.
     * @group Events 
     */
    onDataLoad?: (data: TData[]) => void;
    /** 
     * Callback when data is requested.
     * @group Events 
     */
    onDataRequest?: (query: any) => void;
    /** 
     * Callback when data change starts.
     * @group Events 
     */
    onDataChangeStart?: (args: { action: 'add' | 'edit' | 'delete'; data: TData | TData[] }) => void;
    /** 
     * Callback when data change completes.
     * @group Events 
     */
    onDataChangeComplete?: (args: { action: 'add' | 'edit' | 'delete'; data: TData | TData[] }) => void;
    /** 
     * Callback when data change is cancelled.
     * @group Events 
     */
    onDataChangeCancel?: (args: { action: 'add' | 'edit' | 'delete'; row?: any }) => void;
    /** 
     * Callback when data change is requested.
     * @group Events 
     */
    onDataChangeRequest?: (args: { action: 'add' | 'edit' | 'delete'; data: TData }) => void;
    /** 
     * Callback on error.
     * @group Events 
     */
    onError?: (error: any) => void;
    /** 
     * Callback on refresh.
     * @group Events 
     */
    onRefresh?: () => void;
}

/**
 * Common export options
 */
export interface ExportOptions {
    filename?: string;
    format?: 'csv' | 'excel' | 'pdf';
    includeHeaders?: boolean;
    selectedOnly?: boolean;
}

/**
 * Common clipboard data
 */
export interface ClipboardData<TData = any> {
    data: TData;
    action: 'copy' | 'cut';
    timestamp: number;
}

/**
 * Common drag and drop data
 */
export interface DragDropData<TData = any> {
    item: TData;
    sourceIndex: number;
    targetIndex?: number;
    position?: 'before' | 'after' | 'inside';
}

/**
 * Common context menu item
 */
export interface ContextMenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    separator?: boolean;
    children?: ContextMenuItem[];
    onClick?: () => void;
}

/**
 * Common keyboard shortcut
 */
export interface KeyboardShortcut {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    handler: (event: KeyboardEvent) => void;
}

/**
 * Common theme configuration
 */
export interface ThemeConfig {
    mode?: 'light' | 'dark' | 'system';
    primaryColor?: string;
    accentColor?: string;
    borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Common responsive breakpoints
 */
export interface ResponsiveBreakpoints {
    mobile: number;
    tablet: number;
    desktop: number;
    wide: number;
}

/**
 * Common viewport state
 */
export interface ViewportState {
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}
