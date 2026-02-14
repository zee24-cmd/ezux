import React, { useState } from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { FilterRuleSelect } from './FilterRuleSelect';
import { FilterOperator } from '../EzTable.types';

/**
 * Props for the advanced column filtering UI.
 * @group Models
 */
export interface AdvancedColumnFilterProps {
    /** Data type of the column (text, number, date). @group Properties */
    columnType: string;
    /** Unique identifier of the column. @group Properties */
    columnId?: string;
    /** Current filter value (rule or group). @group State */
    value: any;
    /** Handler for filter changes. @group Events */
    onChange: (val: any) => void;
}

const OPERATORS_BY_TYPE: Record<string, { label: string; value: FilterOperator }[]> = {
    text: [
        { label: 'Contains', value: 'contains' },
        { label: 'Does not contain', value: 'doesNotContain' },
        { label: 'Equals', value: 'equals' },
        { label: 'Does not equal', value: 'notEquals' },
        { label: 'Starts with', value: 'startsWith' },
        { label: 'Ends with', value: 'endsWith' },
    ],
    number: [
        { label: 'Equals', value: 'equals' },
        { label: 'Greater than', value: 'gt' },
        { label: 'Greater or equal', value: 'gte' },
        { label: 'Less than', value: 'lt' },
        { label: 'Less or equal', value: 'lte' },
        { label: 'Between', value: 'between' },
    ],
    date: [
        { label: 'Equals', value: 'equals' },
        { label: 'After', value: 'gt' },
        { label: 'On or after', value: 'gte' },
        { label: 'Before', value: 'lt' },
        { label: 'On or before', value: 'lte' },
        { label: 'Between', value: 'between' },
    ]
};

