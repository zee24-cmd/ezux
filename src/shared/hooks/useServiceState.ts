import { useState, useEffect } from 'react';
import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
import { BaseService } from '../services/BaseService';
import { globalServiceRegistry } from '../services/ServiceRegistry';

/**
 * Hook for subscribing to a service's state in a reactive way.
 * 
 * Automatically handles subscriptions to any service extending `BaseService`.
 * Returns the latest state and triggers re-renders on service updates.
 * 
 * @template TSelected The shape of the selected state slice (defaults to TState).
 * @param serviceName The name of the service to subscribe to.
 * @param selector An optional selector function to subscribe only to a slice of state.
 * @returns The current state of the service, or undefined if not found.
 * @group Hooks
 */

// Fallback empty store to satisfy unconditional hook rules when a service isn't mounted yet
const EMPTY_STORE = new Store(undefined as any);

export const useServiceState = <TState, TSelected = TState>(
    serviceName: string,
    selector?: (state: TState) => TSelected
): TSelected | undefined => {
    // We must track the service reference to know when it mounts.
    // However, globalServiceRegistry is not inherently reactive right now,
    // so we will re-check if service exists on mount and on serviceName change.
    const [serviceRef, setServiceRef] = useState(() =>
        globalServiceRegistry.get<BaseService<TState>>(serviceName)
    );

    useEffect(() => {
        let currentService = globalServiceRegistry.get<BaseService<TState>>(serviceName);
        if (currentService !== serviceRef) setServiceRef(currentService);

        // This subscription handles lazy initializations in the same app lifecycle
        const interval = setInterval(() => {
            const svc = globalServiceRegistry.get<BaseService<TState>>(serviceName);
            if (svc && !currentService) {
                currentService = svc;
                setServiceRef(svc);
                clearInterval(interval);
            }
        }, 300);
        return () => clearInterval(interval);
    }, [serviceName, serviceRef]);

    const store = serviceRef ? serviceRef.store : EMPTY_STORE;

    // Fallback selector simply returns the full state (standard behavior)
    const defaultSelector = (s: TState) => s as unknown as TSelected;
    const finalSelector = selector || defaultSelector;

    const selectedState = useStore(store, finalSelector);

    if (!serviceRef) return undefined;
    return selectedState;
};
