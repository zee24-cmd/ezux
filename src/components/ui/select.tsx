import * as React from "react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "./dropdown-menu"
import { cn } from "../../lib/utils"

// Context to share value and onChange
const SelectContext = React.createContext<{
    value?: any;
    onValueChange?: (value: any) => void;
    setOpen: (open: boolean) => void;
} | null>(null);

interface SelectProps {
    value?: any;
    onValueChange?: (value: any) => void;
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children, open: controlledOpen, onOpenChange: controlledOnOpenChange }) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

    const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
    const setOpen = controlledOnOpenChange || setUncontrolledOpen;

    return (
        <SelectContext.Provider value={{ value, onValueChange, setOpen }}>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                {children}
            </DropdownMenu>
        </SelectContext.Provider>
    );
};

export const SelectTrigger: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
    <DropdownMenuTrigger asChild>
        <button className={cn("flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className)}>
            {children}
        </button>
    </DropdownMenuTrigger>
);

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
    const context = React.useContext(SelectContext);
    return <span>{context?.value || placeholder}</span>;
}

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <DropdownMenuContent className="max-h-[200px] overflow-y-auto">
        {children}
    </DropdownMenuContent>
);

export const SelectItem: React.FC<{ value: any, children: React.ReactNode }> = ({ value, children }) => {
    const context = React.useContext(SelectContext);
    return (
        <DropdownMenuItem
            className={cn("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", context?.value === value && "font-bold")}
            onSelect={() => {
                context?.onValueChange?.(value);
                context?.setOpen(false);
            }}
        >
            {children}
        </DropdownMenuItem>
    );
};
