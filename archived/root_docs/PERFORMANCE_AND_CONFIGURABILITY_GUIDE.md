# High-Performance & Configurability Enhancement Guide

**Target**: EZUX Component Library (Monorepo)  
**Focus**: Making components blazing fast and highly configurable  
**Compliance**: SKILL.md (React 19, TanStack Stack)

---

## Part 1: Performance Optimizations

### 🚀 Optimization 1: React 19 Transitions for Heavy Operations

**SKILL.md Requirement**: "Prioritize... Transitions"

#### Current Problem
```typescript
// packages/ezux/src/components/EzTable/useEzTable.ts
const [globalFilter, setGlobalFilter] = useState('');

// When user types in search box:
<input onChange={(e) => setGlobalFilter(e.target.value)} />
// → Blocks main thread for 100-200ms on 10k rows
```

#### Solution: Implement `useTransition`
```typescript
import { useState, useTransition, useDeferredValue } from 'react';

export function useEzTable<TData extends object>(props: EzTableProps<TData>) {
  const [globalFilter, setGlobalFilterInternal] = useState('');
  const [isPending, startTransition] = useTransition();
  
  // Deferred value for filtering
  const deferredGlobalFilter = useDeferredValue(globalFilter);
  
  const setGlobalFilter = (value: string) => {
    // Update input immediately (controlled component)
    setGlobalFilterInternal(value);
    
    // Apply filter in background
    startTransition(() => {
      table.setGlobalFilter(value);
    });
  };
  
  // Use deferredGlobalFilter for actual filtering
  const table = useReactTable({
    // ...
    state: {
      globalFilter: deferredGlobalFilter,
      // ...other state
    },
  });
  
  return { table, isPending };
}
```

#### UI Changes
```typescript
// packages/ezux/src/components/EzTable/EzTableToolbar.tsx
export const EzTableToolbar = ({ table, isPending }: Props) => (
  <div className="flex items-center gap-2">
    <Input
      placeholder="Search..."
      value={table.getState().globalFilter ?? ''}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      className={cn(isPending && "opacity-50")}
    />
    {isPending && (
      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
    )}
  </div>
);
```

**Expected Impact**:
- Main thread stays responsive (\<16ms)
- User sees immediate input feedback
- Filter applies in background
- Visual loading indicator

---

### 🚀 Optimization 2: Stabilize Cell Renderer Props

#### Current Problem
```typescript
// packages/ezux/src/components/EzTable/index.tsx
const EzTableRow = ({ row, ... }) => {
  return (
    <>
      {row.getVisibleCells().map((cell, cellIndex) => (
        <EzTableCell
          cell={cell}
          // ❌ New function on every render
          onCellMouseDown={(r, c) => handleMouseDown(r, c)}
          onCellMouseEnter={(r, c) => handleMouseEnter(r, c)}
          onCellClick={(r, c) => handleClick(r, c)}
        />
      ))}
    </>
  );
};
```

Even though `EzTableCell` is memoized, these new function references cause it to re-render.

#### Solution: Context + Stable Callbacks
```typescript
// packages/ezux/src/components/EzTable/context/EzTableInteractionContext.tsx
import { createContext, useContext, useCallback } from 'react';

interface InteractionContextType {
  onCellMouseDown: (rowIndex: number, cellIndex: number) => void;
  onCellMouseEnter: (rowIndex: number, cellIndex: number) => void;
  onCellClick: (rowIndex: number, cellIndex: number) => void;
}

const InteractionContext = createContext<InteractionContextType | null>(null);

export const useTableInteraction = () => {
  const ctx = useContext(InteractionContext);
  if (!ctx) throw new Error('useTableInteraction must be within provider');
  return ctx;
};

export const TableInteractionProvider = ({ children, onRangeSelect, ... }: Props) => {
  const handleCellMouseDown = useCallback((r: number, c: number) => {
    onRangeSelect?.(r, c);
  }, [onRangeSelect]);
  
  // ... other stable handlers
  
  return (
    <InteractionContext.Provider value={{ 
      onCellMouseDown: handleCellMouseDown,
      // ...
    }}>
      {children}
    </InteractionContext.Provider>
  );
};
```

