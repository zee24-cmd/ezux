import { useState, useEffect, useMemo } from "react";
import { useTableConfig } from "./context/TableConfigContext";

/**
 * SmartCell - The central dispatcher for table cell rendering and editing.
 * Implements IoC by:
 * 1. Prioritizing column-level overrides (meta.Cell/Editor).
 * 2. Falling back to the TableConfig-provided default renderers.
 */
export const SmartCell = ({
    getValue,
    row,
    column,
    table,
}: any) => {
    const { renderers } = useTableConfig();
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);
    const meta = column.columnDef.meta;
    const columnType = meta?.columnType || 'text';

    // Editing State Resolution
    const isRowEditable = table.options.meta?.isRowEditable ? table.options.meta.isRowEditable(row.original) : true;
    const isCellEditable = table.options.meta?.isCellEditable ? table.options.meta.isCellEditable(row.original, column.id) : true;
    const isColumnEditable = column.columnDef.enableEditing !== false;

    const isGlobalEditing = table.options.meta?.enableEditing || false;
    const isRowInEditMode = table.options.meta?.editingRows?.[row.index] || false;

    // Fix: Only show Editor if the specific row is in edit mode
    // This prevents all 1000+ rows from rendering as heavy editors simultaneously
    const isEditing = isGlobalEditing && isRowInEditMode && isRowEditable && isCellEditable && isColumnEditable;

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value);
    };

    const onChange = (newValue: any) => {
        setValue(newValue);
        if (columnType === 'boolean' || columnType === 'select') {
            table.options.meta?.updateData(row.index, column.id, newValue);
        }
    };

    // Memoize commonProps to prevent unnecessary re-renders
    // Extract only specific meta properties needed instead of depending on entire table object
    // This prevents re-renders when table.options.meta changes reference
    const commonProps = useMemo(() => ({
        getValue,
        row,
        column,
        enableEditing: table.options.meta?.enableEditing,
        isCellEditable: table.options.meta?.isCellEditable,
        value,
        onChange,
        onBlur,
        columnType,

        meta,
        isFocused: table.options.meta?.focusedCell?.r === row.index &&
            table.options.meta?.focusedCell?.c === table.getVisibleLeafColumns().findIndex((c: any) => c.id === column.id)
    }), [getValue, row, column, value, columnType, meta, onChange, onBlur, table.options.meta?.focusedCell, table.getVisibleLeafColumns]);

    // 1. Handle Editing Mode
    if (isEditing) {
        if (meta?.Editor) {
            const Editor = meta.Editor;
            return <Editor {...commonProps} />;
        }

        const config = renderers[columnType];
        if (config?.Editor) {
            const Editor = config.Editor;
            // Inject type-specific options
            const extraProps = {
                ...(columnType === 'boolean' ? meta?.booleanOptions : {}),
                ...(columnType === 'select' ? meta?.selectOptions : {})
            };
            return <Editor {...commonProps} {...extraProps} />;
        }
    }

    // 2. Handle Display Mode

    // Column-level override
    if (meta?.Cell) {
        const CustomCell = meta.Cell;
        return <CustomCell {...commonProps} />;
    }

    // Default renderer lookup from Config (IoC)
    const config = renderers[columnType] || renderers.text;
    const Cell = config.Cell;
    const extraProps = {
        ...(columnType === 'boolean' ? meta?.booleanOptions : {}),
        ...(columnType === 'longtext' ? meta?.longTextOptions : {}),
        ...(columnType === 'number' ? meta?.numberOptions : {}),
        ...(columnType === 'date' ? meta?.dateOptions : {}),
        ...(columnType === 'datetime' ? meta?.dateTimeOptions : {}),
        ...(columnType === 'select' ? meta?.selectOptions : {}),
        ...(columnType === 'progress' || columnType === 'chart' || columnType === 'sparkline' ? meta?.chartOptions : {})
    };

    return <Cell {...commonProps} {...extraProps} />;
};
