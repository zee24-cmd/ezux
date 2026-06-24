import '@testing-library/jest-dom';
import { cleanup, act } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test and flush pending async tasks/lazy loads in act
afterEach(async () => {
    cleanup();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
    });
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { }, // deprecated
        removeListener: () => { }, // deprecated
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => { },
    }),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds = [];
    takeRecords() {
        return [];
    }
};
