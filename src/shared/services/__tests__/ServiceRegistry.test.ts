import { describe, it, expect, beforeEach } from 'vitest';
import { EzServiceRegistry } from '../ServiceRegistry';
import { BaseService } from '../BaseService';

class MockService extends BaseService<any> {
    name = 'mock';
    constructor() {
        super({});
    }
}

describe('ServiceRegistry', () => {
    let registry: EzServiceRegistry;

    beforeEach(() => {
        registry = new EzServiceRegistry();
    });

    it('should register and retrieve a service', () => {
        const mock = new MockService();
        registry.register('mock', mock);
        expect(registry.get('mock')).toBe(mock);
    });

    it('should throw an error if service is missing', () => {
        expect(() => registry.getOrThrow('missing')).toThrow();
    });

    it('should check if a service has been registered', () => {
        const mock = new MockService();
        registry.register('mock', mock);
        expect(registry.get('mock')).toBeDefined();
        expect(registry.get('missing')).toBeUndefined();
    });

    it('should be able to clear registry', () => {
        const mock = new MockService();
        registry.register('mock', mock);
        registry.cleanupAll();
        expect(registry.get('mock')).toBeUndefined();
    });
});
