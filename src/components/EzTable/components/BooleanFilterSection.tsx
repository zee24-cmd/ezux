import React from 'react';
import { Column } from '@tanstack/react-table';
import { BooleanFilter } from '../renderers';

interface BooleanFilterSectionProps {
    column: Column<any, any>;
}

export const BooleanFilterSection: React.FC<BooleanFilterSectionProps> = React.memo(({ column }) => {
    const meta = column.columnDef.meta as any;

    return (
        <div className="p-3 space-y-3">
            <div className="text-sm font-medium">Filter by value:</div>
            <BooleanFilter
                value={(column.getFilterValue() as any) || 'all'}
                onChange={(value: any) => {
                    column.setFilterValue(value);
                }}
                trueLabel={meta?.booleanOptions?.trueLabel}
                falseLabel={meta?.booleanOptions?.falseLabel}
                nullLabel={meta?.booleanOptions?.nullLabel}
            />
        </div>
    );
});

BooleanFilterSection.displayName = 'BooleanFilterSection';
