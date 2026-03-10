# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [1.1.12] - 2026-03-10

### Added
- **EzLayout**: Added resizable sidebar support with `sidebarResizable`, `sidebarMinWidth`, `sidebarMaxWidth`, and `onSidebarResize` props. Integrated `react-resizable-panels` for smooth resizing on desktop.

### Fixed
- **EzLayout**: Fixed an issue where the responsive, resizable sidebar would collapse to zero-width or hide all text due to a pixel vs percentage misinterpretation by the `react-resizable-panels` package.
- **EzLayout**: Corrected sidebar collapse behavior so that the resize handle is only active in the expanded state, while the collapsed state properly displays navigation icons without a handle.

### Changed
- **EzTreeView**: Replaced `ChevronRight`/`ChevronDown` expand/collapse icons with standard `Plus`/`Minus` icons for a more traditional tree navigation feel.
- **Dependencies**: Performed a full dependency update, upgrading `@tanstack/react-form`, `lucide-react`, `dompurify`, `happy-dom`, `postcss`, and several other core packages to their latest versions.

### Fixed
- **EzTreeView**: Resolved a bug where indeterminate checkbox states were not correctly synchronized or updated during recursive selection. Fixed state derivation in `useTreeSelection` to ensure parent nodes accurately reflect child check states.

## [1.1.11] - 2026-02-28

### Fixed
- **Build**: Fixed missing `theme-vars.css` in the `dist` folder by adding a post-build copy hook to `vite.config.ts`.
- **Exports**: Corrected several sub-path type exports in `package.json` that were pointing to non-existent deep paths after type rollup consolidation. These fixes resolve build failures for consumers (like `ezux-showcase`) on platforms like Vercel.


### Added
- **EzLayout**: Introduced `EzSidebarNav`, `EzSidebarNavItem`, and `EzSidebarFooter` for structured, multi-level navigation.
- **EzLayout**: Added support for premium popover menus in collapsed sidebar mode, ensuring nested items are accessible with full labels and icons.
- **EzLayout**: Integrated `EzOrganizationSwitcher` into the core layout for enterprise-grade context switching.
- **EzLayout**: Added `useLayoutService` hook for easier access to layout state and actions.

### Changed
- **EzLayout**: Optimized re-render performance by removing `useTransition` and making layout state updates synchronous, effectively resolving "flickering" issues during sidebar toggles.
- **EzLayout**: Centralized `LayoutService` registration within `<EzProvider>` to ensure a stable, global singleton across the application.
- **EzSignature**: Updated default pen color to `#0321ab` for a more professional "Ink Blue" aesthetic.
- **EzSignature**: Improved mobile responsiveness by implementing a dynamic height (200px on mobile, 400px on desktop) via `useMediaQuery`.

### Fixed
- **Security**: Resolved 5 high severity ReDoS vulnerabilities by updating `minimatch` override to `10.2.4`.
- **EzLayout**: Fixed TypeScript error in `EzLayout` component related to `isPending` prop removal.
- **EzLayout**: Fixed visibility of nested navigation icons in collapsed sidebar mode.
- **EzLayout**: Resolved console warnings regarding multiple `LayoutService` registrations.
- **EzLayout**: Eliminated redundant entry animations on `MainContent` that triggered during state updates.

## [1.1.7] - 2026-02-24

### Added
- **Service Architecture**: Introduced `<EzProvider>` context to manage a localized `ServiceRegistry` via React Context, for improved SSR compatibility.
- **Service Architecture**: Added factory hooks (`useThemeService`, `useI18nService`, `useNotificationService`, `useEzServiceRegistry`) to simplify service consumption.
- **Type Definitions**: Configured `vite-plugin-dts` with `rollupTypes: true` to generate standalone, properly consolidated `.d.ts` files for all sub-module entries.
- **Theming**: Extracted CSS theme variables into a standalone `dist/theme-vars.css` for consumers who want tokens without the Tailwind CSS runtime.
- **Exports**: Added explicit exports for orchestrator hooks (`useEzTable`, `useEzScheduler`, `useEzKanban`) and shared hooks (`useEzTheme`, `useMediaQuery`, `useDebounce`, `useDialogState`, `useRowSelectionEvents`).

### Changed
- **API Standardization**: Refactored the orchestrator hooks (`useEzScheduler`, `useEzTable`, `useEzKanban`, `useEzLayout`, `useEzTreeView`) to consistently return an object separated into `{ state, actions, services, config, refs }`. 
- **Service Architecture**: Added SSR guards (`typeof window !== 'undefined'`) to DOM-dependent services (`ThemeService`, `I18nService`, `NotificationService`).
- **Service Architecture**: Refactored legacy hooks and internal components to consume the new Context-based registry instead of the deprecated singleton `globalServiceRegistry`.
- **Dependencies**: Massively reduced `peerDependencies` to only require `react`, `react-dom`, and `@tanstack/*` packages. `lucide-react`, `date-fns`, `dompurify`, `@radix-ui/*` and `@dnd-kit/*` are now bundled dependencies.
- **Dependencies**: Made `rrule` an optional peer dependency via `peerDependenciesMeta`.
- **Dependencies**: Ensured internal styling helpers (`clsx`, `class-variance-authority`, `tailwind-merge`) are bundled correctly and not externalized.
- **Exports**: Replaced wildcard exports (`export *`) with explicit named exports in the main entry point to improve tree-shaking and avoid namespace collisions.
- **Exports**: Defined a formal public API surface using `/** @public */` and `/** @internal */` TSDoc tags in `src/index.ts` to document which exports are stable versus internal details.
- **Documentation**: Formally documented in `README.md` that consumers must provide their own **Tailwind CSS v4** installation to use `ezux`.

### Removed
- **Service Architecture**: Removed `globalServiceRegistry` export entirely to enforce React Context service boundaries instead of singletons.
- **API Cleanups**: Removed `useSchedulerImperative` from the returned values in `useEzScheduler` as it is an internal implementation detail, and removed raw `store`/`actions` from orchestrator hook returns.
- **CSS**: Completely removed `@import "tailwindcss"` from the distributed CSS so the library no longer imposes the full Tailwind runtime on consumers.
- **CSS**: Removed all global layout resets (`html`, `body`, `#root` styles) from `dist/ezux.css` to guarantee the library never imposes structural CSS constraints on the host application.

### Dependencies
- **Dependencies**: Updated `tailwindcss` and `@tailwindcss/postcss` to `4.2.1`.
- **Dependencies**: Upgraded `@tanstack/react-store` and `@tanstack/store` to `0.9.1` (minor).
- **Dependencies**: Updated `@tanstack/react-virtual` and `@tanstack/virtual-core` to `3.13.19`.
- **Dependencies**: Updated `country-flag-icons` to `1.6.14`.

### Fixed
- **EzTable**: Fixed drag handle (grip icon) visibility in column headers to properly respect `allowReordering` definitions on individual columns and prevent dragging special/internal columns like `select` and `actions`.

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
