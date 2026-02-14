import { flexRender } from '@tanstack/react-table';
import { cn } from '../../lib/utils';

interface EzTableFooterProps {
    table: any;
    columnVirtualizer: any;
    density: string;
}

export const EzTableFooter = ({ table, columnVirtualizer, density }: EzTableFooterProps) => {
    const footerGroups = table.getFooterGroups();
    if (footerGroups.length === 0) return null;

    // Column Virtualization Handling
    const virtualFooters = columnVirtualizer?.getVirtualItems() || table.getVisibleLeafColumns().map((_c: any, index: number) => ({ index }));
    const fPaddingLeft = columnVirtualizer?.getVirtualItems()[0]?.start || 0;
    const fPaddingRight = columnVirtualizer
        ? columnVirtualizer.getTotalSize() - (columnVirtualizer.getVirtualItems()[columnVirtualizer.getVirtualItems().length - 1]?.end || 0)
        : 0;

    return (
        <>
            {footerGroups.map((footerGroup: any) => (
                <div
                    key={footerGroup.id}
                    className={cn(
                        "flex w-full border-t border-border bg-background/95 backdrop-blur-sm font-bold z-20",
                        "sticky bottom-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
                    )}
                    role="rowgroup"
                >
                    {fPaddingLeft > 0 && <div style={{ flex: `0 0 ${fPaddingLeft}px` }} />}
                    {virtualFooters.map((virtualColumn: any) => {
                        const footer = footerGroup.headers[virtualColumn.index];
                        // Safety check: skip if footer is undefined (can happen with column virtualization and grouped columns)
                        if (!footer) return null;

                        const meta = table.options.meta;
                        return (
                            <div
                                key={footer.id}
                                className={cn(
                                    "px-4 flex items-center",
                                    meta?.dir === 'rtl' ? "border-l border-border/50" : "border-r border-border/50",
                                    density === 'compact' && "py-2 text-xs",
                                    density === 'standard' && "py-4 text-sm",
                                    density === 'comfortable' && "py-6 text-base",
                                    (footer.column.columnDef.meta?.align === 'right' || (meta?.dir === 'rtl' && !footer.column.columnDef.meta?.align)) && "justify-end text-right",
                                    footer.column.columnDef.meta?.align === 'center' && "justify-center text-center",
                                    (footer.column.columnDef.meta?.align === 'left' || (!footer.column.columnDef.meta?.align && meta?.dir !== 'rtl')) && "justify-start text-left"
                                )}
                                style={{
                                    width: footer.getSize(),
                                    flex: `0 0 ${footer.getSize()}px`,
                                }}
                                role="cell"
                            >
                                {footer.isPlaceholder ? null : flexRender(footer.column.columnDef.footer, footer.getContext())}
                            </div>
                        );
                    })}
                    {fPaddingRight > 0 && <div style={{ flex: `0 0 ${fPaddingRight}px` }} />}
                </div>
            ))}
        </>
    );
};

EzTableFooter.displayName = 'EzTableFooter';
