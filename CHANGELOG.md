# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
