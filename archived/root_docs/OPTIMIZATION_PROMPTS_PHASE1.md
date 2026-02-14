# EzUX Component Optimization - Phase 1 Prompts
## High Priority: Foundation & Core Utilities

### Objective
Implement foundational shared utilities that will be used across all components, providing immediate code sharing benefits and performance improvements.

---

## Task 1: Create Imperative API Generator

**File to Create**: `packages/ezux/src/shared/utils/createImperativeAPI.ts`

**Description**: Extract the common imperative API pattern used across EzLayout, EzTable, EzScheduler, and EzTreeView into a reusable utility function.

**Requirements**:
1. Create a function `createImperativeAPI<TRef, TProps, TAPI>(ref: React.Ref<TRef>, props: TProps, apiMethods: TAPI)` that generates imperative API methods
2. Use `useImperativeHandle` internally
3. Support common patterns like:
   - `validateField` pattern (used in EzTable)
   - `refresh` pattern
   - `scrollToIndex` pattern
   - `getData` pattern
4. Type-safe implementation with proper TypeScript generics
5. Add comprehensive JSDoc documentation

**Implementation Pattern**:
```typescript
/**
 * Creates a standardized imperative API for components
 * @param ref - The component ref
 * @param props - Component props
 * @param apiMethods - Custom API methods to expose
 * @returns Imperative API object
 */
export function createImperativeAPI<TRef, TProps, TAPI>(
  ref: React.Ref<TRef>,
  props: TProps,
  apiMethods: TAPI
): TAPI {
  return useImperativeHandle(ref, () => apiMethods, [props, ...Object.values(apiMethods)]);
}
```

**Files to Update**:
- `packages/ezux/src/components/EzLayout/hooks/useLayoutImperative.ts` - Refactor to use generator
- `packages/ezux/src/components/EzTable/hooks/useTableImperative.ts` - Refactor to use generator
- `packages/ezux/src/components/EzScheduler/hooks/useSchedulerImperative.ts` - Refactor to use generator
- `packages/ezux/src/components/EzTreeView/hooks/useTreeImperative.ts` - Refactor to use generator
- `packages/ezux/src/shared/utils/createImperativeAPI.ts` - Create new file

**Expected Code Reduction**: ~400 lines

---

## Task 2: Extract Cell Renderers

**File to Create**: `packages/ezux/src/shared/components/BaseCell.tsx`
**File to Create**: `packages/ezux/src/shared/components/PrimitiveRenderer.tsx`

**Description**: Extract the base cell rendering logic from EzTable to create reusable components that can be used across all components.

**Requirements**:
1. Create `BaseCell` component with:
   - Null/undefined value handling
   - Typography and alignment
   - Tooltip support
   - Fallback rendering
2. Create `PrimitiveRenderer` component with:
   - Text, number, date, datetime rendering
   - Search highlighting support
   - Column type detection
   - Alignment defaults
3. Add `PrimitiveEditor` for unified editing
4. Ensure all existing EzTable functionality continues to work
5. Add TypeScript types for all props

**Implementation Pattern**:
```typescript
// BaseCell.tsx
export interface BaseCellProps {
  value: any;
  className?: string;
  title?: string;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export const BaseCell: React.FC<BaseCellProps> = ({ value, className, title, children, fallback, align }) => {
  // Implementation
};
```

**Files to Update**:
- `packages/ezux/src/components/EzTable/renderers/BaseCell.tsx` - Move to shared
- `packages/ezux/src/components/EzTable/renderers/PrimitiveRenderer.tsx` - Move to shared
- `packages/ezux/src/components/EzTable/renderers/index.ts` - Update exports
- `packages/ezux/src/shared/components/index.ts` - Export new components

**Expected Code Reduction**: ~150 lines

---

## Task 3: Consolidate Virtualization Utilities

**File to Create**: `packages/ezux/src/shared/hooks/useVirtualization.ts`

**Description**: Extract common virtualization logic from EzTable, EzScheduler, and EzTreeView into a shared hook.

