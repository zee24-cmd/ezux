import React, { useMemo, useCallback } from 'react';
import { FilterGroup, FilterRule, FilterOperator } from './EzTable.types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';
import { TrashIcon } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { FILTER_OPERATORS } from './constants/filterOptions';
import { FilterRuleSelect } from './components/FilterRuleSelect';
import { isFilterGroup } from './utils/filterTypeGuards';

const generateId = () => Math.random().toString(36).substring(2, 9);

interface EzFilterBuilderProps {
    filter: FilterGroup;
    columns: ColumnDef<any>[];
    onChange: (filter: FilterGroup) => void;
    depth?: number;
    onRemove?: () => void;
}

const FilterRuleRow = React.memo(({
    rule,
    fields,
    onUpdate,
    onRemove
}: {
    rule: FilterRule;
    fields: { id: string; label: string }[];
    onUpdate: (rule: FilterRule) => void;
    onRemove: () => void;
}) => {
    const operatorOptions = useMemo(() => FILTER_OPERATORS.map(op => ({ value: op.value, label: op.label })), []);

    return (
        <div className="flex items-center gap-2 pl-2">
            <FilterRuleSelect
                value={rule.field}
                onChange={(val) => onUpdate({ ...rule, field: val })}
                options={fields.map(f => ({ value: f.id, label: f.label }))}
                placeholder="Field"
                className="h-7 text-xs w-[120px]"
            />

            <FilterRuleSelect
                value={rule.operator}
                onChange={(val) => onUpdate({ ...rule, operator: val as FilterOperator })}
                options={operatorOptions}
                placeholder="Op"
                className="h-7 text-xs w-[100px]"
            />

            {!['empty', 'notEmpty'].includes(rule.operator) && (
                <Input
                    value={rule.value}
                    onChange={(e) => onUpdate({ ...rule, value: e.target.value })}
                    className="h-7 text-xs w-[120px]"
                    placeholder="Value..."
                />
            )}

            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={onRemove}
            >
                <TrashIcon className="w-3 h-3" />
            </Button>
        </div>
    );
});

FilterRuleRow.displayName = 'FilterRuleRow';

export const EzFilterBuilder: React.FC<EzFilterBuilderProps> = React.memo(({
    filter,
    columns,
    onChange,
    depth = 0,
    onRemove
}) => {
    const fields = useMemo(() => columns.map((col: ColumnDef<any>) => {
        const id = col.id || (col as any).accessorKey;
        const label = typeof col.header === 'string' ? col.header : id;
        return { id, label: String(label) };
    }).filter(f => f.id), [columns]);

    const addRule = useCallback(() => {
        const newRule: FilterRule = {
            kind: 'rule',
            id: generateId(),
            field: fields[0]?.id || '',
            operator: 'contains',
            value: ''
        };
        onChange({
            ...filter,
            filters: [...filter.filters, newRule]
        });
    }, [filter, onChange, fields]);

    const addGroup = useCallback(() => {
        const newGroup: FilterGroup = {
            kind: 'group',
            id: generateId(),
            logic: 'AND',
            filters: []
        };
        onChange({
            ...filter,
            filters: [...filter.filters, newGroup]
        });
    }, [filter, onChange]);

    const removeFilter = useCallback((index: number) => {
        const newFilters = [...filter.filters];
        newFilters.splice(index, 1);
        onChange({ ...filter, filters: newFilters });
    }, [filter, onChange]);

    const updateFilter = useCallback((index: number, newFilter: FilterRule | FilterGroup) => {
        const newFilters = [...filter.filters];
        newFilters[index] = newFilter;
        onChange({ ...filter, filters: newFilters });
    }, [filter, onChange]);

    const toggleLogic = useCallback(() => {
        const newLogic = filter.logic === 'AND' ? 'OR' : 'AND';
        onChange({ ...filter, logic: newLogic });
    }, [filter, onChange]);

    return (
        <div className={cn("flex flex-col gap-2 p-3 border rounded-md bg-muted/20", depth > 0 && "ml-4 border-l-4 border-l-primary/50")}>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLogic}
                    className="w-16 font-bold text-xs h-7"
                >
                    {filter.logic}
                </Button>

                <span className="text-xs text-muted-foreground flex-1">
                    {depth === 0 ? "Root Group" : "Nested Group"}
                </span>

                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addRule} title="Add Rule">
                    <span className="text-lg">+</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addGroup} title="Add Group">
                    <span className="font-bold text-xs">( )</span>
                </Button>

                {depth > 0 && onRemove && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600" onClick={onRemove}>
                        <span className="text-lg">×</span>
                    </Button>
                )}
            </div>

            <div className="flex flex-col gap-2 mt-1">
                {filter.filters.length === 0 && (
                    <div className="text-xs text-muted-foreground italic px-2">No filters defined.</div>
                )}
                {filter.filters.map((f: FilterRule | FilterGroup, i: number) => {
                    if (isFilterGroup(f)) {
                        return (
                            <EzFilterBuilder
                                key={f.id}
                                filter={f as FilterGroup}
                                columns={columns}
                                onChange={(updatedGroup: FilterGroup) => updateFilter(i, updatedGroup)}
                                depth={depth + 1}
                                onRemove={() => removeFilter(i)}
                            />
                        );
                    }

                    return (
                        <FilterRuleRow
                            key={f.id}
                            rule={f as FilterRule}
                            fields={fields}
                            onUpdate={(updatedRule) => updateFilter(i, updatedRule)}
                            onRemove={() => removeFilter(i)}
                        />
                    );
                })}
            </div>
        </div>
    );
});

EzFilterBuilder.displayName = 'EzFilterBuilder';

