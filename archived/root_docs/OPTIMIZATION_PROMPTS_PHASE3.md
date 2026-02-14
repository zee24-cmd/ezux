# EzUX Component Optimization - Phase 3 Prompts
## Low Priority: Advanced Features & Maintenance

### Objective
Implement advanced features and maintainability improvements that will enhance the long-term maintainability and extensibility of the components.

---

## Task 10: Consolidate Common Utility Functions

**File to Create**: `packages/ezux/src/shared/utils/commonUtils.ts`

**Description**: Consolidate common utility functions from all components into a single, comprehensive utilities file.

**Requirements**:
1. Extract utility functions from:
   - `packages/ezux/src/components/EzTreeView/utils/treeUtils.ts`
   - `packages/ezux/src/components/EzTable/filterUtils.ts`
   - `packages/ezux/src/shared/utils/formatters.ts`
2. Organize into logical categories:
   - Data transformation utilities
   - Validation utilities
   - Formatting utilities
   - Tree manipulation utilities
   - Filter utilities
3. Add comprehensive documentation
4. Ensure type safety with TypeScript
5. Add JSDoc comments for all functions

**Implementation Pattern**:
```typescript
// Data Transformation
export function transformData<T>(data: any[], transformFn: (item: any) => T): T[] {
  return data.map(transformFn);
}

// Validation
export function validateRequired(value: any, fieldName: string): boolean {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  return true;
}

// Formatting
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-US', options).format(value);
}

// Tree Manipulation
export function findNodeById<T>(nodes: TreeNode<T>[], id: string): TreeNode<T> | undefined {
  // Implementation
}

// Filter Utilities
export function smartColumnFilterFn(row: any, columnId: string, value: any): boolean {
  // Implementation
}

// Advanced Filtering
export function advancedFilterFn(row: any, columnId: string, value: any): boolean {
  // Implementation
}
```

**Files to Update**:
- `packages/ezux/src/components/EzTreeView/utils/treeUtils.ts` - Update to use shared utilities
- `packages/ezux/src/components/EzTable/filterUtils.ts` - Update to use shared utilities
- `packages/ezux/src/shared/utils/formatters.ts` - Update to use shared utilities
- `packages/ezux/src/shared/utils/commonUtils.ts` - Create new file
- `packages/ezux/src/shared/utils/index.ts` - Update exports
- `packages/ezux/src/shared/utils/serviceUtils.ts` - Update to use shared utilities

**Expected Code Reduction**: ~250 lines

---

## Task 11: Type Definition Consolidation

**File to Create**: `packages/ezux/src/shared/types/commonTypes.ts`

**Description**: Centralize common type definitions used across all components.

**Requirements**:
1. Extract common type definitions from:
   - `packages/ezux/src/components/EzLayout/EzLayout.types.ts`
   - `packages/ezux/src/components/EzTable/EzTable.types.ts`
   - `packages/ezux/src/components/EzScheduler/EzScheduler.types.ts`
   - `packages/ezux/src/components/EzTreeView/EzTreeView.types.ts`
2. Organize into logical categories:
   - Base component types
   - State types
   - Event types
   - Service types
   - Utility types
3. Add comprehensive TypeScript documentation
4. Ensure proper type exports and re-exports
5. Add JSDoc comments for complex types

**Implementation Pattern**:
```typescript
// Base Component Types
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  dataTestId?: string;
}

// State Types
export interface State<T> {
  data: T;
  loading: boolean;
  error: Error | null;
  initialized: boolean;
}

// Event Types
export interface BaseEvent {
  timestamp: Date;
  source: string;
}

export interface SelectionEvent<T> extends BaseEvent {
  selected: T[];
  deselected: T[];
  changed: boolean;
}

// Service Types
export interface Service<T> {
  name: string;
  initialize(): Promise<void>;
  cleanup(): void;
  getState(): T;
  setState(state: T): void;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

**Files to Update**:
- `packages/ezux/src/components/EzLayout/EzLayout.types.ts` - Update to use shared types
- `packages/ezux/src/components/EzTable/EzTable.types.ts` - Update to use shared types
- `packages/ezux/src/components/EzScheduler/EzScheduler.types.ts` - Update to use shared types
- `packages/ezux/src/components/EzTreeView/EzTreeView.types.ts` - Update to use shared types
- `packages/ezux/src/shared/types/commonTypes.ts` - Create new file
- `packages/ezux/src/shared/types/index.ts` - Update exports

**Expected Code Reduction**: ~150 lines

---

## Task 12: Service Cleanup Optimization

**File to Update**: All service files in `packages/ezux/src/shared/services/`

**Description**: Implement comprehensive cleanup for all services to prevent memory leaks.

**Requirements**:
1. Review all services for cleanup patterns
2. Implement proper cleanup for:
   - Event listeners
   - Subscriptions
   - Timers
   - DOM references
   - Service registry entries
3. Add cleanup tracking and logging
4. Implement service lifecycle hooks
5. Add memory leak detection and reporting

**Implementation Pattern**:
```typescript
export class CleanupOptimizedService implements IService {
  name = 'CleanupOptimizedService';
  private cleanupCallbacks: Array<() => void> = [];
  private isCleanedUp = false;

