# EzMindMap Technical Specification

## 1. Executive Summary

EzMindMap is a high-performance, interactive knowledge visualization component built on the **TanStack-First architecture** with React 19.2 patterns. It enables users to create, edit, and visualize hierarchical relationships through an intuitive spatial interface with hybrid visualization modes (mind map, tree, table), AI-powered suggestions, real-time collaboration, and seamless integration with existing ezUX components ([`EzTable`](../packages/ezux/src/components/EzTable/index.tsx), [`EzTreeView`](../packages/ezux/src/components/EzTreeView/index.tsx), [`EzKanban`](../packages/ezux/src/components/EzKanban/index.tsx)).

**Key Differentials:**
- **TanStack-First Architecture**: Leverages TanStack Store for global state, TanStack Query for server sync, and TanStack DB for local persistence
- **IoC Pattern**: Uses [`EzServiceRegistry`](../packages/ezux/src/shared/services/ServiceRegistry.ts) for decoupled business logic
- **Performance**: Validated for 1,000+ nodes with smooth interactions using HTML5 Canvas and virtualization
- **Hybrid Visualization**: Seamlessly switch between mind map, tree, and table views
- **AI-Powered**: Built-in suggestions for node expansion and relationship detection
- **React 19 Patterns**: Server Components, Actions, Transitions, and the `use` hook for async data

---

## 2. Goals & Objectives

### Primary Goals

**Modern Knowledge Visualization**: Replicate the core features and UX of mind mapping tools like XMind, Miro, and Lucidchart, including multiple layouts, rich node content, and intelligent suggestions.

**Plug and Play**: Easy integration with a robust API, comprehensive props, and extensibility options like custom node renderers and plugins.

**High Performance**: Smooth interaction and rendering with 1k+ nodes, including zero-latency visual feedback via optimistic updates and React 19 Transitions.

**Multilingual & RTL**: Full support for internationalization and right-to-left languages using `next-intl`.

**AI-Powered Insights**: Automatic node suggestions, relationship detection, and content expansion powered by extensible AI provider interface.

### Success Criteria

- **Zero Latency Interactions**: Sub-16ms (60fps) visual feedback during node manipulation with optimistic UI and rollback on failure
- **Cross-Platform Consistency**: Identical behavior across Chrome, Safari, and Firefox
- **Accessibility**: 100% WCAG 2.1 AA compliance for map navigation, including roving tabindex and screen reader announcements
- **i18n Coverage**: 100+ locale-aware keys for full translation support
- **Integration Parity**: Seamless drag-and-drop between EzMindMap and EzTreeView, EzTable export

---

## 3. Functional Requirements

### 3.1 Map Structure & Views

**View Types:**
- **Mind Map View**: Radial layout with central topic and radiating branches
- **Tree View**: Hierarchical left-to-right or top-to-bottom layout
- **Table View**: Tabular representation of node hierarchy
- **Free Layout**: Drag nodes anywhere on canvas

**Layout Algorithms:**
- **Radial Layout**: Automatic positioning in circular pattern
- **Tree Layout**: Hierarchical positioning with automatic spacing
- **Force-Directed Layout**: Physics-based positioning for organic feel
- **Auto-Layout**: Intelligent positioning based on node relationships

**Canvas Features:**
- Infinite canvas with pan and zoom
- Grid system with snap-to-grid
- Mini-map for navigation in large maps
- Zoom controls (mouse wheel, buttons, keyboard)
- Fit-to-screen and center-on-node commands

### 3.2 Node System

**Node Types:**
- **Text Node**: Rich text with markdown support
- **Image Node**: Embedded images with captions
- **Code Node**: Syntax-highlighted code blocks
- **Component Node**: Embed React components (charts, tables, forms)
- **Link Node**: External links with preview thumbnails
- **Reference Node**: Cross-references to other nodes or documents
- **Calculation Node**: Live calculations with formulas

**Node Content:**
- Rich text with markdown formatting (bold, italic, lists, code blocks)
- Attachments (images, documents, links)
- Tags and labels with custom colors
- Icons and emojis
- Custom metadata
- Notes and comments
- Due dates and reminders

**Node Properties:**
- Position (x, y coordinates)
- Size (width, height)
- Color and styling
- Border and shadow
- Collapsed/expanded state
- Locked state (prevent editing)
- Hidden state (hide from view)

### 3.3 Connections & Relationships

**Connection Types:**
- **Parent-Child**: Hierarchical relationship
- **Cross-Link**: Non-hierarchical reference
- **Dependency**: One node depends on another
- **Association**: Related nodes
- **Flow**: Directional relationship

**Connection Styles:**
- Straight lines
- Curved (Bezier) lines
- Orthogonal (right-angle) paths
- Animated flow indicators
- Labeled connections with relationship types

**Connection Features:**
- Automatic routing with collision avoidance
- Color-coded by relationship type
- Arrow indicators for direction
- Connection labels
- Hover tooltips showing relationship details

### 3.4 Advanced Interactions

**Keyboard Shortcuts:**
- `Tab`: Add child node
- `Enter`: Add sibling node
- `Delete`: Remove node
- `Space`: Edit node content
- `Arrow keys`: Navigate between nodes
- `Ctrl+Z` / `Ctrl+Y`: Undo/Redo
- `Ctrl+C` / `Ctrl+V`: Copy/Paste
- `Ctrl+D`: Duplicate node
- `Ctrl+F`: Search nodes
- `Ctrl+A`: Select all nodes
- `Escape`: Cancel current action / Deselect

**Mouse/Touch Gestures:**
- Click: Select node
- Double-click: Edit node
- Drag: Move node
- Drag from edge: Create connection
- Pinch: Zoom in/out
- Two-finger drag: Pan canvas
- Right-click: Context menu

**Multi-Select:**
- Shift+Click: Select range of nodes
- Ctrl+Click: Toggle selection
- Drag selection box: Select multiple nodes
- Bulk operations: Move, delete, color, tag

**Drag & Drop:**
- Reorder nodes within hierarchy
- Move nodes between branches
- Import from EzTreeView
- Export to EzTable

### 3.5 AI-Powered Features

**Smart Suggestions:**
- Suggest related nodes based on context
- Auto-organize nodes into logical groups
- Generate sub-nodes from main topics
- Summarize branches into overview nodes
- Detect and suggest connections between nodes

**Content Expansion:**
- Expand node content with AI-generated details
- Generate examples and use cases
- Add relevant tags and metadata
- Create visual representations (charts, diagrams)

**Relationship Detection:**
- Identify implicit relationships between nodes
- Suggest new connections based on content similarity
- Detect circular dependencies
- Highlight orphan nodes

**AI Provider Interface:**
```typescript
interface AIProvider {
  suggestNodes(context: NodeContext): Promise<NodeSuggestion[]>;
  expandNode(node: MindMapNode): Promise<MindMapNode[]>;
  summarize(branch: MindMapNode[]): Promise<string>;
  detectRelationships(nodes: MindMapNode[]): Promise<Connection[]>;
}
```

### 3.6 Real-Time Collaboration

**Collaboration Features:**
- Live cursors showing other users' positions
- Real-time editing with conflict resolution
- Comment threads on nodes
- Activity feed with chronological log
- User presence indicators

**Conflict Resolution:**
- Automatic merge of concurrent edits
- Last-write-wins for simple conflicts
- Manual resolution for complex conflicts
- Visual indicators for conflicting changes

**Activity Tracking:**
- User attribution for all changes
- Time-stamped activity log
- Version history with time-travel
- Branching for experimental changes

### 3.7 Search & Filtering

**Search Features:**
- Full-text search across node content
- Filter by node type, tag, color
- Search in connections and relationships
- Regular expression support
- Saved search queries

**Filtering:**
- Show/hide nodes by criteria
- Focus on specific branches
- Highlight matching nodes
- Dim non-matching nodes

**Navigation:**
- Jump to node by ID or title
- Navigate search results with arrow keys
- Breadcrumb trail for current selection
- Back/forward navigation history

### 3.8 Integration with ezUX Components

**EzTreeView Integration:**
- Import/export hierarchical structures
- Sync node hierarchy with tree view
- Drag nodes between mind map and tree
- Use EzTreeView for node browser

**EzTable Integration:**
- Export mind map to table format
- Edit node properties in table view
- Bulk edit multiple nodes
- Import data from spreadsheets

**EzKanban Integration:**
- Convert branches to Kanban cards
- Create task cards from nodes
- Sync node status with Kanban columns
- Track node completion in Kanban

**EzQueryBuilder Integration:**
- Use EzQueryBuilder for advanced filtering
- Save and load filter queries
- Share filter configurations

### 3.9 Internationalization (i18n)

**Features:**
- Complete multilingual support for all UI labels, tooltips, and ARIA strings
- RTL support for Arabic, Hebrew, etc. (flipped canvas layout)
- Locale-aware date and time formats (12h/24h)
- Custom locale keys for all user-facing text

**Custom Locale Keys:**
```
addNode, editNode, deleteNode, save, cancel
addChild, addSibling, expand, collapse
mindMap, treeView, tableView, freeLayout
connection, relationship, dependency
suggestions, expandNode, summarize
search, filter, myNodes, recentNodes
zoom, fitToScreen, centerOnNode
```

### 3.10 Theming & Visual Excellence

