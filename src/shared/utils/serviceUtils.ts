import { ServiceRegistry, IService } from '../services/ServiceRegistry';

/**
 * Ensures a service is registered in the registry and returns it.
 * If not present, creates a new instance using the factory.
 */
export const getOrRegisterService = <T extends IService>(
    registry: ServiceRegistry,
    key: string,
    factory: () => T
): T => {
    let service = registry.get<T>(key);
    if (!service) {
        service = factory();
        registry.register(key, service);
    }
    return service;
};

/**
 * Ensures multiple services are registered in the registry.
 */
export const ensureServices = (
    registry: ServiceRegistry,
    services: Record<string, () => IService>
) => {
    Object.entries(services).forEach(([key, factory]) => {
        if (!registry.get(key)) {
            registry.register(key, factory());
        }
    });
};