**Requirements**:
1. Create `useVirtualization` hook with:
   - Parent ref management
   - Row virtualizer creation
   - Column virtualizer creation
   - Effective row height calculation
   - Scroll position management
2. Support both row and column virtualization
3. Provide configuration options for customization
4. Ensure compatibility with existing virtualization patterns
5. Add proper TypeScript types

**Implementation Pattern**:
```typescript
export interface VirtualizationConfig {
  parentRef: React.RefObject<HTMLDivElement>;
  itemSize?: number;
  overscan?: number;
  enableColumnVirtualization?: boolean;
}

export function useVirtualization(config: VirtualizationConfig) {
  // Implementation
}
```

**Files to Update**:
- `packages/ezux/src/components/EzTable/hooks/useTableVirtualization.ts` - Refactor to use shared hook
- `packages/ezux/src/components/EzScheduler/hooks/useSchedulerVirtualization.ts` - Refactor to use shared hook
- `packages/ezux/src/components/EzTreeView/hooks/useTreeVirtualization.ts` - Refactor to use shared hook
- `packages/ezux/src/shared/hooks/useVirtualization.ts` - Create new file
- `packages/ezux/src/shared/hooks/index.ts` - Export new hook

**Expected Code Reduction**: ~200 lines

---

## Task 4: Implement VirtualScrollingService

**File to Update**: `packages/ezux/src/components/EzScheduler/services/VirtualScrollingService.ts`

**Description**: Transform the empty placeholder service into a fully functional virtual scrolling service.

**Requirements**:
1. Implement actual virtual scrolling logic using `@tanstack/react-virtual`
2. Handle multi-resource scenarios
3. Optimize rendering range calculations
4. Support scroll-to-index functionality
5. Add proper cleanup
6. Integrate with ServiceRegistry pattern

**Implementation Pattern**:
```typescript
export class VirtualScrollingService implements IService {
  name = 'VirtualScrollingService';
  private scrollContainer: HTMLElement | null = null;
  private rowVirtualizer: any;
  private overscan = 5;

  configure(container: HTMLElement, options?: VirtualizationOptions) {
    this.scrollContainer = container;
    this.rowVirtualizer = createVirtualizer({
      count: 0,
      getScrollElement: () => this.scrollContainer,
      estimateSize: () => options?.itemSize || 64,
      overscan: options?.overscan || 5,
    });
  }

  scrollToIndex(index: number, options?: ScrollToOptions) {
    this.rowVirtualizer.scrollToIndex(index, options);
  }

  cleanup() {
    this.scrollContainer = null;
    this.rowVirtualizer = null;
  }
}
```

**Files to Update**:
- `packages/ezux/src/components/EzScheduler/services/VirtualScrollingService.ts` - Implement functionality
- `packages/ezux/src/components/EzScheduler/hooks/useSchedulerVirtualization.ts` - Integrate service

**Expected Code Reduction**: ~100 lines (from duplicated virtualization logic)

---

## Testing Requirements

For each task, ensure:
1. All existing tests continue to pass
2. Add new tests for shared utilities
3. Test with different data sizes (small, medium, large)
4. Test edge cases (empty data, null values, etc.)
5. Performance testing with large datasets

---

## Deliverables

1. ✅ `packages/ezux/src/shared/utils/createImperativeAPI.ts`
2. ✅ `packages/ezux/src/shared/components/BaseCell.tsx`
3. ✅ `packages/ezux/src/shared/components/PrimitiveRenderer.tsx`
4. ✅ `packages/ezux/src/shared/hooks/useVirtualization.ts`
5. ✅ `packages/ezux/src/shared/components/index.ts`
6. ✅ `packages/ezux/src/shared/hooks/index.ts`
7. ✅ All component hooks refactored to use shared utilities
8. ✅ All tests passing
9. ✅ Performance benchmarks showing improvement

**Total Expected Code Reduction**: ~850 lines
**Estimated Time**: 2-3 days
**Priority**: HIGH