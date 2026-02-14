# EzUX Component Optimization Implementation Prompt

## Overview
This prompt provides a structured approach to implementing optimization recommendations for EzLayout, EzTable, EzScheduler, EzTreeView, and EzSignature components, focusing on code sharing, performance improvements, and code size reduction while maintaining SKILL.md compliance.

## Implementation Priority

### Phase 1: Code Sharing (High Priority)
**Estimated Effort**: 2-3 days

#### 1.1 Create Shared Validation Hook
**File**: `packages/ezux/src/shared/hooks/useFieldValidation.ts`

```typescript
/**
 * Shared hook for field validation logic
 * Replaces duplicated validation patterns across components
 */
export const useFieldValidation = (props: {
    validateField?: (data: { fieldName: string; value: any; data: any }) => boolean | string;
    editSettings?: any;
}) => {
    // Implementation
};
```

**Usage in**: [`EzTable`](packages/ezux/src/components/EzTable/index.tsx:111-156)

#### 1.2 Enhance useEventHandlers Hook
**File**: `packages/ezux/src/shared/hooks/useEventHandlers.ts`

**Changes**:
- Add standardized drag-and-drop handler pattern
- Include common keyboard navigation handlers
- Support pointer event handling

**Usage in**: [`EzTable`](packages/ezux/src/components/EzTable/index.tsx:161-201), [`EzTreeView`](packages/ezux/src/components/EzTreeView/index.tsx:41-55), [`EzScheduler`](packages/ezux/src/components/EzScheduler/index.tsx:81-121)

#### 1.3 Create useComponentImperativeAPI Hook
**File**: `packages/ezux/src/shared/hooks/useComponentImperativeAPI.ts`

```typescript
/**
 * Generic imperative API hook for all EzUX components
 * Standardizes imperative API pattern across components
 */
export const useComponentImperativeAPI = <T extends Record<string, any>>(
    ref: React.Ref<T> | undefined,
    api: T,
    options?: {
        validateField?: (data: any) => boolean;
        validateEditForm?: () => boolean;
    }
) => {
    // Implementation
};
```

**Usage in**: All components

#### 1.4 Extract SVG Path Helper
**File**: `packages/ezux/src/shared/utils/canvasUtils.ts`

```typescript
/**
 * Canvas-related utility functions
 * Includes SVG path conversion for signatures
 */
export function getSvgPathFromStroke(stroke: number[][]): string {
    // Implementation from EzSignature
}

export function getStrokePath(stroke: number[][], options: {
    size: number;
    thinning: number;
    smoothing: number;
    streamline: number;
}): string {
    // Implementation
}
```

#### 1.5 Create useService Hook
**File**: `packages/ezux/src/shared/hooks/useService.ts`

```typescript
/**
 * Hook for standardized service access
 * Abstracts service registration and access patterns
 */
export const useService = <T extends IService>(
    serviceName: string,
    factory: () => T
): T => {
    // Implementation
};
```

**Usage in**: [`EzTreeView`](packages/ezux/src/components/EzTreeView/useEzTreeView.ts:29-33)

---

### Phase 2: Performance Optimizations (High Priority)
**Estimated Effort**: 2-3 days

#### 2.1 Optimize EzTable Column Size Calculation
**File**: `packages/ezux/src/components/EzTable/components/EzTableHeaderSection.tsx`

**Changes**:
- Extract column size calculation to separate component
- Use React.memo for memoization
- Optimize dependency arrays

**Before** (lines 57-66):
```typescript
const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i]!;
        colSizes[`--header-${header.id}-size`] = header.getSize();
        colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
}, [table.getState().columnSizing, table.getState().columnSizingInfo, table.getFlatHeaders()]);
```

#### 2.2 Implement EzSignature Selective Rendering
**File**: `packages/ezux/src/components/EzSignature/EzSignature.tsx`

**Changes**:
- Wrap stroke rendering in React.memo
- Implement virtualization for large stroke collections
- Optimize renderedStrokes useMemo dependencies

**Before** (lines 170-180):
```typescript
const renderedStrokes = useMemo(() => strokes.map((stroke, i) => {
    const outline = getStroke(stroke, {
        size: maxStrokeWidth,
        thinning,
        smoothing,
        streamline,
        start: { cap: true, taper: false },
        end: { cap: true, taper: true }
    });
    return <path key={i} d={getSvgPathFromStroke(outline)} fill={effectiveStrokeColor} />;
}), [strokes, maxStrokeWidth, thinning, smoothing, streamline, effectiveStrokeColor]);
```

#### 2.3 Optimize EzTreeView Tree Flattening
**File**: `packages/ezux/src/components/EzTreeView/hooks/useTreeVirtualization.ts`

