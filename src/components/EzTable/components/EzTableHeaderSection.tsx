import React from 'react';
import { Table } from '@tanstack/react-table';
import { DraggableHeader } from './DraggableHeader';
import { cn } from '../../../lib/utils';
import { flexColumn, borderStyles } from '../../../shared/utils/ezStyleUtils';


interface EzTableHeaderSectionProps<TData extends object> {
    table: Table<TData>;
    enableStickyHeader?: boolean;
    classNames?: { header?: string };
    density?: 'compact' | 'standard' | 'comfortable';
    autoFitColumn: (columnId: string) => void;
    slots?: { header?: React.ComponentType<any> };
    // State props to force re-render when table state changes
    columnPinning?: any;
    columnSizing?: any;
    sorting?: any;
    grouping?: any;
    columnVisibility?: any;
}

export const EzTableHeaderSection = React.memo(_EzTableHeaderSection) as typeof _EzTableHeaderSection;

function _EzTableHeaderSection<TData extends object>({
    table,
    enableStickyHeader,
    classNames,
    density,
    autoFitColumn,
    slots
}: EzTableHeaderSectionProps<TData>) {
    return (
        <div
            className={cn(
                flexColumn,
                "w-full bg-background shadow-sm",
                borderStyles.bottom,
                enableStickyHeader && "sticky top-0 z-20",
                classNames?.header
            )}
            role="rowgroup"
        >
            {table.getHeaderGroups().map((headerGroup: any) => (
                <div
                    key={headerGroup.id}
                    className={cn("flex w-full border-border/50 last:border-0 h-full", borderStyles.bottom)}
                    role="row"
                >

                    {slots?.header ? (
                        <div className="contents">
                            {(() => {
                                const HeaderSlot = slots.header!;
                                return headerGroup.headers.map((header: any) => (
                                    <HeaderSlot key={header.id} header={header} table={table} />
                                ));
                            })()}
                        </div>
                    ) : (
                        headerGroup.headers.map((header: any) => (
                            <DraggableHeader
                                key={header.id}
                                header={header}
                                density={density}
                                onAutoFit={autoFitColumn}
                                columnPinning={table.getState().columnPinning}
                            />
                        ))
                    )}
                </div>
            ))}
        </div>
    );
}
