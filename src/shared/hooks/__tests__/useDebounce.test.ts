import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should return initial value', () => {
        const { result } = renderHook(() => useDebounce('initial', 500));
        expect(result.current).toBe('initial');
    });

    it('should debounce value changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'initial', delay: 500 } }
        );

        expect(result.current).toBe('initial');

        rerender({ value: 'changed', delay: 500 });
        expect(result.current).toBe('initial'); // Not changed yet

        act(() => {
            vi.advanceTimersByTime(250);
        });
        expect(result.current).toBe('initial'); // Still not changed

        act(() => {
            vi.advanceTimersByTime(250); // Total 500ms
        });
        expect(result.current).toBe('changed');
    });
});
