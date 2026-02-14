import { useCallback } from 'react';
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';

/**
 * Configuration for component event handlers.
 * @group Properties
 */
export interface EventHandlerConfig {
    /** Triggered when a drag operation starts. @group Events */
    onDragStart?: (event: DragStartEvent) => void;
    /** Triggered while an item is being dragged over. @group Events */
    onDragOver?: (event: DragOverEvent) => void;
    /** Triggered when a drag operation completes. @group Events */
    onDragEnd?: (event: DragEndEvent) => void;
    /** Triggered on key press. @group Events */
    onKeyPress?: (event: React.KeyboardEvent) => void;
    /** Triggered on key down. @group Events */
    onKeyDown?: (event: React.KeyboardEvent) => void;
    /** Triggered on key up. @group Events */
    onKeyUp?: (event: React.KeyboardEvent) => void;
    /** Triggered on mouse click. @group Events */
    onClick?: (event: React.MouseEvent) => void;
    /** Triggered on mouse double-click. @group Events */
    onDoubleClick?: (event: React.MouseEvent) => void;
    /** Triggered when focus state changes. @group Events */
    onFocusChange?: (focused: boolean) => void;
    /** Triggered on pointer down (touch/mouse). @group Events */
    onPointerDown?: (event: React.PointerEvent) => void;
    /** Triggered on pointer move (touch/mouse). @group Events */
    onPointerMove?: (event: React.PointerEvent) => void;
    /** Triggered on pointer up (touch/mouse). @group Events */
    onPointerUp?: (event: React.PointerEvent) => void;
    /** Triggered when pointer leaves element. @group Events */
    onPointerLeave?: (event: React.PointerEvent) => void;
    /** Triggered when pointer enters element. @group Events */
    onPointerEnter?: (event: React.PointerEvent) => void;
}

/**
 * An enhanced hook that standardizes event processing across all EzUX components.
 * 
 * Provides pre-bound, memoized handlers for DND, keyboard, mouse, and pointer events,
 * ensuring consistent behavior and high performance.
 * 
 * @param config Configuration of desired event callbacks.
 * @group Hooks
 */
export function useEventHandlers(config: EventHandlerConfig) {
    // DND Handlers
    const handleDragStart = useCallback((event: DragStartEvent) => {
        config.onDragStart?.(event);
    }, [config.onDragStart]);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        config.onDragOver?.(event);
    }, [config.onDragOver]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        config.onDragEnd?.(event);
    }, [config.onDragEnd]);

    // Keyboard Handlers
    const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
        config.onKeyPress?.(event);
    }, [config.onKeyPress]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        config.onKeyDown?.(event);
    }, [config.onKeyDown]);

    const handleKeyUp = useCallback((event: React.KeyboardEvent) => {
        config.onKeyUp?.(event);
    }, [config.onKeyUp]);

    // Mouse Handlers
    const handleClick = useCallback((event: React.MouseEvent) => {
        config.onClick?.(event);
    }, [config.onClick]);

    const handleDoubleClick = useCallback((event: React.MouseEvent) => {
        config.onDoubleClick?.(event);
    }, [config.onDoubleClick]);

    // Pointer Handlers
    const handlePointerDown = useCallback((event: React.PointerEvent) => {
        config.onPointerDown?.(event);
    }, [config.onPointerDown]);

    const handlePointerMove = useCallback((event: React.PointerEvent) => {
        config.onPointerMove?.(event);
    }, [config.onPointerMove]);

    const handlePointerUp = useCallback((event: React.PointerEvent) => {
        config.onPointerUp?.(event);
    }, [config.onPointerUp]);

    const handlePointerLeave = useCallback((event: React.PointerEvent) => {
        config.onPointerLeave?.(event);
    }, [config.onPointerLeave]);

    const handlePointerEnter = useCallback((event: React.PointerEvent) => {
        config.onPointerEnter?.(event);
    }, [config.onPointerEnter]);

    // Focus Handlers
    const handleFocus = useCallback(() => {
        config.onFocusChange?.(true);
    }, [config.onFocusChange]);

    const handleBlur = useCallback(() => {
        config.onFocusChange?.(false);
    }, [config.onFocusChange]);

    return {
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleKeyPress,
        handleKeyDown,
        handleKeyUp,
        handleClick,
        handleDoubleClick,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handlePointerLeave,
        handlePointerEnter,
        handleFocus,
        handleBlur
    };
}
