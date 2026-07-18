# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [1.1.24] - 2026-07-18

### Fixed
- **EzTable**: Prevented Add New row focus activation from moving the horizontal scrollbar to later editable columns.

## [1.1.23] - 2026-07-18

### Fixed
- **EzTable**: Restricted Add New row editor autofocus to the focused editable cell so horizontal scrolling stays on the first editable column.

## [1.1.22] - 2026-07-18

### Fixed
- **EzTable**: Improved Add New row focus for virtualized tables by scrolling both the target row and first editable column before activating the editor.

## [1.1.21] - 2026-07-18

### Fixed
- **EzTable**: When adding a row in normal edit mode, the table now scrolls the first editable cell into view, applies focus, and activates the editor for immediate input.

## [1.1.20] - 2026-07-18

### Added
- **EzTable**: Added query cache isolation test and concurrent callback emission regression tests to [useEzTable.test.tsx](file:///Users/zed/Documents/ezux/src/components/EzTable/__tests__/useEzTable.test.tsx).
- **TypeScript**: Added TypeScript 6 typecheck script validation to verify public API declaration file compatibility for consumer projects.

### Changed
- **Themes & Typography**: Added shared semantic typography tokens for display text, headings, body text, labels, captions, line heights, and touch targets across Zinc, Orange, Blue, Green, and Rose themes.
- **Responsive Design**: Added mobile typography adjustments and shared responsive text utilities to improve readability from mobile devices through wide desktop layouts.
- **Theming**: Updated shared inputs, textareas, and breadcrumbs to use semantic theme tokens instead of hardcoded zinc, white, and black colors, preserving custom theme behavior.
- **EzTable**: Refactored `queryKey` in [useEzTable.ts](file:///Users/zed/Documents/ezux/src/components/EzTable/useEzTable.ts) to utilize a `WeakMap` based service identity resolver for inline services, preventing cache collisions across different tables on the page.
- **EzTable**: Removed `setTimeout` event side-effects from updaters in [useTableState.ts](file:///Users/zed/Documents/ezux/src/components/EzTable/hooks/useTableState.ts) and [useTableFiltering.ts](file:///Users/zed/Documents/ezux/src/components/EzTable/hooks/useTableFiltering.ts), moving callback emissions to React-safe `useEffect` hooks.
- **EzTable**: Modernized [EzTableEditDialog.tsx](file:///Users/zed/Documents/ezux/src/components/EzTable/EzTableEditDialog.tsx) by implementing React 19 `useActionState` and `useOptimistic` form actions.
- **EzTable**: Eliminated remaining `any` type casts across [useTableState.ts](file:///Users/zed/Documents/ezux/src/components/EzTable/hooks/useTableState.ts), [useTableFiltering.ts](file:///Users/zed/Documents/ezux/src/components/EzTable/hooks/useTableFiltering.ts), [useEzTable.ts](file:///Users/zed/Documents/ezux/src/components/EzTable/useEzTable.ts), [useTableHistory.ts](file:///Users/zed/Documents/ezux/src/components/EzTable/hooks/useTableHistory.ts), and [useTableImperative.ts](file:///Users/zed/Documents/ezux/src/components/EzTable/hooks/useTableImperative.ts) in favor of strictly typed generics, index types, and safe object types.
- **EzTable**: Wrapped all asynchronous timeouts in [useTableImperative.ts](file:///Users/zed/Documents/ezux/src/components/EzTable/hooks/useTableImperative.ts) inside an unmount cleanup hook to prevent post-unmount state update errors.
- **EzKanban**: Fixed columns and swimlanes array mutation inside [KanbanBoard.tsx](file:///Users/zed/Documents/ezux/src/components/EzKanban/components/KanbanBoard.tsx) by copying arrays with the spread operator before invoking `.sort()`.
- **TypeScript**: Upgraded compilation framework to TypeScript 7 natively utilizing the Go-based typechecker binary. Added a TypeScript 6 compatibility bridge to support rollup declarations.
- **Security**: Upgraded dependency chain overrides (`fast-xml-parser` to `5.7.0`) to resolve 14 npm vulnerabilities.

## [1.1.19] - 2026-06-24

### Added
- **EzScheduler**: Added `timeOptions` support for scheduler event editors so consumers can provide valid appointment slots from location operating schedules.
- **EzScheduler**: Added `slotDurationOptions` for configurable toolbar interval choices.

### Changed
- **EzScheduler**: Plumbed `slotDuration` through `EzScheduler -> EzEventModal -> DateTimePicker`, including default event duration, imperative scroll methods, drag/resize preview snapping, and DateTimePicker-generated time slots.

## [1.1.18] - 2026-06-24

### Changed
- **Testing**: Enhanced test cleanup fixtures in [setup.ts](file:///Users/zed/Documents/ezux/test/setup.ts) to execute unmounts and flush pending dynamic/suspended imports inside `act()`, resolving console `act` warning output.

## [1.1.17] - 2026-06-24

### Changed
- **Typography & Accessibility**: Upgraded global font size and line-height tokens to relative units (`rem`) and improved sizes to conform with readability guidelines for age 40+ users (e.g., base body font size raised to `1rem`/`16px` equivalent and line-height to `1.5`).

## [1.1.16] - 2026-06-24

### Changed
- **React 19 Compatibility**: Modernized all UI primitives and core components by refactoring `React.forwardRef` to React 19 native prop-based refs (including `Button`, `Input`, `Checkbox`, `Textarea`, `Label`, `Switch`, `Tooltip`, `Popover`, `Card`, `Progress`, `Avatar`, `Tabs`, `EzTable`, and `EzScheduler`).
- **TypeScript**: Upgraded the compilation target and library output to `ES2022`. Cleaned up deprecated legacy compiler settings (`baseUrl`, `ignoreDeprecations`) in `tsconfig.json` for forward compatibility with TypeScript 7.0.
- **Hooks**: Refactored `useSchedulerImperative` to support nullable/optional ref prop signatures.

## [1.1.15] - 2026-04-29

### Added
- **EzFlow**: Added the `EzWorkflow` workflow builder, typed workflow nodes, validation, examples, local service adapters, import/export support, and production-readiness coverage.
- **Exports**: Added `ezux/flow`, `ezux/advanced`, and `ezux/mock-services` package entry points, with public API checks for consumer imports.

### Changed
- **Build**: Updated the Vite library build entries, externalization rules, path resolution, CSS side effects, and Node engine metadata for the expanded package surface.
- **EzScheduler**: Improved drag-and-drop behavior with drag overlays, pointer-aware collision detection, resource-aware drops, and before-event lifecycle guards for create, change, delete, resize, and drop operations.
- **EzTable**: Refined toolbar filtering, column hiding, row sizing, validation callbacks, status bar totals, context menu payloads, and scroll behavior.
- **Themes & i18n**: Expanded theme variables, service helpers, performance monitoring, and localization infrastructure.
- **Dependencies**: Added `@xyflow/react` and `framer-motion`, upgraded TanStack store packages to `0.11.0`, and refreshed Vite, Vitest, Tailwind, Playwright, and related tooling.

## [1.1.14] - 2026-04-10

### Changed
- **Migration**: Migrated the entire library to **Vite 8**, leveraging the new Rust-based **Rolldown** bundler for faster builds and improved developer experience.
- **Dependencies**: Upgraded `@vitejs/plugin-react` to **v6.0.0**, which uses **Oxc** for faster React transforms and removes the Babel dependency.
- **Icons**: Upgraded `lucide-react` to **v1.0.0**, providing improved accessibility with `aria-hidden="true"` by default and various performance optimizations.

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
