import React, { memo, useCallback, useMemo } from 'react';
import { Header, flexRender } from '@tanstack/react-table';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { cn } from '../../../lib/utils';
import {
    getDensityClass
} from '../../../shared/utils/ezStyleUtils';
import { PinnedPosition, getPinnedStyles, getPinnedClasses } from '../../../shared/utils/styleUtils';

import { EzExcelFilter } from '../EzExcelFilter';
import { EzHeaderContextMenu } from '../EzHeaderContextMenu';

interface DraggableHeaderProps {
    header: Header<any, any>;
    density?: string;
    onAutoFit?: (id: string) => void;
    columnPinning?: any;
}

export const DraggableHeader = memo(({ header, density, onAutoFit, columnPinning }: DraggableHeaderProps) => {
    const { attributes, listeners, setNodeRef: setDraggableRef, isDragging } = useDraggable({
        id: header.column.id,
        disabled: !header.column.getCanGroup() || header.isPlaceholder,
        data: {
            type: 'column',
            columnId: header.column.id,
        }
    });

    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: `header-${header.column.id}`,
        disabled: !header.column.getCanGroup() || header.isPlaceholder,
        data: {
            type: 'header',
            columnId: header.column.id,
        }
    });

    const isPinned = header.column.getIsPinned();
    const pinnedStyles = useMemo(() => {
        if (!isPinned) return {};
        const position = isPinned === 'right' ? header.column.getAfter('right') : header.column.getStart('left');
        const meta = header.getContext().table.options.meta as any;
        return getPinnedStyles(isPinned as PinnedPosition, position, meta?.dir);
    }, [isPinned, header.column, columnPinning]);

    const lastClickTimeRef = React.useRef(0);
    const handleResizerMouseDown = useCallback((e: React.MouseEvent) => {
        const now = Date.now();
        if (now - lastClickTimeRef.current < 300) {
            onAutoFit?.(header.column.id);
        }
        lastClickTimeRef.current = now;
        header.getResizeHandler()(e as any);
    }, [header, onAutoFit]);

    const align = header.column.columnDef.meta?.align || 'left';
    const gridLines = header.column.columnDef.meta?.gridLines || header.getContext().table.options.meta?.gridLines;

    const meta = header.getContext().table.options.meta as any;
    const isColumnFocused = meta?.focusedCell?.c === header.index;

    const content = (
        <div
            ref={(node) => {
                setDraggableRef(node);
                setDroppableRef(node);
            }}
            className={cn(
                "relative h-full font-semibold text-foreground flex items-center select-none group/header transition-all flex-shrink-0 px-4",
                meta?.dir === 'rtl' ? "border-l border-border/50" : "border-r border-border/50",
                getDensityClass(density as any),
                isDragging && "opacity-50 bg-muted",
                isOver && "ring-2 ring-inset ring-primary bg-accent/50",
                header.column.getIsGrouped() && "bg-accent/30",
                isColumnFocused && "bg-primary/5 text-primary border-b-2 border-primary",
                // Alignment
                align === 'center' && "justify-center text-center",
                align === 'right' && "justify-end text-right",
                // Pinned Classes (Shadows, background)
                getPinnedClasses(isPinned),
                // Grid Lines
                (gridLines === 'Both' || gridLines === 'Vertical') && (meta?.dir === 'rtl' ? "border-l border-border" : "border-r border-border")
            )}
            style={{
                width: `calc(var(--header-${header.id}-size) * 1px)`,
                minWidth: (header.column.columnDef.minSize ?? 0) > 0 ? header.column.columnDef.minSize : undefined,
                maxWidth: (header.column.columnDef.maxSize ?? 0) > 0 && header.column.columnDef.maxSize !== Number.MAX_SAFE_INTEGER ? header.column.columnDef.maxSize : undefined,
                ...pinnedStyles
            }}
            role="columnheader"
            aria-colindex={header.index + 1}
            aria-sort={header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : 'none'}
        >
            <div className={cn(
                "flex items-center w-full h-full gap-2",
                align === 'center' && "justify-center relative",
                align === 'right' && "justify-end"
            )}>
                {header.column.getCanGroup() && !header.isPlaceholder && (
                    <div {...attributes} {...listeners} className={cn(
                        "cursor-grab active:cursor-grabbing p-1 text-zinc-400 opacity-0 group-hover/header:opacity-100 transition-opacity",
                        align === 'center'
                            ? (meta?.dir === 'rtl' ? "absolute right-1 top-1/2 -translate-y-1/2" : "absolute left-1 top-1/2 -translate-y-1/2")
                            : (meta?.dir === 'rtl' ? "-mr-2 ml-1" : "-ml-2 mr-1")
                    )}>
                        <GripVertical className="w-3.5 h-3.5" />
                    </div>
                )}

                <div
                    className={cn(
                        "flex items-center min-w-0 gap-2 cursor-pointer group h-full select-none",
                        align === 'center' && "justify-center",
                        align === 'right' && "justify-end",
                        header.column.getCanSort() ? "hover:text-foreground/80" : "",
                        (align !== 'center' && align !== 'right') && "flex-1"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                    tabIndex={header.column.getCanSort() ? 0 : -1}
                    role="button"
                    aria-label={`Sort by ${header.column.columnDef.header as string}`}
                >
                    {align === 'center' && header.column.getIsSorted() && (
                        <div className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    )}
                    <span className="truncate min-w-0">
                        {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    {header.column.getIsSorted() === 'asc' && <ArrowUp className="w-4 h-4 text-foreground flex-shrink-0" />}
                    {header.column.getIsSorted() === 'desc' && <ArrowDown className="w-4 h-4 text-foreground flex-shrink-0" />}
                </div>
                {!header.isPlaceholder && header.column.getCanFilter() && (
                    <div className={cn(
                        meta?.dir === 'rtl' ? "ml-2" : "mr-2",
                        align === 'center' && (meta?.dir === 'rtl' ? "absolute left-1 top-1/2 -translate-y-1/2 ml-0" : "absolute right-1 top-1/2 -translate-y-1/2 mr-0")
                    )}>
                        <EzExcelFilter column={header.column} table={header.getContext().table as any} />
                    </div>
                )}
            </div>
            {
                header.column.getCanResize() && (
                    <div
                        onMouseDown={handleResizerMouseDown}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                            "absolute top-0 h-full w-4 cursor-col-resize hover:bg-primary/10 touch-none select-none z-30 transition-colors",
                            meta?.dir === 'rtl' ? "left-0" : "right-0",
                            header.column.getIsResizing() ? "bg-primary w-1" : ""
                        )}
                        role="separator"
                    />
                )
            }
        </div >
    );

    if (header.column.getCanPin()) {
        return <EzHeaderContextMenu header={header}>{content}</EzHeaderContextMenu>;
    }
    return content;
});

DraggableHeader.displayName = 'DraggableHeader';