#### Updated Cell Component
```typescript
const EzTableCell = memo(({ cell, virtualRowIndex, cellIndex }: Props) => {
  const { onCellMouseDown, onCellMouseEnter, onCellClick } = useTableInteraction();
  
  return (
    <div
      onMouseDown={() => onCellMouseDown(virtualRowIndex, cellIndex)}
      onMouseEnter={() => onCellMouseEnter(virtualRowIndex, cellIndex)}
      onClick={() => onCellClick(virtualRowIndex, cellIndex)}
    >
      {/* cell content */}
    </div>
  );
}, (prev, next) => {
  // Custom comparison for optimal memoization
  return (
    prev.cell.id === next.cell.id &&
    prev.isFocused === next.isFocused &&
    prev.isSelected === next.isSelected
  );
});
```

**Expected Impact**: 60-80% reduction in cell re-renders

---

### 🚀 Optimization 3: Persistent Web Worker

#### Current Implementation
```typescript
// apps/showcase/src/demos/layout/EzTableDemoWrapper.tsx
const useTableData = (count: number) => {
  return useQuery({
    queryKey: ['tableData', count],
    queryFn: () => new Promise((resolve) => {
      // ❌ Creates new worker every time
      const worker = new Worker(new URL('../../workers/data.worker.ts', import.meta.url), { type: 'module' });
      worker.postMessage({ type: 'generateTableData', count });
      worker.onmessage = (e) => {
        resolve(e.data.data);
        worker.terminate(); // ❌ Terminates immediately
      };
    }),
  });
};
```

**Overhead**: 50-100ms per worker creation

#### Optimized: Worker Service
```typescript
// apps/showcase/src/services/DataWorkerService.ts
class DataWorkerService {
  private worker: Worker | null = null;
  private requestId = 0;
  private pendingRequests = new Map<number, (data: any) => void>();

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    this.worker = new Worker(
      new URL('../workers/data.worker.ts', import.meta.url),
      { type: 'module' }
    );

    this.worker.onmessage = (e) => {
      const { requestId, type, data } = e.data;
      
      if (type === 'complete') {
        const resolver = this.pendingRequests.get(requestId);
        if (resolver) {
          resolver(data);
          this.pendingRequests.delete(requestId);
        }
      }
    };
  }

  async generateTableData(count: number): Promise<any[]> {
    return new Promise((resolve) => {
      const id = ++this.requestId;
      this.pendingRequests.set(id, resolve);
      
      this.worker?.postMessage({
        type: 'generateTableData',
        count,
        requestId: id
      });
    });
  }

  destroy() {
    this.worker?.terminate();
    this.worker = null;
  }
}

export const dataWorkerService = new DataWorkerService();
```

#### Updated Hook
```typescript
// apps/showcase/src/hooks/useTableData.ts
import { useQuery } from '@tanstack/react-query';
import { dataWorkerService } from '../services/DataWorkerService';

export const useTableData = (count: number) => {
  return useQuery({
    queryKey: ['tableData', count],
    queryFn: () => dataWorkerService.generateTableData(count),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep in cache for 10 minutes
  });
};
```

**Expected Impact**: 
- 50-100ms faster subsequent loads
- Progressive data streaming possible (future)
- Single worker instance across all demos

---

### 🚀 Optimization 4: Virtual Scrolling Tuning

#### Current Configuration
```typescript
// packages/ezux/src/components/EzTable/useEzTable.ts
const rowVirtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 40, // Fixed height
  overscan: 5,
});
```

#### Optimized Configuration
```typescript
const rowVirtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => {
    // Dynamic height based on density
    switch (density) {
      case 'compact': return 32;
      case 'comfortable': return 48;
      default: return 40;
    }
  },
  overscan: 10, // Increased for smoother scrolling
  // Enable range extractor for better blank prevention
  rangeExtractor: (range) => {
    const start = Math.max(range.startIndex - range.overscan, 0);
    const end = Math.min(range.endIndex + range.overscan, range.count - 1);
    
    const indices: number[] = [];
    for (let i = start; i <= end; i++) {
      indices.push(i);
    }
    return indices;
  },
  // Measure actual heights for accuracy
  measureElement: (el) => el?.getBoundingClientRect().height ?? 40,
});
```

