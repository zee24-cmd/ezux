# EzExcelFilter and EzFilterBuilder Optimization Prompt for Google Gemini 3 Fast

## Task
Optimize both EzExcelFilter and EzFilterBuilder components in the EzUX library for better performance and reduced code size, including implementing shared code to eliminate duplication. Ensure 100% complaince with /Users/zed/Documents/ezux/.agents/skills/design-md/SKILL.md 

## Components to Optimize

### 1. EzExcelFilter
**Location**: `packages/ezux/src/components/EzTable/EzExcelFilter.tsx` (313 lines)

### 2. EzFilterBuilder
**Location**: `packages/ezux/src/components/EzTable/EzFilterBuilder.tsx` (191 lines)

---

## Phase 1: EzExcelFilter Optimization

### Performance Improvements

#### 1.1 Consolidate useEffect Hooks
**Current Issue**: Two separate useEffect hooks with timers (lines 57-71)
```typescript
// Current code
useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(timer);
}, [search]);

useEffect(() => {
    const timer = setTimeout(() => {
        const values = column.getFacetedUniqueValues();
        setUniqueValues(values);
        setAllAvailableValues(Array.from(values.keys()));
        setIsLoading(false);
    }, 50);
    return () => clearTimeout(timer);
}, [column]);
```

**Required Change**: Consolidate into a single useEffect
```typescript
useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(timer);
}, [search]);

useEffect(() => {
    const timer = setTimeout(() => {
        const values = column.getFacetedUniqueValues();
        setUniqueValues(values);
        setAllAvailableValues(Array.from(values.keys()));
        setIsLoading(false);
    }, 50);
    return () => clearTimeout(timer);
}, [column]);
```

#### 1.2 Wrap FilterContent with React.memo
**Current Issue**: No memoization on FilterContent component
```typescript
// Current code
function FilterContent({ column, setIsOpen }: { column: Column<any, any>; setIsOpen: (o: boolean) => void }) {
```

**Required Change**: Add memoization
```typescript
const FilterContent = React.memo(({ column, setIsOpen }: { column: Column<any, any>; setIsOpen: (o: boolean) => void }) => {
    // ... existing code ...
});
```

#### 1.3 Reduce useMemo Dependencies
**Current Issue**: Line 84-89 has 3 dependencies
```typescript
const columnType = useMemo(() => {
    const meta = column.columnDef.meta as any;
    if (meta?.columnType) return meta.columnType;
    if (allAvailableValues.length === 0 && !isLoading) return 'text';
    return detectColumnType(allAvailableValues);
}, [column.columnDef.meta, allAvailableValues, isLoading]); // 3 dependencies
```

**Required Change**: Remove `isLoading` from dependencies
```typescript
const columnType = useMemo(() => {
    const meta = column.columnDef.meta as any;
    if (meta?.columnType) return meta.columnType;
    if (allAvailableValues.length === 0) return 'text';
    return detectColumnType(allAvailableValues);
}, [column.columnDef.meta, allAvailableValues]);
```

#### 1.4 Extract Column Type Constants
**Current Issue**: Lines 91-93 have hardcoded column type checks
```typescript
const isDateColumn = columnType === 'date' || columnType === 'datetime';
const isBooleanColumn = columnType === 'boolean';
const isSelectColumn = columnType === 'select';
```

**Required Change**: Extract to constants
```typescript
const DATE_COLUMN_TYPES = ['date', 'datetime'] as const;
const BOOLEAN_COLUMN_TYPES = ['boolean'] as const;
const SELECT_COLUMN_TYPES = ['select'] as const;

const isDateColumn = DATE_COLUMN_TYPES.includes(columnType as any);
const isBooleanColumn = BOOLEAN_COLUMN_TYPES.includes(columnType as any);
const isSelectColumn = SELECT_COLUMN_TYPES.includes(columnType as any);
```

#### 1.5 Create SelectAllCheckbox Component
**Current Issue**: Lines 264-273 have inline select all checkbox
```typescript
<div className="flex items-center space-x-2 px-2 py-1.5 hover:bg-muted rounded text-sm cursor-pointer" onClick={() => handleToggleAllVisible(!isAllVisibleSelected)}>
    <Checkbox
        checked={isAllVisibleSelected ? true : (isSomeVisibleSelected ? "indeterminate" : false)}
        onCheckedChange={(c) => handleToggleAllVisible(c === true)}
    />
    <label className="flex-1 cursor-pointer">
        {debouncedSearch ? `(Select All Search Results)` : `(Select All)`}
    </label>
</div>
```

