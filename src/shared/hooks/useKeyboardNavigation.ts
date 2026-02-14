import { useState, useCallback, useEffect } from 'react';

/**
 * Configuration for the useKeyboardNavigation hook.
 * @group Properties
 */
interface KeyboardNavigationOptions {
    /** Total number of items in the navigable list. @group Data */
    totalItems: number;
    /** Number of columns for grid navigation (use 1 for simple lists). @default 1 @group Properties */
    columns?: number;
    /** Callback triggered when focus moves to a new index. @group Events */
    onSelect?: (index: number) => void;
    /** Callback triggered when the Enter key is pressed on a focused item. @group Events */
    onAction?: (index: number) => void;
    /** Callback triggered when the Escape key is pressed. @group Events */
    onCancel?: () => void;
    /** Whether navigation should wrap around at boundaries. @default true @group Properties */
    wrap?: boolean;
    /** Whether keyboard listening is currently active. @default true @group Properties */
    enabled?: boolean;
}

/**
 * Hook for managing keyboard focus and selection in lists and grids.
 * 
 * Implements standard directional arrow key navigation, Enter for action,
 * and Escape for cancellation/unfocus.
 * 
 * @param options Keyboard navigation behavior configuration.
 * @group Hooks
 */
export const useKeyboardNavigation = ({
    totalItems,
    columns = 1,
    onSelect,
    onAction,
    onCancel,
    wrap = true,
    enabled = true
}: KeyboardNavigationOptions) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled || totalItems === 0) return;

        let newIndex = selectedIndex;

        switch (event.key) {
            case 'ArrowDown':
                if (selectedIndex === -1) {
                    newIndex = 0;
                } else {
                    newIndex = selectedIndex + columns;
                    if (newIndex >= totalItems) {
                        newIndex = wrap ? newIndex % columns : selectedIndex;
                    }
                }
                event.preventDefault();
                break;

            case 'ArrowUp':
                if (selectedIndex === -1) {
                    newIndex = totalItems - 1;
                } else {
                    newIndex = selectedIndex - columns;
                    if (newIndex < 0) {
                        if (wrap) {
                            // Find the bottom-most item in the same column
                            const remainder = selectedIndex % columns;
                            const rows = Math.ceil(totalItems / columns);
                            newIndex = (rows - 1) * columns + remainder;
                            if (newIndex >= totalItems) newIndex -= columns;
                        } else {
                            newIndex = selectedIndex;
                        }
                    }
                }
                event.preventDefault();
                break;

            case 'ArrowRight':
                if (selectedIndex === -1) {
                    newIndex = 0;
                } else {
                    newIndex = selectedIndex + 1;
                    if (newIndex >= totalItems) {
                        newIndex = wrap ? 0 : selectedIndex;
                    }
                }
                event.preventDefault();
                break;

            case 'ArrowLeft':
                if (selectedIndex === -1) {
                    newIndex = totalItems - 1;
                } else {
                    newIndex = selectedIndex - 1;
                    if (newIndex < 0) {
                        newIndex = wrap ? totalItems - 1 : selectedIndex;
                    }
                }
                event.preventDefault();
                break;

            case 'Enter':
                if (selectedIndex !== -1 && onAction) {
                    onAction(selectedIndex);
                    event.preventDefault();
                }
                break;

            case 'Escape':
                if (onCancel) {
                    onCancel();
                    event.preventDefault();
                }
                setSelectedIndex(-1);
                break;

            default:
                return;
        }

        if (newIndex !== selectedIndex) {
            setSelectedIndex(newIndex);
            onSelect?.(newIndex);
        }
    }, [selectedIndex, totalItems, columns, onSelect, onAction, onCancel, wrap, enabled]);

    useEffect(() => {
        if (enabled) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [enabled, handleKeyDown]);

    return {
        /** The current focused index (-1 if none). @group State */
        selectedIndex,
        /** Manually sets the focused index. @group Methods */
        setSelectedIndex
    };
};
