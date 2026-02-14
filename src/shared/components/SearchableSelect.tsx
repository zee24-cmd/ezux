import React, { useState, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandItem,
    CommandList
} from '../../components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../../components/ui/popover';

export interface SearchableSelectProps {
    value?: string | null;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    className?: string;
    onBlur?: () => void;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    value,
    onChange,
    options = [],
    placeholder = "Select option...",
    className,
    onBlur: _onBlur // Prefix with underscore to indicate intent
}) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        const lowQuery = searchQuery.toLowerCase();
        return options.filter(opt =>
            opt.label.toLowerCase().includes(lowQuery) ||
            opt.value.toLowerCase().includes(lowQuery)
        );
    }, [options, searchQuery]);

    const [parentElement, setParentElement] = useState<HTMLDivElement | null>(null);

    const rowVirtualizer = useVirtualizer({
        count: filteredOptions.length,
        getScrollElement: () => parentElement,
        estimateSize: () => 35, // Average height of a command item
        overscan: 5,
    });

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between h-8 px-2 font-normal text-xs", className)}
                >
                    <span className="truncate">
                        {value
                            ? options.find((opt) => opt.value === value)?.label || value
                            : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[400px] overflow-hidden"
                align="start"
                side="bottom"
                collisionPadding={10}
            >
                <Command shouldFilter={false} className="h-full">
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                        <input
                            className="flex h-9 w-full rounded-md bg-transparent py-3 text-xs outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-zinc-950 dark:text-zinc-50"
                            placeholder="Type to search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <CommandList
                        ref={setParentElement}
                        className="max-h-[300px] overflow-y-auto"
                        style={{ maxHeight: '300px' }}
                    >
                        {filteredOptions.length === 0 && <CommandEmpty>No option found.</CommandEmpty>}
                        <div
                            style={{
                                height: `${rowVirtualizer.getTotalSize()}px`,
                                width: '100%',
                                position: 'relative',
                            }}
                        >
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const option = filteredOptions[virtualRow.index];
                                return (
                                    <div
                                        key={virtualRow.key}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: `${virtualRow.size}px`,
                                            transform: `translateY(${virtualRow.start}px)`,
                                        }}
                                    >
                                        <CommandItem
                                            value={option.value}
                                            onSelect={(currentValue) => {
                                                onChange(currentValue === value ? "" : currentValue);
                                                setOpen(false);
                                                setSearchQuery("");
                                            }}
                                            className="flex items-center justify-between text-xs py-1.5"
                                        >
                                            <span className="truncate">{option.label}</span>
                                            <Check
                                                className={cn(
                                                    "h-3 w-3",
                                                    value === option.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    </div>
                                );
                            })}
                        </div>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
