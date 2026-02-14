# EzUX Component Optimization - Phase 2 Prompts
## Medium Priority: State Management & Performance

### Objective
Implement state management improvements and performance optimizations that will enhance the maintainability and performance of the components.

---

## Task 5: Create Unified State Management Hook

**File to Create**: `packages/ezux/src/shared/hooks/useComponentState.ts`

**Description**: Create a base state management hook that provides common state patterns used across all components.

**Requirements**:
1. Create `useComponentState<T>` hook with:
   - Reactive state initialization
   - State synchronization with services
   - Loading state management
   - Error state handling
   - Persistence support
2. Support common patterns:
   - Service-based state updates
   - Debounced state updates
   - Batch state updates
   - State change callbacks
3. Add TypeScript generics for type safety
4. Provide configuration options

**Implementation Pattern**:
```typescript
export interface StateConfig<T> {
  initialState: T;
  service?: Service;
  persistenceKey?: string;
  debounceMs?: number;
  onChange?: (state: T) => void;
}

export function useComponentState<T>(config: StateConfig<T>) {
  const [state, setState] = useState(config.initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Service integration
  const service = config.service;

  // State updates with debouncing
  const updateState = useCallback((updater: (prev: T) => T) => {
    if (config.debounceMs) {
      debouncedUpdate(updater);
    } else {
      setState(updater);
    }
  }, [config.debounceMs]);

  // Persistence
  useEffect(() => {
    if (config.persistenceKey) {
      const saved = localStorage.getItem(config.persistenceKey);
      if (saved) setState(JSON.parse(saved));
    }
  }, [config.persistenceKey]);

  return { state, setState, loading, error, updateState };
}
```

**Files to Update**:
- `packages/ezux/src/components/EzLayout/hooks/useLayoutState.ts` - Refactor to use shared hook
- `packages/ezux/src/components/EzTable/hooks/useTableState.ts` - Refactor to use shared hook
- `packages/ezux/src/components/EzScheduler/hooks/useSchedulerState.ts` - Refactor to use shared hook
- `packages/ezux/src/components/EzTreeView/hooks/useTreeState.ts` - Refactor to use shared hook
- `packages/ezux/src/shared/hooks/useComponentState.ts` - Create new file
- `packages/ezux/src/shared/hooks/index.ts` - Export new hook

**Expected Code Reduction**: ~300 lines

---

## Task 6: Memoize Column Size Calculations

**File to Update**: `packages/ezux/src/components/EzTable/index.tsx`

**Description**: Optimize the column size calculation logic to prevent unnecessary recalculations.

**Requirements**:
1. Add proper dependency array to `useMemo` for column size vars
2. Optimize the calculation to only run when necessary
3. Add caching mechanism for column sizes
4. Ensure proper cleanup on component unmount
5. Test with different column configurations

**Implementation Pattern**:
```typescript
const columnSizeVars = React.useMemo(() => {
  const headers = table.getFlatHeaders();
  const colSizes: { [key: string]: any } = {};

  // Only recalculate if column sizes changed
  if (table.getState().columnSizingInfo.isDirty) {
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
  }

  return colSizes;
}, [table.getState().columnSizingInfo.isDirty, table.getState().columnSizing]);
```

**Files to Update**:
- `packages/ezux/src/components/EzTable/index.tsx` - Optimize column size calculation
- Add performance tests for column resizing scenarios

**Expected Performance Improvement**: 30-40% reduction in re-renders during column resizing

---

## Task 7: Consolidate Event Handlers

**File to Create**: `packages/ezux/src/shared/hooks/useEventHandlers.ts`

**Description**: Extract common event handler patterns into a reusable hook.

**Requirements**:
1. Create `useEventHandlers` hook with:
   - Drag and drop handlers
   - Keyboard navigation handlers
   - Click and double-click handlers
   - Focus management handlers
2. Support configuration for different event types
3. Add memoization for handler functions
4. Ensure proper cleanup of event listeners

**Implementation Pattern**:
```typescript
export interface EventHandlerConfig {
  onDragEnd?: (event: DragEndEvent) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onFocusChange?: (focused: boolean) => void;
}

export function useEventHandlers(config: EventHandlerConfig) {
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    config.onDragEnd?.(event);
  }, [config.onDragEnd]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    config.onKeyPress?.(event);
  }, [config.onKeyPress]);

  // ... other handlers

  return {
    handleDragEnd,
    handleKeyPress,
    // ... other handlers
  };
}
```

