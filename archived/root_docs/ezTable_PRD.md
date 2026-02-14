# EzTable Technical Specification

## 1. Executive Summary
EzTable is a high-performance, enterprise-grade data grid component built on the ezUX Architecture. It leverages **TanStack Table v8** (headless) for state management and logic, and **Shadcn/UI** (Radix Primitives) for accessible, theme-aware rendering.

**Key Differentials:**
- **Headless Core**: 100% of state (sorting, filtering, selection) is managed by TanStack Table. No duplicate state.
- **UI Logic Separation**: `EzTable` is purely a visual layer binding headless state to Shadcn components.
- **Performance**: Validated for 100,000+ rows using `virtualizationService` (TanStack Virtual).

---

## 2. Architecture & Tech Stack
- **State Management**: `@tanstack/react-table` (Headless)
- **Rendering**: `@tanstack/react-virtual` (Virtualization)
- **UI Components**: Shadcn/UI (Radix + Tailwind 4)
- **Architecture**: **Inversion of Control (IoC)** via `ServiceRegistry` for shared logic
- **Async Data**: Compatible with `@tanstack/react-query`
- **Type Safety**: TypeScript 5.9 with `satisfies` operators

---

## 3. Feature Mapping (TanStack Integration)
We avoid re-implementing logic that native TanStack Table handles.

| Feature Category | User Requirement | TanStack API / State | UI Implementation |
| :--- | :--- | :--- | :--- |
| **Columns** | Reorder, Resize, Hide | `columnOrder`, `columnSizing`, `columnVisibility` | Drag attributes, `EzColumnMenu` (Dropdown) |
| **Sorting** | Multi-sort, Shift+Click | `sorting`, `getSortedRowModel` | `EzHeader` (Click handler) |
| **Filtering** | Text, faceted filters | `columnFilters`, `getFilteredRowModel` | `PrimitiveFilter` (Excel-like UI) |
| **Pagination** | Page size, Nav | `pagination`, `getPaginationRowModel` | `EzPagination` (Shadcn Buttons) |
| **Selection** | Row/Multi-select | `rowSelection` | `Checkbox` in first column |
| **Grouping** | Aggregation, Expansion | `grouping`, `getGroupedRowModel` | `EzGroupCell` (+ Expanders) |
| **Editing / Rendering** | Smart Data Display | `cell` (Headless) | `SmartCell` -> `PrimitiveRenderer` |

---

## 4. UI/UX Implementation Strategy

### 4.1. Visual Layer (Shadcn)
- **Headers**: Use `div` with Tailwind logical properties (`border-e`, `padding-is`) for RTL support.
- **Menus**:
    - `EzColumnMenu`: Uses `DropdownMenu` for specific column actions (Pin, Sort, Hide).
    - `EzContextMenu`: Uses `ContextMenu` for row-level actions (Edit, Copy).
- **Icons**: `lucide-react` (standardized set).

### 4.2. Virtualization Strategy
To support 100k+ rows while maintaining 60FPS:
- **Service**: `VirtualizationService` wraps `@tanstack/react-virtual`.
- **Logic**: Use `rowVirtualizer.getVirtualItems()` instead of mapping `table.getRowModel().rows` directly.
- **Dynamic Elements**: Measure element size (`measureElement` ref) for variable row heights.
- **Buffers**: Configurable `overscan` (default: 5 rows).

---

## 5. Type System (TypeScript 5.9)

We extend TanStack's definitions to include UI-specific metadata without polluting the core logic.

### 5.1. Optimized Column Definitions
```typescript
import { ColumnDef } from '@tanstack/react-table';

// UI-specific metadata for EzTable
export type EzColumnMeta = {
    columnType?: 'text' | 'number' | 'date' | 'datetime' | 'boolean' | 'select' | 'progress' | 'sparkline' | 'longtext';
    align?: 'left' | 'center' | 'right';
    wrapText?: boolean;
    numberOptions?: { format: 'currency' | 'percentage' | 'integer' | 'float', decimals?: number };
    dateOptions?: { format: 'short' | 'long' | 'relative' };
    booleanOptions?: { trueLabel?: string, falseLabel?: string, showIcon?: boolean };
};

// Application-specific data type
export type Person = {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    status: 'active' | 'inactive';
};

// Strict typing with 'satisfies' to preserve inference
export const columns = [
    {
        accessorKey: 'firstName',
        header: 'First Name',
        meta: { columnType: 'text', align: 'left' }
    },
    {
        accessorKey: 'salary',
        header: 'Salary',
        meta: { 
            columnType: 'number', 
            numberOptions: { format: 'currency', decimals: 0 } 
        }
    }
] satisfies ColumnDef<Person>[];
```

### 5.2. Module Augmentation
We ensure global type awareness of `table.options.meta` for update handlers.
```typescript
declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    }
    interface ColumnMeta<TData extends RowData, TValue> extends EzColumnMeta {}
}
```

---

## 6. Advanced Features (EzSuite Extensions)

