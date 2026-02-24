import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ThemeService } from '../ThemeService';

describe('ThemeService', () => {
    let service: ThemeService;

    beforeEach(() => {
        // Mock document classes for theme changes
        document.documentElement.className = '';
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
        service = new ThemeService();
    });

    afterEach(() => {
        document.documentElement.className = '';
    });

    it('should initialize with light theme by default', () => {
        expect(service.getState().mode).toBe('light');
    });

    it('should set theme successfully', () => {
        service.setMode('dark');
        expect(service.getState().mode).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should toggle theme', () => {
        service.setMode('light');
        service.toggleMode();
        expect(service.getState().mode).toBe('dark');
        service.toggleMode();
        expect(service.getState().mode).toBe('light');
    });

    it('should emit changes when theme updates', () => {
        const subscriber = vi.fn();
        service.subscribe(subscriber);
        service.setMode('dark');
        expect(subscriber).toHaveBeenCalled();
    });
});
