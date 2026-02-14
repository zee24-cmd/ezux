import { useMemo } from 'react';
import { Table } from '@tanstack/react-table';

/**
 * Calculates CSS variables for column sizes.
 * Optimized to strictly re-calculate only when sizing or visibility changes.
 */
export const useColumnSizeVars = <TData extends object>(table: Table<TData>) => {
    return useMemo(() => {
        const headers = table.getFlatHeaders();
        const colSizes: { [key: string]: number | string } = {};

        for (let i = 0; i < headers.length; i++) {
            const header = headers[i]!;
            colSizes[`--header-${header.id}-size`] = header.getSize();
            colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
        }

        return colSizes as React.CSSProperties;
    }, [
        table.getState().columnSizing,
        table.getState().columnSizingInfo,
        table.getState().columnVisibility, // Added visibility dependency
        table.getFlatHeaders() // This changes when columns structure changes
    ]);
};
