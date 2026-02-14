import { SharedBaseProps } from '../../shared/types/BaseProps';
import { RowData, ColumnDef as TanStackColumnDef, RowSelectionState, GroupingState, Row, SortingState, ColumnFiltersState, PaginationState, TableState } from '@tanstack/react-table';
export type FilterOperator = 'contains' | 'doesNotContain' | 'shouldContain' | 'equals' | 'doesNotEqual' | 'notEquals' | 'startsWith' | 'endsWith' | 'empty' | 'notEmpty' | 'gt' | 'greaterThan' | 'lt' | 'lessThan' | 'gte' | 'greaterThanOrEqual' | 'lte' | 'lessThanOrEqual' | 'between';
export type FilterRule = {
    id: string;
    field: string;
    operator: FilterOperator;
    value: any;
};
export type FilterGroup = {
    id: string;
    logic: 'AND' | 'OR';
    filters: (FilterRule | FilterGroup)[];
};
export type EzGlobalFilterState = string | {
    quickSearch?: string;
    advanced?: FilterGroup;
};
export type EzColumnMeta = {
    filterVariant?: 'text' | 'range' | 'select';
    align?: 'left' | 'center' | 'right';
    icon?: React.ReactNode;
    wrapText?: boolean;
};
declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
        editingRows?: Record<string, boolean>;
        toggleRowEditing?: (rowIndex: number, editing?: boolean) => void;
        focusedCell?: {
            r: number;
            c: number;
        } | null;
        setFocusedCell?: (cell: {
            r: number;
            c: number;
        } | null) => void;
        navigateFocus?: (dr: number, dc: number) => void;
        enableEditing?: boolean;
        isRowEditable?: (row: TData) => boolean;
        isCellEditable?: (row: TData, columnId: string) => boolean;
    }
    interface ColumnMeta<TData extends RowData, TValue> extends EzColumnMeta {
    }
}
export type ColumnDef<TData, TValue = unknown> = TanStackColumnDef<TData, TValue>;
export interface EzTableProps<TData extends object> extends SharedBaseProps {
    data: TData[];
    columns: ColumnDef<TData>[];
    /**
     * Estimated row height for virtualization.
     * Default: 48
     */
    estimatedRowHeight?: number;
    /**
     * Total expected rows if knowing beforehand (for server-side cases later).
     */
    rowCount?: number;
    /**
     * Pagination Configuration
     */
    pagination?: boolean;
    pageSize?: number;
    manualPagination?: boolean;
    pageCount?: number;
    onPaginationChange?: (pagination: PaginationState) => void;
    /**
     * Selection Configuration
     */
    enableRowSelection?: boolean;
    onRowSelectionChange?: (selection: RowSelectionState) => void;
    /**
     * Filtering Configuration
     */
    enableColumnFiltering?: boolean;
    manualFiltering?: boolean;
    onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
    onGlobalFilterChange?: (filter: EzGlobalFilterState) => void;
    /**
     * Grouping Configuration (Phase 2)
     */
    enableGrouping?: boolean;
    defaultGrouping?: GroupingState;
    onGroupingChange?: (grouping: GroupingState) => void;
    /**
     * Sorting Configuration
     */
    manualSorting?: boolean;
    onSortingChange?: (sorting: SortingState) => void;
    /**
     * Editing Configuration (Phase 2)
     */
    enableEditing?: boolean;
    onDataChange?: (data: TData[]) => void;
    isCellEditable?: (row: TData, columnId: string) => boolean;
    isRowEditable?: (row: TData) => boolean;
    /**
     * Tree Data Configuration (Phase 2)
     */
    enableTreeData?: boolean;
    getSubRows?: (originalRow: TData) => TData[] | undefined;
    /**
     * Pivoting Configuration (Phase 2)
     * Note: TanStack's pivoting is largely an extension of grouping + aggregation
     */
    enablePivoting?: boolean;
    /**
     * Export Configuration (Phase 4)
     */
    enableExport?: boolean;
    onExport?: (type: 'csv' | 'excel') => void;
    enableContextMenu?: boolean;
    onContextMenuItemClick?: (action: string, row: TData) => void;
    enableRangeSelection?: boolean;
    enableRowPinning?: boolean;
    enableAdvancedFiltering?: boolean;
    renderDetailPanel?: (props: {
        row: Row<TData>;
    }) => React.ReactNode;
    enableStickyHeader?: boolean;
    enableStickyPagination?: boolean;
    enableChangeTracking?: boolean;
    enableColumnPinning?: boolean;
    enablePersistence?: boolean;
    persistenceKey?: string;
    density?: 'compact' | 'standard' | 'comfortable';
    isLoading?: boolean;
    renderNoRowsOverlay?: () => React.ReactNode;
    onCellClick?: (params: {
        row: TData;
        columnId: string;
        cellValue: any;
        event: React.MouseEvent;
    }) => void;
    onCellDoubleClick?: (params: {
        row: TData;
        columnId: string;
        cellValue: any;
        event: React.MouseEvent;
    }) => void;
    state?: Partial<TableState>;
}
