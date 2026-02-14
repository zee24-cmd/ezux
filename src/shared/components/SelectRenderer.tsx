import React from 'react';
import { cn } from '../../lib/utils';
import { HighlightText } from './HighlightText';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { SearchableSelect } from './SearchableSelect';

// --- Select Type Definitions ---

export interface SelectOption {
    value: string;
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

// --- Select Cell ---

export interface SelectCellProps {
    value: string | string[] | null | undefined;
    options?: SelectOption[];
    multiSelect?: boolean;
    className?: string;
    table?: any;
}

export const SelectCell: React.FC<SelectCellProps> = ({
    value,
    options = [],
    className,
    table
}) => {
    if (value === null || value === undefined) {
        return <span className="text-muted-foreground text-xs italic">—</span>;
    }

    // Normalize value to array for consistent handling
    const values = Array.isArray(value) ? value : [value];

    if (values.length === 0) {
        return <span className="text-muted-foreground text-xs italic">—</span>;
    }

    // Find option details for each value
    const selectedOptions = values.map(v => {
        const option = options.find(opt => opt.value === v);
        return option || { value: v, label: v, color: 'default' as const };
    });

    const getStatusColors = (color?: string) => {
        switch (color) {
            case 'success':
                return {
                    container: 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500/90 dark:text-emerald-50 dark:border-emerald-400/50',
                    dot: 'bg-emerald-600 dark:bg-emerald-200'
                };
            case 'danger':
            case 'destructive':
                return {
                    container: 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-500/90 dark:text-rose-50 dark:border-rose-400/50',
                    dot: 'bg-rose-600 dark:bg-rose-200'
                };
            case 'warning':
                return {
                    container: 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-500/90 dark:text-amber-50 dark:border-amber-400/50',
                    dot: 'bg-amber-600 dark:bg-amber-200'
                };
            case 'primary':
            case 'info':
                return {
                    container: 'bg-blue-100 text-blue-950 border-blue-300 dark:bg-blue-500/90 dark:text-blue-50 dark:border-blue-400/50',
                    dot: 'bg-blue-600 dark:bg-blue-200'
                };
            default:
                return {
                    container: 'bg-slate-100 text-slate-950 border-slate-300 dark:bg-slate-500/90 dark:text-slate-50 dark:border-slate-400/50',
                    dot: 'bg-slate-600 dark:bg-slate-200'
                };
        }
    };

    return (
        <div className={cn("inline-flex items-center gap-1.5 flex-wrap py-1", className)}>
            {selectedOptions.map((option, index) => {
                const styles = getStatusColors(option.color);
                return (
                    <div
                        key={`${option.value}-${index}`}
                        className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all duration-300 shadow-sm",
                            styles.container
                        )}
                    >
                        <span className={cn("w-1.5 h-1.5 rounded-full", styles.dot)} />
                        {table?.options.meta?.enableSearchHighlighting ? (
                            <HighlightText
                                text={option.label}
                                highlight={typeof table.getState().globalFilter === 'string' ? table.getState().globalFilter : table.getState().globalFilter?.quickSearch}
                            />
                        ) : option.label}
                    </div>
                );
            })}
        </div>
    );
};

// --- Select Editor ---

export interface SelectEditorProps {
    value: any;
    onChange: (value: any) => void;
    options: SelectOption[];
    variant?: 'dropdown' | 'radio' | 'combobox';
    multiSelect?: boolean;
    onBlur?: () => void;
    className?: string;
    placeholder?: string;
    isFocused?: boolean;
}

export const SelectEditor: React.FC<SelectEditorProps> = ({
    value,
    onChange,
    options = [],
    variant = 'dropdown',
    onBlur,
    className,
    placeholder = 'Select...',
    isFocused
}) => {
    const [open, setOpen] = React.useState(false);
    const hasAutoOpened = React.useRef(false);

    React.useEffect(() => {
        if (isFocused && variant === 'dropdown') {
            if (!hasAutoOpened.current) {
                setOpen(true);
                hasAutoOpened.current = true;
            }
        } else {
            setOpen(false);
            hasAutoOpened.current = false;
        }
    }, [isFocused, variant]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Stop propagation for keys that control the Select, preventing Table navigation conflicts
        if (['Enter', ' ', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.stopPropagation();
        }
    };

    if (variant === 'combobox') {
        return (
            <div className={cn("w-full", className)}>
                <SearchableSelect
                    value={value}
                    onChange={onChange}
                    options={options}
                    placeholder={placeholder}
                    onBlur={onBlur}
                />
            </div>
        );
    }

    if (variant === 'radio') {
        return (
            <div className={cn("w-full px-2 py-1", className)} onBlur={onBlur}>
                <RadioGroup value={value || ''} onValueChange={onChange}>
                    {options.map((opt) => (
                        <div key={opt.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt.value} id={`radio-${opt.value}`} />
                            <Label htmlFor={`radio-${opt.value}`} className="text-xs font-medium cursor-pointer">
                                {opt.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        );
    }
    return (
        <div className={cn("w-full -m-1 p-0.5", className)} onBlur={onBlur} onKeyDown={handleKeyDown}>
            <Select
                value={value}
                onValueChange={onChange}
                open={open}
                onOpenChange={setOpen}
            >
                <SelectTrigger className="h-7 py-0 border-0 shadow-none bg-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

// --- Select Filter ---

export interface SelectFilterProps {
    options: SelectOption[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    className?: string;
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
    options = [],
    selectedValues = [],
    onChange,
    className
}) => {
    const handleToggle = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter(v => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    const handleSelectAll = () => {
        if (selectedValues.length === options.length) {
            onChange([]);
        } else {
            onChange(options.map(opt => opt.value));
        }
    };

    return (
        <div className={cn("flex flex-col gap-2 p-2 min-w-[180px]", className)}>
            <div className="flex items-center justify-between border-b pb-2 mb-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Filter Options
                </span>
                <button
                    onClick={handleSelectAll}
                    className="text-[10px] font-medium text-primary hover:underline"
                >
                    {selectedValues.length === options.length ? 'Clear All' : 'Select All'}
                </button>
            </div>

            <div className="max-h-[180px] overflow-y-auto">
                <div className="flex flex-col gap-2 pr-2">
                    {options.map((option) => (
                        <div key={option.value} className="flex items-center gap-2">
                            <Checkbox
                                id={`filter-${option.value}`}
                                checked={selectedValues.includes(option.value)}
                                onCheckedChange={() => handleToggle(option.value)}
                            />
                            <Label
                                htmlFor={`filter-${option.value}`}
                                className="text-sm font-normal cursor-pointer flex-1"
                            >
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