  registerCleanup(callback: () => void): void {
    if (this.isCleanedUp) {
      console.warn(`Cannot register cleanup for ${this.name} after cleanup`);
      return;
    }
    this.cleanupCallbacks.push(callback);
  }

  cleanup(): void {
    if (this.isCleanedUp) {
      console.warn(`${this.name} already cleaned up`);
      return;
    }

    this.isCleanedUp = true;

    // Execute all cleanup callbacks in reverse order
    this.cleanupCallbacks.reverse().forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error(`Error during cleanup in ${this.name}:`, error);
      }
    });

    this.cleanupCallbacks = [];
  }

  getCleanupCount(): number {
    return this.cleanupCallbacks.length;
  }
}
```

**Files to Update**:
- `packages/ezux/src/shared/services/LayoutService.ts`
- `packages/ezux/src/shared/services/I18nService.ts`
- `packages/ezux/src/shared/services/PersistenceService.ts`
- `packages/ezux/src/shared/services/NotificationService.ts`
- `packages/ezux/src/shared/services/ServiceRegistry.ts`
- Add memory leak tests

**Expected Code Reduction**: ~100 lines (from duplicated cleanup logic)
**Expected Memory Improvement**: 30-40% reduction in memory usage

---

## Task 13: Component Composition

**File to Create**: `packages/ezux/src/shared/components/`

**Description**: Break down large component files into smaller, composable sub-components.

**Requirements**:
1. Identify large component files:
   - `packages/ezux/src/components/EzTable/index.tsx` (397 lines)
   - `packages/ezux/src/components/EzScheduler/index.tsx` (230 lines)
2. Create composable sub-components:
   - Toolbar components
   - Footer components
   - Overlay components
   - Modal components
   - Panel components
3. Maintain backward compatibility
4. Add proper component composition patterns
5. Ensure proper prop drilling reduction

**Implementation Pattern**:
```typescript
// EzTable/toolbar/EzTableToolbar.tsx
export interface EzTableToolbarProps {
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  enableAdvancedFiltering: boolean;
  enableExport: boolean;
  onExport: () => void;
  // ... other props
}

export const EzTableToolbar: React.FC<EzTableToolbarProps> = ({
  globalFilter,
  setGlobalFilter,
  enableAdvancedFiltering,
  enableExport,
  onExport,
  // ... other props
}) => {
  return (
    <div className="ez-table-toolbar">
      {/* Toolbar implementation */}
    </div>
  );
};

// EzTable/index.tsx - Refactored
export const EzTable: React.FC<EzTableProps> = (props) => {
  return (
    <div className="ez-table">
      <EzTableToolbar {...toolbarProps} />
      <EzTableBody {...bodyProps} />
      <EzTableFooter {...footerProps} />
    </div>
  );
};
```

**Files to Update**:
- `packages/ezux/src/components/EzTable/` - Create composable sub-components
- `packages/ezux/src/components/EzScheduler/` - Create composable sub-components
- `packages/ezux/src/shared/components/` - Create shared sub-components
- Update all component files to use composable pattern

**Expected Code Reduction**: ~500 lines
**Expected Maintainability Improvement**: 40-50% reduction in file sizes

---

## Task 14: Advanced Virtualization Features

**File to Update**: `packages/ezux/src/shared/hooks/useVirtualization.ts`

**Description**: Enhance virtualization with advanced features for better performance.

**Requirements**:
1. Add progressive rendering for large datasets
2. Implement prefetching for upcoming items
3. Add smooth scrolling with inertia
4. Support adaptive item sizing
5. Add virtualization debugging tools

**Implementation Pattern**:
```typescript
export interface AdvancedVirtualizationConfig extends VirtualizationConfig {
  progressiveRendering?: boolean;
  prefetchDistance?: number;
  adaptiveSizing?: boolean;
  debug?: boolean;
}

