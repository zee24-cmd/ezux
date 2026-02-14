# EzFilterBuilder Performance Optimization Prompt for Google Gemini 3 Fast

## Task
Optimize the EzFilterBuilder component in `packages/ezux/src/components/EzTable/EzFilterBuilder.tsx` for better performance and reduced code size.

## Current Issues Identified

### Performance Bottlenecks
1. **Unnecessary re-renders**: The `fields` array is recalculated on every render (lines 29-34)
2. **No memoization**: All event handlers (`addRule`, `addGroup`, `removeFilter`, `updateFilter`, `toggleLogic`) are recreated on every render
3. **Excessive object creation**: Spread syntax (`...filter`) creates new objects on every change, triggering parent re-renders
4. **No component memoization**: The entire component is not wrapped in `React.memo`
5. **Deep nesting without memoization**: Nested components re-render independently

### Code Size Issues
1. **Duplicate Select components**: Two similar Select structures with hardcoded options (lines 135-147, 149-166)
2. **Hardcoded operator options**: 8 operator options hardcoded directly in JSX (lines 156-165)
3. **Redundant type checking**: Runtime check `const isGroup = 'logic' in f;` (line 115)
4. **Large conditional blocks**: Value input conditional rendering (lines 168-175)
5. **Multiple similar buttons**: Repeated Button variants with similar styling

## Required Changes

### Phase 1: Performance Optimization (High Priority)

1. **Add `useMemo` for computed values**
```typescript
const fields = useMemo(() => columns.map((col) => {
    const id = col.id || (col as any).accessorKey;
    const label = typeof col.header === 'string' ? col.header : id;
    return { id, label };
}).filter(f => f.id), [columns]);
```

2. **Add `useCallback` for all event handlers**
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

3. **Wrap component with `React.memo`**
```typescript
export const EzFilterBuilder = React.memo(({ filter, columns, onChange, depth = 0, onRemove }) => {
    // ... existing code ...
});
```

### Phase 2: Code Size Reduction (Medium Priority)

4. **Extract operator options to constant**
```typescript
const OPERATOR_OPTIONS = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'gt', label: '>' },
    { value: 'lt', label: '<' },
    { value: 'empty', label: 'Is Empty' },
    { value: 'notEmpty', label: 'Not Empty' }
] as const;
```

5. **Create reusable FilterRuleSelect component**
```typescript
interface FilterRuleSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder: string;
    className?: string;
}

const FilterRuleSelect: React.FC<FilterRuleSelectProps> = ({ value, onChange, options, placeholder, className }) => (
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

6. **Use discriminated unions for type checking**
```typescript
// Update FilterRule and FilterGroup types
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

// Replace runtime check with type guard
const isGroup = (item: FilterRule | FilterGroup): item is FilterGroup => item.kind === 'group';
```

## Expected Results

- **Performance**: 40-60% reduction in re-renders
- **Code Size**: 30-40% reduction through component extraction
- **Bundle Size**: ~2-3KB reduction
- **Maintainability**: Better separation of concerns with reusable components

## Implementation Order

1. Add memoization hooks (useMemo + useCallback)
2. Wrap component with React.memo
3. Extract operator options to constant
4. Create reusable FilterRuleSelect component
5. Update types to use discriminated unions
6. Apply reusable components throughout

## Notes

- Maintain existing functionality and API
- Keep all existing imports and dependencies
- Preserve current styling and UI behavior
- Ensure backward compatibility with existing usage