**Changes**:
- Implement memoization for flattened nodes
- Add selective flattening based on expanded nodes
- Optimize dependency arrays

**Before** (line 78):
```typescript
const { flattenedNodes } = useTreeVirtualization(treeData, expandedNodes, searchTerm);
```

#### 2.4 Consolidate useEffect Dependencies
**File**: All component files

**Changes**:
- Use useCallback for all handlers
- Minimize dependency arrays
- Remove unnecessary dependencies

**Example**: [`EzTable`](packages/ezux/src/components/EzTable/index.tsx:83-91)

#### 2.5 Implement Service Subscription Debouncing
**File**: `packages/ezux/src/shared/services/BaseService.ts`

**Changes**:
- Add debouncing for state notifications
- Implement batching for multiple updates
- Add configuration options

**Before** (lines 43-64):
```typescript
private notifySubscribers() {
    if (this.isUpdating) {
        this.updateQueue.push(this.state);
        return;
    }
    // ... existing implementation
}
```

---

### Phase 3: Code Size Reduction (Medium Priority)
**Estimated Effort**: 2 days

#### 3.1 Consolidate Dialog State Management
**File**: `packages/ezux/src/shared/hooks/useDialogState.ts`

```typescript
/**
 * Shared hook for dialog state management
 * Replaces inline dialog state in multiple components
 */
export const useDialogState = (props: {
    mode?: 'create' | 'edit' | 'view';
    open?: boolean;
    initialData?: any;
}) => {
    // Implementation
};
```

**Usage in**: [`EzTable`](packages/ezux/src/components/EzTable/index.tsx:68-91), [`EzScheduler`](packages/ezux/src/components/EzScheduler/index.tsx:29-37)

#### 3.2 Extract Scheduler Event Handlers
**File**: `packages/ezux/src/components/EzScheduler/hooks/useSchedulerEventHandlers.ts`

```typescript
/**
 * Hook for scheduler event handlers
 * Extracts inline event handlers from EzScheduler
 */
export const useSchedulerEventHandlers = (props: {
    onCellDoubleClick?: (date: Date, resourceId?: string) => void;
    onEventDoubleClick?: (event: SchedulerEvent) => void;
    onEventCreate?: (event: SchedulerEvent) => void;
    onEventChange?: (event: SchedulerEvent) => void;
    onEventDelete?: (id: string) => void;
    schedulerService: SchedulerService;
}) => {
    // Implementation
};
```

**Usage in**: [`EzScheduler`](packages/ezux/src/components/EzScheduler/index.tsx:81-121)

#### 3.3 Standardize Modal Components
**File**: `packages/ezux/src/shared/components/Modal.tsx`

**Changes**:
- Create reusable Modal component
- Extract modal state management
- Standardize modal props and behavior

**Usage in**: [`EzTable`](packages/ezux/src/components/EzTable/index.tsx:320-337), [`EzScheduler`](packages/ezux/src/components/EzScheduler/index.tsx:159-170)

#### 3.4 Simplify EzTreeView State Management
**File**: `packages/ezux/src/components/EzTreeView/hooks/useNodeEditor.ts`

```typescript
/**
 * Hook for node editing operations
 * Extracts inline rename handler from EzTreeView
 */
export const useNodeEditor = (props: {
    treeData: TreeNode[];
    updateNode: (id: string, updates: Partial<TreeNode>) => void;
    onNodeRename?: (id: string, newLabel: string) => void;
}) => {
    // Implementation
};
```

**Usage in**: [`EzTreeView`](packages/ezux/src/components/EzTreeView/useEzTreeView.ts:81-86)

#### 3.5 Consolidate Loading States
**File**: `packages/ezux/src/shared/hooks/useLoadingState.ts`

```typescript
/**
 * Hook for loading state management
 * Integrates with useBaseComponent for consistent loading states
 */
export const useLoadingState = (props: {
    isLoading?: boolean;
    onLoadingChange?: (loading: boolean) => void;
}) => {
    // Implementation
};
```

**Usage in**: All components

---

### Phase 4: SKILL.md Compliance (Medium Priority)
**Estimated Effort**: 1-2 days

#### 4.1 Enhance TypeScript Strict Mode
**File**: All TypeScript files

**Changes**:
- Replace `any` types with proper TypeScript types
- Use `satisfies` operator for type assertions
- Implement explicit resource management with `using` keyword
- Add proper type parameters to generics

**Example**: [`EzTable`](packages/ezux/src/components/EzTable/index.tsx:22-23)

#### 4.2 Optimize Service Registry Lifecycle
**File**: `packages/ezux/src/shared/services/ServiceRegistry.ts`

**Changes**:
- Implement proper cleanup with `using` pattern
- Add explicit lifecycle management
- Improve error handling

#### 4.3 Standardize Testing Strategy
**File**: All test files

