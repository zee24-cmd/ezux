import { memo } from 'react';
import { cn } from '../../lib/utils';

interface EzTableStatusBarProps {
    table: any;
    selectionInfo?: string;
}

export const EzTableStatusBar = memo(({ table, selectionInfo }: EzTableStatusBarProps) => {
    const rowCount = table.getPrePaginationRowModel().rows.length;
    const selectedCount = Object.keys(table.getState().rowSelection).length;

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
                {selectionInfo && <span>| {selectionInfo}</span>}
            </div>
            <div className="flex gap-2">
                {/* Placeholder for future status icons/info */}
            </div>
        </div>
    );
});

EzTableStatusBar.displayName = 'EzTableStatusBar';
