import { useState, useCallback, useEffect } from 'react';
import { Table } from '@tanstack/react-table';
import { EzTableProps } from '../EzTable.types';

/**
 * Handles selection logic for EzTable, including range selection.
 * Integrates with TanStack table's selection state for row selection.
 * 
 * @param props - Table properties of type {@link EzTableProps}
 * @param table - The TanStack Table instance
 * @returns Selection state and event handlers
 * @group Hooks
 */
export const useTableSelection = <TData extends object>(
    props: EzTableProps<TData>,
    table: Table<TData>
) => {
    const { enableRangeSelection = false } = props;
    const { rows } = table.getRowModel();

    // Range selection state (cell-based)
    const [rangeSelection, setRangeSelection] = useState<{
        start: { r: number, c: number },
        end: { r: number, c: number }
    } | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);

    const onCellMouseDown = useCallback((rowIndex: number, colIndex: number) => {
        if (!enableRangeSelection) return;
        setIsSelecting(true);
        setRangeSelection({
            start: { r: rowIndex, c: colIndex },
            end: { r: rowIndex, c: colIndex }
        });
    }, [enableRangeSelection]);

    const onCellMouseEnter = useCallback((rowIndex: number, colIndex: number) => {
        if (!enableRangeSelection || !isSelecting) return;
        setRangeSelection(prev => prev ? { ...prev, end: { r: rowIndex, c: colIndex } } : null);
    }, [enableRangeSelection, isSelecting]);

    useEffect(() => {
        if (!enableRangeSelection) return;
        const handleMouseUp = () => setIsSelecting(false);
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, [enableRangeSelection]);

    /**
     * Imperatively selects a range of rows.
     */
    const selectRowByRange = useCallback((startIndex: number, endIndex: number) => {
        const newSelection: Record<string, boolean> = {};
        const [min, max] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];

        for (let i = min; i <= max; i++) {
            const row = rows[i];
            if (row) newSelection[row.id] = true;
        }
        table.setRowSelection(prev => ({ ...prev, ...newSelection }));
    }, [rows, table]);

    return {
        /** Cell-based range selection state. @group State */
        rangeSelection,
        /** Handler for mouse down event on a cell. @group Events */
        onCellMouseDown,
        /** Handler for mouse enter event on a cell. @group Events */
        onCellMouseEnter,
        /** Imperatively select a range of rows. @group Methods */
        selectRowByRange,
        /** Whether a selection operation is currently active. @group State */
        isSelecting
    };
};
