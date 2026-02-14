import { cn } from '../../lib/utils';

/**
 * Shared style utilities to reduce inline style computations
 */

export type Density = 'compact' | 'standard' | 'comfortable';
export type PinnedPosition = 'left' | 'right' | false;

/**
 * Get density-based class names for height
 */
export const getDensityHeightClasses = (density?: Density): string => {
    switch (density) {
        case 'compact':
            return 'min-h-[40px]';
        case 'comfortable':
            return 'min-h-[56px]';
        case 'standard':
        default:
            return 'min-h-[48px]';
    }
};

/**
 * Get density-based class names for padding
 */
export const getDensityPaddingClasses = (density?: Density): string => {
    switch (density) {
        case 'compact':
            return 'py-0 px-2';
        case 'comfortable':
            return 'py-4 px-4';
        case 'standard':
        default:
            return 'py-2 px-4';
    }
};

/**
 * Get density-based text size classes
 */
export const getDensityTextClasses = (density?: Density): string => {
    switch (density) {
        case 'compact':
            return 'text-xs';
        case 'comfortable':
            return 'text-base';
        case 'standard':
        default:
            return 'text-sm';
    }
};

/**
 * Get complete density classes (combines height, padding, text)
 */
export const getDensityClasses = (density?: Density): string => {
    return cn(
        getDensityHeightClasses(density),
        getDensityPaddingClasses(density),
        getDensityTextClasses(density)
    );
};

/**
 * Get pinned column/row styles
 */
export const getPinnedStyles = (
    isPinned: PinnedPosition,
    position: number,
    dir: 'ltr' | 'rtl' = 'ltr'
): React.CSSProperties => {
    if (!isPinned) return {};

    const side = dir === 'rtl'
        ? (isPinned === 'left' ? 'right' : 'left')
        : (isPinned === 'left' ? 'left' : 'right');

    return {
        position: 'sticky',
        [side]: `${position}px`,
        zIndex: 30
    };
};

/**
 * Get pinned column/row class names
 */
export const getPinnedClasses = (isPinned: PinnedPosition, dir: 'ltr' | 'rtl' = 'ltr'): string => {
    if (!isPinned) return '';

    const baseClasses = 'bg-background';

    const isStart = isPinned === 'left';
    const isRtl = dir === 'rtl';

    // Shadow should be on the inner side of the pinned column
    // For start-pinned: shadow on right (LTR) or left (RTL)
    // For end-pinned: shadow on left (LTR) or right (RTL)
    const shadowRight = (isStart && !isRtl) || (!isStart && isRtl);

    const shadowClasses = shadowRight
        ? 'shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]'
        : 'shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.3)]';

    return cn(baseClasses, shadowClasses);
};

/**
 * Get alignment classes
 */
export const getAlignmentClasses = (align?: 'left' | 'center' | 'right', dir: 'ltr' | 'rtl' = 'ltr'): string => {
    switch (align) {
        case 'center':
            return 'justify-center text-center';
        case 'right':
            return 'justify-end text-right';
        case 'left':
            return 'justify-start text-left';
        default:
            return dir === 'rtl' ? 'justify-end text-right' : 'justify-start text-left';
    }
};

/**
 * Get cell/row selection classes
 * Excel-like: Uses border for focus (thick border on all sides)
 */
export const getSelectionClasses = (isSelected: boolean, isFocused: boolean): string => {
    return cn(
        isSelected && 'bg-primary/10 ring-1 ring-inset ring-primary/30 z-[1]',
        isFocused && 'bg-primary/10 z-[10]'
    );
};

/**
 * Get hover classes
 */
export const getHoverClasses = (enabled: boolean = true): string => {
    return enabled ? 'hover:bg-muted/50 transition-colors' : '';
};

/**
 * Get drag-and-drop classes
 */
export const getDragDropClasses = (isDragging: boolean, isOver: boolean): string => {
    return cn(
        isDragging && 'opacity-50 bg-muted cursor-grabbing',
        isOver && 'ring-2 ring-inset ring-primary bg-accent/50'
    );
};

/**
 * Get border classes
 */
export const getBorderClasses = (
    position?: 'top' | 'bottom' | 'left' | 'right' | 'all',
    variant?: 'default' | 'muted'
): string => {
    const borderColor = variant === 'muted' ? 'border-border/50' : 'border-border';

    switch (position) {
        case 'top':
            return cn('border-t', borderColor);
        case 'bottom':
            return cn('border-b', borderColor);
        case 'left':
            return cn('border-l', borderColor);
        case 'right':
            return cn('border-r', borderColor);
        case 'all':
            return cn('border', borderColor);
        default:
            return '';
    }
};

/**
 * Get truncation/wrapping classes
 */
export const getTextOverflowClasses = (
    mode?: 'truncate' | 'wrap' | 'ellipsis',
    enableTooltip?: boolean
): string => {
    switch (mode) {
        case 'wrap':
            return 'whitespace-normal break-words';
        case 'ellipsis':
            return enableTooltip ? 'overflow-hidden' : 'truncate';
        case 'truncate':
        default:
            return 'truncate';
    }
};

/**
 * Get sticky classes
 */
export const getStickyClasses = (
    position?: 'top' | 'bottom',
    zIndex: number = 20
): string => {
    if (!position) return '';

    return cn(
        'sticky',
        position === 'top' ? 'top-0' : 'bottom-0',
        `z-[${zIndex}]`
    );
};

/**
 * Get grid line classes
 */
export const getGridLinesClasses = (
    gridLines?: 'Both' | 'Horizontal' | 'Vertical' | 'None',
    isLastColumn?: boolean,
    dir: 'ltr' | 'rtl' = 'ltr'
): string => {
    if (isLastColumn || !gridLines || gridLines === 'None' || gridLines === 'Horizontal') {
        return '';
    }
    return dir === 'rtl' ? 'border-l border-border/50' : 'border-r border-border/50';
};

/**
 * Combine multiple style utilities
 */
export const combineStyleClasses = (...classes: (string | undefined | false)[]): string => {
    return cn(...classes.filter(Boolean));
};
