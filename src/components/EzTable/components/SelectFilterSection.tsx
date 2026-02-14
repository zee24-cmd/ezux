import React from 'react';
import { Column } from '@tanstack/react-table';
import { SelectFilter } from '../renderers';

/**
 * Props for the select filter section.
 * @group Models
 */
interface SelectFilterSectionProps {
    /** The TanStack Column instance. @group Properties */
    column: Column<any, any>;
    /** All available unique values for selection. @group Properties */
    allAvailableValues: any[];
}

/**
 * Renders a multi-select filter list for a column.
 * @group Components
 */
export const SelectFilterSection: React.FC<SelectFilterSectionProps> = React.memo(({
    column,
    allAvailableValues
}) => (
    <div className="p-1">
        <SelectFilter
            options={allAvailableValues.map(v => ({ value: String(v), label: String(v) }))}
            selectedValues={Array.isArray(column.getFilterValue()) ? (column.getFilterValue() as string[]) : []}
            onChange={(values: string[]) => {
                column.setFilterValue(values.length > 0 ? values : undefined);
            }}
        />
    </div>
));

SelectFilterSection.displayName = 'SelectFilterSection';
