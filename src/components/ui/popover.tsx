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
export const PopoverContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuContent>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <DropdownMenuContent
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={className}
        {...props}
    />
))
PopoverContent.displayName = "PopoverContent"
