
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { EzSignature } from './index';
import { EzSignatureRef } from './EzSignature.types';
import React from 'react';

// Mock getStroke since it's math-heavy and we care about component logic
vi.mock('../../lib/perfect-freehand', () => ({
    getStroke: vi.fn(() => [[0, 0], [10, 10], [10, 0], [0, 0]]), // Return a dummy square polygon
}));

// Mock Pointer Capture API which is not fully implemented in happy-dom
if (typeof window !== 'undefined') {
    Element.prototype.setPointerCapture = vi.fn();
    Element.prototype.releasePointerCapture = vi.fn();
}

describe('EzSignature', () => {
    it('renders without crashing', () => {
        render(<EzSignature />);
        const container = document.querySelector('.ez-signature-container');
        expect(container).toBeInTheDocument();
        const svg = container?.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('exposes imperative API via ref', () => {
        const ref = React.createRef<EzSignatureRef>();
        render(<EzSignature ref={ref} />);

        expect(ref.current).toBeDefined();
        expect(ref.current?.clear).toBeInstanceOf(Function);
        expect(ref.current?.undo).toBeInstanceOf(Function);
        expect(ref.current?.save).toBeInstanceOf(Function);
        expect(ref.current?.isEmpty).toBeInstanceOf(Function);
    });

    it('interaction updates state (simulated)', () => {
        const onChange = vi.fn();
        const ref = React.createRef<EzSignatureRef>();
        render(<EzSignature ref={ref} onChange={onChange} />);

        const svg = document.querySelector('svg')!;

        // Simulate drawing
        fireEvent.pointerDown(svg, { buttons: 1, clientX: 10, clientY: 10, pressure: 0.5 });
        fireEvent.pointerMove(svg, { buttons: 1, clientX: 20, clientY: 20, pressure: 0.5 });
        fireEvent.pointerUp(svg);

        expect(onChange).toHaveBeenCalled();
        expect(ref.current?.isEmpty()).toBe(false);
    });

    it('clear resets state', () => {
        const ref = React.createRef<EzSignatureRef>();
        render(<EzSignature ref={ref} />);

        // Simulate drawing
        act(() => {
            ref.current?.load([[[0, 0, 0.5]]]); // Load dummy data
        });

        expect(ref.current?.isEmpty()).toBe(false);

        act(() => {
            ref.current?.clear();
        });

        expect(ref.current?.isEmpty()).toBe(true);
    });

    it('undo/redo works', () => {
        const ref = React.createRef<EzSignatureRef>();
        render(<EzSignature ref={ref} />);

        // 1st stroke
        act(() => {
            ref.current?.load([[[10, 10, 0.5]]]);
        });
        expect(ref.current?.getSignature().length).toBe(1);

        // Undo
        act(() => {
            ref.current?.undo();
        });
        // Logic for undo with load/history might depend on how load implements history push.
        // In my implementation: load sets strokes and pushes to history.
        // So undo should go back to previous state (empty if it was empty before).
        // Wait, initial history index is -1. Load pushes new history. index -> 0.
        // Undo -> index -1. Stokes -> [].
        expect(ref.current?.getSignature().length).toBe(0);

        // Redo
        act(() => {
            ref.current?.redo();
        });
        expect(ref.current?.getSignature().length).toBe(1);
    });
});