export function useAdvancedVirtualization(config: AdvancedVirtualizationConfig) {
  const {
    progressiveRendering = false,
    prefetchDistance = 5,
    adaptiveSizing = false,
    debug = false,
    ...baseConfig
  } = config;

  const virtualizer = useVirtualizer({
    ...baseConfig,
    estimateSize: adaptiveSizing ? adaptiveEstimateSize : baseConfig.itemSize,
    overscan: prefetchDistance,
  });

  // Progressive rendering
  const visibleItems = useMemo(() => {
    if (!progressiveRendering) {
      return virtualizer.getVirtualItems();
    }

    const allItems = virtualizer.getVirtualItems();
    const renderedItems = [];

    // Render visible items + buffer
    for (let i = 0; i < allItems.length; i++) {
      renderedItems.push(allItems[i]);

      // Progressive rendering: render next item after delay
      if (i === renderedItems.length - 1 && i < allItems.length - 1) {
        setTimeout(() => {
          // Request animation frame for smooth rendering
          requestAnimationFrame(() => {
            // Implementation
          });
        }, 100);
      }
    }

    return renderedItems;
  }, [virtualizer, progressiveRendering]);

  // Debug mode
  useEffect(() => {
    if (debug) {
      console.log('Virtualization Debug:', {
        itemCount: virtualizer.getTotalCount(),
        renderedCount: visibleItems.length,
        scrollPosition: virtualizer.getScrollOffset(),
      });
    }
  }, [virtualizer, visibleItems, debug]);

  return {
    virtualizer,
    visibleItems,
    scrollPosition: virtualizer.getScrollOffset(),
  };
}
```

**Files to Update**:
- `packages/ezux/src/shared/hooks/useVirtualization.ts` - Add advanced features
- Update all components to use advanced virtualization
- Add performance benchmarks for advanced features

**Expected Performance Improvement**: 15-25% improvement in large dataset rendering

---

## Task 15: Documentation & Examples

**File to Create**: `packages/ezux/docs/OPTIMIZATION_GUIDE.md`

**Description**: Create comprehensive documentation for the optimization work and best practices.

**Requirements**:
1. Document all shared utilities and their usage
2. Provide code examples for common patterns
3. Create migration guides for refactored components
4. Document performance benchmarks and improvements
5. Add troubleshooting guide

**Implementation Pattern**:
```markdown
# EzUX Component Optimization Guide

## Overview
This guide documents the optimization work performed on EzUX components, including:
- Code sharing improvements
- Performance optimizations
- Code size reductions
- Best practices

## Shared Utilities

### createImperativeAPI
Creates standardized imperative API for components.

**Usage**:
```typescript
const imperativeAPI = createImperativeAPI(ref, props, {
  validateField: (field) => { /* ... */ },
  refresh: () => { /* ... */ },
});
```

### useVirtualization
Provides virtualization functionality for large datasets.

**Usage**:
```typescript
const { virtualizer, visibleItems } = useVirtualization({
  parentRef,
  itemSize: 64,
  overscan: 10,
});
```

## Performance Improvements

### Column Size Calculation
Optimized column size calculations to reduce re-renders by 40%.

### Service Pattern
Optimized service subscriptions to reduce unnecessary re-renders by 30%.

## Migration Guide

### From Old Pattern to New Pattern
```typescript
// Old Pattern
const imperativeAPI = useImperativeHandle(ref, () => ({
  validateField: (field) => { /* ... */ },
}));

// New Pattern
const imperativeAPI = createImperativeAPI(ref, props, {
  validateField: (field) => { /* ... */ },
});
```

## Performance Benchmarks

| Component | Before | After | Improvement |
|-----------|--------|-------|-------------|
| EzTable (1000 rows) | 120ms | 72ms | 40% |
| EzScheduler (500 events) | 85ms | 60ms | 30% |

## Troubleshooting

### Memory Leaks
Check service cleanup with:
```typescript
console.log(service.getCleanupCount());
```

### Performance Issues
Enable debug mode:
```typescript
const { visibleItems } = useVirtualization({
  debug: true,
});
```
```

**Files to Create**:
- `packages/ezux/docs/OPTIMIZATION_GUIDE.md`
- `packages/ezux/docs/OPTIMIZATION_MIGRATION_GUIDE.md`
- `packages/ezux/docs/OPTIMIZATION_BENCHMARKS.md`

**Expected Documentation Improvement**: Comprehensive, easy-to-follow guides

---

## Testing Requirements

For each task, ensure:
1. All existing tests continue to pass
2. Add new tests for shared utilities
3. Test with different data sizes (small, medium, large)
4. Test edge cases (empty data, null values, etc.)
5. Performance testing with large datasets
6. Memory leak testing
7. Integration testing with all components

---

## Deliverables

1. ✅ `packages/ezux/src/shared/utils/commonUtils.ts`
2. ✅ `packages/ezux/src/shared/types/commonTypes.ts`
3. ✅ All services optimized with comprehensive cleanup
4. ✅ All large component files refactored into composable components
5. ✅ Advanced virtualization features implemented
6. ✅ Comprehensive documentation created
7. ✅ All tests passing
8. ✅ Performance benchmarks documented
9. ✅ Migration guides created

**Total Expected Code Reduction**: ~1000 lines
**Expected Memory Improvement**: 30-40% reduction in memory usage
**Expected Maintainability Improvement**: 40-50% reduction in file sizes
**Estimated Time**: 3-4 days
**Priority**: LOW