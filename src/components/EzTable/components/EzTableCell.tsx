import React, { memo, useMemo } from 'react';
import { flexRender } from '@tanstack/react-table';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import {
    getDensityClasses,
    getAlignmentClasses,
    getPinnedClasses,
    getPinnedStyles,
    getSelectionClasses,
    getTextOverflowClasses,
    combineStyleClasses,
    getGridLinesClasses
} from '../../../shared/utils/styleUtils';
import { TooltipWrapper } from '../../../shared/components/TooltipWrapper';
import { Density, PinnedPosition } from '../../../shared/types/common';
import { TruncatedTooltip } from '../utils/TruncatedTooltip';

/**
 * Props for the granular cell component.
 * @group Models
 */
export interface EzTableCellProps {
    /** The TanStack Cell instance. @group Properties */
    cell: any;
    /** The virtual row index. @group Properties */
    virtualRowIndex: number;
    /** The index of the cell in the row. @group Properties */
    cellIndex: number;
    /** Current pinning state of the column. @group Properties */
    isPinned: any;
    /** Whether the cell is currently selected. @group State */
    isSelected: boolean;
    /** Whether the cell has focus. @group State */
    isFocused: boolean;
    /** Table density. @group Properties */
    density: any;
    /** Handler for cell mouse down. @group Events */
    onCellMouseDown: (rowIndex: number, colIndex: number, event: React.MouseEvent) => void;
    /** Handler for cell mouse enter. @group Events */
    onCellMouseEnter: (rowIndex: number, colIndex: number) => void;
    /** Handler for cell click. @group Events */
    onCellClick?: (params: any) => void;
    /** Handler for cell double-click. @group Events */
    onCellDoubleClick?: (params: any) => void;
    /** Table metadata object (TanStack). @group Properties */
    tableMeta: any;
    /** Row nesting depth. @group Properties */
    rowDepth: number;
    /** Custom renderer for detail panel. @group Components */
    renderDetailPanel?: (props: any) => React.ReactNode;
    /** Whether this is the first visible column. @group Properties */
    isFirstColumn: boolean;
    /** Current column pinning state. @group Properties */
    columnPinning: any;
    /** The TanStack Table instance. @group Properties */
    table?: any;
}

/**
 * Highly optimized component for rendering a single table cell.
 * @group Components
 */