**Expected Impact**: Smoother scrolling, no blank rows

---

## Part 2: Configurability Enhancements

### 🎨 Enhancement 1: Extended Column Types

#### Current Limitation
```typescript
// Only supports basic types
interface ColumnMeta {
  filterVariant?: 'text' | 'number' | 'date';
}
```

#### Enhanced Type System
```typescript
// packages/ezux/src/components/EzTable/EzTable.types.ts

export type FilterVariant = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'datetime'
  | 'boolean'
  | 'enum'
  | 'tags'
  | 'richtext'
  | 'custom';

export interface EnumOption {
  label: string;
  value: any;
  icon?: React.ReactNode;
  color?: string;
}

export interface ColumnMeta {
  // Filtering
  filterVariant?: FilterVariant;
  enumOptions?: EnumOption[];
  customFilterComponent?: React.ComponentType<FilterComponentProps>;
  
  // Rendering
  renderCell?: (value: any, row: any) => React.ReactNode;
  renderEditCell?: (value: any, onChange: (v: any) => void) => React.ReactNode;
  
  // Formatting
  format?: (value: any) => string;
  parse?: (input: string) => any;
  
  // Validation
  validate?: (value: any) => string | null;
  
  // Display
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
  maxWidth?: number;
}
```

#### Usage Example
```typescript
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'isActive',
    header: 'Active',
    meta: {
      filterVariant: 'boolean',
      renderCell: (value) => (
        <Switch checked={value} disabled />
      ),
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    meta: {
      filterVariant: 'enum',
      enumOptions: [
        { label: 'Admin', value: 'admin', icon: <Shield />, color: 'red' },
        { label: 'User', value: 'user', icon: <User />, color: 'blue' },
        { label: 'Guest', value: 'guest', icon: <Eye />, color: 'gray' },
      ],
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    meta: {
      filterVariant: 'tags',
      renderCell: (tags: string[]) => (
        <div className="flex gap-1 flex-wrap">
          {tags.map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      ),
    },
  },
];
```

---

### 🎨 Enhancement 2: Scheduler Resource Management

#### Current Limitation
```typescript
// Shows all resources, no filtering
<DayWeekView resources={props.resources} />
```

#### Enhanced Resource Configuration
```typescript
// packages/ezux/src/components/EzScheduler/EzScheduler.types.ts

export interface ResourceConfig {
  // Search
  searchable?: boolean;
  searchPlaceholder?: string;
  
  // Grouping
  groupBy?: 'department' | 'type' | ((resource: Resource) => string);
  collapsible?: boolean;
  defaultExpanded?: boolean;
  
  // Filtering
  filterBy?: (resource: Resource) => boolean;
  
  // Display
  maxVisible?: number;
  virtualizeThreshold?: number; // Start virtualizing at N resources
  
  // Rendering
  renderResource?: (resource: Resource) => React.ReactNode;
  renderGroup?: (groupName: string, resources: Resource[]) => React.ReactNode;
}

export interface EzSchedulerProps {
  // ... existing
  resourceConfig?: ResourceConfig;
}
```

#### Implementation
```typescript
// packages/ezux/src/components/EzScheduler/components/EzResourcePanel.tsx
export const EzResourcePanel = ({ resources, config }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  const filteredResources = useMemo(() => {
    let filtered = resources;
    
    // Apply search
    if (config?.searchable && searchQuery) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply custom filter
    if (config?.filterBy) {
      filtered = filtered.filter(config.filterBy);
    }
    
    return filtered;
  }, [resources, searchQuery, config]);
  
  const groupedResources = useMemo(() => {
    if (!config?.groupBy) return { 'All': filteredResources };
    
    return filteredResources.reduce((groups, resource) => {
      const groupKey = typeof config.groupBy === 'function'
        ? config.groupBy(resource)
        : resource[config.groupBy as keyof Resource] as string;
      
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(resource);
      return groups;
    }, {} as Record<string, Resource[]>);
  }, [filteredResources, config]);
  
  return (
    <div className="w-64 border-r">
      {config?.searchable && (
        <Input
          placeholder={config.searchPlaceholder ?? "Search resources..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      )}
      
      {Object.entries(groupedResources).map(([groupName, resources]) => (
        <div key={groupName}>
          {config?.groupBy && (
            <button onClick={() => toggleGroup(groupName)}>
              {expandedGroups.has(groupName) ? <ChevronDown /> : <ChevronRight />}
              {groupName} ({resources.length})
            </button>
          )}
          
          {expandedGroups.has(groupName) && resources.map(resource => (
            config?.renderResource 
              ? config.renderResource(resource)
              : <div key={resource.id}>{resource.name}</div>
          ))}
        </div>
      ))}
    </div>
  );
};
```

