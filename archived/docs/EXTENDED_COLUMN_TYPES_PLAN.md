# Extended Column Types - Implementation Plan

**Feature**: Add support for Boolean, Enum, Tags, Rich Text, and Custom Renderer column types  
**Status**: 🎯 In Progress  
**Priority**: High (Week 2+ Enhancement #1)

---

## 🎯 Objectives

Enhance `EzTable` to support specialized column types beyond the current text, number, and date types:

1. **Boolean** - Checkbox display with toggle filter
2. **Enum** - Icon-based dropdown selection
3. **Tags** - Multi-select chip display
4. **Rich Text** - HTML/Markdown rendering
5. **Custom Renderers** - Framework for user-defined renderers

---

## 📋 Implementation Phases

### **Phase 1: Boolean Columns** ✅ NEXT
**Goal:** Add checkbox-based boolean columns with filter support

**Features:**
- ✅ Checkbox display for true/false values
- ✅ Toggle editing interface
- ✅ Tri-state filter (All/True/False)
- ✅ IndeterminateCheckbox support

**New Components:**
- `BooleanCell` - Display component
- `BooleanEditor` - Editing component
- `BooleanFilter` - Filter dropdown

**Implementation:**
```typescript
// Column definition
{
    accessorKey: 'isActive',
    header: 'Active',
    meta: {
        columnType: 'boolean',
        booleanConfig: {
            trueLabel: 'Active',
            falseLabel: 'Inactive',
            trueIcon: <Check />,
            falseIcon: <X />
        }
    }
}
```

---

### **Phase 2: Enum Columns**
**Goal:** Dropdown selection with icons and colors

**Features:**
- Icon + text display
- Color coding by value
- Dropdown editor with search
- Multi-value filter

**New Components:**
- `EnumCell` - Badge with icon
- `EnumEditor` - Searchable dropdown
- `EnumFilter` - Multi-select filter

**Implementation:**
```typescript
// Column definition
{
    accessorKey: 'priority',
    header: 'Priority',
    meta: {
        columnType: 'enum',
        enumConfig: {
            options: [
                { value: 'high', label: 'High', icon: <AlertCircle />, color: 'red' },
                { value: 'medium', label: 'Medium', icon: <Info />, color: 'yellow' },
                { value: 'low', label: 'Low', icon: <CheckCircle />, color: 'green' }
            ]
        }
    }
}
```

---

### **Phase 3: Tags Columns**
**Goal:** Multi-select chip-based display

**Features:**
- Chip array display
- Multi-select editor
- Tag creation on-the-fly
- Color-coded chips

**New Components:**
- `TagsCell` - Chip array
- `TagsEditor` - Multi-select with creation
- `TagsFilter` - Tag selection filter

**Implementation:**
```typescript
// Column definition
{
    accessorKey: 'skills',
    header: 'Skills',
    meta: {
        columnType: 'tags',
        tagsConfig: {
            availableTags: ['React', 'TypeScript', 'Node.js'],
            allowCreate: true,
            maxTags: 5,
            colorScheme: 'auto'
        }
    }
}
```

---

### **Phase 4: Rich Text Columns**
**Goal:** HTML/Markdown rendering

**Features:**
- Safe HTML rendering
- Markdown support
- Rich text editor
- Preview mode

**New Components:**
- `RichTextCell` - Sanitized HTML/MD renderer
- `RichTextEditor` - WYSIWYG or MD editor
- `RichTextPreview` - Read-only display

**Implementation:**
```typescript
// Column definition
{
    accessorKey: 'description',
    header: 'Description',
    meta: {
        columnType: 'richText',
        richTextConfig: {
            format: 'markdown', // or 'html'
            maxLength: 500,
            allowImages: false
        }
    }
}
```

---

### **Phase 5: Custom Renderers Framework**
**Goal:** Allow users to define custom cell/editor/filter components

**Features:**
- Component registration system
- Props interface
- Lifecycle hooks
- Type safety

**Implementation:**
```typescript
// Register custom renderer
registerColumnRenderer('rating', {
    Cell: ({ value }) => <StarRating value={value} />,
    Editor: ({ value, onChange }) => <StarRatingEditor value={value} onChange={onChange} />,
    Filter: ({ column }) => <StarRatingFilter column={column} />
});

// Use in column
{
    accessorKey: 'rating',
    header: 'Rating',
    meta: {
        columnType: 'custom',
        customRenderer: 'rating'
    }
}
```

---

## 🏗️ Architecture

### **1. Column Type System**

```typescript
// packages/ezux/src/components/EzTable/types/ColumnTypes.ts

export type ColumnType = 
    | 'text' 
    | 'number' 
    | 'date' 
    | 'datetime'
    | 'boolean'
    | 'enum'
    | 'tags'
    | 'richText'
    | 'custom';

export interface ColumnTypeConfig {
    type: ColumnType;
    cellRenderer?: React.ComponentType<CellRendererProps>;
    editorRenderer?: React.ComponentType<EditorRendererProps>;
    filterRenderer?: React.ComponentType<FilterRendererProps>;
}
```

### **2. Renderer Registry**

```typescript
// packages/ezux/src/components/EzTable/renderers/RendererRegistry.ts

class ColumnRendererRegistry {
    private renderers: Map<ColumnType, ColumnTypeConfig>;
    
    register(type: ColumnType, config: ColumnTypeConfig): void;
    get(type: ColumnType): ColumnTypeConfig | undefined;
    has(type: ColumnType): boolean;
}

export const columnRendererRegistry = new ColumnRendererRegistry();
```

### **3. Component Structure**

```
packages/ezux/src/components/EzTable/
├── renderers/
│   ├── BooleanRenderer/
│   │   ├── BooleanCell.tsx
│   │   ├── BooleanEditor.tsx
│   │   └── BooleanFilter.tsx
│   ├── EnumRenderer/
│   │   ├── EnumCell.tsx
│   │   ├── EnumEditor.tsx
│   │   └── EnumFilter.tsx
│   ├── TagsRenderer/
│   │   ├── TagsCell.tsx
│   │   ├── TagsEditor.tsx
│   │   └── TagsFilter.tsx
│   ├── RichTextRenderer/
│   │   ├── RichTextCell.tsx
│   │   ├── RichTextEditor.tsx
│   │   └── RichTextPreview.tsx
│   └── RendererRegistry.ts
├── types/
│   └── ColumnTypes.ts
└── hooks/
    └── useColumnRenderer.ts
```

---

## 📝 Demo Implementation

Create a new demo page: `apps/showcase/src/routes/_auth/table/column-types.tsx`

**Features to Showcase:**
- All 5 column types in one table
- Inline editing for each type
- Filtering demonstrations
- Configuration panel to toggle features
- Performance with 1,000+ rows

---

## ✅ Success Criteria

- [ ] Boolean columns render and edit correctly
- [ ] Enum columns show icons and colors
- [ ] Tags columns support multi-select
- [ ] Rich text renders safely
- [ ] Custom renderers can be registered
- [ ] All types support filtering
- [ ] All types support sorting
- [ ] Performance remains optimal
- [ ] TypeScript types are complete
- [ ] Documentation is comprehensive

---

**Status**: 🎯 Ready to implement Phase 1 (Boolean Columns)  
**Next Action**: Create BooleanCell, BooleanEditor, and BooleanFilter components

---
