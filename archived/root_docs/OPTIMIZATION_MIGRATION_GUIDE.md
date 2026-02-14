# EzUX Optimization Migration Guide

This document provides instructions for migrating existing components to the new optimized architecture implemented in Phase 3.

## 1. Migrating Custom Renderers

Old pattern:
```typescript
// Previously in EzTable/renderers/CustomRenderer.tsx
import { cn } from '../utils/someUtil';
```

New pattern:
Move the renderer to `src/shared/components` if it's generic.
```typescript
import { BaseCell } from './BaseCell';
import { cn } from '../../lib/utils';
```

## 2. Adopting `useVirtualization`

If you are using a custom scroll container, replace `@tanstack/react-virtual` hooks directly with `useVirtualization`.

```typescript
import { useVirtualization } from '../../shared/hooks/useVirtualization';

const { parentRef, rowVirtualizer, getVirtualItems } = useVirtualization({
    rowCount: data.length,
    rowHeight: 48,
    progressiveRendering: true
});
```

## 3. Implementing Functional Services

Ensure your services extend `BaseService` to handle subscriptions and cleanup automatically.

```typescript
import { BaseService } from '../shared/services/BaseService';

export class MyService extends BaseService<MyState> {
    name = 'MyService';
    constructor() {
        super({ /* initial state */ });
    }
}
```

## 4. Component Sectioning

Break down monolithic components into sections in `components/MyComponent/components/`.

Example structure:
- `MyComponent/index.tsx` (Entry)
- `MyComponent/useMyComponent.ts` (Logic)
- `MyComponent/components/MyComponentHeader.tsx` (View)
- `MyComponent/components/MyComponentBody.tsx` (View)

## 5. Summary of Shared Utilities

| Utility | Location | Description |
|---------|----------|-------------|
| `HighlightText` | `shared/components` | Search term highlighting |
| `BaseCell` | `shared/components` | Core cell rendering logic |
| `PrimitiveRenderer` | `shared/components` | Unified text/num/date rendering |
| `useComponentState` | `shared/hooks` | Standardized component state |
| `createImperativeAPI` | `shared/utils` | API generation |