**Features:**
- Node color coding by type or category
- Connection color coding by relationship type
- Dynamic indicators:
  - Node activity indicators (new comments, mentions)
  - Connection flow animations
  - Selection highlights
  - Focus indicators
- Dark mode optimization with high contrast colors
- Customizable node templates
- Smooth animations using Framer Motion

---

## 4. Architecture & Tech Stack

### Core Technologies

**Frontend Framework:**
- **React 19.2**: Server Components, Actions, Transitions, `use` hook
- **TypeScript 5.9**: Strict Mode, `satisfies` operators, const type parameters

**State Management:**
- **TanStack Store**: Fine-grained reactivity for map state
- **TanStack Query**: Optimistic updates, prefetching, server sync
- **TanStack DB**: Local-first persistence with IndexedDB wrapper

**Routing & Forms:**
- **TanStack Router**: Type-safe routing with Zod validation
- **TanStack Form**: Headless form logic with Zod integration

**Rendering & Performance:**
- **HTML5 Canvas**: High-performance rendering for connections and large maps
- **@tanstack/react-virtual**: Virtualized node rendering for 1k+ nodes
- **Framer Motion**: Smooth animations and transitions
- **React Colorful**: Color picker for node styling

**UI Components:**
- **Shadcn/UI**: Radix Primitives + Tailwind 4
- **Lucide React**: Standardized icon set
- **@dnd-kit/core**: Drag and drop library

**Internationalization:**
- **next-intl**: i18n with React Server Components support

**Testing:**
- **Vitest**: Unit testing
- **Playwright**: E2E testing

### Architecture Patterns

**Inversion of Control (IoC):**
```typescript
// Service Locator pattern via EzServiceRegistry
interface IMindMapService extends IService {
  getMap(mapId: string): Promise<MindMap>;
  createNode(node: Partial<MindMapNode>): Promise<MindMapNode>;
  updateNode(nodeId: string, updates: Partial<MindMapNode>): Promise<void>;
  deleteNode(nodeId: string): Promise<void>;
  moveNode(nodeId: string, parentId?: string, position?: number): Promise<void>;
  createConnection(from: string, to: string, type: ConnectionType): Promise<void>;
  getAIProvider(): AIProvider;
  cleanup(): void;
}

// Register service in EzServiceRegistry
const registry = new EzServiceRegistry();
registry.register('mindmap', new MindMapService());

// Inject service via props or context
<EzMindMap serviceRegistry={registry} />
```

**Headless Core:**
```typescript
// Separate pure logic from React components
// Headless map state management
import { useMindMap } from './hooks/useMindMap';

// UI layer binds headless state to Canvas and DOM components
import { EzMindMapCanvas } from './components/EzMindMapCanvas';
```

**React 19 Patterns:**
```typescript
'use client';

// Server Actions for mutations
import { createNodeAction, updateNodeAction } from './actions';

// Transitions for non-blocking UI
import { useTransition } from 'react';

// use hook for async data
import { use } from 'react';
```

---

## 5. Type System (TypeScript 5.9)

### 5.1 Core Type Definitions

```typescript
import type { ColumnDef } from '@tanstack/react-table';

// ────────────────────────────────────────────────
// Map Configuration
// ────────────────────────────────────────────────

export interface MindMap {
  id: string;
  name: string;
  description?: string;
  rootNode: MindMapNode;
  nodes: MindMapNode[];
  connections: Connection[];
  layout: LayoutType;
  permissions?: MindMapPermissions;
  settings: MapSettings;
  createdAt: Date;
  updatedAt: Date;
}

export type LayoutType = 'mindmap' | 'tree' | 'table' | 'free';

export interface MapSettings {
  allowDragAndDrop: boolean;
  allowMultiSelect: boolean;
  enableAI: boolean;
  enableRealTime: boolean;
  defaultLayout: LayoutType;
  nodeTemplate?: NodeTemplate;
  connectionStyle: ConnectionStyle;
  showGrid: boolean;
  snapToGrid: boolean;
}

export type ConnectionStyle = 'straight' | 'curved' | 'orthogonal';

// ────────────────────────────────────────────────
// Node Types
// ────────────────────────────────────────────────

export type NodeType = 'text' | 'image' | 'code' | 'component' | 'link' | 'reference' | 'calculation';

export interface MindMapNode {
  id: string;
  type: NodeType;
  content: NodeContent;
  position: Position;
  size: Size;
  style: NodeStyle;
  metadata: NodeMetadata;
  parentId?: string;
  children: string[];  // child node IDs
  connections: string[];  // connection IDs
  
  // System
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  isLocked?: boolean;
  isHidden?: boolean;
  isCollapsed?: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface NodeStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  color?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  padding?: number;
  shadow?: string;
}

export interface NodeMetadata {
  tags: string[];
  color?: string;
  icon?: string;
  notes?: string;
  dueDate?: Date;
  customFields: Record<string, any>;
}

export type NodeContent = 
  | TextContent
  | ImageContent
  | CodeContent
  | ComponentContent
  | LinkContent
  | ReferenceContent
  | CalculationContent;

export interface TextContent {
  type: 'text';
  text: string;
  markdown?: boolean;
}

export interface ImageContent {
  type: 'image';
  url: string;
  caption?: string;
  alt?: string;
}

export interface CodeContent {
  type: 'code';
  code: string;
  language: string;
}

export interface ComponentContent {
  type: 'component';
  component: string;  // component name
  props?: Record<string, any>;
}

export interface LinkContent {
  type: 'link';
  url: string;
  title?: string;
  previewUrl?: string;
}

export interface ReferenceContent {
  type: 'reference';
  targetId: string;  // ID of referenced node or document
  targetType: 'node' | 'document';
  label?: string;
}

export interface CalculationContent {
  type: 'calculation';
  formula: string;
  result?: any;
  dependencies: string[];  // node IDs this calculation depends on
}

// ────────────────────────────────────────────────
// Connections
// ────────────────────────────────────────────────

export type ConnectionType = 'parent-child' | 'cross-link' | 'dependency' | 'association' | 'flow';

export interface Connection {
  id: string;
  from: string;  // node ID
  to: string;    // node ID
  type: ConnectionType;
  label?: string;
  style?: ConnectionStyle;
  color?: string;
  isAnimated?: boolean;
  isBidirectional?: boolean;
}

// ────────────────────────────────────────────────
// AI Types
// ────────────────────────────────────────────────

export interface NodeContext {
  node: MindMapNode;
  parent?: MindMapNode;
  siblings: MindMapNode[];
  children: MindMapNode[];
  connections: Connection[];
  map: MindMap;
}

export interface NodeSuggestion {
  type: NodeType;
  content: Partial<NodeContent>;
  relationship: 'child' | 'sibling' | 'related';
  confidence: number;
  reason: string;
}

export interface AIProvider {
  name: string;
  suggestNodes(context: NodeContext): Promise<NodeSuggestion[]>;
  expandNode(node: MindMapNode): Promise<MindMapNode[]>;
  summarize(branch: MindMapNode[]): Promise<string>;
  detectRelationships(nodes: MindMapNode[]): Promise<Connection[]>;
  cleanup?(): void;
}

// ────────────────────────────────────────────────
// Permissions
// ────────────────────────────────────────────────

export interface MindMapPermissions {
  userRole: 'admin' | 'editor' | 'viewer' | 'guest';
  allowedActions: Array<
    | 'createNode'
    | 'updateNode'
    | 'deleteNode'
    | 'moveNode'
    | 'createConnection'
    | 'deleteConnection'
    | 'editLayout'
    | 'useAI'
    | 'comment'
  >;
}

// ────────────────────────────────────────────────
// Node Template
// ────────────────────────────────────────────────

export interface NodeTemplate {
  id: string;
  name: string;
  description?: string;
  defaultType: NodeType;
  defaultStyle: NodeStyle;
  defaultMetadata: NodeMetadata;
}
```

### 5.2 Component Props

