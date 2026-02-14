
import { useState } from 'react';
import { IService, globalServiceRegistry, ServiceRegistry } from '../services/ServiceRegistry';
import { getOrRegisterService } from '../utils/serviceUtils';

/**
 * Hook for standardized service access.
 * Abstracts service registration and access patterns.
 * Ensures the service is registered and provides a stable reference.
 * 
 * @param serviceName Unique name of the service
 * @param factory Factory function to create the service if not registered
 * @param registry Optional service registry to use (defaults to global)
 * @returns The requested service instance
 */
export const useService = <T extends IService>(
    serviceName: string,
    factory: () => T,
    registry?: ServiceRegistry | null
): T => {
    // Determine which registry to use. Default to global.
    const targetRegistry = registry || globalServiceRegistry;

    // Use useState to ensure lazy initialization and stability across renders
    const [service] = useState(() => {
        return getOrRegisterService(targetRegistry, serviceName, factory);
    });

    return service;
};
