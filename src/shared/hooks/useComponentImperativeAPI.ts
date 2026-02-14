import { useImperativeHandle, Ref, useMemo } from 'react';

export interface ImperativeAPIOptions {
    validateField?: (data: any) => boolean;
    validateEditForm?: () => boolean;
    [key: string]: any;
}

/**
 * Generic imperative API hook for all EzUX components
 * Standardizes imperative API pattern across components
 */
export const useComponentImperativeAPI = <T extends Record<string, any>>(
    ref: Ref<T> | undefined,
    api: T,
    options?: ImperativeAPIOptions
) => {
    const exposedApi = useMemo(() => {
        if (!options) return api;
        return {
            ...api,
            ...options
        };
    }, [api, options]);

    useImperativeHandle(ref, () => exposedApi, [exposedApi]);
};