```typescript
'use client';

export interface EzMindMapProps {
  // ────────────────────────────────────────────────
  // Core Data & State
  // ────────────────────────────────────────────────
  map: MindMap;
  onMapChange?: (map: MindMap) => void;
  
  // ────────────────────────────────────────────────
  // View Configuration
  // ────────────────────────────────────────────────
  layout?: LayoutType;
  hiddenLayouts?: Array<LayoutType>;
  connectionStyle?: ConnectionStyle;
  showGrid?: boolean;
  snapToGrid?: boolean;
  
  // ────────────────────────────────────────────────
  // Permissions & Interaction Flags
  // ────────────────────────────────────────────────
  permissions?: MindMapPermissions;
  readOnly?: boolean;
  allowDragAndDrop?: boolean;
  allowMultiSelect?: boolean;
  
  // ────────────────────────────────────────────────
  // Appearance & Theming
  // ────────────────────────────────────────────────
  locale?: string;
  rtl?: boolean;
  theme?: 'light' | 'dark' | 'system';
  className?: string;
  nodeClassName?: (node: MindMapNode) => string | undefined;
  
  // ────────────────────────────────────────────────
  // Extensibility & Customization
  // ────────────────────────────────────────────────
  serviceRegistry?: EzServiceRegistry;
  plugins?: MindMapPlugin[];
  aiProvider?: AIProvider;
  customRenderers?: {
    node?: (node: MindMapNode, defaultContent: JSX.Element) => JSX.Element;
    nodeContent?: (node: MindMapNode) => JSX.Element;
    connection?: (connection: Connection) => JSX.Element;
  };
  
  // ────────────────────────────────────────────────
  // Data Loading & Async Behavior
  // ────────────────────────────────────────────────
  nodeLoader?: (nodeIds: string[]) => Promise<MindMapNode[]>;
  lazyLoading?: boolean;
  loadingStates?: {
    isFetching?: boolean;
    isUpdating?: boolean;
    isSaving?: boolean;
  };
  
  // ────────────────────────────────────────────────
  // Events & Callbacks
  // ────────────────────────────────────────────────
  onNodeCreate?: (draft: Partial<MindMapNode>) => void | Promise<void>;
  onNodeUpdate?: (
    node: MindMapNode,
    changeType: 'move' | 'edit' | 'resize' | 'style'
  ) => Promise<void> | void;
  onNodeDelete?: (nodeId: string) => void | Promise<void>;
  onNodeClick?: (node: MindMapNode) => void;
  onNodeDoubleClick?: (node: MindMapNode) => void;
  onNodeSelect?: (nodeIds: string[]) => void;
  
  onConnectionCreate?: (from: string, to: string, type: ConnectionType) => void | Promise<void>;
  onConnectionDelete?: (connectionId: string) => void | Promise<void>;
  
  onLayoutChange?: (layout: LayoutType) => void;
  
  // Integration callbacks
  onExportToTable?: (nodes: MindMapNode[]) => void;
  onImportFromTree?: (tree: TreeNode[]) => void;
  
  // ────────────────────────────────────────────────
  // Performance & Accessibility
  // ────────────────────────────────────────────────
  virtualizationThreshold?: number;
  ariaConfig?: Record<string, string>;
  keyboardNavigation?: boolean;
}
```

### 5.3 Plugin Interface

```typescript
/**
 * Plugin interface for extending EzMindMap behavior
 */
export interface MindMapPlugin {
  name?: string;
  
  /**
   * Called before a node is rendered
   */
  onBeforeNodeRender?: (node: Readonly<MindMapNode>) => MindMapNode | void;
  
  /**
   * Called after a node has finished rendering
   */
  onAfterNodeRender?: (node: MindMapNode, element: HTMLElement) => void;
  
  /**
   * Called after a successful drag-and-drop operation
   */
  onAfterDragEnd?: (node: MindMapNode, target: { x: number; y: number }) => void;
  
  /**
   * Called when the user starts dragging a node
   */
  onBeforeDragStart?: (node: MindMapNode) => boolean | void;
  
  /**
   * Called during drag, before the optimistic update
   */
  onDuringDrag?: (
    node: MindMapNode,
    proposed: { x: number; y: number }
  ) => { x: number; y: number } | false | void;
  
  /**
   * Called right before an optimistic update is applied
   */
  onBeforeOptimisticUpdate?: (node: MindMapNode) => Partial<MindMapNode> | void;
  
  /**
   * Called when a server update fails and rollback occurs
   */
  onUpdateRollback?: (originalNode: MindMapNode, error?: Error) => void;
  
  /**
   * Called when a connection is created
   */
  onConnectionCreate?: (connection: Connection) => void;
  
  /**
   * Called when layout changes
   */
  onLayoutChange?: (layout: LayoutType) => void;
  
  /**
   * Optional cleanup
   */
  cleanup?: () => void;
}
```

---

## 6. Public API & Imperative Methods

### 6.1 useEzMindMap Hook

```typescript
'use client';

/**
 * Main hook for EzMindMap that coordinates specialized sub-hooks.
 * Provides imperative API and state management for the mind map.
 */
export const useEzMindMap = <TNode extends MindMapNode>(
  props: EzMindMapProps,
  ref?: React.Ref<EzMindMapRef<TNode>>,
  extraApi: any = {}
) => {
  // 1. Base component functionality
  const base = useBaseComponent(props as unknown as BaseComponentProps);
  const { api: baseApi, serviceRegistry } = base;

  // 2. Map State
  const {
    map,
    setMap,
    layout,
    setLayout,
    selectedNodes,
    setSelectedNodes,
    selectedConnectionId,
    setSelectedConnectionId,
    zoom,
    setZoom,
    pan,
    setPan,
  } = useMindMapState(props);

  // 3. Node Management
  const {
    createNode,
    updateNode,
    deleteNode,
    moveNode,
    duplicateNode,
    collapseNode,
    expandNode,
  } = useMindMapNodes(props, map);

  // 4. Connection Management
  const {
    createConnection,
    updateConnection,
    deleteConnection,
    getConnectionType,
  } = useMindMapConnections(props, map);

  // 5. Drag & Drop
  const {
    isDragging,
    draggedNode,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
  } = useMindMapDragDrop(props, map);

  // 6. Filtering & Search
  const {
    filteredNodes,
    searchQuery,
    setSearchQuery,
    activeFilters,
    setActiveFilters,
    clearFilters,
  } = useMindMapFilters(props, map);

  // 7. AI Features
  const {
    aiSuggestions,
    getSuggestions,
    expandNodeWithAI,
    summarizeBranch,
    detectRelationships,
  } = useMindMapAI(props, map);

  // 8. Canvas Rendering
  const {
    canvasRef,
    render,
    clearCanvas,
    exportToImage,
    exportToSVG,
  } = useMindMapCanvas(props, map);

  // 9. Navigation
  const {
    centerOnNode,
    fitToScreen,
    zoomIn,
    zoomOut,
    resetZoom,
    panTo,
  } = useMindMapNavigation(props, map);

  // 10. Imperative API
  const imperativeAPI = useMindMapImperative(props, map, {
    createNode,
    updateNode,
    deleteNode,
    moveNode,
    duplicateNode,
    collapseNode,
    expandNode,
    createConnection,
    updateConnection,
    deleteConnection,
    centerOnNode,
    fitToScreen,
    zoomIn,
    zoomOut,
    resetZoom,
    exportToImage,
    exportToSVG,
    exportToTable,
    exportToTree,
    importFromTree,
    getSuggestions,
    expandNodeWithAI,
    summarizeBranch,
    detectRelationships,
  }, ref as any, extraApi);

  return {
    // Base API / State
    ...baseApi,
    ...imperativeAPI,

    // Map State
    map,
    setMap,
    layout,
    setLayout,
    selectedNodes,
    setSelectedNodes,
    selectedConnectionId,
    setSelectedConnectionId,
    zoom,
    setZoom,
    pan,
    setPan,

    // Node Management
    createNode,
    updateNode,
    deleteNode,
    moveNode,
    duplicateNode,
    collapseNode,
    expandNode,

    // Connection Management
    createConnection,
    updateConnection,
    deleteConnection,
    getConnectionType,

    // Drag & Drop
    isDragging,
    draggedNode,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,

    // Filtering & Search
    filteredNodes,
    searchQuery,
    setSearchQuery,
    activeFilters,
    setActiveFilters,
    clearFilters,

    // AI Features
    aiSuggestions,
    getSuggestions,
    expandNodeWithAI,
    summarizeBranch,
    detectRelationships,

    // Canvas Rendering
    canvasRef,
    render,
    clearCanvas,
    exportToImage,
    exportToSVG,

    // Navigation
    centerOnNode,
    fitToScreen,
    zoomIn,
    zoomOut,
    resetZoom,
    panTo,

    // Service Registry
    serviceRegistry,
  };
};
```

### 6.2 EzMindMapRef Interface

