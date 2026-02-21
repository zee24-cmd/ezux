# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [1.1.6] - 2026-02-21

### Changed
- **EzTable**: Drag handle (grip icon) in column headers is now always visible when `enableColumnReorder` or `enableGrouping` is enabled, providing clear visual indication that columns are draggable.

## [1.1.5] - 2026-02-21

### Changed
- **Dependencies**: Updated `happy-dom` from `^20.6.3` to `^20.7.0`.
- **Dependencies**: Aligned `@tanstack/store` and `@tanstack/react-store` to `^0.8.1` to match `@tanstack/react-form@1.28.3` internal dependencies.
### Removed
- **Dependencies**: Removed deprecated `@types/dompurify` package - `dompurify` provides its own type definitions.

### Fixed
- **TanStack Form**: Fixed `atom?.get is not a function` error in `useField` hook by aligning store versions.
- **BaseService**: Fixed `subscribe` method to correctly return unsubscribe function for `@tanstack/store@0.8.1`.

## [1.1.4] - 2026-02-21

### Changed
- **Type Safety**: Updated all components to use proper TypeScript types instead of `any` throughout the codebase.
- **EzKanban**: Improved type definitions in `EzKanban.types.ts`, `CardEditorModal`, `KanbanBoard`, `KanbanCard`, `KanbanColumn`, `KanbanSwimlane`, and `KanbanToolbar`.
- **EzScheduler**: Enhanced type safety in `EzScheduler.types.ts`, `EzEventModal`, `EzSchedulerQuickAdd`, `RecurrenceEditor`, and view components.
- **EzTable**: Replaced `any` types with proper interfaces in `EzTable.types.ts`, `EzTableCell`, `EzTableRow`, `EzDraggableHeader`, and related hooks.
- **EzLayout**: Updated `EzLayout.types.ts`, authentication components, and layout hooks with strict typing.
- **EzTreeView**: Improved type definitions in `EzTreeView.types.ts`, `EzTreeViewItem`, and `EzVirtualTree`.
- **EzSignature**: Enhanced type safety in `EzSignature.tsx` and `EzSignature.types.ts`.
- **Shared Utilities**: Updated common types, hooks, and services with proper TypeScript types.

### Fixed
- Build process now completes successfully with strict TypeScript checking.
- All 28 unit tests passing.

## [1.1.0] - 2026-02-17

### Added
- **Modular Architecture**: Complete refactoring of core components (`EzScheduler`, `EzKanban`, `EzTable`, `EzLayout`, `EzTreeView`) to support tree-shakable, standalone usage.
- **EzScheduler**: New modular sub-components (`DayWeekView`, `MonthView`, `TimelineView`, `AgendaView`) and specialized hooks.
- **EzKanban**: Extracted `KanbanCard` and `KanbanColumn` for independent use.
- **EzTable**: Enhanced with `slots.toolbar` for custom toolbar injection and decoupled status bar logic.
- **EzLayout**: Decoupled `Sidebar`, `Header`, and `UserProfile` components.
- **EzTreeView**: Fully decoupled `useEzTreeView` hook and implemented slot-based node rendering.
- **EzSignature**: Verified as an atomic, standalone component.

### Changed
- **Package Structure**: Transitioned from a monorepo-style structure to a flat, standalone library structure, simplifying imports and usage.
- **Build System**: Updated build configuration to support individual component exports and optimal tree-shaking.
- **API**: Standardized component APIs to use `slots` pattern for customization, replacing legacy render props and configuration objects.
- **Documentation**: Updated `README.md` and component documentation to reflect the new modular architecture.

### Removed
- **Legacy Props**: Removed deprecated `components` prop from `EzScheduler` views in favor of the new composition model.
- **Monorepo Config**: Removed `packages/` directory structure and workspace configuration in favor of a single-package root.

### Fixed
- **EzScheduler**: Resolved build errors in `DayWeekView` and `TimelineView` related to legacy prop usage.
- **EzTable**: Fixed status bar row count accuracy and removed unnecessary `memo` wrappers.
- **EzKanban**: Corrected drag-and-drop behavior and column header rendering.
- **EzSignature**: Fixed background color consistency in dark/light modes.

## [1.0.7] - 2026-02-10

### Added
- Initial release of `ezux` component library.
- Core components: `EzLayout`, `EzTable`, `EzScheduler`, `EzKanban`, `EzTreeView`, `EzSignature`.
