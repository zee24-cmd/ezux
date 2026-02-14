import { BaseService } from './BaseService';

/**
 * Base interface for all services in the EzUX ecosystem.
 * @group Services
 */
export interface IService {
  /** Unique name of the service for registration and lookup. @group Data */
  name: string;
  /** Optional cleanup logic to run when the service is unregistered. @group Methods */
  cleanup?: () => void;
}

/**
 * Interface for a service repository that manages service lifecycles and dependency injection.
 * @group Services
 */
export interface ServiceRegistry {
  /** Registers a service instance by name. @group Methods */
  register<T extends IService>(name: string, service: T): void;
  /** Retrieves a service instance by name, if it exists. @group Methods */
  get<T extends IService>(name: string): T | undefined;
  /** Retrieves a service or throws an error if not found. @group Methods */
  getOrThrow<T extends IService>(name: string): T;
  /** Removes a service from the registry and triggers its cleanup. @group Methods */
  unregister(name: string): void;
  /** Triggers cleanup for all registered services. @group Methods */
  cleanupAll(): void;
}

interface ServiceRegistryState {
  serviceNames: string[];
}

/**
 * A central repository for managing and accessing shared services.
 * 
 * Supports dependency injection patterns across components and ensures
 * proper singleton management and cleanup of library resources.
 * 
 * @group Services
 */
export class EzServiceRegistry extends BaseService<ServiceRegistryState> implements ServiceRegistry {
  name = 'ServiceRegistry';
  private services = new Map<string, IService>();

  constructor() {
    super({ serviceNames: [] });
    this.registerCleanup(() => this.cleanupAll());
  }

  register<T extends IService>(name: string, service: T): void {
    if (this.services.has(name)) {
      console.warn(`Service ${name} is already registered. Overwriting.`);
      this.unregister(name);
    }
    this.services.set(name, service);
    this.updateState();
  }

  get<T extends IService>(name: string): T | undefined {
    return this.services.get(name) as T | undefined;
  }

  getOrThrow<T extends IService>(name: string): T {
    const service = this.get<T>(name);
    if (!service) {
      throw new Error(`Service ${name} not found in registry.`);
    }
    return service;
  }

  unregister(name: string): void {
    const service = this.services.get(name);
    if (service?.cleanup) {
      service.cleanup();
    }
    if (this.services.delete(name)) {
      this.updateState();
    }
  }

  cleanupAll(): void {
    for (const service of this.services.values()) {
      if (service.cleanup) {
        service.cleanup();
      }
    }
    this.services.clear();
    this.updateState();
  }

  private updateState() {
    this.setState({ serviceNames: Array.from(this.services.keys()) });
  }

}

export const globalServiceRegistry = new EzServiceRegistry();
