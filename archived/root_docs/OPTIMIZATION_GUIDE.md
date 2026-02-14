# EzUX Optimization Guide

This guide documents the optimization and refactoring work performed during Phase 3 of the EzUX development process. The goal was to centralize common logic, improve performance through advanced virtualization, and establish clear architectural patterns for future component development.

## 1. Centralized Types (`/src/shared/types`)

We have consolidated base component properties and common data types to ensure consistent APIs across all components.

- **`BaseComponentProps`**: Centralized base props for all components (id, className, style, dir, etc.).
- **`CommonTypes`**: Standardized definitions for Filters, Selection, and Tree structures.

**Usage:**
```typescript
import { BaseComponentProps } from '../../shared/types/commonTypes';

interface MyComponentProps extends BaseComponentProps {
  // component specific props
}
```

## 2. Shared Hooks (`/src/shared/hooks`)

### `useVirtualization`
An enhanced virtualization hook powered by `@tanstack/react-virtual`, supporting both row and column virtualization with advanced features:

- **Progressive Rendering**: Reduces overscan during active scrolling to maintain high frame rates, restoring it when idle.
- **Prefetching**: Configurable prefetch distance to ensure smooth data availability.
- **Adaptive Sizing**: Support for dynamic row/item heights.
- **Debug Mode**: Real-time console metrics for virtualization performance.

### `useComponentState`
A foundational hook for building enterprise-grade components. It manages:
- **Initial State**: Syncing props to internal state.
- **Service Integration**: Automatic subscription to state-providing services.
- **Persistence**: Built-in support for `PersistenceService`.
- **Debouncing**: Standardized change handling with debounce options.

### `useEventHandlers`
Centralizes event management and prevents unnecessary re-renders by memoizing callback handlers.

## 3. Shared Services (`/src/shared/services`)

### `BaseService`
All services now extend `BaseService`, which provides:
- **Reactive State**: Built-in observer pattern.
- **Automatic Cleanup**: A registration mechanism for side-effect clearers (intervals, listeners).
- **ServiceRegistry**: Centralized management and lifecycle control of all application services.

## 4. Component Composition Pattern

Complex components like `EzTable` and `EzScheduler` have been refactored into logical sections:

- **Logic Orchestration**: The main `index.tsx` and `useEzTable` / `useEzScheduler` hooks coordinate high-level logic.
- **Section Components**: Rendering is delegated to specialized components (e.g., `EzTableHeaderSection`, `EzTableBodySection`, `EzSchedulerContent`).
- **Sub-hooks**: Specific features are isolated into internal hooks (e.g., `useTableFiltering`, `useTableVirtualization`).

## 5. Performance Best Practices

1. **Memoization**: All complex sub-components and rendering sections are wrapped in `React.memo`.
2. **Double Negation**: Always cast optional boolean props to strict booleans (e.g., `!!prop`) before passing to internal components to avoid type mismatches.
3. **Slot Pattern**: Use the `slots` and `slotProps` pattern to allow users to override internal component rendering without losing core logic.

---

*This guide is part of the EzUX Enterprise Architecture documentation.*