#### Usage Example
```typescript
<EzScheduler
  events={events}
  resources={allResources}
  resourceConfig={{
    searchable: true,
    groupBy: 'department',
    collapsible: true,
    defaultExpanded: true,
    maxVisible: 20,
    renderResource: (resource) => (
      <div className="flex items-center gap-2">
        <Avatar src={resource.avatar} />
        <span>{resource.name}</span>
        <Badge>{resource.role}</Badge>
      </div>
    ),
  }}
/>
```

---

### 🎨 Enhancement 3: Component-Level Theming

#### Current Limitation
```typescript
// Components inherit global theme only
// Cannot have dark table in light app
```

#### Scoped Theme System
```typescript
// packages/ezux/src/shared/types/Theme.ts

export interface ComponentTheme {
  mode?: 'light' | 'dark' | 'inherit';
  accentColor?: string;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  density?: 'compact' | 'normal' | 'comfortable';
  
  // Custom CSS variables
  customVars?: Record<string, string>;
}

export interface ThemedComponentProps {
  theme?: ComponentTheme;
}
```

#### Implementation
```typescript
// packages/ezux/src/components/EzTable/index.tsx
export const EzTable = <TData extends object>({
  theme,
  ...props
}: EzTableProps<TData> & ThemedComponentProps) => {
  const themeVars = useMemo(() => {
    if (!theme) return {};
    
    const vars: Record<string, string> = {};
    
    if (theme.accentColor) {
      vars['--table-accent'] = theme.accentColor;
    }
    
    if (theme.customVars) {
      Object.assign(vars, theme.customVars);
    }
    
    return vars;
  }, [theme]);
  
  return (
    <div
      data-theme={theme?.mode ?? 'inherit'}
      data-radius={theme?.radius}
      data-density={theme?.density}
      style={themeVars as React.CSSProperties}
      className={cn(
        "ez-table-root",
        theme?.mode === 'dark' && "dark",
        props.className
      )}
    >
      {/* Table content */}
    </div>
  );
};
```

#### Scoped CSS
```css
/* packages/ezux/src/components/EzTable/styles.css */

.ez-table-root {
  /* Default theme variables */
  --table-bg: hsl(var(--background));
  --table-fg: hsl(var(--foreground));
  --table-accent: hsl(var(--primary));
}

.ez-table-root[data-theme="dark"] {
  --table-bg: hsl(222 47% 11%);
  --table-fg: hsl(0 0% 95%);
  --table-accent: hsl(217 91% 60%);
}

.ez-table-root[data-radius="full"] {
  --table-radius: 9999px;
}

/* Apply scoped variables */
.ez-table-root thead {
  background: var(--table-bg);
  color: var(--table-fg);
}

.ez-table-root .selected-row {
  background: var(--table-accent);
}
```

#### Usage Example
```typescript
// Light mode app, but dark table
<div className="bg-white">
  <EzTable
    data={data}
    columns={columns}
    theme={{
      mode: 'dark',
      accentColor: '#3b82f6',
      radius: 'md',
    }}
  />
</div>
```

---

## Part 3: Advanced Configurability Patterns

### 🎛️ Pattern 1: Render Prop Slots

