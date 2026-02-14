import React, { useMemo, useState, useEffect } from 'react';
import { Column, Table } from '@tanstack/react-table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { detectColumnType } from './utils/columnTypeDetector';
import { cn } from '../../lib/utils';
import { formatNumber } from '../../shared/utils/formatUtils';
import { useFilterSelection } from './hooks/useFilterSelection';
import { SelectAllCheckbox } from './components/SelectAllCheckbox';
import { BooleanFilterSection } from './components/BooleanFilterSection';
import { SelectFilterSection } from './components/SelectFilterSection';
import { VirtualizedFilterList } from './components/VirtualizedFilterList';
import { FilterActionButtons } from './components/FilterActionButtons';
import { ListFilter, Search, ChevronRight, ChevronLeft, Pin, PinOff, Loader2 } from 'lucide-react';
import { EzDateFilterTree } from './EzDateFilterTree';
import { AdvancedColumnFilter } from './components/AdvancedColumnFilter';

interface EzExcelFilterProps<TData, TValue> {
    column: Column<TData, TValue>;
    table: Table<TData>;
}

export function EzExcelFilter<TData, TValue>({ column, table }: EzExcelFilterProps<TData, TValue>) {
    const [isOpen, setIsOpen] = useState(false);
    const meta = table.options.meta as any;
    const containerRef = meta?.containerRef;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div
                    className={cn(
                        "ml-1 cursor-pointer p-1 rounded hover:bg-muted transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        column.getIsFiltered() ? "bg-primary/10" : ""
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <ListFilter className={cn(
                        "w-4 h-4",
                        column.getIsFiltered() ? "text-primary fill-primary" : "text-muted-foreground"
                    )} />
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-[280px] p-0"
                align="start"
                container={containerRef?.current}
                collisionBoundary={containerRef?.current}
            >
                {isOpen && <FilterContent column={column} table={table} setIsOpen={setIsOpen} filterValue={column.getFilterValue()} />}
            </PopoverContent>
        </Popover>
    );
}

const DATE_COLUMN_TYPES = ['date', 'datetime'] as const;
const BOOLEAN_COLUMN_TYPES = ['boolean'] as const;
const SELECT_COLUMN_TYPES = ['select'] as const;

const FilterContent = React.memo(({ column, table, setIsOpen, filterValue }: { column: Column<any, any>; table: Table<any>; setIsOpen: (o: boolean) => void; filterValue: any }) => {
    const [view, setView] = useState<'list' | 'filters'>('list');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [uniqueValues, setUniqueValues] = useState<Map<any, number>>(new Map());
    const [allAvailableValues, setAllAvailableValues] = useState<any[]>([]);

    const meta = table.options.meta as any;
    const containerRef = meta?.containerRef;

    // Use containerRef if available, otherwise fallback to the ID we added
    const containerElement = containerRef?.current || (typeof document !== 'undefined' ? document.getElementById('ez-table-default') : null);

    const containerHeight = containerElement?.clientHeight ?? 500;
    const dynamicMaxHeight = Math.min(500, containerHeight > 100 ? containerHeight - 40 : 500);

    useEffect(() => {
        const searchTimer = setTimeout(() => setDebouncedSearch(search), 200);
        const dataTimer = setTimeout(() => {
            const values = column.getFacetedUniqueValues();
            setUniqueValues(values);
            setAllAvailableValues(Array.from(values.keys()));
            setIsLoading(false);
        }, 50);

        return () => {
            clearTimeout(searchTimer);
            clearTimeout(dataTimer);
        };
    }, [search, column]);

    const {
        selectedValues,
        handleSelectAll,
        handleSelect,
        handleBulkSelect,
        clearSelection
    } = useFilterSelection(
        filterValue as any[] | null,
        allAvailableValues
    );

    const columnType = useMemo(() => {
        const metaCol = column.columnDef.meta as any;
        if (metaCol?.columnType) return metaCol.columnType;
        if (allAvailableValues.length === 0) return 'text';
        return detectColumnType(allAvailableValues);
    }, [column.columnDef.meta, allAvailableValues]);

    const isDateColumn = DATE_COLUMN_TYPES.includes(columnType as any);
    const isBooleanColumn = BOOLEAN_COLUMN_TYPES.includes(columnType as any);
    const isSelectColumn = SELECT_COLUMN_TYPES.includes(columnType as any);

    const sortedUniqueValues = useMemo(() => {
        const values = [...allAvailableValues].sort((a, b) => {
            if (a === b) return 0;
            if (a === null || a === undefined) return -1;
            if (b === null || b === undefined) return 1;

            // Fast numeric vs string check
            const aStr = String(a);
            const bStr = String(b);
            return aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: 'base' });
        });

        if (!debouncedSearch) return values;
        const lowSearch = debouncedSearch.toLowerCase();
        return values.filter(v => String(v).toLowerCase().includes(lowSearch));
    }, [allAvailableValues, debouncedSearch]);

    const applyFilter = () => {
        if (view === 'filters') {
            setIsOpen(false);
            return;
        }

        let finalValues: any[] | undefined;
        if (selectedValues === null) {
            finalValues = debouncedSearch ? sortedUniqueValues : undefined;
        } else {
            finalValues = Array.from(selectedValues);
        }
        column.setFilterValue(finalValues?.length === 0 ? undefined : finalValues);
        setIsOpen(false);
    };

    const handleClear = () => {
        if (view === 'filters') {
            column.setFilterValue(undefined);
            setIsOpen(false);
            return;
        }
        clearSelection();
        setSearch('');
    };

    const currentFilter = filterValue;
    const isAdvanced = currentFilter && typeof currentFilter === 'object' && !Array.isArray(currentFilter);

    const handleAdvancedChange = (val: any) => {
        column.setFilterValue(val);
        // We don't close the popover immediately to allow the user to see/change AND/OR
    };

    const isAllVisibleSelected = useMemo(() => {
        if (selectedValues === null) return true;
        return sortedUniqueValues.length > 0 && sortedUniqueValues.every(v => selectedValues.has(v));
    }, [selectedValues, sortedUniqueValues]);

    const isSomeVisibleSelected = useMemo(() => {
        if (selectedValues === null) return sortedUniqueValues.length > 0;
        return sortedUniqueValues.some(v => selectedValues.has(v));
    }, [selectedValues, sortedUniqueValues]);

    const handleToggleAllVisible = (checked: boolean) => {
        if (!debouncedSearch) {
            handleSelectAll(checked);
        } else {
            handleBulkSelect(sortedUniqueValues, checked);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[300px] flex flex-col items-center justify-center space-y-3 bg-popover text-popover-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground animate-pulse font-medium">Calculating filter values...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-0 overflow-hidden" style={{ maxHeight: `${dynamicMaxHeight}px` }}>
            {view === 'filters' ? (
                <div className="flex flex-col animate-in fade-in slide-in-from-right-2 duration-200">
                    <div className="p-3 border-b flex items-center space-x-2 bg-muted/30">
                        <Button variant="ghost" size="sm" onClick={() => setView('list')} className="h-6 w-6 p-0">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold text-sm capitalize">{columnType} Filters</span>
                    </div>
                    <div className="flex-1 overflow-y-auto min-h-0">
                        <AdvancedColumnFilter
                            columnType={columnType}
                            columnId={column.id}
                            value={isAdvanced ? currentFilter : undefined}
                            onChange={handleAdvancedChange}
                        />
                    </div>
                    <FilterActionButtons
                        onClear={handleClear}
                        onApply={applyFilter}
                        className="border-t mt-auto"
                    />
                </div>
            ) : (
                <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-200 flex-1 min-h-0">
                    {column.getCanPin() && (
                        <div className="p-1 border-b border-border space-y-0.5">
                            {['left', 'right'].map(pos => column.getIsPinned() !== pos && (
                                <div key={pos} className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium cursor-pointer hover:bg-muted rounded" onClick={() => { column.pin(pos as any); setIsOpen(false); }}>
                                    <Pin className={cn("w-3.5 h-3.5", pos === 'left' ? "rotate-[-45deg]" : "rotate-[45deg]")} /> Pin to {pos.charAt(0).toUpperCase() + pos.slice(1)}
                                </div>
                            ))}
                            {column.getIsPinned() && (
                                <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-red-500 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 rounded" onClick={() => { column.pin(false); setIsOpen(false); }}>
                                    <PinOff className="w-3.5 h-3.5" /> Unpin Column
                                </div>
                            )}
                        </div>
                    )}

                    {!isBooleanColumn && !isSelectColumn && (
                        <div className="p-2 border-b border-border flex justify-between items-center cursor-pointer hover:bg-muted/50 transition group" onClick={() => setView('filters')}>
                            <span className="text-sm font-medium capitalize">{columnType} Filters</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                        </div>
                    )}

                    <div className="flex flex-col flex-1 overflow-hidden min-h-0">
                        {isBooleanColumn ? (
                            <BooleanFilterSection column={column} />
                        ) : isSelectColumn ? (
                            <SelectFilterSection column={column} allAvailableValues={allAvailableValues} />
                        ) : (
                            <div className="flex flex-col flex-1 min-h-0 pointer-events-auto">
                                <div className="sticky top-0 bg-popover text-popover-foreground border-b z-20">
                                    <div className="p-2">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="pl-9 h-9"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <SelectAllCheckbox
                                        checked={isAllVisibleSelected}
                                        indeterminate={isSomeVisibleSelected && !isAllVisibleSelected}
                                        onSelectAll={handleToggleAllVisible}
                                        showSearchResults={!!debouncedSearch}
                                    />
                                </div>

                                {isDateColumn ? (
                                    <div className="flex-1 overflow-y-auto px-2 pb-2 min-h-0 pt-2">
                                        <EzDateFilterTree uniqueValues={uniqueValues} selectedValues={selectedValues} onBulkSelect={handleBulkSelect} />
                                    </div>
                                ) : (
                                    <VirtualizedFilterList
                                        sortedUniqueValues={sortedUniqueValues}
                                        selectedValues={selectedValues}
                                        handleSelect={handleSelect}
                                        formatter={(val) => {
                                            const meta = column.columnDef.meta as any;
                                            if (meta?.columnType === 'number') {
                                                if (meta?.numberOptions?.format === 'currency') {
                                                    return formatNumber(val, { format: 'currency', ...meta.numberOptions });
                                                }
                                                if (meta?.numberOptions?.format === 'percentage') {
                                                    return formatNumber(val, { format: 'percentage', ...meta.numberOptions });
                                                }
                                                if (meta?.numberOptions?.format === 'float' || meta?.numberOptions?.format === 'integer') {
                                                    return formatNumber(val, { format: meta.numberOptions.format, ...meta.numberOptions });
                                                }
                                            }
                                            return String(val);
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                    <FilterActionButtons onClear={handleClear} onApply={applyFilter} />
                </div>
            )}
        </div>
    );
});

FilterContent.displayName = 'FilterContent';

