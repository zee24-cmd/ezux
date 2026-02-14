import { useState, useCallback, useEffect, useRef } from 'react';
import { IService } from '../services/ServiceRegistry';

/**
 * Configuration for the useComponentState hook.
 * @group Properties
 */
export interface StateConfig<T> {
    /** Initial state value. @group Data */
    initialState: T;
    /** Optional service for state synchronization. @group Services */
    service?: IService;
    /** LocalStorage key for state persistence. @group Properties */
    persistenceKey?: string;
    /** Delay in milliseconds for state update debouncing. @group Properties */
    debounceMs?: number;
    /** Callback triggered when state changes. @group Events */
    onChange?: (state: T) => void;
}

/**
 * A robust state management hook with support for debouncing, persistence, and service integration.
 * 
 * @param config Configuration for the state management.
 * @group Hooks
 */
export function useComponentState<T>(config: StateConfig<T>) {
    const [state, setState] = useState<T>(config.initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const configRef = useRef(config);

    // Keep config ref updated to avoid unnecessary effect re-runs
    useEffect(() => {
        configRef.current = config;
    }, [config]);

    // Debounce Logic
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedUpdate = useCallback((updater: T | ((prev: T) => T)) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            setState((prev) => {
                const newState = typeof updater === 'function'
                    ? (updater as (prev: T) => T)(prev)
                    : updater;

                configRef.current.onChange?.(newState);
                return newState;
            });
        }, configRef.current.debounceMs || 0);
    }, []);

    // State updates
    const updateState = useCallback((updater: T | ((prev: T) => T)) => {
        if (configRef.current.debounceMs) {
            debouncedUpdate(updater);
        } else {
            setState((prev) => {
                const newState = typeof updater === 'function'
                    ? (updater as (prev: T) => T)(prev)
                    : updater;

                configRef.current.onChange?.(newState);
                return newState;
            });
        }
    }, [debouncedUpdate]);

    // Direct setter without debounce (for initialization/reset)
    const setImmediateState = useCallback((newState: T) => {
        setState(newState);
        configRef.current.onChange?.(newState);
    }, []);

    // Persistence
    useEffect(() => {
        if (config.persistenceKey) {
            try {
                const saved = localStorage.getItem(config.persistenceKey);
                if (saved) {
                    setState((prev) => ({ ...prev, ...JSON.parse(saved) }));
                }
            } catch (e) {
                console.warn(`Failed to load persisted state for key: ${config.persistenceKey}`, e);
            }
        }
    }, [config.persistenceKey]);

    useEffect(() => {
        if (config.persistenceKey) {
            try {
                localStorage.setItem(config.persistenceKey, JSON.stringify(state));
            } catch (e) {
                console.warn(`Failed to save state for key: ${config.persistenceKey}`, e);
            }
        }
    }, [config.persistenceKey, state]);

    // Service Subscription (Optional Generic implementation)
    useEffect(() => {
        if (config.service && typeof (config.service as any).subscribe === 'function') {
            // This assumes the service exposes a compatible subscribe method
            // Real implementation depends on the Service contract
            const unsubscribe = (config.service as any).subscribe((_newState: any) => {
                // Logic to map service state to component state would go here
                // For now, we assume explicit binding in specific hooks
            });
            return () => {
                if (typeof unsubscribe === 'function') unsubscribe();
            }
        }
    }, [config.service]);

    return {
        /** The current state object. @group State */
        state,
        /** Updates the state (with optional debouncing). @group Methods */
        setState: updateState,
        /** Updates the state immediately, bypassing debouncing. @group Methods */
        setImmediateState,
        /** Whether a state-related async operation is in progress. @group State */
        loading,
        /** Functional setter for loading state. @group Methods */
        setLoading,
        /** Current error state. @group State */
        error,
        /** Functional setter for error state. @group Methods */
        setError
    };
}
