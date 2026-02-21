
import { useState, useEffect, useCallback } from 'react';
import { globalServiceRegistry, ServiceRegistry } from '../services/ServiceRegistry';
import { ComponentEventCallbacks } from '../types/common';

/**
 * Common properties for all core components.
 * @group Properties
 */
export interface BaseComponentProps extends ComponentEventCallbacks {
    /** 
     * The shared service registry instance.
     * @group Services 
     */
    serviceRegistry?: ServiceRegistry;
}

export type BaseComponentConfig = BaseComponentProps;

/**
 * Base internal state for core components.
 * @group State
 */
export interface BaseComponentState {
    /** Whether the component is processing an async action. @group State */
    isLoading: boolean;
    /** Current error state. @group State */
    error: Error | null;
    /** Whether the component has mounted on the client. @group State */
    isHydrated: boolean;
}


/**
 * Foundation API shared by all core components.
 * @group Methods
 */
export interface BaseComponentAPI {
    /** Shows the global component spinner. @group Methods */
    showSpinner: () => void;
    /** Hides the global component spinner. @group Methods */
    hideSpinner: () => void;
}

/**
 * A foundational hook that provides shared infrastructure for all core components.
 * 
 * Handles service registry resolution, basic lifecycle events, and common loading/error state.
 * 
 * @param props The component's props.
 * @group Hooks
 */
export const useBaseComponent = (props: BaseComponentProps) => {
    // 1. Service Registry
    const [serviceRegistry] = useState(() => props.serviceRegistry || globalServiceRegistry);

    // 2. Base State
    const [state, setState] = useState<BaseComponentState>({
        isLoading: false,
        error: null,
        isHydrated: false
    });

    const setIsLoading = useCallback((isLoading: boolean) => {
        setState(prev => ({ ...prev, isLoading }));
    }, []);

    const setError = useCallback((error: Error | null) => {
        setState(prev => ({ ...prev, error }));
    }, []);

    // 3. Lifecycle
    useEffect(() => {
        setState(prev => ({ ...prev, isHydrated: true }));
        if (props.onCreated) {
            props.onCreated();
        }

        return () => {
            if (props.onDestroyed) {
                props.onDestroyed();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // onCreated/onDestroyed are intentionally excluded: they are lifecycle callbacks
        // that should only fire once on mount/unmount regardless of reference changes.
    }, []);

    // 4. Base API
    const api = {
        showSpinner: useCallback(() => setIsLoading(true), []),
        hideSpinner: useCallback(() => setIsLoading(false), []),
    };

    return {
        /** The resolved service registry for this component. @group Services */
        serviceRegistry,
        /** Current base state (loading, error, hydrated). @group State */
        state,
        /** Functional setter for loading state. @group Methods */
        setIsLoading,
        /** Functional setter for error state. @group Methods */
        setError,
        /** Base API (spinner controls). @group Methods */
        api
    };
};