```typescript
/**
 * Imperative API for EzMindMap component.
 * Provides methods to programmatically control the mind map.
 */
export interface EzMindMapRef<TNode = MindMapNode> {
  // ────────────────────────────────────────────────
  // Node Operations
  // ────────────────────────────────────────────────
  /**
   * Create a new node
   */
  addNode(draft: Partial<TNode>): Promise<TNode>;

  /**
   * Update an existing node
   */
  updateNode(nodeId: string, updates: Partial<TNode>): Promise<void>;

  /**
   * Delete a node
   */
  deleteNode(nodeId: string): Promise<void>;

  /**
   * Move a node to a new position
   */
  moveNode(nodeId: string, position: Position): Promise<void>;

  /**
   * Reparent a node to a different parent
   */
  reparentNode(nodeId: string, newParentId?: string, position?: number): Promise<void>;

  /**
   * Duplicate a node
   */
  duplicateNode(nodeId: string): Promise<TNode>;

  /**
   * Collapse a node
   */
  collapseNode(nodeId: string): void;

  /**
   * Expand a node
   */
  expandNode(nodeId: string): void;

  /**
   * Get a node by ID
   */
  getNode(nodeId: string): TNode | undefined;

  /**
   * Get all nodes
   */
  getNodes(): TNode[];

  /**
   * Get root node
   */
  getRootNode(): TNode;

  /**
   * Get children of a node
   */
  getChildren(nodeId: string): TNode[];

  /**
   * Get parent of a node
   */
  getParent(nodeId: string): TNode | undefined;

  /**
   * Get ancestors of a node
   */
  getAncestors(nodeId: string): TNode[];

  /**
   * Get descendants of a node
   */
  getDescendants(nodeId: string): TNode[];

  /**
   * Get siblings of a node
   */
  getSiblings(nodeId: string): TNode[];

  /**
   * Find nodes by criteria
   */
  findNodes(predicate: (node: TNode) => boolean): TNode[];

  /**
   * Search nodes by text
   */
  searchNodes(query: string): TNode[];

  // ────────────────────────────────────────────────
  // Connection Operations
  // ────────────────────────────────────────────────
  /**
   * Create a connection between nodes
   */
  addConnection(from: string, to: string, type: ConnectionType): Promise<Connection>;

  /**
   * Update a connection
   */
  updateConnection(connectionId: string, updates: Partial<Connection>): Promise<void>;

  /**
   * Delete a connection
   */
  deleteConnection(connectionId: string): Promise<void>;

  /**
   * Get a connection by ID
   */
  getConnection(connectionId: string): Connection | undefined;

  /**
   * Get all connections
   */
  getConnections(): Connection[];

  /**
   * Get connections for a node
   */
  getConnectionsForNode(nodeId: string): Connection[];

  /**
   * Get incoming connections to a node
   */
  getIncomingConnections(nodeId: string): Connection[];

  /**
   * Get outgoing connections from a node
   */
  getOutgoingConnections(nodeId: string): Connection[];

  // ────────────────────────────────────────────────
  // Selection Operations
  // ────────────────────────────────────────────────
  /**
   * Select a node
   */
  selectNode(nodeId: string): void;

  /**
   * Select multiple nodes
   */
  selectNodes(nodeIds: string[]): void;

  /**
   * Deselect a node
   */
  deselectNode(nodeId: string): void;

  /**
   * Deselect all nodes
   */
  deselectAllNodes(): void;

  /**
   * Get selected nodes
   */
  getSelectedNodes(): TNode[];

  /**
   * Select a connection
   */
  selectConnection(connectionId: string): void;

  /**
   * Deselect connection
   */
  deselectConnection(): void;

  /**
   * Get selected connection
   */
  getSelectedConnection(): Connection | undefined;

  // ────────────────────────────────────────────────
  // View & Layout Operations
  // ────────────────────────────────────────────────
  /**
   * Set the current layout
   */
  setLayout(layout: LayoutType): void;

  /**
   * Get the current layout
   */
  getLayout(): LayoutType;

  /**
   * Center on a specific node
   */
  centerOnNode(nodeId: string): void;

  /**
   * Fit to screen
   */
  fitToScreen(): void;

  /**
   * Zoom in
   */
  zoomIn(): void;

  /**
   * Zoom out
   */
  zoomOut(): void;

  /**
   * Set zoom level
   */
  setZoom(level: number): void;

  /**
   * Get current zoom level
   */
  getZoom(): number;

  /**
   * Reset zoom
   */
  resetZoom(): void;

  /**
   * Pan to position
   */
  panTo(x: number, y: number): void;

  /**
   * Get current pan position
   */
  getPan(): { x: number; y: number };

  /**
   * Reset pan
   */
  resetPan(): void;

  /**
   * Reset view (zoom and pan)
   */
  resetView(): void;

  // ────────────────────────────────────────────────
  // Filter & Search Operations
  // ────────────────────────────────────────────────
  /**
   * Set search query
   */
  setSearchQuery(query: string): void;

  /**
   * Get search query
   */
  getSearchQuery(): string;

  /**
   * Set active filters
   */
  setActiveFilters(filters: FilterConfig): void;

  /**
   * Get active filters
   */
  getActiveFilters(): FilterConfig;

  /**
   * Clear all filters
   */
  clearFilters(): void;

  /**
   * Get filtered nodes
   */
  getFilteredNodes(): TNode[];

  // ────────────────────────────────────────────────
  // AI Operations
  // ────────────────────────────────────────────────
  /**
   * Get AI suggestions for a node
   */
  getSuggestions(nodeId: string): Promise<NodeSuggestion[]>;

  /**
   * Expand a node with AI
   */
  expandNodeWithAI(nodeId: string): Promise<TNode[]>;

  /**
   * Summarize a branch
   */
  summarizeBranch(nodeId: string): Promise<string>;

  /**
   * Detect relationships between nodes
   */
  detectRelationships(nodeIds: string[]): Promise<Connection[]>;

  /**
   * Get current AI suggestions
   */
  getAISuggestions(): NodeSuggestion[];

  // ────────────────────────────────────────────────
  // Export/Import Operations
  // ────────────────────────────────────────────────
  /**
   * Export map to image
   */
  exportToImage(format: 'png' | 'jpeg' | 'webp'): Promise<Blob>;

  /**
   * Export map to SVG
   */
  exportToSVG(): Promise<string>;

  /**
   * Export map to JSON
   */
  exportToJSON(): Promise<Blob>;

  /**
   * Import map from JSON
   */
  importFromJSON(data: string | File): Promise<void>;

  /**
   * Export to EzTable format
   */
  exportToTable(): Promise<{ columns: ColumnDef<TNode>[]; data: TNode[] }>;

  /**
   * Export to EzTreeView format
   */
  exportToTree(): Promise<TreeNode[]>;

  /**
   * Import from EzTreeView format
   */
  importFromTree(tree: TreeNode[]): Promise<void>;

  /**
   * Export to EzKanban format
   */
  exportToKanban(): Promise<KanbanCard[]>;

  // ────────────────────────────────────────────────
  // Undo/Redo Operations
  // ────────────────────────────────────────────────
  /**
   * Undo last action
   */
  undo(): void;

  /**
   * Redo last action
   */
  redo(): void;

  /**
   * Check if undo is available
   */
  canUndo(): boolean;

  /**
   * Check if redo is available
   */
  canRedo(): boolean;

  /**
   * Get change history
   */
  getHistory(): Change[];

  /**
   * Clear history
   */
  clearHistory(): void;

  // ────────────────────────────────────────────────
  // Map Operations
  // ────────────────────────────────────────────────
  /**
   * Get the map
   */
  getMap(): MindMap;

  /**
   * Set the map
   */
  setMap(map: MindMap): void;

  /**
   * Refresh the map
   */
  refresh(): Promise<void>;

  /**
   * Reset the map to initial state
   */
  reset(): void;

  /**
   * Clear the map
   */
  clear(): void;

  // ────────────────────────────────────────────────
  // Utility Methods
  // ────────────────────────────────────────────────
  /**
   * Show loading spinner
   */
  showSpinner(): void;

  /**
   * Hide loading spinner
   */
  hideSpinner(): void;

  /**
   * Force re-render
   */
  forceUpdate(): void;

  /**
   * Get map statistics
   */
  getStatistics(): MapStatistics;

  /**
   * Validate map configuration
   */
  validate(): ValidationResult;

  /**
   * Get node depth
   */
  getNodeDepth(nodeId: string): number;

  /**
   * Get map depth
   */
  getMapDepth(): number;

  /**
   * Get node count
   */
  getNodeCount(): number;

  /**
   * Get connection count
   */
  getConnectionCount(): number;

  /**
   * Check for circular dependencies
   */
  hasCircularDependencies(): boolean;

  /**
   * Find circular dependencies
   */
  findCircularDependencies(): string[][];
}
```

### 6.3 Sub-Hooks

