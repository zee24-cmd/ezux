import { Row } from '@tanstack/react-table';
import { EzGlobalFilterState, FilterRule } from './EzTable.types';
import { isFilterGroup } from './utils/filterTypeGuards';
import { checkRule as sharedCheckRule, checkGroup as sharedCheckGroup } from '../../shared/utils/commonUtils';

export const advancedFilterFn = <TData>(
    row: Row<TData>,
    _columnId: string, // Unused but part of signature
    filterValue: EzGlobalFilterState
): boolean => {
    // 1. Handle simple string search (Default behavior)
    if (typeof filterValue === 'string') {
        if (!filterValue) return true;
        const search = filterValue.toLowerCase();
        return row.getAllCells().some(cell => {
            const val = cell.getValue();
            return String(val ?? '').toLowerCase().includes(search);
        });
    }

    // 2. Handle Structured Object
    const { quickSearch, advanced } = filterValue;

    // Quick Search Check first (AND logic with Advanced)
    if (quickSearch) {
        const search = quickSearch.toLowerCase();
        const matchesSearch = row.getAllCells().some(cell => {
            const val = cell.getValue();
            return String(val ?? '').toLowerCase().includes(search);
        });
        if (!matchesSearch) return false;
    }

    // Advanced Filter Check (Recursive)
    if (advanced) {
        if (!sharedCheckGroup(advanced, (field) => row.getValue(field))) return false;
    }

    return true;
};

export const smartColumnFilterFn = <TData>(
    row: Row<TData>,
    columnId: string,
    filterValue: any
): boolean => {
    try {
        // 1. Array (Checkbox / Facet Selection)
        if (Array.isArray(filterValue)) {
            if (filterValue.length === 0) return true;
            const cellValue = row.getValue(columnId);
            return filterValue.includes(cellValue);
        }

        if (typeof filterValue === 'object' && filterValue !== null) {
            // 2. Filter Group (Nested logic AND/OR)
            if (isFilterGroup(filterValue)) {
                return sharedCheckGroup(filterValue, (field) => row.getValue(field || columnId));
            }

            // 3. Structured Object { value, operator }
            if ('operator' in filterValue) {
                const rule: FilterRule = {
                    kind: 'rule',
                    id: columnId,
                    field: columnId,
                    operator: filterValue.operator,
                    value: filterValue.value
                };
                return sharedCheckRule(rule, (field) => row.getValue(field));
            }
        }

        // 3. Primitive (Default String Search)
        const cellValue = row.getValue(columnId);
        const valStr = String(cellValue ?? '').toLowerCase();
        const filterStr = String(filterValue ?? '').toLowerCase();
        return valStr.includes(filterStr);

    } catch (e) {
        console.error(`Error in smartColumnFilterFn for column ${columnId}:`, e);
        return true; // Fail safe
    }
};
