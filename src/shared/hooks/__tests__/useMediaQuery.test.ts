import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMediaQuery } from '../useMediaQuery';

describe('useMediaQuery', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: query === '(min-width: 768px)', // match this one for test
                media: query,
                onchange: null,
                addListener: vi.fn(), // deprecated
                removeListener: vi.fn(), // deprecated
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    it('should return matches based on query', () => {
        const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
        expect(result.current).toBe(true);

        const { result: result2 } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
        expect(result2.current).toBe(false);
    });
});