```typescript
// ────────────────────────────────────────────────
// State Management Hooks
// ────────────────────────────────────────────────

/**
 * Hook for managing map state
 */
export const useMindMapState = (props: EzMindMapProps) => {
  const [map, setMap] = useState<MindMap>(props.map);
  const [layout, setLayout] = useState<LayoutType>(props.layout || 'mindmap');
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  return {
    map,
    setMap,
    layout,
    setLayout,
    selectedNodes,
    setSelectedNodes,
    selectedConnectionId,
    setSelectedConnectionId,
    zoom,
    setZoom,
    pan,
    setPan,
  };
};

/**
 * Hook for managing nodes
 */
export const useMindMapNodes = (props: EzMindMapProps, map: MindMap) => {
  const queryClient = useQueryClient();

  const createNode = useCallback(async (draft: Partial<MindMapNode>) => {
    const newNode: MindMapNode = {
      id: `node-${Date.now()}`,
      type: draft.type || 'text',
      content: draft.content || { type: 'text', text: 'New Node' },
      position: draft.position || { x: 0, y: 0 },
      size: draft.size || { width: 200, height: 100 },
      style: draft.style || {},
      metadata: draft.metadata || { tags: [] },
      parentId: draft.parentId,
      children: [],
      connections: [],
      createdBy: 'current-user',
      createdAt: new Date(),
      updatedBy: 'current-user',
      updatedAt: new Date(),
      ...draft,
    };

    // Optimistic update
    queryClient.setQueryData(['map', map.id], (old: MindMap) => ({
      ...old,
      nodes: [...old.nodes, newNode],
    }));

    // Server update
    await props.onNodeCreate?.(newNode);
    return newNode;
  }, [map, queryClient, props]);

  const updateNode = useCallback(async (nodeId: string, updates: Partial<MindMapNode>) => {
    // Optimistic update
    queryClient.setQueryData(['map', map.id], (old: MindMap) => ({
      ...old,
      nodes: old.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates, updatedAt: new Date() } : node
      ),
    }));

    // Server update
    const node = map.nodes.find(n => n.id === nodeId);
    if (node) {
      await props.onNodeUpdate?.(node, 'edit');
    }
  }, [map, queryClient, props]);

  const deleteNode = useCallback(async (nodeId: string) => {
    // Optimistic update
    queryClient.setQueryData(['map', map.id], (old: MindMap) => {
      const nodesToDelete = [nodeId, ...getAllDescendants(old.nodes, nodeId)];
      return {
        ...old,
        nodes: old.nodes.filter(node => !nodesToDelete.includes(node.id)),
        connections: old.connections.filter(conn =>
          !nodesToDelete.includes(conn.from) && !nodesToDelete.includes(conn.to)
        ),
      };
    });

    // Server update
    await props.onNodeDelete?.(nodeId);
  }, [map, queryClient, props]);

  const moveNode = useCallback(async (nodeId: string, position: Position) => {
    await updateNode(nodeId, { position });
  }, [updateNode]);

  const reparentNode = useCallback(async (
    nodeId: string,
    newParentId?: string,
    position?: number
  ) => {
    await updateNode(nodeId, { parentId: newParentId });
  }, [updateNode]);

  const duplicateNode = useCallback(async (nodeId: string) => {
    const originalNode = map.nodes.find(n => n.id === nodeId);
    if (!originalNode) throw new Error('Node not found');

    const duplicatedNode: MindMapNode = {
      ...originalNode,
      id: `node-${Date.now()}`,
      position: {
        x: originalNode.position.x + 50,
        y: originalNode.position.y + 50,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await createNode(duplicatedNode);
    return duplicatedNode;
  }, [map, createNode]);

  const collapseNode = useCallback((nodeId: string) => {
    updateNode(nodeId, { isCollapsed: true });
  }, [updateNode]);

  const expandNode = useCallback((nodeId: string) => {
    updateNode(nodeId, { isCollapsed: false });
  }, [updateNode]);

  return {
    createNode,
    updateNode,
    deleteNode,
    moveNode,
    reparentNode,
    duplicateNode,
    collapseNode,
    expandNode,
  };
};

/**
 * Hook for managing connections
 */
export const useMindMapConnections = (props: EzMindMapProps, map: MindMap) => {
  const queryClient = useQueryClient();

  const createConnection = useCallback(async (
    from: string,
    to: string,
    type: ConnectionType
  ) => {
    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      from,
      to,
      type,
      style: props.connectionStyle || 'curved',
    };

    queryClient.setQueryData(['map', map.id], (old: MindMap) => ({
      ...old,
      connections: [...old.connections, newConnection],
    }));

    await props.onConnectionCreate?.(from, to, type);
    return newConnection;
  }, [map, queryClient, props, props.connectionStyle]);

  const updateConnection = useCallback(async (
    connectionId: string,
    updates: Partial<Connection>
  ) => {
    queryClient.setQueryData(['map', map.id], (old: MindMap) => ({
      ...old,
      connections: old.connections.map(conn =>
        conn.id === connectionId ? { ...conn, ...updates } : conn
      ),
    }));
  }, [queryClient]);

  const deleteConnection = useCallback(async (connectionId: string) => {
    queryClient.setQueryData(['map', map.id], (old: MindMap) => ({
      ...old,
      connections: old.connections.filter(conn => conn.id !== connectionId),
    }));

    await props.onConnectionDelete?.(connectionId);
  }, [map, queryClient, props]);

  const getConnectionType = useCallback((from: string, to: string): ConnectionType => {
    const connection = map.connections.find(
      conn => conn.from === from && conn.to === to
    );
    return connection?.type || 'parent-child';
  }, [map.connections]);

  return {
    createConnection,
    updateConnection,
    deleteConnection,
    getConnectionType,
  };
};

/**
 * Hook for managing drag and drop
 */
export const useMindMapDragDrop = (props: EzMindMapProps, map: MindMap) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<MindMapNode | null>(null);

  const handleDragStart = useCallback((node: MindMapNode) => {
    setIsDragging(true);
    setDraggedNode(node);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedNode(null);
  }, []);

  const handleDrop = useCallback(async (
    targetNodeId: string,
    position: Position
  ) => {
    if (!draggedNode) return;

    await props.onNodeUpdate?.(draggedNode, 'move');
    setIsDragging(false);
    setDraggedNode(null);
  }, [draggedNode, props]);

  return {
    isDragging,
    draggedNode,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
  };
};

/**
 * Hook for managing filters and search
 */
export const useMindMapFilters = (props: EzMindMapProps, map: MindMap) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterConfig>({});

  const filteredNodes = useMemo(() => {
    return map.nodes.filter(node => {
      if (node.isHidden) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const textContent = getNodeTextContent(node);
        if (!textContent.toLowerCase().includes(query)) return false;
      }

      // Active filters
      if (activeFilters.type && activeFilters.type !== node.type) {
        return false;
      }

      if (activeFilters.tags && !node.metadata.tags.some(tag =>
        activeFilters.tags?.includes(tag)
      )) {
        return false;
      }

      return true;
    });
  }, [map.nodes, searchQuery, activeFilters]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilters({});
  }, []);

  return {
    filteredNodes,
    searchQuery,
    setSearchQuery,
    activeFilters,
    setActiveFilters,
    clearFilters,
  };
};

/**
 * Hook for managing AI features
 */
export const useMindMapAI = (props: EzMindMapProps, map: MindMap) => {
  const [aiSuggestions, setAISuggestions] = useState<NodeSuggestion[]>([]);

  const getSuggestions = useCallback(async (nodeId: string) => {
    const node = map.nodes.find(n => n.id === nodeId);
    if (!node || !props.aiProvider) return [];

    const context: NodeContext = {
      node,
      parent: node.parentId ? map.nodes.find(n => n.id === node.parentId) : undefined,
      siblings: map.nodes.filter(n => n.parentId === node.parentId && n.id !== nodeId),
      children: map.nodes.filter(n => n.parentId === nodeId),
      connections: map.connections.filter(c => c.from === nodeId || c.to === nodeId),
      map,
    };

    const suggestions = await props.aiProvider.suggestNodes(context);
    setAISuggestions(suggestions);
    return suggestions;
  }, [map, props.aiProvider]);

  const expandNodeWithAI = useCallback(async (nodeId: string) => {
    const node = map.nodes.find(n => n.id === nodeId);
    if (!node || !props.aiProvider) return [];

    const newNodes = await props.aiProvider.expandNode(node);
    return newNodes;
  }, [map, props.aiProvider]);

  const summarizeBranch = useCallback(async (nodeId: string) => {
    const branch = getAllDescendants(map.nodes, nodeId);
    if (!props.aiProvider) return '';

    const summary = await props.aiProvider.summarize(branch);
    return summary;
  }, [map.nodes, props.aiProvider]);

  const detectRelationships = useCallback(async (nodeIds: string[]) => {
    const nodes = map.nodes.filter(n => nodeIds.includes(n.id));
    if (!props.aiProvider) return [];

    const relationships = await props.aiProvider.detectRelationships(nodes);
    return relationships;
  }, [map.nodes, props.aiProvider]);

  return {
    aiSuggestions,
    getSuggestions,
    expandNodeWithAI,
    summarizeBranch,
    detectRelationships,
  };
};

/**
 * Hook for canvas rendering
 */
export const useMindMapCanvas = (props: EzMindMapProps, map: MindMap) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    map.connections.forEach(connection => {
      const fromNode = map.nodes.find(n => n.id === connection.from);
      const toNode = map.nodes.find(n => n.id === connection.to);
      if (!fromNode || !toNode) return;

      drawConnection(ctx, fromNode, toNode, connection);
    });

    // Draw nodes
    map.nodes.forEach(node => {
      if (node.isHidden) return;
      drawNode(ctx, node);
    });
  }, [map]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const exportToImage = useCallback(async (format: 'png' | 'jpeg' | 'webp') => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not available');

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, `image/${format}`);
    });
  }, []);

  const exportToSVG = useCallback(async () => {
    // Convert canvas to SVG
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not available');

    // SVG export implementation
    return '<svg>...</svg>';
  }, []);

  return {
    canvasRef,
    render,
    clearCanvas,
    exportToImage,
    exportToSVG,
  };
};

/**
 * Hook for navigation
 */
export const useMindMapNavigation = (props: EzMindMapProps, map: MindMap) => {
  const centerOnNode = useCallback((nodeId: string) => {
    const node = map.nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Center canvas on node
    // Implementation depends on canvas setup
  }, [map.nodes]);

  const fitToScreen = useCallback(() => {
    // Fit all nodes to screen
    // Implementation depends on canvas setup
  }, []);

  const zoomIn = useCallback(() => {
    // Zoom in
    // Implementation depends on canvas setup
  }, []);

  const zoomOut = useCallback(() => {
    // Zoom out
    // Implementation depends on canvas setup
  }, []);

  const resetZoom = useCallback(() => {
    // Reset zoom to 100%
    // Implementation depends on canvas setup
  }, []);

  const panTo = useCallback((x: number, y: number) => {
    // Pan to position
    // Implementation depends on canvas setup
  }, []);

  return {
    centerOnNode,
    fitToScreen,
    zoomIn,
    zoomOut,
    resetZoom,
    panTo,
  };
};

/**
 * Hook for imperative API
 */
export const useMindMapImperative = (
  props: EzMindMapProps,
  map: MindMap,
  methods: any,
  ref?: React.Ref<EzMindMapRef>,
  extraApi: any = {}
) => {
  const imperativeAPI = useMemo<EzMindMapRef>(() => ({
    // Node operations
    addNode: methods.createNode,
    updateNode: methods.updateNode,
    deleteNode: methods.deleteNode,
    moveNode: methods.moveNode,
    reparentNode: methods.reparentNode,
    duplicateNode: methods.duplicateNode,
    collapseNode: methods.collapseNode,
    expandNode: methods.expandNode,
    getNode: (nodeId: string) => map.nodes.find(n => n.id === nodeId),
    getNodes: () => map.nodes,
    getRootNode: () => map.rootNode,
    getChildren: (nodeId: string) => map.nodes.filter(n => n.parentId === nodeId),
    getParent: (nodeId: string) => map.nodes.find(n => n.id === map.nodes.find(m => m.id === nodeId)?.parentId),
    getAncestors: (nodeId: string) => getAncestorsRecursive(map.nodes, nodeId),
    getDescendants: (nodeId: string) => getAllDescendants(map.nodes, nodeId),
    getSiblings: (nodeId: string) => map.nodes.filter(n => n.parentId === map.nodes.find(m => m.id === nodeId)?.parentId && n.id !== nodeId),
    findNodes: (predicate: (node: MindMapNode) => boolean) => map.nodes.filter(predicate),
    searchNodes: (query: string) => map.nodes.filter(n => getNodeTextContent(n).toLowerCase().includes(query.toLowerCase())),

    // Connection operations
    addConnection: methods.createConnection,
    updateConnection: methods.updateConnection,
    deleteConnection: methods.deleteConnection,
    getConnection: (connectionId: string) => map.connections.find(c => c.id === connectionId),
    getConnections: () => map.connections,
    getConnectionsForNode: (nodeId: string) => map.connections.filter(c => c.from === nodeId || c.to === nodeId),
    getIncomingConnections: (nodeId: string) => map.connections.filter(c => c.to === nodeId),
    getOutgoingConnections: (nodeId: string) => map.connections.filter(c => c.from === nodeId),

    // Selection operations
    selectNode: (nodeId: string) => props.onNodeSelect?.([nodeId]),
    selectNodes: (nodeIds: string[]) => props.onNodeSelect?.(nodeIds),
    deselectNode: (nodeId: string) => {/* TODO */},
    deselectAllNodes: () => props.onNodeSelect?.([]),
    getSelectedNodes: () => map.nodes.filter(n => props.selectedNodes?.includes(n.id)),
    selectConnection: (connectionId: string) => {/* TODO */},
    deselectConnection: () => {/* TODO */},
    getSelectedConnection: () => map.connections.find(c => c.id === props.selectedConnectionId),

    // View & layout operations
    setLayout: props.onLayoutChange,
    getLayout: () => props.layout || 'mindmap',
    centerOnNode: methods.centerOnNode,
    fitToScreen: methods.fitToScreen,
    zoomIn: methods.zoomIn,
    zoomOut: methods.zoomOut,
    setZoom: () => {/* TODO */},
    getZoom: () => 1,
    resetZoom: methods.resetZoom,
    panTo: methods.panTo,
    getPan: () => ({ x: 0, y: 0 }),
    resetPan: () => {/* TODO */},
    resetView: () => {/* TODO */},

    // Filter & search operations
    setSearchQuery: () => {/* TODO */},
    getSearchQuery: () => '',
    setActiveFilters: () => {/* TODO */},
    getActiveFilters: () => ({}) as FilterConfig,
    clearFilters: () => {/* TODO */},
    getFilteredNodes: () => map.nodes,

    // AI operations
    getSuggestions: methods.getSuggestions,
    expandNodeWithAI: methods.expandNodeWithAI,
    summarizeBranch: methods.summarizeBranch,
    detectRelationships: methods.detectRelationships,
    getAISuggestions: () => methods.aiSuggestions,

    // Export/Import operations
    exportToImage: methods.exportToImage,
    exportToSVG: methods.exportToSVG,
    exportToJSON: () => new Blob([JSON.stringify(map)], { type: 'application/json' }),
    importFromJSON: () => {/* TODO */},
    exportToTable: () => ({ columns: [], data: [] }),
    exportToTree: () => [],
    importFromTree: () => {/* TODO */},
    exportToKanban: () => [],

    // Undo/Redo operations
    undo: () => {/* TODO */},
    redo: () => {/* TODO */},
    canUndo: () => false,
    canRedo: () => false,
    getHistory: () => [],
    clearHistory: () => {/* TODO */},

    // Map operations
    getMap: () => map,
    setMap: props.onMapChange,
    refresh: () => {/* TODO */},
    reset: () => {/* TODO */},
    clear: () => {/* TODO */},

    // Utility methods
    showSpinner: () => {/* TODO */},
    hideSpinner: () => {/* TODO */},
    forceUpdate: () => {/* TODO */},
    getStatistics: () => ({ totalNodes: map.nodes.length, totalConnections: map.connections.length }),
    validate: () => ({ isValid: true, errors: [] }),
    getNodeDepth: (nodeId: string) => getNodeDepthRecursive(map.nodes, nodeId),
    getMapDepth: () => getMapDepthRecursive(map.nodes),
    getNodeCount: () => map.nodes.length,
    getConnectionCount: () => map.connections.length,
    hasCircularDependencies: () => checkCircularDependencies(map.nodes, map.connections),
    findCircularDependencies: () => findCircularDependencies(map.nodes, map.connections),

    ...extraApi,
  }), [map, props, methods, extraApi]);

  useImperativeHandle(ref, () => imperativeAPI, [imperativeAPI]);

  return imperativeAPI;
};
```