export const EzTableCell = memo(({
    cell,
    virtualRowIndex,
    cellIndex,
    isPinned,
    isSelected,
    isFocused,
    density,
    onCellMouseDown,
    onCellMouseEnter,
    onCellClick,
    onCellDoubleClick,
    tableMeta,
    rowDepth,
    renderDetailPanel,
    isFirstColumn,
    columnPinning
}: EzTableCellProps) => {
    const cellStyle = useMemo(() => {
        return {
            width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
            minWidth: (cell.column.columnDef.minSize ?? 0) > 0 ? cell.column.columnDef.minSize : undefined,
            maxWidth: (cell.column.columnDef.maxSize ?? 0) > 0 && cell.column.columnDef.maxSize !== Number.MAX_SAFE_INTEGER ? cell.column.columnDef.maxSize : undefined,
            ...getPinnedStyles(isPinned as PinnedPosition, isPinned === 'right' ? cell.column.getAfter('right') : cell.column.getStart('left'), tableMeta?.dir),
            paddingLeft: (tableMeta?.dir !== 'rtl' && (cell.column.id === 'firstName' || cell.column.id === 'name' || cell.column.id === 'id'))
                ? `${rowDepth * 20 + 16}px`
                : undefined,
            paddingRight: (tableMeta?.dir === 'rtl' && (cell.column.id === 'firstName' || cell.column.id === 'name' || cell.column.id === 'id'))
                ? `${rowDepth * 20 + 16}px`
                : undefined
        };
    }, [cell.column.id, isPinned, rowDepth, columnPinning]);


    const content = (
        <>
            {cell.getIsGrouped() ? (
                <span className="font-semibold">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    <span className="text-muted-foreground font-normal ml-1">({cell.row.subRows.length})</span>
                </span>
            ) : cell.getIsAggregated() ? (
                <span className={cn(
                    "font-medium tabular-nums",
                    tableMeta?.enableGroupFooters && "text-primary/80 bg-primary/5 px-2 py-0.5 rounded"
                )}>
                    {flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext())}
                </span>
            ) : cell.getIsPlaceholder() ? (
                null
            ) : (
                flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
        </>
    );

    const clipMode = cell.column.columnDef.meta?.clipMode;

    // Excel-like focus border style: use box-shadow to avoid layout shifts and ensure it overlaps grid lines
    // We use ONLY inset shadows to ensure the outer dimensions of the cell (and thus the row height) NEVER change.
    // Validation Logic
    const validationResult = useMemo(() => {
        // Only show validation errors if a save has been attempted
        if (!tableMeta?.validate || !tableMeta?.validationAttempted) return { isValid: true };

        const fieldName = cell.column.id;
        const value = cell.getValue();
        const data = cell.row.original;
        return tableMeta.validate(fieldName, value, data);
    }, [tableMeta, cell, virtualRowIndex, cell.getValue()]);

    const focusStyle = isFocused ? {
        boxShadow: !validationResult.isValid
            ? 'inset 0 0 0 2px hsl(var(--destructive))'
            : 'inset 0 0 0 2px hsl(var(--primary))',
        zIndex: 20,
        position: 'relative' as const
    } : {};

    return (
        <div
            onMouseDown={(e) => {
                if (e.button === 0) {
                    onCellMouseDown(virtualRowIndex, cellIndex, e);
                    tableMeta?.setFocusedCell?.({ r: virtualRowIndex, c: cellIndex });
                }
            }}
            onMouseEnter={() => onCellMouseEnter(virtualRowIndex, cellIndex)}
            onClick={(e) => {
                onCellClick?.({ row: cell.row.original, columnId: cell.column.id, cellValue: cell.getValue(), event: e, rowIndex: virtualRowIndex, colIndex: cellIndex });

                // Excel-like: If already focused, single click enters edit mode
                if (isFocused && tableMeta?.toggleRowEditing && !tableMeta?.editingRows?.[virtualRowIndex]) {
                    tableMeta.toggleRowEditing(virtualRowIndex, true);
                }
            }}
            onDoubleClick={(e) => onCellDoubleClick?.({ row: cell.row.original, columnId: cell.column.id, cellValue: cell.getValue(), event: e, rowIndex: virtualRowIndex, colIndex: cellIndex })}
            className={combineStyleClasses(
                "px-4 text-sm text-foreground flex select-none min-h-full min-w-0 flex-shrink-0 relative",
                isFocused && "z-20",
                isFocused && validationResult.isValid && "bg-primary/5",
                isFocused && !validationResult.isValid && "bg-destructive/5",
                !validationResult.isValid && "ring-1 ring-inset ring-destructive",
                !isFocused && (tableMeta?.dir === 'rtl' ? "border-l border-border/50" : "border-r border-border/50"),
                cell.column.columnDef.meta?.wrapText ? "items-start pt-3" : "items-center",
                getDensityClasses(density as Density),
                getSelectionClasses(isSelected, isFocused),
                getAlignmentClasses(cell.column.columnDef.meta?.align, tableMeta?.dir),
                getTextOverflowClasses(cell.column.columnDef.meta?.wrapText ? 'wrap' : (clipMode === 'ellipsis-tooltip' ? 'ellipsis' : 'truncate'), clipMode === 'ellipsis-tooltip'),
                getPinnedClasses(isPinned as PinnedPosition, tableMeta?.dir),
                !isFocused && getGridLinesClasses(cell.column.columnDef.meta?.gridLines as any || tableMeta?.gridLines as any, undefined, tableMeta?.dir),
                typeof tableMeta?.classNames?.cell === 'function' ? tableMeta.classNames.cell(cell) : tableMeta?.classNames?.cell
            )}
            style={{ ...cellStyle as React.CSSProperties, ...focusStyle }}
            role="cell"
            data-column-id={cell.column.id}
        >
            {(cell.getIsGrouped() || (cell.row.getCanExpand() && isFirstColumn) || (renderDetailPanel && isFirstColumn)) ? (
                <button
                    className={cn(
                        tableMeta?.dir === 'rtl' ? "ml-2" : "mr-2",
                        "p-1 hover:bg-muted rounded transition-transform",
                        !cell.row.getCanExpand() && !renderDetailPanel && "invisible"
                    )}
                    onClick={(e) => { e.stopPropagation(); cell.row.getToggleExpandedHandler()(); }}
                >
                    {cell.row.getIsExpanded() ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
            ) : null}

            {
                !validationResult.isValid ? (
                    <div className="flex-1 min-w-0">
                        <TooltipWrapper
                            enabled={true}
                            side={tableMeta?.dir === 'rtl' ? "left" : "right"}
                            className="bg-destructive text-destructive-foreground border-destructive/20 shadow-xl z-50"
                            content={
                                <>
                                    <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-80">Validation Error</p>
                                    <p className="text-xs font-medium">{validationResult.error}</p>
                                </>
                            }
                        >
                            <div className="w-full h-full flex items-center">
                                {content}
                            </div>
                        </TooltipWrapper>
                    </div>
                ) : clipMode === 'ellipsis-tooltip' ? (
                    <div className="flex-1 min-w-0">
                        <TruncatedTooltip text={typeof cell.getValue() === 'string' ? cell.getValue() as string : undefined}>
                            {content}
                        </TruncatedTooltip>
                    </div>
                ) : content
            }
        </div >
    );
});

EzTableCell.displayName = 'EzTableCell';