export const AdvancedColumnFilter: React.FC<AdvancedColumnFilterProps> = ({
    columnType,
    columnId,
    value,
    onChange
}) => {
    const typeKey = (columnType === 'datetime' || columnType === 'date') ? 'date' : (columnType === 'number' ? 'number' : 'text');
    const operators = OPERATORS_BY_TYPE[typeKey] || OPERATORS_BY_TYPE.text;
    const inputType = columnType === 'number' ? 'number' : (columnType === 'date' || columnType === 'datetime') ? 'date' : 'text';

    // Parse current value into internal state
    const isGroup = value?.kind === 'group';
    const rule1 = isGroup ? value.filters[0] : (value?.operator ? value : { operator: operators[0].value, value: '' });
    const rule2 = isGroup ? value.filters[1] : { operator: operators[0].value, value: '' };
    const logic = isGroup ? value.logic : 'OR';
    const hasSecondRule = isGroup;

    const [localRule1, setLocalRule1] = useState(rule1);
    const [localRule2, setLocalRule2] = useState(rule2);
    const [localLogic, setLocalLogic] = useState<'AND' | 'OR'>(logic);
    const [useSecondRule, setUseSecondRule] = useState(hasSecondRule);

    // Sync local state with props when value changes (e.g. on Clear)
    React.useEffect(() => {
        const isGrp = value?.kind === 'group';
        const r1 = isGrp ? value.filters[0] : (value?.operator ? value : { operator: operators[0].value, value: '' });
        const r2 = isGrp ? value.filters[1] : { operator: operators[0].value, value: '' };
        const logicVal = isGrp ? value.logic : 'OR';

        setLocalRule1(r1);
        setLocalRule2(r2);
        setLocalLogic(logicVal);
        setUseSecondRule(isGrp);
    }, [value, operators]);

    const updateFilter = (r1: any, r2: any, log: 'AND' | 'OR', active2: boolean) => {
        // If not using second rule, send single rule unless we explicitly want to start a group?
        // Actually for OR support we must send a group even if R2 is partial, or handle it in UI only.
        // Better: If active2 is true, try to send a group.

        if (!active2) {
            onChange({
                kind: 'rule',
                operator: r1.operator,
                value: r1.value,
                field: r1.field || columnId,
                id: r1.id || columnId
            });
            return;
        }

        // Validate R2 value for completeness, but allow empty R2 if we want to persist the "structure" for OR?
        // If we send empty R2 with OR, it matches nothing (if empty/null/undef) -> OR works as R1 OR False => R1.
        // So it is safe to send empty rule with OR if checkRule handles it safely.
        // checkRule('contains', '') returns TRUE. Use non-empty operator?
        // Let's rely on standard logic. If value is empty string, 'contains' is true. 'equals' is false/true depending on data.

        onChange({
            kind: 'group',
            logic: log,
            filters: [
                {
                    kind: 'rule',
                    operator: r1.operator,
                    value: r1.value,
                    field: r1.field || columnId,
                    id: r1.id || `${columnId}_1`
                },
                {
                    kind: 'rule',
                    operator: r2.operator,
                    value: r2.value,
                    field: r2.field || columnId,
                    id: r2.id || `${columnId}_2`
                }
            ]
        });
    };

    const renderValueInput = (rule: any, setRule: (r: any) => void, isRule2: boolean) => {
        const handleValueChange = (newVal: any) => {
            const newR = { ...rule, value: newVal };
            setRule(newR);
            const nextActive2 = useSecondRule || isRule2;
            if (isRule2 && !useSecondRule) setUseSecondRule(true);
            updateFilter(
                isRule2 ? localRule1 : newR,
                isRule2 ? newR : localRule2,
                localLogic,
                nextActive2
            );
        };

        if (rule.operator === 'between') {
            const val = Array.isArray(rule.value) ? rule.value : [rule.value ?? '', ''];
            return (
                <div className="flex gap-2">
                    <Input
                        type={inputType}
                        value={val[0]}
                        onChange={(e) => handleValueChange([e.target.value, val[1]])}
                        className="h-8 shadow-none flex-1"
                        placeholder="From..."
                    />
                    <Input
                        type={inputType}
                        value={val[1]}
                        onChange={(e) => handleValueChange([val[0], e.target.value])}
                        className="h-8 shadow-none flex-1"
                        placeholder="To..."
                    />
                </div>
            );
        }

        return (
            <Input
                type={inputType}
                value={rule.value ?? ''}
                onChange={(e) => handleValueChange(e.target.value)}
                className="h-8 shadow-none"
                placeholder="Enter value..."
            />
        );
    };

    return (
        <div className="p-3 space-y-4">
            <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase">Show rows where:</Label>
                <div className="space-y-2">
                    <FilterRuleSelect
                        value={localRule1.operator}
                        options={operators}
                        onChange={(val) => {
                            const op = val as FilterOperator;
                            const newR1 = { ...localRule1, operator: op, value: op === 'between' ? ['', ''] : localRule1.value };
                            setLocalRule1(newR1);
                            updateFilter(newR1, localRule2, localLogic, useSecondRule);
                        }}
                        placeholder="Select operator"
                        className="h-8 shadow-none"
                    />
                    {renderValueInput(localRule1, setLocalRule1, false)}
                </div>
            </div>

            <div className="flex justify-center">
                <RadioGroup
                    value={localLogic}
                    onValueChange={(val: 'AND' | 'OR') => {
                        setLocalLogic(val);
                        if (!useSecondRule) setUseSecondRule(true);
                        updateFilter(localRule1, localRule2, val, true);
                    }}
                    className="flex gap-4"
                >
                    <div className="flex items-center space-x-1.5 focus-within:bg-muted/50 px-2 py-0.5 rounded transition">
                        <RadioGroupItem value="AND" id="and" className="h-3.5 w-3.5" />
                        <Label htmlFor="and" className="text-xs cursor-pointer font-semibold uppercase tracking-wider">And</Label>
                    </div>
                    <div className="flex items-center space-x-1.5 focus-within:bg-muted/50 px-2 py-0.5 rounded transition">
                        <RadioGroupItem value="OR" id="or" className="h-3.5 w-3.5" />
                        <Label htmlFor="or" className="text-xs cursor-pointer font-semibold uppercase tracking-wider">Or</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className={`space-y-2 transition-opacity duration-200 ${!useSecondRule ? 'opacity-50' : ''}`}>
                <div className="space-y-2">
                    <FilterRuleSelect
                        value={localRule2.operator}
                        options={operators}
                        onChange={(val) => {
                            const op = val as FilterOperator;
                            const newR2 = { ...localRule2, operator: op, value: op === 'between' ? ['', ''] : localRule2.value };
                            setLocalRule2(newR2);
                            if (!useSecondRule) setUseSecondRule(true);
                            updateFilter(localRule1, newR2, localLogic, true);
                        }}
                        placeholder="Select operator"
                        className="h-8 shadow-none"
                    />
                    {renderValueInput(localRule2, setLocalRule2, true)}
                </div>
            </div>

            {!useSecondRule && (
                <div className="text-[10px] text-muted-foreground italic text-center">
                    Select AND/OR or enter a second value to combine filters
                </div>
            )}
        </div>
    );
};
