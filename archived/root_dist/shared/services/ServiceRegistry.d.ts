export interface IService {
    name: string;
    cleanup?: () => void;
}
export interface ServiceRegistry {
    register<T extends IService>(name: string, service: T): void;
    get<T extends IService>(name: string): T | undefined;
    getOrThrow<T extends IService>(name: string): T;
    unregister(name: string): void;
    cleanupAll(): void;
}
export declare class EzServiceRegistry implements ServiceRegistry {
    private services;
    register<T extends IService>(name: string, service: T): void;
    get<T extends IService>(name: string): T | undefined;
    getOrThrow<T extends IService>(name: string): T;
    unregister(name: string): void;
    cleanupAll(): void;
}
export declare const globalServiceRegistry: EzServiceRegistry;
