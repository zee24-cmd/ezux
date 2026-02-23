import React from 'react';
import { Row, Column, Table, RowData, ColumnDef as TanStackColumnDef } from '@tanstack/react-table';
import { FilterSettings, SearchSettings, SortSettings, TextWrapSettings } from './EzTableFilter.types';
import { SelectionSettings, EditSettings } from './EzTableEdit.types';
import { EzTableClassNames, EzTableIcons, EzTableSlots, EzTableLocalization } from './EzTableProps';

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
        classNames?: EzTableClassNames<TData>;
        icons?: EzTableIcons;
        slots?: EzTableSlots<TData>;
        slotProps?: Record<string, unknown>;
        localization?: EzTableLocalization;
        gridLines?: 'Both' | 'Horizontal' | 'Vertical' | 'None';
    }
    interface ColumnMeta<TData extends RowData, TValue> extends EzColumnMeta { }
}

// Re-export TanStack types for consumers
export type ColumnDef<TData, TValue = unknown> = TanStackColumnDef<TData, TValue>;