**Changes**:
- Ensure all components use Vitest for unit tests
- Ensure all E2E flows use Playwright
- Add comprehensive test coverage
- Implement snapshot testing for UI components

#### 4.4 Create Shared Error Handling
**File**: `packages/ezux/src/shared/hooks/useErrorHandler.ts`

```typescript
/**
 * Hook for centralized error handling
 * Integrates with NotificationService for user feedback
 */
export const useErrorHandler = (props: {
    onError?: (error: Error) => void;
    notificationService?: NotificationService;
}) => {
    // Implementation
};
```

#### 4.5 Implement EzProvider Wrapper
**File**: `packages/ezux/src/providers/EzProvider.tsx`

```typescript
/**
 * Global provider for EzUX services
 * Provides service registry, i18n, and other shared services
 */
export const EzProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Implementation
};
```

---

## Implementation Guidelines

### Testing Requirements
1. **Unit Tests**: Each new hook must have corresponding Vitest tests
2. **Integration Tests**: Test hook interactions with components
3. **E2E Tests**: Verify end-to-end functionality after implementation
4. **Performance Tests**: Benchmark before and after optimizations

### Code Quality Standards
1. **TypeScript Strict Mode**: All files must use strict mode
2. **ESLint Rules**: Follow project's ESLint configuration
3. **Prettier**: Ensure consistent code formatting
4. **Documentation**: JSDoc comments for all public APIs

### Performance Benchmarks
1. **Component Rendering**: Measure render times before/after
2. **Memory Usage**: Monitor memory leaks and cleanup
3. **Bundle Size**: Track bundle size changes
4. **Lighthouse Scores**: Maintain/improve performance scores

### Migration Strategy
1. **Backward Compatibility**: Maintain existing API signatures
2. **Gradual Rollout**: Implement changes incrementally
3. **Feature Flags**: Use flags for experimental features
4. **Monitoring**: Track usage and performance metrics

---

## Expected Outcomes

### Code Metrics
- **Total Lines Saved**: 350-400 lines
- **Code Duplication Reduction**: 60-70%
- **Bundle Size Reduction**: 15-20 KB
- **Test Coverage Increase**: 20-30%

### Performance Metrics
- **Render Time Reduction**: 40-50%
- **Memory Usage Reduction**: 25-30%
- **Bundle Size Reduction**: 15-20 KB
- **Lighthouse Performance Score**: Maintain/improve from current baseline

### Developer Experience
- **Reduced Boilerplate**: 60% reduction in repetitive code
- **Improved Type Safety**: Better TypeScript support
- **Easier Maintenance**: Single source of truth for common patterns
- **Better Testing**: Comprehensive test coverage

---

## Risk Mitigation

### Potential Risks
1. **Breaking Changes**: Maintain backward compatibility
2. **Performance Regression**: Comprehensive testing required
3. **Complexity Increase**: Keep changes incremental and well-documented
4. **Testing Overhead**: Allocate sufficient time for testing

### Mitigation Strategies
1. **Feature Flags**: Gradual rollout with feature flags
2. **A/B Testing**: Test performance impact on production
3. **Monitoring**: Track metrics before/after deployment
4. **Rollback Plan**: Maintain ability to revert changes

---

## Success Criteria

### Code Quality
- [ ] All new hooks follow TypeScript strict mode
- [ ] All components maintain existing API signatures
- [ ] Code passes all ESLint checks
- [ ] All new code is documented with JSDoc

### Performance
- [ ] Component rendering time reduced by 40%+
- [ ] Bundle size reduced by 15%+
- [ ] No memory leaks introduced
- [ ] Lighthouse performance score maintained/improved

### Testing
- [ ] 100% coverage of new hooks
- [ ] Integration tests pass for all components
- [ ] E2E tests pass for all major workflows
- [ ] Performance benchmarks show improvements

### Maintainability
- [ ] Code duplication reduced by 60%+
- [ ] Boilerplate code reduced by 60%+
- [ ] Documentation updated
- [ ] Team review and approval

---

## Next Steps

1. **Review and Approval**: Get stakeholder approval for implementation plan
2. **Resource Allocation**: Assign developers to each phase
3. **Sprint Planning**: Break down into 2-week sprints
4. **Implementation**: Execute implementation following guidelines
5. **Testing**: Comprehensive testing before deployment
6. **Monitoring**: Track metrics after deployment
7. **Iteration**: Iterate based on feedback and metrics

---

## Contact and Support

For questions or issues during implementation:
- Review SKILL.md for architectural guidelines
- Consult existing component implementations for patterns
- Reference test files for usage examples
- Use component documentation for API details

---

**Last Updated**: 2026-02-01  
**Version**: 1.0.0  
**Status**: Ready for Implementation