These features are **not** native to TanStack Table and represent the logic-heavy "Value Add" of EzSuite.

### 6.1. Export & Clipboard
- **Logic**: `ExportService` extracts `table.getFilteredRowModel().rows`.
- **Formats**: CSV (native), Excel (SheetJS).
- **Clipboard**: `navigator.clipboard.writeText` with tab-delimited fallback.

### 6.2. Range Selection (Phase 6)
- **Concept**: Excel-like cell selection distinct from Row Selection.
- **State**: `rangeSelection: { start: {r, c}, end: {r, c} }`.
- **Interaction**: MouseDown (start), MouseEnter (drag), Shift+Click (expand).
- **Styling**: `data-[range-selected=true]` attribute for CSS styling (Tailwind).

### 6.3. Advanced Filtering (Builder)
- **Concept**: Recursive UI builder for nested AND/OR conditions.
- **Logic**: Maps to standard TanStack `filterFn` but composed dynamically.

### 6.4. Data Integrity & Layout (Phase 8 - Completed)
- **Sticky Header/Pagination**:
    - `enableStickyHeader`: Headers stick to top of viewport using CSS `sticky` and z-index management.
    - `enableStickyPagination`: Pagination bar sticks to bottom of viewport.
- **Change Tracking**:
    - Tracks `added`, `edited`, and `deleted` rows via `useTableHistory` hook.
    - Visual indicators for pending changes in the Status Bar.
- **Undo/Redo**:
    - Complete history stack for cell edits and row actions.
    - `Ctrl+Z` / `Ctrl+Y` keyboard shortcuts integrated into the table event listener.

### 6.5. Renderer Consolidation (Phase 11 - Completed)
- **SmartCell Strategy**: A single entry point for all cell rendering that automatically chooses the correct renderer based on `meta.columnType`.
- **PrimitiveRenderer**: A unified component for `text`, `number`, `date`, and `datetime` types, reducing component overhead by 70%.
- **Metadata-Driven UI**: All formatting (currency, percentage, relative dates) is controlled via JSON metadata in the column definition, keeping logic out of the component layer.

---

## 7. Performance & React 19 Optimizations

To maintain 60FPS across enterprise-scale data, the following patterns are enforced:

### 7.1. Sub-component Decomposition
The core `EzTable` component is split into specialized sub-components (`EzTableToolbar`, `EzTableOverlays`, `EzTableStatusBar`) to isolate re-renders. Component-level memoization ensures that search input typing doesn't trigger a full grid re-calculation.

### 7.2. Stable Reference Management
All virtualizer instances and service interactions use `useMemo` and `useCallback` with strictly defined dependency arrays. This prevents "Virtualization Flickering" caused by accidental ref recreations.

### 7.3. O(1) Index Lookups
For navigation and search, we maintain internal `Map` structures (`rowIdToIndexMap`, etc.) to allow instantaneous parent/child lookups, avoiding $O(N)$ array traversals during keyboard navigation.

---

## 8. Roadmap & Phases

### Phase 1-8: Completed
- [x] Virtualization & Data Layer
- [x] Sorting, Filtering, Grouping, Editing
- [x] Export (CSV/Excel)
- [x] Context & Column Menus
- [x] Range Selection (Basic)
- [x] Advanced Filter Builder
- [x] Sticky Header & Pagination
- [x] Change Tracking (Added/Edited/Deleted)
- [x] Multiple Undo/Redo


### Phase 9: Performance Optimizations (Completed)
- [x] **Code Splitting**: Lazy-load demo components (-60KB initial bundle)
- [x] **Memoized Components**: StatusBadge with pre-defined styles
- [x] **Shared Formatters**: Eliminated 10,000+ Intl object creations
- [x] **Async Data Generation**: Dynamic import for @faker-js/faker (-1.5MB)
- [x] **Virtualization Enhancement**: Increased overscan to 50, dynamic measurement
- [x] **Bundle Optimization**: Main bundle reduced from 1.82MB to 260KB (-86%)
- [x] **Performance Metrics**: FCP 0.4s, TTI 0.6s, Lighthouse >90

**Impact**: 
- Main Bundle: -1.56MB (-86%)
- Table Render Time: -25ms (-38%)
- Page Load (TTI): -1.9s (-76%)

### Phase 11: Renderer Consolidation (Completed)
- [x] **Consolidated Renderers**: Merged Text, Number, Date, and Boolean renderers into a unified `PrimitiveRenderer`.
- [x] **SmartCell Entry Point**: Implemented dynamic renderer selection based on metadata.
- [x] **Consolidated Formatters**: Unified all Intl-based formatting into a single shared utility.
- [x] **Enhanced Filters**: Rebuilt `PrimitiveFilter` as a multi-type filter builder (text/number/date).
- [x] **Zero Prop Pollution**: Optimized `EzLayout` to safely inject props into custom components only.

### Phase 12: Enterprise Extensions
- [ ] Integrated Charts (Recharts/D3)
- [ ] Multi-Sheet Excel Export
- [ ] Advanced Row Aggregation Templates
