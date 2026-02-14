import { useMemo } from 'react';
import { useVirtualization } from '../../../shared/hooks/useVirtualization';
import { Table } from '@tanstack/react-table';
import { EzTableProps } from '../EzTable.types';

/**
 * Handles table virtualization using the shared useVirtualization hook.
 * Maps table density and column sizes to virtualization parameters.
 *
 * @param props - Table properties of type {@link EzTableProps}
 * @param table - The TanStack Table instance
 * @returns Virtualization state and scroll methods
 * @group Hooks
 */
export const useTableVirtualization = <TData extends object>(
    props: EzTableProps<TData>,
    table: Table<TData>,
    dir: 'ltr' | 'rtl' = 'ltr'
) => {
    const {
        density = 'standard',
        rowHeight,
        estimatedRowHeight,
        enableColumnVirtualization = false
    } = props;

    const { rows } = table.getRowModel();

    // Adjusted heights to match actual rendered size (including padding and borders)
    // Subagent measured 65px for standard (48px min-h + 16px py-2 + 1px border)
    const effectiveRowHeight = useMemo(() => {
        if (rowHeight) return rowHeight;
        if (estimatedRowHeight) return estimatedRowHeight;
        switch (density) {
            case 'compact': return 41;      // 40px + 0px padding + 1px border
            case 'comfortable': return 89;  // 56px + 32px padding + 1px border
            default: return 65;             // 48px + 16px padding + 1px border
        }
    }, [rowHeight, estimatedRowHeight, density]);

    const headerHeight = useMemo(() => {
        switch (density) {
            case 'compact': return 40;
            case 'comfortable': return 56;
            default: return 48;
        }
    }, [density]);

    const virtualization = useVirtualization({
        rowCount: rows.length,
        rowHeight: effectiveRowHeight,
        // Increased overscan for smoother scrolling with large datasets (5K-100K rows)
        overscanCount: props.overscanCount ?? 30,
        columnCount: enableColumnVirtualization ? table.getVisibleLeafColumns().length : 0,
        columnWidth: (index) => table.getVisibleLeafColumns()[index].getSize(),
        enableColumnVirtualization,
        progressiveRendering: props.progressiveRendering ?? false,
        prefetchDistance: props.prefetchDistance ?? 10,
        adaptiveSizing: props.adaptiveSizing,
        id: props.id,
        debug: false,
        languageDirection: dir, // Pass the text direction to handles horizontal RTL
        // When sticky header is enabled, we need to offset the virtualizer's start position.
        // We use the standard header height based on density, falling back to user override.
        scrollPaddingStart: props.enableStickyHeader ? (props.scrollPaddingStart ?? headerHeight) : (props.scrollPaddingStart ?? 0),
        // Ensure the scroll container has proper sizing
        scrollMargin: 0
    });

    const { parentRef, rowVirtualizer, columnVirtualizer, scrollToIndex, scrollToRow, scrollToColumn } = virtualization;

    return {
        /** Reference to the scrollable container. @group Properties */
        parentRef,
        /** Row virtualizer instance. @group Properties */
        rowVirtualizer,
        /** Column virtualizer instance (if enabled). @group Properties */
        columnVirtualizer,
        /** Scroll to a specific item index. @group Methods */
        scrollToIndex,
        /** Scroll to a specific row. @group Methods */
        scrollToRow,
        /** Scroll to a specific column. @group Methods */
        scrollToColumn,
        /** Calculated row height based on density or props. @group Properties */
        effectiveRowHeight
    };
};