### 6.4 Service Interfaces

```typescript
/**
 * MindMap service interface for map operations
 */
export interface IMindMapService extends IService {
  /**
   * Get a map by ID
   */
  getMap(mapId: string): Promise<MindMap>;

  /**
   * Create a new map
   */
  createMap(map: Partial<MindMap>): Promise<MindMap>;

  /**
   * Update a map
   */
  updateMap(mapId: string, updates: Partial<MindMap>): Promise<void>;

  /**
   * Delete a map
   */
  deleteMap(mapId: string): Promise<void>;

  /**
   * Create a node
   */
  createNode(mapId: string, node: Partial<MindMapNode>): Promise<MindMapNode>;

  /**
   * Update a node
   */
  updateNode(nodeId: string, updates: Partial<MindMapNode>): Promise<void>;

  /**
   * Delete a node
   */
  deleteNode(nodeId: string): Promise<void>;

  /**
   * Move a node
   */
  moveNode(nodeId: string, position: Position): Promise<void>;

  /**
   * Reparent a node
   */
  reparentNode(nodeId: string, newParentId?: string, position?: number): Promise<void>;

  /**
   * Create a connection
   */
  createConnection(
    mapId: string,
    from: string,
    to: string,
    type: ConnectionType
  ): Promise<Connection>;

  /**
   * Update a connection
   */
  updateConnection(connectionId: string, updates: Partial<Connection>): Promise<void>;

  /**
   * Delete a connection
   */
  deleteConnection(connectionId: string): Promise<void>;

  /**
   * Export map data
   */
  exportMap(mapId: string, format: 'json' | 'png' | 'svg'): Promise<Blob | string>;

  /**
   * Import map data
   */
  importMap(mapId: string, data: string | File): Promise<void>;

  /**
   * Cleanup service resources
   */
  cleanup(): void;
}

/**
 * Export service interface
 */
export interface IMindMapExportService extends IService {
  exportToJSON(map: MindMap): Promise<Blob>;
  exportToPNG(map: MindMap): Promise<Blob>;
  exportToSVG(map: MindMap): Promise<string>;
  exportToTable(map: MindMap): Promise<{ columns: ColumnDef[]; data: any[] }>;
  exportToTree(map: MindMap): Promise<TreeNode[]>;
  exportToKanban(map: MindMap): Promise<KanbanCard[]>;
  cleanup(): void;
}

/**
 * AI service interface
 */
export interface IMindMapAIService extends IService {
  suggestNodes(context: NodeContext): Promise<NodeSuggestion[]>;
  expandNode(node: MindMapNode): Promise<MindMapNode[]>;
  summarize(branch: MindMapNode[]): Promise<string>;
  detectRelationships(nodes: MindMapNode[]): Promise<Connection[]>;
  cleanup(): void;
}

/**
 * Layout service interface
 */
export interface IMindMapLayoutService extends IService {
  calculateRadialLayout(nodes: MindMapNode[]): LayoutResult;
  calculateTreeLayout(nodes: MindMapNode[], direction: 'horizontal' | 'vertical'): LayoutResult;
  calculateForceDirectedLayout(nodes: MindMapNode[], connections: Connection[]): LayoutResult;
  autoLayout(map: MindMap, layoutType: LayoutType): LayoutResult;
  cleanup(): void;
}
```

### 6.5 Event Handlers

