import { useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import { getTextWidth } from '../utils/TextMeasurer';
import { formatNumber, formatDate } from '../../../shared/utils/formatUtils';

export const useAutoFit = <TData extends object>(table: Table<TData>) => {
    const autoFitColumn = useCallback((columnId: string) => {
        const column = table.getColumn(columnId);
        if (!column) return;

        const rows = table.getRowModel().rows;
        // Sample up to 50 rows for performance
        const sampleRows = rows.slice(0, 50);

        // Font approximation - ideally should match exact table styling
        const bodyFont = '14px Inter, sans-serif';
        const headerFont = '600 14px Inter, sans-serif';
        const meta = column.columnDef.meta;

        let maxWidth = 0;

        // 1. Measure Header
        const headerText = typeof column.columnDef.header === 'string'
            ? column.columnDef.header
            : columnId;
        maxWidth = Math.max(maxWidth, getTextWidth(headerText, headerFont));

        // 2. Measure Cells
        sampleRows.forEach(row => {
            let cellValue = row.getValue(columnId);

            if (meta?.columnType === 'number') {
                cellValue = formatNumber(cellValue as any, meta.numberOptions);
            } else if (meta?.columnType === 'date') {
                cellValue = formatDate(cellValue as any, meta.dateOptions as any);
            } else if (meta?.columnType === 'datetime') {
                cellValue = formatDate(cellValue as any, meta.dateTimeOptions as any);
            }

            const text = cellValue !== null && cellValue !== undefined ? String(cellValue) : '';

            // Handle longtext preview length if applicable
            if (meta?.columnType === 'longtext' && meta?.longTextOptions?.previewLength) {
                const trunc = text.length > meta.longTextOptions.previewLength
                    ? text.substring(0, meta.longTextOptions.previewLength) + '...'
                    : text;
                maxWidth = Math.max(maxWidth, getTextWidth(trunc, bodyFont));
            } else {
                maxWidth = Math.max(maxWidth, getTextWidth(text, bodyFont));
            }
        });

        // 3. Add Padding & Icon Space
        // Padding: 32px (16px * 2)
        // Icons: Grip (20px), Sort (20px), Filter (20px) = 60px
        // Total Buffer: 100px roughly for safe breathing room
        const finalWidth = Math.ceil(maxWidth + 100);

        // 4. Update Table State
        table.setColumnSizing(old => ({
            ...old,
            [columnId]: finalWidth
        }));
    }, [table]);

    return { autoFitColumn };
};
