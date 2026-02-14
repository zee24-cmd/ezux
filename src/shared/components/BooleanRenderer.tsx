import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Switch } from '../../components/ui/switch';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';

// --- Boolean Cell ---

export interface BooleanCellProps {
    value: boolean | null | undefined;
    trueLabel?: string;
    falseLabel?: string;
    nullLabel?: string;
    showIcon?: boolean;
    showLabel?: boolean;
    variant?: 'checkbox' | 'switch';
    className?: string;
    disabled?: boolean;
    onChange?: (value: boolean) => void;
}

export const BooleanCell: React.FC<BooleanCellProps> = ({
    value,
    trueLabel = 'Yes',
    falseLabel = 'No',
    nullLabel = 'N/A',
    showIcon = true,
    showLabel = false,
    variant = 'checkbox',
    className,
    disabled = true,
    onChange
}) => {
    const isTrue = value === true;
    const isFalse = value === false;

    // Use value for tristate check
    const isNull = value === null || value === undefined;

    if (variant === 'switch') {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <Switch
                    checked={isTrue}
                    onCheckedChange={onChange}
                    disabled={disabled}
                    className="scale-90"
                />
                {showLabel && (
                    <span className="text-xs font-medium">
                        {isTrue ? trueLabel : isFalse ? falseLabel : nullLabel}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-colors text-xs font-medium",
            isTrue && "bg-emerald-50/50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
            isFalse && "bg-rose-50/50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
            isNull && "bg-muted/60 text-muted-foreground",
            className
        )}>
            {showIcon && (
                <>
                    {isTrue && <Check className="w-3.5 h-3.5" />}
                    {isFalse && <X className="w-3.5 h-3.5" />}
                    {isNull && <Minus className="w-3.5 h-3.5" />}
                </>
            )}
            {showLabel && (
                <span className="text-xs font-medium">
                    {isTrue ? trueLabel : isFalse ? falseLabel : nullLabel}
                </span>
            )}
        </div>
    );
};

// --- Boolean Editor ---

export interface BooleanEditorProps {
    value: boolean | null | undefined;
    onChange: (value: boolean) => void;
    trueLabel?: string;
    falseLabel?: string;
    variant?: 'checkbox' | 'switch';
    disabled?: boolean;
    className?: string;
}

export const BooleanEditor: React.FC<BooleanEditorProps> = ({
    value,
    onChange,
    trueLabel = 'Yes',
    falseLabel = 'No',
    variant = 'checkbox',
    disabled = false,
    className
}) => {
    const checked = value === true;

    if (variant === 'switch') {
        return (
            <div className={cn("flex items-center gap-2 p-2", className)}>
                <Switch
                    id="boolean-switch"
                    checked={checked}
                    onCheckedChange={(checkedState) => {
                        onChange(checkedState);
                    }}
                    disabled={disabled}
                />
                <Label
                    htmlFor="boolean-switch"
                    className="text-sm font-medium cursor-pointer"
                >
                    {checked ? trueLabel : falseLabel}
                </Label>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-2 p-2", className)}>
            <Checkbox
                id="boolean-editor"
                checked={checked}
                onCheckedChange={(checkedState) => {
                    onChange(checkedState === true);
                }}
                disabled={disabled}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label
                htmlFor="boolean-editor"
                className="text-sm font-medium cursor-pointer"
            >
                {checked ? trueLabel : falseLabel}
            </Label>
        </div>
    );
};

// --- Boolean Filter ---

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export interface BooleanFilterProps {
    value: 'all' | 'true' | 'false' | 'null';
    onChange: (value: 'all' | 'true' | 'false' | 'null') => void;
    trueLabel?: string;
    falseLabel?: string;
    nullLabel?: string;
    allLabel?: string;
    className?: string;
}

export const BooleanFilter: React.FC<BooleanFilterProps> = ({
    value,
    onChange,
    trueLabel = 'Yes',
    falseLabel = 'No',
    nullLabel = 'N/A',
    allLabel = 'All',
    className
}) => {
    return (
        <Select value={value} onValueChange={onChange as (value: string) => void}>
            <SelectTrigger className={cn("w-full h-8", className)}>
                <SelectValue placeholder="Filter..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">
                    <div className="flex items-center gap-2">
                        <Minus className="w-4 h-4 text-muted-foreground" />
                        <span>{allLabel}</span>
                    </div>
                </SelectItem>
                <SelectItem value="true">
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>{trueLabel}</span>
                    </div>
                </SelectItem>
                <SelectItem value="false">
                    <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-rose-600" />
                        <span>{falseLabel}</span>
                    </div>
                </SelectItem>
                <SelectItem value="null">
                    <div className="flex items-center gap-2">
                        <Minus className="w-4 h-4 text-muted-foreground" />
                        <span>{nullLabel}</span>
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    );
};