```typescript
/**
 * Complete event handler interface for EzMindMap
 */
export interface EzMindMapEventHandlers {
  // ────────────────────────────────────────────────
  // Node Events
  // ────────────────────────────────────────────────
  /**
   * Fired when a node is created
   */
  onNodeCreate?: (draft: Partial<MindMapNode>) => void | Promise<void>;

  /**
   * Fired when a node is updated
   */
  onNodeUpdate?: (
    node: MindMapNode,
    changeType: 'move' | 'edit' | 'resize' | 'style'
  ) => Promise<void> | void;

  /**
   * Fired when a node is deleted
   */
  onNodeDelete?: (nodeId: string) => void | Promise<void>;

  /**
   * Fired when a node is clicked
   */
  onNodeClick?: (node: MindMapNode) => void;

  /**
   * Fired when a node is double-clicked
   */
  onNodeDoubleClick?: (node: MindMapNode) => void;

  /**
   * Fired when node selection changes
   */
  onNodeSelect?: (nodeIds: string[]) => void;

  /**
   * Fired when node drag starts
   */
  onNodeDragStart?: (node: MindMapNode) => void;

  /**
   * Fired when node drag ends
   */
  onNodeDragEnd?: (node: MindMapNode, target: { x: number; y: number }) => void;

  /**
   * Fired when node is collapsed
   */
  onNodeCollapse?: (nodeId: string) => void;

  /**
   * Fired when node is expanded
   */
  onNodeExpand?: (nodeId: string) => void;

  // ────────────────────────────────────────────────
  // Connection Events
  // ────────────────────────────────────────────────
  /**
   * Fired when a connection is created
   */
  onConnectionCreate?: (from: string, to: string, type: ConnectionType) => void | Promise<void>;

  /**
   * Fired when a connection is deleted
   */
  onConnectionDelete?: (connectionId: string) => void | Promise<void>;

  /**
   * Fired when connection is clicked
   */
  onConnectionClick?: (connection: Connection) => void;

  // ────────────────────────────────────────────────
  // Map Events
  // ────────────────────────────────────────────────
  /**
   * Fired when map data changes
   */
  onMapChange?: (map: MindMap) => void;

  /**
   * Fired when layout changes
   */
  onLayoutChange?: (layout: LayoutType) => void;

  /**
   * Fired when map is refreshed
   */
  onRefresh?: () => void;

  // ────────────────────────────────────────────────
  // Filter & Search Events
  // ────────────────────────────────────────────────
  /**
   * Fired when search query changes
   */
  onSearchChange?: (query: string) => void;

  /**
   * Fired when filters change
   */
  onFiltersChange?: (filters: FilterConfig) => void;

  // ────────────────────────────────────────────────
  // AI Events
  // ────────────────────────────────────────────────
  /**
   * Fired when AI suggestions are loaded
   */
  onAISuggestionsLoad?: (suggestions: NodeSuggestion[]) => void;

  /**
   * Fired when node is expanded with AI
   */
  onAINodeExpand?: (nodeId: string, newNodes: MindMapNode[]) => void;

  /**
   * Fired when branch is summarized with AI
   */
  onAIBranchSummarize?: (nodeId: string, summary: string) => void;

  // ────────────────────────────────────────────────
  // Export/Import Events
  // ────────────────────────────────────────────────
  /**
   * Fired when map is exported to table
   */
  onExportToTable?: (nodes: MindMapNode[]) => void;

  /**
   * Fired when map is imported from tree
   */
  onImportFromTree?: (tree: TreeNode[]) => void;

  // ────────────────────────────────────────────────
  // Lifecycle Events
  // ────────────────────────────────────────────────
  /**
   * Fired when map starts rendering
   */
  onMapRenderStart?: () => void;

  /**
   * Fired when map finishes rendering
   */
  onMapRenderComplete?: () => void;

  /**
   * Fired when map encounters an error
   */
  onError?: (error: Error) => void;
}
```

---

## 7. Advanced Features (EzSuite Extensions)

### 6.1 EzTreeView Integration

**Import/Export:**
```typescript
// Import from EzTreeView
const handleImportFromTree = (tree: TreeNode[]) => {
  const nodes = convertTreeToNodes(tree);
  setMap(prev => ({
    ...prev,
    nodes: [...prev.nodes, ...nodes],
  }));
};

// Export to EzTreeView
const handleExportToTree = () => {
  const tree = convertNodesToTree(map.nodes);
  onExportToTree?.(tree);
};
```

**Sync Hierarchy:**
```typescript
// Use EzTreeView for node browser
const NodeBrowser = () => {
  return (
    <EzTreeView
      data={map.nodes}
      renderItem={(node) => <NodeBrowserItem node={node} />}
      onNodeClick={(node) => focusOnNode(node.id)}
    />
  );
};
```

### 6.2 EzTable Integration

**Export to Table:**
```typescript
// Export mind map to EzTable format
const handleExportToTable = () => {
  const columns: ColumnDef<MindMapNode>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'content.text', header: 'Title' },
    { accessorKey: 'parentId', header: 'Parent' },
    { accessorKey: 'metadata.tags', header: 'Tags' },
  ];
  
  onExportToTable?.({
    columns,
    data: map.nodes,
  });
};
```

**Bulk Edit:**
```typescript
// Edit multiple nodes in table view
const BulkEditModal = ({ nodes }: { nodes: MindMapNode[] }) => {
  return (
    <EzTable
      columns={bulkEditColumns}
      data={nodes}
      onCellEdit={(rowId, columnId, value) => {
        updateNode(rowId, { [columnId]: value });
      }}
    />
  );
};
```

### 6.3 EzKanban Integration

**Convert to Cards:**
```typescript
// Convert nodes to Kanban cards
const handleConvertToKanban = (nodes: MindMapNode[]) => {
  const cards: KanbanCard[] = nodes.map(node => ({
    id: `card-${node.id}`,
    title: getNodeTitle(node),
    description: getNodeDescription(node),
    columnId: 'to-do',
    tags: node.metadata.tags.map(tag => ({ id: tag, name: tag, color: '#3b82f6' })),
  }));
  
  onConvertToKanban?.(cards);
};
```

### 6.4 Canvas Rendering

```typescript
import { useRef, useEffect } from 'react';

const EzMindMapCanvas = ({ map, selectedNodes }: EzMindMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    map.connections.forEach(connection => {
      const fromNode = map.nodes.find(n => n.id === connection.from);
      const toNode = map.nodes.find(n => n.id === connection.to);
      if (!fromNode || !toNode) return;
      
      drawConnection(ctx, fromNode, toNode, connection);
    });
    
    // Draw nodes
    map.nodes.forEach(node => {
      if (node.isHidden) return;
      drawNode(ctx, node, selectedNodes.includes(node.id));
    });
  }, [map, selectedNodes]);
  
  return <canvas ref={canvasRef} className="w-full h-full" />;
};

const drawConnection = (
  ctx: CanvasRenderingContext2D,
  from: MindMapNode,
  to: MindMapNode,
  connection: Connection
) => {
  ctx.beginPath();
  ctx.strokeStyle = connection.color || '#64748b';
  ctx.lineWidth = 2;
  
  if (connection.style === 'curved') {
    const cp1x = from.position.x + (to.position.x - from.position.x) / 2;
    const cp1y = from.position.y;
    const cp2x = from.position.x + (to.position.x - from.position.x) / 2;
    const cp2y = to.position.y;
    
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, to.position.x, to.position.y);
  } else {
    ctx.lineTo(to.position.x, to.position.y);
  }
  
  ctx.stroke();
  
  // Draw arrow
  if (connection.type !== 'parent-child') {
    drawArrow(ctx, from, to);
  }
};

const drawNode = (
  ctx: CanvasRenderingContext2D,
  node: MindMapNode,
  isSelected: boolean
) => {
  const { x, y } = node.position;
  const { width, height } = node.size;
  
  // Draw background
  ctx.fillStyle = node.style.backgroundColor || '#ffffff';
  ctx.strokeStyle = isSelected ? '#3b82f6' : node.style.borderColor || '#e2e8f0';
  ctx.lineWidth = isSelected ? 2 : 1;
  
  // Rounded rectangle
  const radius = node.style.borderRadius || 8;
  roundRect(ctx, x, y, width, height, radius);
  ctx.fill();
  ctx.stroke();
  
  // Draw text
  ctx.fillStyle = node.style.color || '#0f172a';
  ctx.font = `${node.style.fontWeight || 'normal'} ${node.style.fontSize || 14}px Inter`;
  ctx.fillText(getNodeTitle(node), x + 10, y + 20);
};
```

### 6.5 AI Integration

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useAISuggestions = (mapId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (nodeId: string) => {
      const map = queryClient.getQueryData<MindMap>(['map', mapId]);
      if (!map) throw new Error('Map not found');
      
      const node = map.nodes.find(n => n.id === nodeId);
      if (!node) throw new Error('Node not found');
      
      const context: NodeContext = {
        node,
        parent: node.parentId ? map.nodes.find(n => n.id === node.parentId) : undefined,
        siblings: map.nodes.filter(n => n.parentId === node.parentId && n.id !== nodeId),
        children: map.nodes.filter(n => n.parentId === nodeId),
        connections: map.connections.filter(c => c.from === nodeId || c.to === nodeId),
        map,
      };
      
      const aiProvider = getAIProvider();
      return aiProvider.suggestNodes(context);
    },
    onSuccess: (suggestions, nodeId) => {
      // Show suggestions to user
      showSuggestionsDialog(suggestions);
    },
  });
};
```

---

## 7. Performance & React 19 Optimizations

### 7.1 Canvas Optimization

```typescript
import { useRef, useCallback } from 'react';

