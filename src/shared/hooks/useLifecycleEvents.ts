import { useLayoutEffect, useEffect, useRef } from 'react';

/**
 * Lifecycle event callbacks that can be shared across components.
 * Used by EzTable, EzScheduler, EzTreeView for render lifecycle.
 */
export interface LifecycleCallbacks {
    /** Called before the component paints (synchronous with layout) */
    onRenderStart?: () => void;
    /** Called after the component has painted (asynchronous) */
    onRenderComplete?: () => void;
}

/**
 * Shared hook to handle render lifecycle events.
 * - onRenderStart fires in useLayoutEffect (before browser paint)
 * - onRenderComplete fires in useEffect (after browser paint)
 * 
 * @example
 * useLifecycleEvents({
 *   onRenderStart: () => console.log('Rendering...'),
 *   onRenderComplete: () => console.log('Rendered!')
 * });
 */
export const useLifecycleEvents = (callbacks: LifecycleCallbacks) => {
    const hasRenderedRef = useRef(false);

    // Fire onRenderStart before paint
    useLayoutEffect(() => {
        if (callbacks.onRenderStart) {
            callbacks.onRenderStart();
        }
    });

    // Fire onRenderComplete after paint (only on first render)
    useEffect(() => {
        if (!hasRenderedRef.current && callbacks.onRenderComplete) {
            callbacks.onRenderComplete();
            hasRenderedRef.current = true;
        }
    }, [callbacks.onRenderComplete]);

    // Reset on unmount to allow re-triggering if remounted
    useEffect(() => {
        return () => {
            hasRenderedRef.current = false;
        };
    }, []);
};