**Required Change**: Create shared component and use it
```typescript
// Create file: packages/ezux/src/components/EzTable/components/SelectAllCheckbox.tsx
interface SelectAllCheckboxProps {
    checked: boolean;
    indeterminate: boolean;
    onSelectAll: (select: boolean) => void;
    showSearchResults?: boolean;
}

export const SelectAllCheckbox: React.FC<SelectAllCheckboxProps> = ({ checked, indeterminate, onSelectAll, showSearchResults = false }) => (
    <div className="flex items-center space-x-2 px-2 py-1.5 hover:bg-muted rounded text-sm cursor-pointer" onClick={() => onSelectAll(!checked)}>
        <Checkbox checked={checked ? true : (indeterminate ? "indeterminate" : false)} onCheckedChange={(c) => onSelectAll(c === true)} />
        <label className="flex-1 cursor-pointer">
            {showSearchResults ? '(Select All Search Results)' : '(Select All)'}
        </label>
    </div>
);
```

Then use it in EzExcelFilter:
```typescript
<SelectAllCheckbox
    checked={isAllVisibleSelected}
    indeterminate={isSomeVisibleSelected && !isAllVisibleSelected}
    onSelectAll={handleToggleAllVisible}
    showSearchResults={!!debouncedSearch}
/>
```

### Code Size Improvements

#### 1.6 Extract Large Conditional Rendering
**Current Issue**: Lines 217-302 have large conditional block
**Required Change**: Extract into separate components
- Create `BooleanFilterSection` component for lines 225-237
- Create `SelectFilterSection` component for lines 238-247
- Create `VirtualizedFilterList` component for lines 249-301

#### 1.7 Create FilterActionButtons Component
**Current Issue**: Lines 306-307 have inline action buttons
**Required Change**: Create shared component (see Phase 3, Item 6)

---

## Phase 2: EzFilterBuilder Optimization

### Performance Improvements

#### 2.1 Add useMemo for fields Calculation
**Current Issue**: Lines 29-34 recalculate on every render
```typescript
const fields = columns.map((col) => {
    const id = col.id || (col as any).accessorKey;
    const label = typeof col.header === 'string' ? col.header : id;
    return { id, label };
}).filter(f => f.id);
```

**Required Change**:
```typescript
const fields = useMemo(() => columns.map((col) => {
    const id = col.id || (col as any).accessorKey;
    const label = typeof col.header === 'string' ? col.header : id;
    return { id, label };
}).filter(f => f.id), [columns]);
```

#### 2.2 Add useCallback for All Event Handlers
**Current Issue**: Lines 36-76 recreate on every render

**Required Change**: Add useCallback to all handlers
```typescript
const addRule = useCallback(() => {
    const newRule: FilterRule = {
        id: generateId(),
        field: fields[0]?.id || '',
        operator: 'contains',
        value: ''
    };
    onChange({
        ...filter,
        filters: [...filter.filters, newRule]
    });
}, [filter, onChange, fields]);

const addGroup = useCallback(() => {
    const newGroup: FilterGroup = {
        id: generateId(),
        logic: 'AND',
        filters: []
    };
    onChange({
        ...filter,
        filters: [...filter.filters, newGroup]
    });
}, [filter, onChange]);

const removeFilter = useCallback((index: number) => {
    const newFilters = [...filter.filters];
    newFilters.splice(index, 1);
    onChange({ ...filter, filters: newFilters });
}, [filter, onChange]);

const updateFilter = useCallback((index: number, newFilter: FilterRule | FilterGroup) => {
    const newFilters = [...filter.filters];
    newFilters[index] = newFilter;
    onChange({ ...filter, filters: newFilters });
}, [filter, onChange]);

const toggleLogic = useCallback(() => {
    const newLogic = filter.logic === 'AND' ? 'OR' : 'AND';
    onChange({ ...filter, logic: newLogic });
}, [filter, onChange]);
```

#### 2.3 Wrap Component with React.memo
**Current Issue**: No memoization on component
```typescript
export const EzFilterBuilder: React.FC<EzFilterBuilderProps> = ({...}) => {
```

**Required Change**:
```typescript
export const EzFilterBuilder = React.memo(({ filter, columns, onChange, depth = 0, onRemove }) => {
    // ... existing code ...
});
```

### Code Size Improvements

#### 2.4 Extract Operator Options to Constant
**Current Issue**: Lines 156-165 have hardcoded operator options
```typescript
<SelectContent>
    <SelectItem value="contains">Contains</SelectItem>
    <SelectItem value="equals">Equals</SelectItem>
    <SelectItem value="startsWith">Starts With</SelectItem>
    <SelectItem value="endsWith">Ends With</SelectItem>
    <SelectItem value="gt">{'>'}</SelectItem>
    <SelectItem value="lt">{'<'}</SelectItem>
    <SelectItem value="empty">Is Empty</SelectItem>
    <SelectItem value="notEmpty">Not Empty</SelectItem>
</SelectContent>
```

