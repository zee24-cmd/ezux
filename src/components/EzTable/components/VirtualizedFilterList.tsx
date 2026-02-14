import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Checkbox } from '../../ui/checkbox';

/**
 * Props for the virtualized filter list.
 * @group Models
 */
interface VirtualizedFilterListProps {
    /** Sorted unique values to display. @group Properties */
    sortedUniqueValues: any[];
    /** Set of currently selected values. @group State */
    selectedValues: Set<any> | null;
    /** Handler for selection toggle. @group Events */
    handleSelect: (value: any, checked: boolean) => void;
    /** Optional formatter for display values. @group Methods */
    formatter?: (value: any) => string;
}

/**
 * Renders a high-performance virtualized list of filter values.
 * @group Components
 */
export const VirtualizedFilterList: React.FC<VirtualizedFilterListProps> = React.memo(({
    sortedUniqueValues,
    selectedValues,
    handleSelect,
    formatter
}) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const rowVirtualizer = useVirtualizer({
        count: sortedUniqueValues.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 32,
        overscan: 5,
    });

    return (
        <div ref={parentRef} className="flex-1 overflow-y-auto px-2 pb-2 min-h-0 pt-2">
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const value = sortedUniqueValues[virtualRow.index];
                    const isChecked = selectedValues === null || selectedValues.has(value);
                    const displayValue = formatter ? formatter(value) : (String(value) || '(Empty)');

                    return (
                        <div
                            key={virtualRow.key}
                            className="absolute top-0 left-0 w-full flex items-center space-x-2 px-2 py-1 hover:bg-muted rounded text-sm cursor-pointer"
                            style={{ height: `${virtualRow.size}px`, transform: `translateY(${virtualRow.start}px)` }}
                            onClick={() => handleSelect(value, !isChecked)}
                        >
                            <Checkbox checked={isChecked} onCheckedChange={(c: boolean | "indeterminate") => handleSelect(value, c === true)} />
                            <span className="flex-1 truncate">{displayValue}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

VirtualizedFilterList.displayName = 'VirtualizedFilterList';
