/**
 * Shared hooks index
 * Exports all shared hooks for easy importing
 */

export { useBaseComponent } from './useBaseComponent';
export type { BaseComponentConfig, BaseComponentState, BaseComponentAPI } from './useBaseComponent';

export { useVirtualization } from './useVirtualization';
export type { VirtualizationConfig, VirtualizationResult } from './useVirtualization';

export { useEzTheme } from './useEzTheme';
export { useI18n } from './useI18n';

export { useLifecycleEvents } from './useLifecycleEvents';
export type { LifecycleCallbacks } from './useLifecycleEvents';

export { useDataChangeEvents } from './useDataChangeEvents';
export type { DataChangeCallbacks } from './useDataChangeEvents';

export { useRowSelectionEvents } from './useRowSelectionEvents';
export type { RowSelectionCallbacks, RowSelectionState } from './useRowSelectionEvents';

export { useStateChangeEvents } from './useStateChangeEvents';
export type { StateChangeCallbacks, SortingState, PaginationState } from './useStateChangeEvents';

export { useComponentState } from './useComponentState';
export type { StateConfig } from './useComponentState';

export { useEventHandlers } from './useEventHandlers';
export type { EventHandlerConfig } from './useEventHandlers';

/**
 * An advanced hook for exposing an imperative API from an EzUX component.
 * 
 * Standardizes the pattern of using `useImperativeHandle` with optional validation
 * methods and base API merging.
 * 
 * @param ref The ref object to attach the API to.
 * @param api The core API methods to expose.
 * @param options Additional imperative methods or overrides.
 * @group Hooks
 */
export { useComponentImperativeAPI } from './useComponentImperativeAPI';
/**
 * A lightweight hook for exposing an imperative API from a component.
 * 
 * Consolidates the imperative API pattern using `useImperativeHandle`,
 * ensuring efficient reference stability.
 * 
 * @param ref The ref object from the forwardRef or parent component.
 * @param api An object containing the methods and properties to expose.
 * @group Hooks
 */
export { useImperativeAPI } from './useImperativeAPI';
export { useDndHandlers } from './useDndHandlers';
export { useLoadingState } from './useLoadingState';
export { useFieldValidation } from './useFieldValidation';
export { useService } from './useService';
export { useMediaQuery } from './useMediaQuery';
export { useCurrentTime } from './useCurrentTime';
export { useDialogState } from './useDialogState';
export { useKeyboardNavigation } from './useKeyboardNavigation';
export { useHistory } from './useHistory';
export { useServiceState } from './useServiceState';
export { useInitCoreServices } from './useInitCoreServices';




