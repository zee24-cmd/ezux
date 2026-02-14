import { useState, useCallback } from 'react';

export type DialogMode = 'create' | 'edit' | 'view';

export interface DialogStateHelperConfig<T> {
    initialMode?: DialogMode;
    initialData?: T;
    defaultData?: T;
}

/**
 * Shared hook for managing dialog/modal state.
 * Simplifies handling of open/close state, data passing, and operation modes.
 */
export function useDialogState<T = any>(config: DialogStateHelperConfig<T> = {}) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<DialogMode>(config.initialMode || 'view');
    const [data, setData] = useState<T>(config.initialData || ({} as T));
    const [meta, setMeta] = useState<any>({}); // Extra metadata (e.g., indices, IDs)

    const open = useCallback((mode: DialogMode, data?: T, meta?: any) => {
        setMode(mode);
        if (data !== undefined) setData(data);
        else if (config.defaultData) setData(config.defaultData);

        if (meta !== undefined) setMeta(meta);
        setIsOpen(true);
    }, [config.defaultData]);

    const close = useCallback(() => {
        setIsOpen(false);
        // Optional: clear data on close? Usually better to keep it to avoid UI flickering during transition.
    }, []);

    const toggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    return {
        isOpen,
        mode,
        data,
        meta,
        open,
        close,
        toggle,
        setData,
        setMode
    };
}
