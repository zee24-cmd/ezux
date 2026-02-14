import { useState, useCallback } from 'react';

/**
 * useFilterSelection - Shared hook for managing multi-select sets in filters.
 * Handles "(Select All)", individual selection, and bulk selection.
 */
export function useFilterSelection(
    initialValues: any[] | null,
    allAvailableValues: any[]
) {
    const [selectedValues, setSelectedValues] = useState<Set<any> | null>(() => {
        if (Array.isArray(initialValues)) {
            return new Set(initialValues);
        }
        return null;
    });

    const isAllSelected = selectedValues === null;

    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            setSelectedValues(null);
        } else {
            setSelectedValues(new Set());
        }
    }, []);

    const handleSelect = useCallback((value: any, checked: boolean) => {
        setSelectedValues((prev) => {
            if (prev === null) {
                if (checked) return null;
                const newSet = new Set(allAvailableValues);
                newSet.delete(value);
                return newSet;
            }
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(value);
                if (newSet.size === allAvailableValues.length) return null;
            } else {
                newSet.delete(value);
            }
            return newSet;
        });
    }, [allAvailableValues]);

    const handleBulkSelect = useCallback((values: any[], checked: boolean) => {
        setSelectedValues((prev) => {
            const currentSelected = prev || new Set(allAvailableValues);
            const newSet = new Set(currentSelected);

            if (checked) {
                values.forEach(v => newSet.add(v));
                if (newSet.size === allAvailableValues.length) return null;
            } else {
                values.forEach(v => newSet.delete(v));
            }
            return newSet;
        });
    }, [allAvailableValues]);

    const clearSelection = useCallback(() => {
        setSelectedValues(null);
    }, []);

    return {
        selectedValues,
        isAllSelected,
        handleSelectAll,
        handleSelect,
        handleBulkSelect,
        clearSelection
    };
}
