import { useState, useEffect } from "react";
import { Input } from "../ui/input";

export const EditableCell = ({
    getValue,
    row,
    column,
    table,
}: any) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);

    const isRowEditable = table.options.meta?.isRowEditable ? table.options.meta.isRowEditable(row.original) : true;
    const isCellEditable = table.options.meta?.isCellEditable ? table.options.meta.isCellEditable(row.original, column.id) : true;
    const isGlobalEditing = table.options.meta?.enableEditing || false;
    const isRowInEditMode = table.options.meta?.editingRows?.[row.index] || false;

    const canEdit = isGlobalEditing && isRowEditable && isCellEditable;
    const isEditing = (canEdit || isRowInEditMode) && isRowEditable && isCellEditable;

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    if (!isEditing) {
        return <span className="px-2">{value as string}</span>;
    }

    return (
        <Input
            value={value as string}
            onChange={e => setValue(e.target.value)}
            onBlur={onBlur}
            autoFocus
            className="h-8 w-full border-none shadow-none focus-visible:ring-1 bg-background px-2"
            onClick={(e) => e.stopPropagation()}
        />
    );
};
