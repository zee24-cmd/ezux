import { memo, useMemo } from 'react';
import { cn } from '../../../lib/utils';
import {
    getDensityClasses
} from '../../../shared/utils/styleUtils';
import { Density } from '../../../shared/types/common';
import { EzContextMenu } from '../../../shared/components/EzContextMenu';
import { EzTableCell } from './EzTableCell';

/**
 * Props for the virtualized row component.
 * @group Models
 */
export interface EzTableRowProps {
    /** Virtual row metadata from the virtualizer. @group Properties */
    virtualRow: any;
    /** The TanStack Row instance. @group Properties */
    row: any;
    /** The TanStack Table instance. @group Properties */
    table: any;
    /** Table density. @group Properties */
    density: any;
    /** Whether context menu is enabled. @group Properties */
    enableContextMenu: boolean;
    /** Handler for context menu item click. @group Events */
    onContextMenuItemClick?: (action: string, row: any) => void;
    /** Helper to check if a cell is selected. @group Methods */
    isCellSelected: (rowIndex: number, colIndex: number) => boolean;
    /** Handler for cell mouse down. @group Events */
    onCellMouseDown: (rowIndex: number, colIndex: number, event: React.MouseEvent) => void;
    /** Handler for cell mouse enter. @group Events */
    onCellMouseEnter: (rowIndex: number, colIndex: number) => void;
    /** Handler for cell click. @group Events */
    onCellClick?: (params: any) => void;
    /** Handler for cell double-click. @group Events */
    onCellDoubleClick?: (params: any) => void;
    /** Currently focused cell coordinates. @group State */
    focusedCell?: { r: number; c: number } | null;
    /** Custom renderer for detail panel. @group Components */
    renderDetailPanel?: (props: any) => React.ReactNode;
    /** Ref callback for measuring the row element. @group Methods */
    measureElement: (el: HTMLElement | null) => void;
    /** Optional column virtualizer instance. @group Properties */
    columnVirtualizer?: any;
    /** Handler for row click. @group Events */
    onRowClick?: (args: any) => void;
    /** Handler for row double-click. @group Events */
    onRowDoubleClick?: (args: any) => void;
    /** Handler for row mouse enter. @group Events */
    onRowMouseEnter?: (index: number, event: React.MouseEvent) => void;
    /** Handler for row mouse leave. @group Events */
    onRowMouseLeave?: (index: number, event: React.MouseEvent) => void;
    /** Current column pinning state. @group Properties */
    columnPinning: any;
    /** Table metadata object (TanStack). @group Properties */
    tableMeta?: any;
}

/**
 * Standardized row component for EzTable, handles virtualization and selection.
 * @group Components
 */
export const EzTableRow = memo(({
    virtualRow,
    row,
    table,
    density,
    enableContextMenu,
    onContextMenuItemClick,
    isCellSelected,
    onCellMouseDown,
    onCellMouseEnter,
    onCellClick,
    onCellDoubleClick,
    focusedCell,
    renderDetailPanel,
    measureElement,
    columnVirtualizer,
    onRowClick,
    onRowDoubleClick,
    onRowMouseEnter,
    onRowMouseLeave,
    columnPinning
}: EzTableRowProps) => {
    // Column Virtualization Handling
    const virtualColumns = columnVirtualizer?.getVirtualItems() || row.getVisibleCells().map((_c: any, index: number) => ({ index }));
    const visibleCells = row.getVisibleCells();

    const { paddingLeft, paddingRight } = useMemo(() => {
        if (!columnVirtualizer || virtualColumns.length === 0) return { paddingLeft: 0, paddingRight: 0 };
        return {
            paddingLeft: virtualColumns[0]?.start || 0,
            paddingRight: columnVirtualizer.getTotalSize() - (virtualColumns[virtualColumns.length - 1]?.end || 0)
        };
    }, [columnVirtualizer, virtualColumns]);

    return (
        <EzContextMenu
            row={row}
            enabled={enableContextMenu}
            onAction={(action: string, data: any) => {
                if (action === 'pin-top') row.pin('top');
                else if (action === 'pin-bottom') row.pin('bottom');
                else if (action === 'unpin') row.pin(false);
                else onContextMenuItemClick?.(action, data);
            }}
        >
            <div
                data-index={virtualRow.index}
                ref={measureElement}
                className="absolute top-0 left-0 w-full flex flex-col group border-b border-border"
                role="row"
                aria-rowindex={virtualRow.index + 1}
                style={{
                    transform: `translateY(${virtualRow.start}px)`,
                    // Use fixed height to prevent jitter from minor layout shifts (e.g. edit inputs)
                    // unless we explicitly expect dynamic height (expanded row or text wrapping)
                    ...(row.getIsExpanded() || visibleCells.some((c: any) => c.column.columnDef.meta?.wrapText)
                        ? { minHeight: `${virtualRow.size}px` }
                        : { height: `${virtualRow.size}px` }),
                }}

                onClick={(e) => onRowClick?.({ row: row.original, data: row.original, rowIndex: row.index, originalEvent: e })}
                onDoubleClick={(e) => onRowDoubleClick?.({ row: row.original, data: row.original, rowIndex: row.index, originalEvent: e })}
                onMouseEnter={(e) => onRowMouseEnter?.(row.index, e)}
                onMouseLeave={(e) => onRowMouseLeave?.(row.index, e)}
            >
                <div className={cn(
                    "flex items-stretch w-full min-w-max hover:bg-muted/50 transition-[background-color] duration-200",
                    row.getIsSelected() && "bg-muted",
                    getDensityClasses(density as Density),
                    typeof table.options.meta?.classNames?.row === 'function' ? table.options.meta.classNames.row(row) : table.options.meta?.classNames?.row
                )}>
                    {paddingLeft > 0 && <div style={{ flex: `0 0 ${paddingLeft}px` }} />}
                    {virtualColumns.map((virtualColumn: any) => {
                        const cell = visibleCells[virtualColumn.index];
                        if (!cell) return null;
                        return (
                            <EzTableCell
                                key={cell.id}
                                cell={cell}
                                virtualRowIndex={virtualRow.index}
                                cellIndex={virtualColumn.index}
                                density={density}
                                isPinned={cell.column.getIsPinned()}
                                isSelected={isCellSelected(virtualRow.index, virtualColumn.index)}
                                isFocused={focusedCell?.r === virtualRow.index && focusedCell?.c === virtualColumn.index}
                                onCellMouseDown={(rid, cid, e) => onCellMouseDown(rid, cid, e)}
                                onCellMouseEnter={onCellMouseEnter}
                                onCellClick={onCellClick}
                                onCellDoubleClick={onCellDoubleClick}
                                tableMeta={table.options.meta}
                                rowDepth={row.depth}
                                renderDetailPanel={renderDetailPanel}
                                isFirstColumn={virtualColumn.index === 0}
                                table={table}
                                columnPinning={columnPinning}
                            />
                        );
                    })}
                    {paddingRight > 0 && <div style={{ flex: `0 0 ${paddingRight}px` }} />}
                </div>
                {row.getIsExpanded() && renderDetailPanel && (
                    <div className="w-full bg-muted/30 border-t border-border">
                        {renderDetailPanel({ row })}
                    </div>
                )}
            </div>
        </EzContextMenu>
    );
});

EzTableRow.displayName = 'EzTableRow';
