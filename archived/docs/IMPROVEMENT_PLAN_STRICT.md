# Ezux Improvement Plan (Strict Compliance: SKILL.md)

**Objective**: Execute Phase 3 (Headless) and Phase 4 (CI/CD) with strict adherence to TanStack patterns, React 19 directives, and Type Safety.

## 🏗️ 1. Headless Components (Phase 3)
**Compliance**: `SKILL.md` -> "Compound / Headless" architecture.
**Requirement**: Must use `TableStore` (TanStack Store) and `Context` for state.

### 1.1 `EzTable.Header` (P0)
- **Directives**: `'use client'`
- **Store Usage**: Subscribe to `sorting` and `columnVisibility` slices.
- **Features**: Drag-and-drop columns (dnd-kit integration), Resize handles, Sort indicators.

### 1.2 `EzTable.Body` (P0)
- **Directives**: `'use client'`
- **Store Usage**: Subscribe to `data`, `pagination`, `sorting`, `filtering`.
- **Features**:
  - **Virtualization**: Uses `@tanstack/react-virtual` (SKILL compliance).
  - **Render**: Accepts `rowComponent` as a prop or uses default `EzTable.Row`.

### 1.3 `EzTable.Toolbar`
- **Directives**: `'use client'`
- **Store Usage**: Reading/Writing `globalFilter` and `columnFilters`.
- **Features**: Debounced input (via `useTransition` for React 19 compliance).

### 1.4 "As Child" Pattern (Polymorphism)
- **Target**: `EzButton`, `EzTable.Row`.
- **Implementation**: Install `@radix-ui/react-slot`. All core interactive primitives must accept `asChild` to wrap User Links (e.g. `NextLink` or `TanStack Link`).

---

## 🎨 2. Theming & Design System (Phase 4)
**Compliance**: `SKILL.md` -> "Tailwind First".

### 2.1 CSS Variables API
- **Action**: Formalize `--ez-primary`, `--ez-radius` in `index.css`.
- **Action**: Create a typesafe `ThemeContext` using `TanStack Store`.

---

## 🚀 3. CI/CD Pipeline
**Compliance**: `SKILL.md` -> "Vite/Pnpm Workflow".

### 3.1 GitHub Actions (`.github/workflows/ci.yml`)
- **Step 1**: Install pnpm.
- **Step 2**: Lint (`eslint`, `tsc --noEmit`).
- **Step 3**: Test (`vitest` for lib, `playwright` for showcase).
- **Step 4**: Build (`vite build`).

---

## 📝 Execution Steps
1.  **Scaffold**: Create `headless` directory in `EzTable`.
2.  **Extract Header**: Create `EzTableHeader.tsx`.
3.  **Extract Body**: Create `EzTableBody.tsx`.
4.  **Implement Slot**: Add `@radix-ui/react-slot` to `EzButton`.
5.  **CI**: Write `ci.yml`.
