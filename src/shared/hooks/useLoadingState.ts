import { useState, useCallback } from 'react';

interface UseLoadingStateOptions {
    initialState?: boolean;
    onError?: (error: any) => void;
}

/**
 * Shared hook for managing loading states and lifecycle.
 */
export function useLoadingState(options: UseLoadingStateOptions = {}) {
    const [isLoading, setIsLoading] = useState(options.initialState ?? false);
    const [error, setError] = useState<Error | null>(null);

    const startLoading = useCallback(() => {
        setIsLoading(true);
        setError(null);
    }, []);

    const stopLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    const wrapPromise = useCallback(async <T>(promise: Promise<T>): Promise<T | undefined> => {
        startLoading();
        try {
            const result = await promise;
            return result;
        } catch (err: any) {
            const errorObj = err instanceof Error ? err : new Error(String(err));
            setError(errorObj);
            options.onError?.(errorObj);
            return undefined;
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading, options.onError]);

    return {
        isLoading,
        error,
        startLoading,
        stopLoading,
        setIsLoading,
        setError,
        wrapPromise
    };
}
