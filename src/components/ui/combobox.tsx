import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "./command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./popover"

export interface ComboboxOption {
    value: string
    label: string
}

interface ComboboxProps {
    options: ComboboxOption[]
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    className?: string
    dropdownWidth?: string
    disabled?: boolean
    dir?: "ltr" | "rtl";
}

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
    ({ options, value, onValueChange, placeholder = "Select option...", searchPlaceholder = "Search...", emptyText = "No results found.", className, dropdownWidth = "w-[400px]", disabled, dir }, ref) => {
        const [open, setOpen] = React.useState(false)

        const selectedLabel = React.useMemo(() => {
            return options.find((option) => option.value === value)?.label || ""
        }, [options, value])

        return (
            <Popover open={open} onOpenChange={setOpen} dir={dir}>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        variant="ghost"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            "w-full justify-between font-normal bg-white dark:bg-zinc-900 border border-border/10 rounded-xl px-4 py-3 h-12 text-[14px] shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all",
                            className
                        )}
                    >
                        <span className="truncate">
                            {selectedLabel || <span className="text-muted-foreground">{placeholder}</span>}
                        </span>
                        <ChevronDown className={cn(
                            "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                            open && "rotate-180"
                        )} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent 
                    className={cn("p-0 border-border/10 shadow-xl overflow-hidden bg-white dark:bg-zinc-950", dropdownWidth)} 
                    align={dir === "rtl" ? "end" : "start"}
                    dir={dir}
                >
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} className="h-11 border-none focus:ring-0" />
                        <CommandList className="max-h-[300px] overflow-y-auto">
                            <CommandEmpty className="py-6 text-sm text-muted-foreground">{emptyText}</CommandEmpty>
                            <CommandGroup className="p-1 space-y-1">
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => {
                                            onValueChange?.(option.value)
                                            setOpen(false)
                                        }}
                                        className="px-4 py-3 text-[14px] cursor-default hover:bg-zinc-100 dark:hover:bg-zinc-800 aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800 transition-colors rounded-lg text-start"
                                    >
                                        <span className="whitespace-normal leading-relaxed flex-1">{option.label}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        )
    }
)

Combobox.displayName = "Combobox"
