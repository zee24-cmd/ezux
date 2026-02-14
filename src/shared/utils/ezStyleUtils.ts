import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Shared density styles for all components
 */
export const densityStyles = {
    compact: "py-1 text-xs",
    standard: "py-2 text-sm",
    comfortable: "py-4 text-base"
};

/**
 * Helper to get density class based on prop
 */
export const getDensityClass = (density: 'compact' | 'standard' | 'comfortable' = 'standard') => {
    return densityStyles[density];
};

/**
 * Common flex container styles
 */
export const flexCenter = "flex items-center justify-center";
export const flexBetween = "flex items-center justify-between";
export const flexStart = "flex items-center justify-start";
export const flexEnd = "flex items-center justify-end";
export const flexColumn = "flex flex-col";

/**
 * Common grid styles
 */
export const gridCenter = "grid place-items-center";

/**
 * Common interactive element styles
 */
export const interactiveStyles = {
    base: "cursor-pointer transition-colors duration-200",
    hover: "hover:bg-accent hover:text-accent-foreground",
    active: "active:scale-95",
    disabled: "opacity-50 cursor-not-allowed pointer-events-none"
};

/**
 * Helper to generate interactive classes
 */
export const getInteractiveClass = (disabled?: boolean) => {
    if (disabled) return interactiveStyles.disabled;
    return cn(interactiveStyles.base, interactiveStyles.hover, interactiveStyles.active);
};

/**
 * Common border styles
 */
export const borderStyles = {
    default: "border border-border",
    bottom: "border-b border-border",
    top: "border-t border-border",
    left: "border-l border-border",
    right: "border-r border-border",
    none: "border-0"
};

/**
 * Scrollbar utilities (for custom scrollbars if needed)
 */
export const scrollbarStyles = {
    hidden: "scrollbar-hide",
    thin: "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
};

/**
 * Text ellipsis styles
 */
export const ellipsisStyles = "truncate whitespace-nowrap overflow-hidden text-ellipsis";