**Required Change**: Create shared constant file
```typescript
// Create file: packages/ezux/src/components/EzTable/constants/filterOptions.ts
export const FILTER_OPERATORS = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'gt', label: '>' },
    { value: 'lt', label: '<' },
    { value: 'gte', label: '>=' },
    { value: 'lte', label: '<=' },
    { value: 'between', label: 'Between' },
    { value: 'empty', label: 'Is Empty' },
    { value: 'notEmpty', label: 'Not Empty' },
    { value: 'doesNotContain', label: 'Does Not Contain' },
    { value: 'doesNotEqual', label: 'Does Not Equal' },
    { value: 'notEquals', label: 'Not Equal' },
    { value: 'shouldContain', label: 'Should Contain' }
] as const;

export const FILTER_OPERATORS_MAP = new Map(
    FILTER_OPERATORS.map(op => [op.value, op.label])
);
```

Then use it in EzFilterBuilder:
```typescript
import { FILTER_OPERATORS } from '../constants/filterOptions';

<SelectContent>
    {FILTER_OPERATORS.map(op => (
        <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
    ))}
</SelectContent>
```

#### 2.5 Create FilterRuleSelect Component
**Current Issue**: Lines 135-147 and 149-166 have duplicate Select patterns
**Required Change**: Create shared component (see Phase 3, Item 2)

#### 2.6 Use Discriminated Unions for Type Checking
**Current Issue**: Line 115 uses runtime check
```typescript
const isGroup = 'logic' in f;
```

**Required Change**: Update types and use type guard
```typescript
// Update EzTable.types.ts
export type FilterRule = {
    kind: 'rule';
    id: string;
    field: string;
    operator: FilterOperator;
    value: any;
};

export type FilterGroup = {
    kind: 'group';
    id: string;
    logic: 'AND' | 'OR';
    filters: (FilterRule | FilterGroup)[];
};

// Create file: packages/ezux/src/components/EzTable/utils/filterTypeGuards.ts
export const isFilterGroup = (item: any): item is FilterGroup => item?.kind === 'group';
export const isFilterRule = (item: any): item is FilterRule => item?.kind === 'rule';

// Use in EzFilterBuilder
import { isFilterGroup } from '../utils/filterTypeGuards';

const isGroup = isFilterGroup(f);
```

---

## Phase 3: Code Sharing (Both Components)

### 3.1 Create Shared Constants File
**File**: `packages/ezux/src/components/EzTable/constants/filterOptions.ts`
**Content**: See Phase 2, Item 4

### 3.2 Create Shared FilterRuleSelect Component
**File**: `packages/ezux/src/components/EzTable/components/FilterRuleSelect.tsx`
**Content**:
```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FilterRuleSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder: string;
    className?: string;
}

export const FilterRuleSelect: React.FC<FilterRuleSelectProps> = ({ value, onChange, options, placeholder, className }) => (
    <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={className}>
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                    {option.label}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);
```

### 3.3 Create Shared Type Guards
**File**: `packages/ezux/src/components/EzTable/utils/filterTypeGuards.ts`
**Content**:
```typescript
export const isFilterGroup = (item: any): item is FilterGroup => item?.kind === 'group';
export const isFilterRule = (item: any): item is FilterRule => item?.kind === 'rule';
```

### 3.4 Create Shared Column Type Detector
**File**: `packages/ezux/src/components/EzTable/utils/columnTypeDetector.ts`
**Content**:
```typescript
export const detectColumnType = (values: any[]): 'text' | 'number' | 'boolean' | 'date' | 'datetime' | 'select' => {
    if (values.length === 0) return 'text';

    const firstValue = values[0];
    if (typeof firstValue === 'boolean') return 'boolean';
    if (typeof firstValue === 'number') return 'number';
    if (firstValue instanceof Date) return 'datetime';

    // Check for date patterns
    const dateRegex = /^\d{4}-\d{2}-\d{2}/;
    const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

    if (dateRegex.test(String(firstValue))) return 'date';
    if (datetimeRegex.test(String(firstValue))) return 'datetime';

    // Check if all values are strings
    const allStrings = values.every(v => typeof v === 'string');
    if (allStrings) return 'text';

    return 'select';
};
```

### 3.5 Create Shared SelectAllCheckbox Component
**File**: `packages/ezux/src/components/EzTable/components/SelectAllCheckbox.tsx`
**Content**: See Phase 1, Item 5

