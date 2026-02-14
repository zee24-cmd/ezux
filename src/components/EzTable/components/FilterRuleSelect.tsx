import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

/**
 * Props for the filter rule selection dropdown.
 * @group Models
 */
interface FilterRuleSelectProps<T extends string> {
    /** Current selection value. @group State */
    value: T;
    /** Handler for selection changes. @group Events */
    onChange: (value: T) => void;
    /** List of available options. @group Properties */
    options: Array<{ value: string; label: string }>;
    /** Placeholder text. @group Properties */
    placeholder: string;
    /** Custom class name. @group Properties */
    className?: string;
}

/**
 * A generic selection component for filter rules (fields or operators).
 * @group Components
 */
export const FilterRuleSelect = React.memo(<T extends string>({
    value,
    onChange,
    options,
    placeholder,
    className
}: FilterRuleSelectProps<T>) => (
    <Select value={value} onValueChange={(val) => onChange(val as T)}>
        <SelectTrigger className={className}>
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                    {option.label}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
));

FilterRuleSelect.displayName = 'FilterRuleSelect';
