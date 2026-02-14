import React from 'react';
import { Row, Table } from '@tanstack/react-table';
import { EzTableOverlays } from '../EzTableOverlays';
import { EzTableRow } from './EzTableRow';
import { cn } from '../../../lib/utils';

/**
 * Props for the body section of EzTable.
 * @group Models
 */
interface EzTableBodySectionProps<TData extends object> {
    /** The TanStack Table instance. @group Properties */
    table: Table<TData>;
    /** List of TanStack Row instances to render. @group Properties */
    rows: Row<TData>[];
    /** Row virtualizer instance. @group Properties */
    rowVirtualizer: any;
    /** Optional column virtualizer instance. @group Properties */
    columnVirtualizer?: any;
    /** Table density. @group Properties */
    density?: 'compact' | 'standard' | 'comfortable';
    /** Custom class names for the body. @group Properties */
    classNames?: { body?: string };
    /** Whether the table is in a loading state. @group Properties */
    isLoading?: boolean;
    /** Whether infinite scroll is enabled. @group Properties */
    enableInfiniteScroll?: boolean;
    /** Whether the table is in a pending/filtering state. @group Properties */
    isPending?: boolean;
    /** Custom renderer for "no rows" overlay. @group Components */
    renderNoRowsOverlay?: () => React.ReactNode;
    /** Custom slots for overriding body components. @group Components */
    slots?: any;
    /** Localization strings. @group Properties */
    localization?: any;
    /** Whether context menu is enabled. @group Properties */
    enableContextMenu?: boolean;
    /** Handler for context menu item click. @group Events */
    onContextMenuItemClick?: (action: string, row: TData) => void;
    /** Helper to check if a cell is currently selected. @group Methods */
    isCellSelected: (rowIndex: number, colIndex: number) => boolean;
    /** Currently focused cell coordinates. @group State */
    focusedCell?: { r: number; c: number } | null;
    /** Handler for cell mouse down. @group Events */
    onCellMouseDown: (rowIndex: number, colIndex: number, event: React.MouseEvent) => void;
    /** Handler for cell mouse enter. @group Events */
    onCellMouseEnter: (rowIndex: number, colIndex: number) => void;
    /** Handler for cell click. @group Events */
    onCellClick?: (params: any) => void;
    /** Handler for cell double-click. @group Events */
    onCellDoubleClick?: (params: any) => void;
    /** Custom renderer for row detail panel. @group Components */
    renderDetailPanel?: (props: { row: Row<TData> }) => React.ReactNode;
    /** Handler for row click. @group Events */
    onRowClick?: (args: any) => void;
    /** Handler for row double-click. @group Events */
    /** Handler for row double-click. @group Events */
    onRowDoubleClick?: (args: any) => void;
    /** Table metadata object (TanStack). @group Properties */
    tableMeta?: any;
}

/**
 * Renders the main body section of EzTable with virtualization and overlay support.
 * @group Components
 */
export function EzTableBodySection<TData extends object>({
    table,
    rows,
    rowVirtualizer,
    columnVirtualizer,
    density,
    classNames,
    isLoading,
    enableInfiniteScroll,
    isPending,
    renderNoRowsOverlay,
    slots,
    localization,
    enableContextMenu,
    onContextMenuItemClick,
    isCellSelected,
    focusedCell,
    onCellMouseDown,
    onCellMouseEnter,
    onCellClick,
    onCellDoubleClick,
    renderDetailPanel,
    onRowClick,
    onRowDoubleClick
}: EzTableBodySectionProps<TData>) {
    // Only show blocking overlay if NOT infinite scrolling
    const showBlockingOverlay = !!((isLoading || isPending) && !enableInfiniteScroll);

    return (
        <div
            className={cn("relative w-full", classNames?.body)}
            style={{
                height: `${rowVirtualizer?.getTotalSize() ?? 0}px`,
                minHeight: '0',
                flexShrink: '0'
            }}
        >
            <EzTableOverlays
                isLoading={showBlockingOverlay}
                rowCount={rows.length}
                renderNoRowsOverlay={renderNoRowsOverlay}
                slots={slots}
                localization={localization}
            />

            {rowVirtualizer?.getVirtualItems().map((virtualRow: any) => {
                const row = rows[virtualRow.index];
                return (
                    <EzTableRow
                        key={row.id}
                        virtualRow={virtualRow}
                        row={row}
                        table={table}
                        density={density}
                        enableContextMenu={!!enableContextMenu}
                        onContextMenuItemClick={onContextMenuItemClick}
                        isCellSelected={isCellSelected}
                        focusedCell={focusedCell}
                        onCellMouseDown={onCellMouseDown}
                        onCellMouseEnter={onCellMouseEnter}
                        onCellClick={onCellClick}
                        onCellDoubleClick={onCellDoubleClick}
                        renderDetailPanel={renderDetailPanel}
                        measureElement={rowVirtualizer.measureElement}
                        columnVirtualizer={columnVirtualizer}
                        onRowClick={onRowClick}
                        onRowDoubleClick={onRowDoubleClick}
                        columnPinning={table.getState().columnPinning}
                        tableMeta={table.options.meta}
                    />
                );
            })}
        </div>
    );
}
