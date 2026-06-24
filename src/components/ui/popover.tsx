import * as React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "./dropdown-menu"

// Shim Popover using DropdownMenu since they share positioning logic
// and we want to avoid adding @radix-ui/react-popover dependency
export const Popover = DropdownMenu
export const PopoverTrigger = DropdownMenuTrigger
export interface PopoverContentProps
    extends React.ComponentPropsWithoutRef<typeof DropdownMenuContent> {
    container?: HTMLElement | null;
    dir?: "ltr" | "rtl";
    ref?: React.Ref<React.ElementRef<typeof DropdownMenuContent>>;
}

export function PopoverContent({ className, align = "center", sideOffset = 4, container, ref, ...props }: PopoverContentProps) {
    return (
        <DropdownMenuContent
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={className}
            container={container}
            {...props}
        />
    );
}
