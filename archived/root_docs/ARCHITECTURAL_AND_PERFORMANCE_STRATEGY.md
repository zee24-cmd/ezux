# Holistic Architecture & Performance Strategy (Monorepo Edition)

**Objective**: Establish a scalable "TanStack-First" Monorepo architecture to maximize component control, enforce strict boundary separation, and optimize performance.
**Compliance**: SKILL.md (TanStack Stack, React 19, TypeScript 5.9).

## 📊 Before vs After Comparison

| Feature | **Before (Current)** | **After (Monorepo Target)** | **Improvement Type** |
| :--- | :--- | :--- | :--- |
| **Project Structure** | **Single Repository**. Demos and Library mixed in `src`. Risky leakage of dev dependencies (Faker) into prod bundle. | **pnpm Workspace**. `packages/ezux` (Pure Lib) vs `apps/showcase` (Demos). Physical verification of library exports. | **Quality & Control** |
| **Component Architecture** | **Monolithic**. `EzTable` handles UI + Logic + Data Fetching. "God Mode" props. | **Compound / Headless**. `EzTable.Root` (Context) > `EzTable.Header` > `EzTable.Body`. Logic lifted to TanStack Store/Hooks. | **Control** |
| **State Management** | **React `useState`**. Prop drilling. Full re-renders on minor updates. | **TanStack Store**. External, granular state. Atomic updates. | **Performance** |
| **Data Fetching** | **Synchronous / `useEffect`**. Blocking UI. "Waterfall" fetching in demos. | **TanStack Query**. Async, cached, server-state synchronization. | **SKILL.md Compliance** |
| **Bundle Size** | **Unknown / Bloated**. Demos included in build. Hard not to ship unused code. | **Pure**. Library bundle contains *only* library code. Demos are separate. Optimized tree-shaking. | **Performance** |
| **Testing** | **None**. | **Vitest (Lib) + Playwright (App)**. Unit tests for hooks, E2E for Showcase. | **Reliability** |

---

## 🏗️ Detailed Architectural Strategy

### 1. The Monorepo Workspace (Control & Isolation)
We will adopt a `pnpm` workspace structure to physically separate the "Product" (Ezux) from the "Consumer" (Showcase).

```text
/ez-workspace
 ├── package.json (Workspace Root)
 ├── pnpm-workspace.yaml
 ├── /packages
 │    └── /ezux           # 📦 The Library
 │          ├── src/      # Pure components (no demos)
 │          ├── package.json
 │          └── vite.config.ts (Library Mode)
 └── /apps
      └── /showcase       # 🚀 The Demo App
            ├── src/      # Demos utilizing "ezux"
            ├── package.json (Dependencies: "ezux": "workspace:*")
            └── vite.config.ts (App Mode)
```

**Why this wins**:
*   **Enforced Boundaries**: The `showcase` app literally cannot access internal utils from `ezux` unless they are exported in `ezux/index.ts`. This acts as a continuous "Integration Test" for your public API.
*   **Zero Bloat**: `@faker-js/faker` stays in `apps/showcase/package.json`. It never touches the `ezux` bundle.

### 2. "TanStack-First" Component Design
We will refactor components to adhere to `SKILL.md` by leveraging the TanStack ecosystem.

*   **Logic → TanStack Store**: Instead of `useEzTable` managing all state, we create granular stores (`sortingStore`, `selectionStore`).
*   **Data → TanStack Query**: Demos in `showcase` will use `useQuery` to fetch/generate data, passing standard JS objects to `ezux`.
*   **Routing → TanStack Router**: The `showcase` app will use TanStack Router for navigation between demos, allowing deep-linking (e.g., `/demos/table?grouping=true`).

### 3. React 19 Compliance
*   **Directives**: All interactive library components will be marked `'use client'`.
*   **Actions**: Data mutations (in demos/docs) will use Server Actions patterns (simulated or real).
*   **Transitions**: Heavy UI updates (filtering 10k rows) wrapped in `useTransition`.

---

## 🚀 Performance Strategy

### 1. Architectural Prevention (The "Wall")
By moving demos to `apps/showcase`, we physically prevent the inclusion of:
*   `@faker-js/faker` (1.5MB)
*   Heavy data generation logic
*   Demo-specific assets
...from entering the `ezux` npm package.

### 2. Granular Re-renders
Refactor `EzTable` from a mono-component to a set of granular components that subscribe to specific slices of a `TableStore`.
*   *Current*: "Global Filter" change -> Re-renders `EzTable` -> Re-renders all 50 `Row` components.
*   *Target*: "Global Filter" change -> Updates `filterStore` -> Re-renders only `Toolbar` and `TableBody` (via Virtualizer). `TableHeader` stays untouched.

### 3. Asynchronous Data
Move synchronous data generation in Demos to:
1.  **Web Workers**: For client-side generation.
2.  **TanStack Query**: For managing the async state (loading, error, data).

---

## 🗺️ Execution Roadmap

1.  **Phase 1: Structure (The Move)**
    *   Initialize `pnpm` workspace.
    *   Move `src` code to `packages/ezux`.
    *   Move `demos` to `apps/showcase`.
    *   Fix imports and `package.json` dependencies.

2.  **Phase 2: Stabilization**
    *   Ensure `showcase` builds using the local `ezux` package.
    *   Implement `React.lazy` for demo routes in `showcase`.

3.  **Phase 3: Refinement (The "Ez" Factor)**
    *   Refactor `EzTable` internal state to use `TanStack Store` (or granular Context).
    *   Adopt `TanStack Query` in `showcase` for data handling.
