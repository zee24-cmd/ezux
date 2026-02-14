import { useState, useEffect } from 'react';
import { BaseService } from '../services/BaseService';
import { globalServiceRegistry } from '../services/ServiceRegistry';

/**
 * Hook for subscribing to a service's state in a reactive way.
 * 
 * Automatically handles subscriptions to any service extending `BaseService`.
 * Returns the latest state and triggers re-renders on service updates.
 * 
 * @template TState The shape of the service's state.
 * @param serviceName The name of the service to subscribe to.
 * @returns The current state of the service.
 * @group Hooks
 */
export const useServiceState = <TState>(serviceName: string): TState | undefined => {
    const [state, setState] = useState<TState | undefined>(() => {
        const service = globalServiceRegistry.get<BaseService<TState>>(serviceName);
        return service?.getState();
    });

    useEffect(() => {
        const service = globalServiceRegistry.get<BaseService<TState>>(serviceName);
        if (!service) return;

        // Initialize with latest state in case it changed between useState and useEffect
        setState(service.getState());

        // Subscribe to future changes
        return service.subscribe((newState) => {
            setState(newState);
        });
    }, [serviceName]);

    return state;
};
