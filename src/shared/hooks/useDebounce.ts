import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for debouncing a value
 * Useful for search inputs and expensive operations
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook for throttling a callback function
 * Useful for scroll, resize, and zoom events
 */
export function useThrottle<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 100
): T {
    const lastRan = useRef(Date.now());
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const throttledCallback = useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();
            const timeSinceLastRan = now - lastRan.current;

            if (timeSinceLastRan >= delay) {
                callback(...args);
                lastRan.current = now;
            } else {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
                    callback(...args);
                    lastRan.current = Date.now();
                }, delay - timeSinceLastRan);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [delay]
    ) as T;

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return throttledCallback;
}