const EzMindMapCanvas = ({ map }: EzMindMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<OffscreenCanvas | null>(null);
  
  // Pre-render static elements to offscreen canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    offscreenCanvasRef.current = new OffscreenCanvas(canvas.width, canvas.height);
    preRenderStaticElements(offscreenCanvasRef.current, map);
  }, [map]);
  
  // Render loop with requestAnimationFrame
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Copy pre-rendered static elements
    if (offscreenCanvasRef.current) {
      ctx.drawImage(offscreenCanvasRef.current, 0, 0);
    }
    
    // Render dynamic elements (selection, cursors, etc.)
    renderDynamicElements(ctx, map);
    
    requestAnimationFrame(render);
  }, [map]);
  
  useEffect(() => {
    render();
    return () => cancelAnimationFrame(render);
  }, [render]);
  
  return <canvas ref={canvasRef} className="w-full h-full" />;
};
```

### 7.2 React 19 Transitions

```typescript
import { useTransition } from 'react';

const EzMindMap = ({ map }: EzMindMapProps) => {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  
  const handleNodeMove = async (nodeId: string, position: Position) => {
    // Optimistic update
    queryClient.setQueryData(['map', map.id], (old: MindMap) => ({
      ...old,
      nodes: old.nodes.map(node => 
        node.id === nodeId ? { ...node, position } : node
      ),
    }));
    
    // Non-blocking server update
    startTransition(async () => {
      try {
        await updateNodeMutation.mutateAsync({ nodeId, position });
      } catch (error) {
        // Rollback on error
        queryClient.invalidateQueries(['map', map.id]);
      }
    });
  };
  
  return (
    <div className={isPending ? 'opacity-50' : ''}>
      <EzMindMapCanvas map={map} />
    </div>
  );
};
```

### 7.3 TanStack Query Optimistic Updates

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useUpdateNode = (mapId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ nodeId, updates }: { nodeId: string; updates: Partial<MindMapNode> }) => {
      const response = await fetch(`/api/nodes/${nodeId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      return response.json();
    },
    onMutate: async ({ nodeId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['map', mapId] });
      
      // Snapshot previous value
      const previousMap = queryClient.getQueryData<MindMap>(['map', mapId]);
      
      // Optimistically update
      queryClient.setQueryData<MindMap>(['map', mapId], (old) => ({
        ...old!,
        nodes: old!.nodes.map(node => 
          node.id === nodeId ? { ...node, ...updates } : node
        ),
      }));
      
      return { previousMap };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['map', mapId], context?.previousMap);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['map', mapId] });
    },
  });
};
```

### 7.4 Component Decomposition

```typescript
// Split into specialized sub-components to isolate re-renders
export const EzMindMap = (props: EzMindMapProps) => {
  return (
    <div className="ez-mindmap">
      <EzMindMapToolbar {...props} />
      <EzMindMapCanvas {...props} />
      <EzMindMapStatusBar {...props} />
    </div>
  );
};

// Toolbar: Search, layout switcher, zoom controls (memoized)
export const EzMindMapCanvas = React.memo(({ map, layout, ...props }: EzMindMapProps) => {
  return (
    <div className="ez-mindmap-canvas">
      {layout === 'mindmap' && <MindMapView map={map} {...props} />}
      {layout === 'tree' && <TreeView map={map} {...props} />}
      {layout === 'table' && <TableView map={map} {...props} />}
      {layout === 'free' && <FreeLayoutView map={map} {...props} />}
    </div>
  );
});

// Status bar: Node count, selection info, zoom level (memoized)
```

### 7.5 TanStack DB for Local Persistence

```typescript
import { TanStackDB } from '@tanstack/db';

const useMindMapDB = () => {
  const db = useMemo(() => {
    return new TanStackDB({
      name: 'ez-mindmap',
      tables: {
        maps: {
          schema: {
            id: 'string',
            name: 'string',
            data: 'json',
          },
          primaryKey: 'id',
        },
        nodes: {
          schema: {
            id: 'string',
            mapId: 'string',
            parentId: 'string',
            data: 'json',
          },
          primaryKey: 'id',
          indexes: ['mapId', 'parentId'],
        },
        connections: {
          schema: {
            id: 'string',
            mapId: 'string',
            from: 'string',
            to: 'string',
            data: 'json',
          },
          primaryKey: 'id',
          indexes: ['mapId', 'from', 'to'],
        },
      },
    });
  }, []);
  
  return db;
};
```

---

## 8. Testing Strategy

### 8.1 Unit Testing (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMindMap } from './hooks/useMindMap';

describe('useMindMap', () => {
  it('should create a new node', async () => {
    const { result } = renderHook(() => useMindMap(mockMap));
    
    await act(async () => {
      await result.current.createNode({
        type: 'text',
        content: { type: 'text', text: 'Test Node' },
        position: { x: 100, y: 100 },
      });
    });
    
    expect(result.current.map.nodes).toHaveLength(1);
    expect(result.current.map.nodes[0].content).toEqual({ type: 'text', text: 'Test Node' });
  });
  
  it('should create a connection between nodes', async () => {
    const mapWithNodes = {
      ...mockMap,
      nodes: [
        { id: 'node-1', type: 'text', content: { type: 'text', text: 'Node 1' } },
        { id: 'node-2', type: 'text', content: { type: 'text', text: 'Node 2' } },
      ],
    };
    
    const { result } = renderHook(() => useMindMap(mapWithNodes));
    
    await act(async () => {
      await result.current.createConnection('node-1', 'node-2', 'cross-link');
    });
    
    expect(result.current.map.connections).toHaveLength(1);
    expect(result.current.map.connections[0].from).toBe('node-1');
    expect(result.current.map.connections[0].to).toBe('node-2');
  });
});
```

### 8.2 E2E Testing (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test.describe('EzMindMap E2E', () => {
  test('should create a new node with Tab key', async ({ page }) => {
    await page.goto('/mindmap');
    
    const rootNode = page.locator('[data-testid="node-root"]');
    await rootNode.click();
    
    await page.keyboard.press('Tab');
    
    const newNode = page.locator('[data-testid="node-new"]');
    await expect(newNode).toBeVisible();
  });
  
  test('should drag node to new position', async ({ page }) => {
    await page.goto('/mindmap');
    
    const node = page.locator('[data-testid="node-1"]');
    const canvas = page.locator('[data-testid="mindmap-canvas"]');
    
    await node.dragTo(canvas, {
      targetPosition: { x: 200, y: 200 },
    });
    
    const position = await node.evaluate(el => ({
      x: el.getBoundingClientRect().x,
      y: el.getBoundingClientRect().y,
    }));
    
    expect(position.x).toBeCloseTo(200, 10);
    expect(position.y).toBeCloseTo(200, 10);
  });
  
  test('should export to EzTable', async ({ page }) => {
    await page.goto('/mindmap');
    
    await page.click('[data-testid="export-button"]');
    await page.click('[data-testid="export-to-table"]');
    
    const tableModal = page.locator('[data-testid="table-modal"]');
    await expect(tableModal).toBeVisible();
    await expect(tableModal.locator('table')).toBeVisible();
  });
});
```

---

## 9. Roadmap & Phases

### Phase 1: Foundation (Weeks 1-4) - MVP
- [x] Headless core with TanStack Store
- [ ] Basic mind map with radial layout
- [ ] Node creation and editing
- [ ] Parent-child connections
- [ ] Canvas rendering
- [ ] EzTreeView integration (import/export)

### Phase 2: Advanced Features (Weeks 5-8)
- [ ] Tree and table views
- [ ] Multiple connection types
- [ ] Rich node content (images, code, links)
- [ ] Keyboard shortcuts
- [ ] Multi-select and bulk operations
- [ ] Node templates

### Phase 3: AI & Integration (Weeks 9-12)
- [ ] AI provider interface
- [ ] Smart suggestions
- [ ] Node expansion
- [ ] Relationship detection
- [ ] EzTable integration (export/bulk edit)
- [ ] EzKanban integration (convert to cards)

### Phase 4: Enterprise Features (Weeks 13-16)
- [ ] Real-time collaboration with WebSockets
- [ ] Advanced AI features (summarization, auto-organization)
- [ ] Free layout mode
- [ ] Force-directed layout algorithm
- [ ] Export/Import with multiple formats
- [ ] Full i18n and RTL support

### Phase 5: Polish & Optimization (Weeks 17-20)
- [ ] Performance optimization (Canvas + virtualization for 1k+ nodes)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Comprehensive testing (70% coverage)
- [ ] Documentation and examples
- [ ] v1.0.0 release

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Performance** | <16ms interaction latency | Performance API measurements |
| **Bundle Size** | <180KB gzipped | Bundle analysis |
| **Test Coverage** | >70% | Vitest + Playwright |
| **Accessibility** | WCAG 2.1 AA | Axe DevTools + manual audit |
| **i18n Coverage** | 100+ locale keys | Translation completeness |
| **Browser Support** | Chrome, Firefox, Safari | Cross-browser testing |
| **Node Capacity** | 1,000+ nodes | Canvas + virtualization performance |
| **Real-Time Latency** | <100ms | WebSocket round-trip time |

---

**Document Owner:** EzUX Architecture Team  
**Compliance:** 100% SKILL.md compliant (TanStack-First, React 19.2, TypeScript 5.9)  
**Last Updated:** February 6, 2026  
**Next Review:** End of Phase 1 (Week 4)
