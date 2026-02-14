import { useCallback } from 'react';

interface CellEventHandlers {
    table: any;
    editSettings: any;
    toggleRowEditing: (rowIndex: number, editing?: boolean) => void;
    onRowClickProp?: (args: any) => void;
    onRowDoubleClickProp?: (args: any) => void;
    onCellClickProp?: (args: any) => void;
    onCellDoubleClickProp?: (args: any) => void;
}

export const useCellEventHandlers = ({
    table,
    editSettings,
    toggleRowEditing,
    onRowClickProp,
    onRowDoubleClickProp,
    onCellClickProp,
    onCellDoubleClickProp
}: CellEventHandlers) => {
    const handleCellEvent = useCallback((args: any, eventType: 'click' | 'dblclick') => {
        const meta = table.options.meta;

        // Set focused cell
        if (meta?.setFocusedCell) {
            const colIndex = args.colIndex ?? table.getVisibleLeafColumns().findIndex((col: any) => col.id === args.columnId);
            if (colIndex !== -1) {
                meta.setFocusedCell({ r: args.rowIndex, c: colIndex });
            }
        }

        // Handle double-click editing
        if (eventType === 'dblclick' && editSettings?.allowEditing && editSettings?.allowEditOnDblClick !== false) {
            toggleRowEditing(args.rowIndex, true);
        }

        // Call appropriate event handler (prefer cell-level handlers, fallback to row-level)
        const handler = eventType === 'click'
            ? (onCellClickProp ?? onRowClickProp)
            : (onCellDoubleClickProp ?? onRowDoubleClickProp);
        handler?.(args);
    }, [table, editSettings, toggleRowEditing, onRowClickProp, onRowDoubleClickProp]);

    return {
        onRowClick: (args: any) => handleCellEvent(args, 'click'),
        onRowDoubleClick: (args: any) => handleCellEvent(args, 'dblclick'),
        onCellClick: (args: any) => handleCellEvent(args, 'click'),
        onCellDoubleClick: (args: any) => handleCellEvent(args, 'dblclick')
    };
};