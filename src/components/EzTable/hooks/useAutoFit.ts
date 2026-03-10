import { useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import { getTextWidth } from '../utils/TextMeasurer';
import { formatNumber, formatDate } from '../../../shared/utils/formatUtils';
import { calculateColWidth } from '../utils/SizingUtils';

export const useAutoFit = <TData extends object>(table: Table<TData>) => {
    const autoFitColumn = useCallback((columnId: string) => {
        const column = table.getColumn(columnId);
        if (!column) return;

        const rows = table.getRowModel().rows;
        // Sample up to 50 rows for performance
        const sampleRows = rows.slice(0, 50);

        // Font approximation - ideally should match exact table styling
        const bodyFontOpts = { fontSize: '14px', fontWeight: '400', fontFamily: 'Inter, sans-serif' };
        const headerFontOpts = { fontSize: '14px', fontWeight: '600', fontFamily: 'Inter, sans-serif' };
        const meta = column.columnDef.meta;

        let maxCalculatedWidth = 0;

        // 1. Measure Header
        const headerText = typeof column.columnDef.header === 'string'
            ? column.columnDef.header
            : columnId;

        maxCalculatedWidth = Math.max(maxCalculatedWidth, calculateColWidth(headerText, { ...headerFontOpts }));

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
            let measureText = text;
            if (meta?.columnType === 'longtext' && meta?.longTextOptions?.previewLength) {
                measureText = text.length > meta.longTextOptions.previewLength
                    ? text.substring(0, meta.longTextOptions.previewLength) + '...'
                    : text;
            }

            // For cells, we don't need the icon buffer, but we need padding
            const textWidth = getTextWidth(measureText, `${bodyFontOpts.fontWeight} ${bodyFontOpts.fontSize} ${bodyFontOpts.fontFamily}`);
            maxCalculatedWidth = Math.max(maxCalculatedWidth, textWidth + 32); // padding
        });

        // 3. Update Table State
        table.setColumnSizing(old => ({
            ...old,
            [columnId]: maxCalculatedWidth
        }));
    }, [table]);

    return { autoFitColumn };
};
