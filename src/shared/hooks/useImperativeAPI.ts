import { useImperativeHandle, Ref } from 'react';

/**
 * A shared hook to consolidate the imperative API pattern using useImperativeHandle.
 * 
 * @param ref The ref object from the forwardRef or parent component.
 * @param api An object containing the methods and properties to expose.
 */
export const useImperativeAPI = <T extends Record<string, any>>(
    ref: Ref<T> | undefined,
    api: T
) => {
    useImperativeHandle(ref, () => api, [api]);
};
