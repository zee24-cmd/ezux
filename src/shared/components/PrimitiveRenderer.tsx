import React from 'react';
import { cn } from '../../lib/utils';
import { BaseCell } from './BaseCell';
import { formatNumber, formatDate } from '../utils/formatUtils';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { HighlightText } from './HighlightText';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../components/ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '../../components/ui/popover';
import { Maximize2, Copy } from 'lucide-react';
import { Button } from '../../components/ui/button';

export interface PrimitiveCellProps {
    value: any;
    columnType?: 'text' | 'number' | 'date' | 'datetime' | 'longtext';
    meta?: any;
    className?: string;
    align?: 'left' | 'center' | 'right';
    table?: any;
}

/**
 * PrimitiveCell - Unified renderer for simple data types.
 * Replaces TextCell, NumberCell, DateCell, etc.
 */
export const PrimitiveCell: React.FC<PrimitiveCellProps> = ({
    value,
    columnType,
    meta,
    className,
    align,
    table
}) => {
    let displayValue: React.ReactNode = value;

    if (value === null || value === undefined) {
        return <BaseCell value={value} align={align} className={className} />;
    }

    switch (columnType) {
        case 'number':
            displayValue = formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2, ...meta?.numberOptions });
            break;
        case 'date':
        case 'datetime':
            displayValue = formatDate(value, columnType === 'datetime' ? meta?.dateTimeOptions : meta?.dateOptions);
            break;
        case 'longtext':
            const fullText = String(value);

            displayValue = (
                <div className="flex items-start gap-1 group/longtext w-full overflow-hidden py-1.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex-1 min-w-0 cursor-help">
                                <span
                                    className="block !whitespace-normal break-words text-xs leading-normal"
                                    style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {fullText}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] p-3 break-words text-xs leading-relaxed">
                            {fullText}
                        </TooltipContent>
                    </Tooltip>

                    {fullText.length > 20 && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 opacity-0 group-hover/longtext:opacity-100 transition-opacity shrink-0"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Maximize2 className="h-3 w-3 text-muted-foreground hover:text-primary" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-4 shadow-xl border-border bg-popover" align="end" onClick={(e) => e.stopPropagation()}>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Detailed Description</h4>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 px-2 gap-1.5 text-[10px] font-bold"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigator.clipboard.writeText(fullText);
                                            }}
                                        >
                                            <Copy className="h-3 w-3" />
                                            Copy
                                        </Button>
                                    </div>
                                    <div className="text-sm leading-relaxed text-foreground max-h-[300px] overflow-auto pr-2 custom-scrollbar whitespace-pre-wrap">
                                        {fullText}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            );
            break;
        case 'text':
        default:
            // No specific formatting
            break;
    }

    if (table?.options.meta?.enableSearchHighlighting) {
        const globalFilter = table.getState().globalFilter;
        const filterText = typeof globalFilter === 'string' ? globalFilter : globalFilter?.quickSearch;

        if (filterText) {
            displayValue = <HighlightText text={displayValue} highlight={filterText} />;
        }
    }

    const resolvedAlign = align || (columnType === 'number' ? 'right' : 'left');

    return (
        <BaseCell
            value={value}
            align={resolvedAlign}
            title={columnType === 'longtext' ? "" : undefined}
            className={cn(
                columnType === 'number' && "font-mono tabular-nums",
                columnType === 'number' && value < 0 && "text-rose-600 dark:text-rose-400",
                "px-3 min-h-full flex",
                (columnType === 'longtext') ? "items-start py-2 overflow-hidden" : (meta?.wrapText ? "items-start" : "items-center"),
                resolvedAlign === 'right' && "justify-end",
                resolvedAlign === 'center' && "justify-center",
                className
            )}
        >
            {displayValue}
        </BaseCell>
    );
};

export interface PrimitiveEditorProps {
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    columnType?: string;
    autoFocus?: boolean;
    isFocused?: boolean;
    className?: string;
    placeholder?: string;
    meta?: any;
}

