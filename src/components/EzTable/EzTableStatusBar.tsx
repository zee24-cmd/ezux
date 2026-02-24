import { memo } from 'react';
import { cn } from '../../lib/utils';
import { Table } from '@tanstack/react-table';

interface EzTableStatusBarProps {
    table: Table<any>;
    selectionInfo?: string;
    rowSelection?: any;
}

export const EzTableStatusBar = memo(({ table, totalRows, selectionInfo, rowSelection }: EzTableStatusBarProps & { totalRows?: number }) => {
    // Robust row count: Use explicit prop if available, otherwise try TanStack models
    const rawRowCount = totalRows ?? (table.getPrePaginationRowModel().rows.length || table.options.rowCount || table.getRowModel().rows.length);
    const rowCount = typeof rawRowCount === 'number' ? rawRowCount : 0;

    // Selection count: Ensure we get a number
    const selectedCount = Object.keys(rowSelection || {}).length;

    return (
        <div className={cn(
            "flex border-t border-border p-2 text-xs text-muted-foreground justify-between bg-muted/30",
            "rounded-b-md"
        )}>
            <div className="flex gap-4 items-center">
                <span>Total: {rowCount} rows</span>
                {selectedCount > 0 && (
                    <span className="text-primary font-medium">
                        {selectedCount} selected
                    </span>
                )}
                {typeof selectionInfo === 'string' && <span>| {selectionInfo}</span>}
            </div>
            <div className="flex gap-2">
                {/* Placeholder for future status icons/info */}
            </div>
        </div>
    );
});

EzTableStatusBar.displayName = 'EzTableStatusBar';
