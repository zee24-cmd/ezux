# Performance Optimization Review & Audit

**Target**: Monorepo Architecture (`packages/ezux` + `apps/showcase`)
**Compliance**: SKILL.md (TanStack Stack, React 19.2)

---

## 🔴 Critical Performance Bottlenecks (Pre-Refactor)

The following issues must be addressed during the migration to the Monorepo structure.

### 1. Bundle Isolation Failure (The "Contamination")
**Severity**: 🚨 **Critical (P0)**
**Location**: `src/index.ts` (currently)
**Problem**: The library bundle currently has no physical barrier against demo dependencies.
- **Evidence**: `EzTable` demos import `@faker-js/faker` (1.5MB). If any demo code is accidentally reachable from `EzTable`, Webpack/Vite will bundle Faker into the production library.
- **Fix**: **Physical Separation**. In the new structure, `packages/ezux` will not have `@faker-js/faker` in its `package.json`. It will be a `devDependency` of `apps/showcase` ONLY.

### 2. Synchronous "God Mode" Rendering
**Severity**: 🔴 **High (P1)**
**Location**: `EzTable/useEzTable.ts`
**Problem**: The `useEzTable` hook centralizes too much state.
- **Code**:
  ```ts
  const [data, setData] = useState(initialData); // Holds ALL data (10k rows)
  const [globalFilter, setGlobalFilter] = useState(''); // Typing here triggers root re-render
  ```
- **Impact**: Typing one character in "Search" causes:
  1. `EzTableImpl` re-render
  2. `DndContext` re-evaluation
  3. `Virtualizer` re-calculation
  4. 50+ `EzTableRow` re-renders
- **Fix (React 19/TanStack)**:
  - Use `useTransition` for filter updates.
  - Move state to `TanStack Store`. `EzTable` components subscribe only to their slice.

### 3. Blocking Data Generation (UI Freeze)
**Severity**: 🔴 **High (P1)**
**Location**: `demos/EzTableDemoWrapper.tsx`
**Problem**: Data generation runs on the Main Thread.
- **Code**: `const data = generateData(50000);` blocks the UI for ~500ms-1000ms.
- **SKILL.md Compliance**: Missing `TanStack Query` and `Workers`.
- **Fix**: Move generation to `apps/showcase/src/workers/data.worker.ts` and wrap with `useQuery`.

### 4. Cell Renderer Thrashing
**Severity**: 🟡 **Medium (P2)**
**Location**: `EzTable/index.tsx`
**Problem**: Inline object/function creation in render loops.
- **Code**:
  ```tsx
  // Created 10,000 times
  cell: ({ getValue }) => <span style={{ color: 'red' }}>...</span>
  ```
- **Fix**: Extract static cell renderers and styles.

---

## 🟢 Architecture Compliance Audit (SKILL.md)

| Requirement | Current Status | Remediation Plan (Monorepo) |
| :--- | :--- | :--- |
| **Dependencies** | ❌ Mixed | **Strict**. `packages/ezux/package.json` contains *only* `peerDependencies` (React) and UI libs (`@tanstack/react-table`). |
| **React 19** | ❌ React 18 patterns | **Strict**. Add `'use client'` to `EzTable` components. Use `useTransition` for filtering. |
| **TanStack Query** | ❌ `useEffect` | **Adopt**. `apps/showcase` uses Query for data. `packages/ezux` remains agnostic (accepts `data` prop). |
| **TanStack Router** | ❌ View State (`view === 'table'`) | **Adopt**. `apps/showcase` uses Router for `/components/table`, `/components/scheduler`. |
| **Testing** | ❌ None | **Add**. `packages/ezux` gets `vitest`. `apps/showcase` gets `playwright`. |

---

## 📉 Expected Metrics (Post-Migration)

| Metric | Current (Est.) | Target (Monorepo) |
| :--- | :--- | :--- |
| **Lib Bundle Size** | ~1.8 MB (Risk) | **< 150 KB (Gzipped)** |
| **Demo First Paint** | ~1.2s | **< 300ms** (Chunks) |
| **Filter Latency** | ~100ms (Main Thread) | **< 16ms** (Transition) |
| **Type Safety** | Loose | **strict: true** (TS 5.9) |