/**
 * PrimitiveEditor - Unified editor for simple inputs.
 * Replaces TextEditor, NumberEditor, etc.
 */
export const PrimitiveEditor: React.FC<PrimitiveEditorProps> = ({
    value,
    onChange,
    onBlur,
    columnType,
    autoFocus = true,
    isFocused,
    className,
    placeholder,
    meta
}) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    const [inputValue, setInputValue] = React.useState<string>(() => {
        if (value === null || value === undefined) return '';
        if (columnType === 'number') {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 20,
            }).format(value);
        }
        return String(value);
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        setInputValue(val);

        if (columnType === 'number') {
            if (val === '') {
                onChange(null);
            } else {
                // Remove commas for parsing
                const sanitized = val.replace(/,/g, '');
                const num = parseFloat(sanitized);
                if (!isNaN(num)) {
                    onChange(num);
                }
            }
        } else {
            onChange(val);
        }
    };

    const handleBlur = () => {
        if (columnType === 'number' && inputValue !== '') {
            const sanitized = inputValue.replace(/,/g, '');
            const num = parseFloat(sanitized);
            if (!isNaN(num)) {
                setInputValue(new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(num));
            }
        }
        onBlur?.();
    };

    const align = meta?.align || (columnType === 'number' ? 'right' : 'left');

    return (
        <Input
            ref={inputRef}
            type={columnType === 'date' ? 'date' : 'text'}
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus={autoFocus}
            className={cn(
                "h-7 px-2 w-full border-0 shadow-none bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                align === 'right' && "text-right",
                align === 'center' && "text-center",
                columnType === 'number' && "font-mono tabular-nums",
                className
            )}
            placeholder={placeholder}
            onClick={(e) => e.stopPropagation()}
        />
    );
};

// --- Primitive Filter ---

export type FilterOperator =
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'doesNotContain'
    | 'startsWith'
    | 'endsWith'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'between';

export interface PrimitiveFilterProps {
    columnType: 'text' | 'number' | 'date' | 'datetime' | 'longtext' | string;
    value: any;
    valueTo?: any;
    operator: FilterOperator;
    onChange: (value: any, operator: FilterOperator, valueTo?: any) => void;
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

export const PrimitiveFilter: React.FC<PrimitiveFilterProps> = ({
    columnType,
    value,
    valueTo,
    operator,
    onChange
}) => {
    const typeKey = (columnType === 'datetime' || columnType === 'date') ? 'date' : (columnType === 'number' ? 'number' : 'text');
    const operators = OPERATORS_BY_TYPE[typeKey] || OPERATORS_BY_TYPE.text;
    const inputType = columnType === 'number' ? 'number' : (columnType === 'date' || columnType === 'datetime') ? 'date' : 'text';

    return (
        <div className="p-3 space-y-3">
            <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground ml-1">Condition</label>
                <Select value={operator} onValueChange={(v: string) => onChange(value, v as FilterOperator, valueTo)}>
                    <SelectTrigger className="h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {operators.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                                {op.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground ml-1">Value</label>
                <Input
                    type={inputType}
                    value={value ?? ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value, operator, valueTo)}
                    className="h-8 antialiased"
                    placeholder="Enter value..."
                    onClick={(e) => e.stopPropagation()}
                />
                {operator === 'between' && (
                    <>
                        <div className="flex items-center gap-2 px-1">
                            <div className="h-[1px] flex-1 bg-border" />
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">and</span>
                            <div className="h-[1px] flex-1 bg-border" />
                        </div>
                        <Input
                            type={inputType}
                            value={valueTo ?? ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(value, operator, e.target.value)}
                            className="h-8 antialiased"
                            placeholder="To value..."
                            onClick={(e) => e.stopPropagation()}
                        />
                    </>
                )}
            </div>
        </div>
    );
};
