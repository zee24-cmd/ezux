import { useEffect } from 'react';

export interface KeyboardShortcutConfig {
    key: string;
    ctrl?: boolean;
    meta?: boolean; // Cmd on Mac
    shift?: boolean;
    alt?: boolean;
    handler: (event: KeyboardEvent) => void;
    preventDefault?: boolean;
}

/**
 * Hook for registering keyboard shortcuts
 * Automatically handles Ctrl (Windows/Linux) and Cmd (Mac) modifiers
 */
export const useKeyboardShortcuts = (shortcuts: KeyboardShortcutConfig[]) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            for (const shortcut of shortcuts) {
                const ctrlOrMeta = shortcut.ctrl || shortcut.meta;
                const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

                // Check if the modifier keys match
                const modifierMatch =
                    (!ctrlOrMeta || (isMac ? event.metaKey : event.ctrlKey)) &&
                    (!shortcut.shift || event.shiftKey) &&
                    (!shortcut.alt || event.altKey);

                // Check if the key matches (case-insensitive)
                const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

                if (modifierMatch && keyMatch) {
                    if (shortcut.preventDefault !== false) {
                        event.preventDefault();
                    }
                    shortcut.handler(event);
                    break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};