### 3.6 Create Shared FilterActionButtons Component
**File**: `packages/ezux/src/components/EzTable/components/FilterActionButtons.tsx`
**Content**:
```typescript
import { Button } from '../ui/button';
import { PlusIcon, XIcon } from 'lucide-react';

interface FilterActionButtonsProps {
    onClear?: () => void;
    onApply?: () => void;
    onAddRule?: () => void;
    onAddGroup?: () => void;
    onRemove?: () => void;
    showClear?: boolean;
    showApply?: boolean;
    showAddRule?: boolean;
    showAddGroup?: boolean;
    showRemove?: boolean;
    className?: string;
}

export const FilterActionButtons: React.FC<FilterActionButtonsProps> = ({
    onClear,
    onApply,
    onAddRule,
    onAddGroup,
    onRemove,
    showClear = true,
    showApply = true,
    showAddRule = false,
    showAddGroup = false,
    showRemove = false,
    className
}) => (
    <div className={`p-2 border-t flex justify-between bg-white dark:bg-zinc-950 flex-shrink-0 sticky bottom-0 z-20 ${className || ''}`}>
        {showClear && onClear && (
            <Button variant="ghost" size="sm" onClick={onClear} className="h-8 text-xs">
                Clear
            </Button>
        )}
        {showApply && onApply && (
            <Button size="sm" onClick={onApply} className="min-w-[70px] h-8 text-xs font-semibold">
                OK
            </Button>
        )}
        {showAddRule && onAddRule && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddRule} title="Add Rule">
                <PlusIcon className="w-4 h-4" />
            </Button>
        )}
        {showAddGroup && onAddGroup && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddGroup} title="Add Group">
                <span className="font-bold text-xs">( )</span>
            </Button>
        )}
        {showRemove && onRemove && (
            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600" onClick={onRemove}>
                <XIcon className="w-4 h-4" />
            </Button>
        )}
    </div>
);
```

---

## Implementation Order

### Step 1: EzExcelFilter Optimizations
1. Consolidate useEffect hooks
2. Wrap FilterContent with React.memo
3. Reduce useMemo dependencies
4. Extract column type constants
5. Create SelectAllCheckbox component
6. Extract large conditional rendering into components

### Step 2: EzFilterBuilder Optimizations
1. Add useMemo for fields calculation
2. Add useCallback for all event handlers
3. Wrap component with React.memo
4. Extract operator options to constant
5. Create FilterRuleSelect component
6. Update types to use discriminated unions

### Step 3: Code Sharing
1. Create shared constants file (filterOptions.ts)
2. Create shared type guards (filterTypeGuards.ts)
3. Create shared column type detector (columnTypeDetector.ts)
4. Create shared components (FilterRuleSelect.tsx, SelectAllCheckbox.tsx, FilterActionButtons.tsx)
5. Update EzExcelFilter to use shared components
6. Update EzFilterBuilder to use shared components

---

## Expected Results

### Performance Improvements
- **EzExcelFilter**: 30-40% reduction in re-renders
- **EzFilterBuilder**: 40-60% reduction in re-renders

### Code Size Reductions
- **EzExcelFilter**: 20-25% code size reduction
- **EzFilterBuilder**: 30-40% code size reduction
- **Shared Code**: ~5-8KB bundle size reduction

### Maintainability Improvements
- Better separation of concerns
- Easier to test individual components
- Consistent patterns across both components
- Simplified future additions and modifications

---

## Notes

1. **Maintain Backward Compatibility**: Ensure all existing functionality remains unchanged
2. **Preserve Styling**: Keep all existing Tailwind classes and visual behavior
3. **Type Safety**: Preserve TypeScript types and interfaces
4. **Testing**: Run existing tests to ensure no regressions
5. **Documentation**: Update any related documentation if needed
6. **Imports**: Update imports to use shared files and components
7. **Exports**: Export new shared components and utilities for other parts of the library

---

## File Structure After Optimization

```
packages/ezux/src/components/EzTable/
├── components/
│   ├── FilterRuleSelect.tsx          (NEW)
│   ├── SelectAllCheckbox.tsx         (NEW)
│   ├── FilterActionButtons.tsx       (NEW)
│   ├── BooleanFilterSection.tsx      (NEW - EzExcelFilter)
│   ├── SelectFilterSection.tsx       (NEW - EzExcelFilter)
│   ├── VirtualizedFilterList.tsx     (NEW - EzExcelFilter)
│   └── DraggableHeader.tsx           (existing)
├── constants/
│   └── filterOptions.ts              (NEW)
├── utils/
│   ├── filterTypeGuards.ts           (NEW)
│   └── columnTypeDetector.ts         (NEW)
├── hooks/
│   └── useFilterSelection.ts         (existing)
├── renderers/
│   ├── PrimitiveFilter.tsx           (existing)
│   ├── BooleanFilter.tsx             (existing)
│   └── SelectFilter.tsx              (existing)
├── EzExcelFilter.tsx                 (optimized)
└── EzFilterBuilder.tsx               (optimized)