```typescript
export interface EzTableProps<TData> {
  // ... existing props
  
  // Custom renderers
  renderToolbar?: (table: Table<TData>) => React.ReactNode;
  renderNoRowsOverlay?: () => React.ReactNode;
  renderLoadingOverlay?: () => React.ReactNode;
  renderPagination?: (table: Table<TData>) => React.ReactNode;
  renderFooter?: (table: Table<TData>) => React.ReactNode;
  
  // Row-level customization
  renderRowActions?: (row: Row<TData>) => React.ReactNode;
  isRowSelectable?: (row: Row<TData>) => boolean;
  isRowExpandable?: (row: Row<TData>) => boolean;
  getRowClassName?: (row: Row<TData>) => string;
}
```

### 🎛️ Pattern 2: Behavior Interceptors

```typescript
export interface EzTableProps<TData> {
  // Lifecycle hooks
  onBeforeSort?: (column: Column<TData>) => boolean; // Return false to cancel
  onAfterSort?: (column: Column<TData>) => void;
  
  onBeforeFilter?: (filter: ColumnFilter) => ColumnFilter | null; // Return null to cancel
  onAfterFilter?: (filters: ColumnFilter[]) => void;
  
  onBeforeEdit?: (row: Row<TData>, column: Column<TData>) => boolean;
  onAfterEdit?: (row: Row<TData>, column: Column<TData>, newValue: any) => void;
  
  // Data transformation
  transformData?: (data: TData[]) => TData[];
  transformExport?: (data: TData[]) => any[];
}
```

### 🎛️ Pattern 3: Plugin System

```typescript
// packages/ezux/src/components/EzTable/plugins/types.ts
export interface EzTablePlugin<TData> {
  name: string;
  version: string;
  
  // Lifecycle
  onInit?: (table: Table<TData>) => void;
  onDataChange?: (data: TData[]) => void;
  onDestroy?: () => void;
  
  // Extensions
  extendColumns?: (columns: ColumnDef<TData>[]) => ColumnDef<TData>[];
  extendToolbar?: () => React.ReactNode;
  extendContextMenu?: (row: Row<TData>) => MenuItem[];
}

// Usage
<EzTable
  data={data}
  columns={columns}
  plugins={[
    auditLogPlugin,
    bulkActionsPlugin,
    advancedSearchPlugin,
  ]}
/>
```

---

## Part 4: Performance Monitoring

### 📊 Built-in Performance Metrics

```typescript
// packages/ezux/src/components/EzTable/useEzTable.ts
export function useEzTable<TData>(props: EzTableProps<TData>) {
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    avgRenderTime: 0,
    dataProcessingTime: 0,
  });
  
  useEffect(() => {
    const start = performance.now();
    
    // Render logic...
    
    const duration = performance.now() - start;
    setMetrics(prev => ({
      renderCount: prev.renderCount + 1,
      lastRenderTime: duration,
      avgRenderTime: (prev.avgRenderTime * prev.renderCount + duration) / (prev.renderCount + 1),
      dataProcessingTime: prev.dataProcessingTime,
    }));
  }, [/* deps */]);
  
  // Expose metrics for debugging
  if (props.enablePerformanceMonitoring) {
    console.table(metrics);
  }
  
  return { table, metrics };
}
```

---

## Summary Checklist

### Performance ✅
- [ ] Implement `useTransition` for filtering
- [ ] Stabilize cell renderer props via context
- [ ] Create persistent worker service
- [ ] Tune virtual scrolling parameters
- [ ] Add performance monitoring

### Configurability ✅
- [ ] Extend column types (boolean, enum, tags, richtext)
- [ ] Add resource panel configuration
- [ ] Implement component-level theming
- [ ] Add render prop slots
- [ ] Add behavior interceptors
- [ ] Design plugin system

### Expected Results
- **Filter Latency**: 100-200ms → \<16ms
- **Re-render Count**: 10,000+ → 2,000-3,000 (60-80% reduction)
- **Bundle Size**: Unknown → \<150KB gzipped
- **Configurability**: Medium → Very High
- **Developer Experience**: Good → Excellent

---

**Next Steps**: Implement in order of priority - Performance first (immediate user impact), then configurability (developer happiness).