**Files to Update**:
- `packages/ezux/src/components/EzLayout/index.tsx` - Refactor event handlers
- `packages/ezux/src/components/EzTable/index.tsx` - Refactor event handlers
- `packages/ezux/src/components/EzTreeView/index.tsx` - Refactor event handlers
- `packages/ezux/src/shared/hooks/useEventHandlers.ts` - Create new file
- `packages/ezux/src/shared/hooks/index.ts` - Export new hook

**Expected Code Reduction**: ~150 lines

---

## Task 8: Implement Service Pattern Optimization

**File to Update**: All service files in `packages/ezux/src/shared/services/`

**Description**: Ensure all services use proper subscription patterns to avoid unnecessary re-renders.

**Requirements**:
1. Review all services for subscription patterns
2. Optimize service state updates to only notify relevant subscribers
3. Add debouncing for frequent updates
4. Implement proper cleanup for subscriptions
5. Add performance monitoring for service updates

**Implementation Pattern**:
```typescript
export class OptimizedService implements IService {
  private subscribers: Set<(state: any) => void> = new Set();
  private updateQueue: any[] = [];
  private isUpdating = false;

  subscribe(listener: (state: any) => void): () => void {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }

  private notifySubscribers() {
    if (this.isUpdating) {
      this.updateQueue.push(this.state);
      return;
    }

    this.isUpdating = true;
    const state = this.state;

    this.subscribers.forEach(listener => {
      // Only notify if state actually changed
      if (listener !== this.lastListener) {
        listener(state);
        this.lastListener = listener;
      }
    });

    this.isUpdating = false;

    if (this.updateQueue.length > 0) {
      const nextUpdate = this.updateQueue.shift();
      if (nextUpdate) this.notifySubscribers();
    }
  }
}
```

**Files to Update**:
- `packages/ezux/src/shared/services/LayoutService.ts`
- `packages/ezux/src/shared/services/I18nService.ts`
- `packages/ezux/src/shared/services/PersistenceService.ts`
- `packages/ezux/src/shared/services/ServiceRegistry.ts`
- Add performance tests for service subscription patterns

**Expected Performance Improvement**: 20-30% reduction in unnecessary re-renders

---

## Task 9: Renderer Consolidation

**File to Update**: `packages/ezux/src/components/EzTable/renderers/`

**Description**: Consolidate multiple renderer types into a unified renderer system.

**Requirements**:
1. Identify all cell renderer types in EzTable
2. Create unified `PrimitiveRenderer` as primary renderer
3. Maintain backward compatibility with existing code
4. Add support for custom renderers
5. Optimize renderer selection logic

**Implementation Pattern**:
```typescript
export interface RendererConfig<T> {
  value: any;
  columnType?: string;
  meta?: any;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const UnifiedRenderer: React.FC<RendererConfig<any>> = ({
  value,
  columnType,
  meta,
  className,
  align
}) => {
  const renderer = getRenderer(columnType, meta);

  return (
    <BaseCell
      value={value}
      align={align || renderer.defaultAlign}
      className={cn(className, renderer.className)}
    >
      {renderer.render(value, meta)}
    </BaseCell>
  );
};
```

**Files to Update**:
- `packages/ezux/src/components/EzTable/renderers/` - Consolidate renderers
- `packages/ezux/src/components/EzTable/renderers/index.ts` - Update exports
- `packages/ezux/src/components/EzTable/SmartCell.tsx` - Integrate unified renderer

**Expected Code Reduction**: ~300 lines

---

## Testing Requirements

For each task, ensure:
1. All existing tests continue to pass
2. Add new tests for shared utilities
3. Test with different data sizes (small, medium, large)
4. Test edge cases (empty data, null values, etc.)
5. Performance testing with large datasets
6. Memory leak testing

---

## Deliverables

1. ✅ `packages/ezux/src/shared/hooks/useComponentState.ts`
2. ✅ `packages/ezux/src/shared/hooks/useEventHandlers.ts`
3. ✅ All component state hooks refactored to use shared hook
4. ✅ All component event handlers refactored to use shared hook
5. ✅ All services optimized with subscription patterns
6. ✅ Renderer consolidation completed
7. ✅ All tests passing
8. ✅ Performance benchmarks showing improvement

**Total Expected Code Reduction**: ~750 lines
**Expected Performance Improvement**: 20-40% reduction in re-renders
**Estimated Time**: 2-3 days
**Priority**: MEDIUM