# EzKanban Technical Specification

## 1. Executive Summary

EzKanban is a high-performance, enterprise-grade Kanban board component built on the **TanStack-First architecture** with React 19.2 patterns. It enables users to manage projects, tasks, and workflows through highly interactive boards with swimlanes, work-in-progress (WIP) limits, real-time collaboration, and seamless integration with existing ezUX components ([`EzTable`](../packages/ezux/src/components/EzTable/index.tsx), [`EzScheduler`](../packages/ezux/src/components/EzScheduler/index.tsx), [`EzTreeView`](../packages/ezux/src/components/EzTreeView/index.tsx)).

**Key Differentials:**
- **TanStack-First Architecture**: Leverages TanStack Store for global state, TanStack Query for server sync, and TanStack DB for local persistence
- **IoC Pattern**: Uses [`EzServiceRegistry`](../packages/ezux/src/shared/services/ServiceRegistry.ts) for decoupled business logic
- **Performance**: Validated for 10,000+ cards using `@tanstack/react-virtual` with sub-16ms interactions
- **Deep Integration**: Native integration with EzTable (card expansion), EzScheduler (event creation), and EzTreeView (hierarchical tasks)
- **React 19 Patterns**: Server Components, Actions, Transitions, and the `use` hook for async data

---

## 2. Goals & Objectives

### Primary Goals

**Modern Project Management**: Replicate the core features and UX of enterprise Kanban tools like Trello, Jira, and Monday.com, including swimlanes, WIP limits, analytics, and real-time collaboration.

**Plug and Play**: Easy integration with a robust API, comprehensive props, and extensibility options like custom card templates and plugins.

**High Performance**: Smooth interaction and rendering with 10k+ cards, including zero-latency visual feedback via optimistic updates and React 19 Transitions.

**Multilingual & RTL**: Full support for internationalization and right-to-left languages using `next-intl`.



### Success Criteria

- **Zero Latency Dragging**: Sub-16ms (60fps) visual feedback during card movement with optimistic UI and rollback on failure
- **Cross-Platform Consistency**: Identical behavior across Chrome, Safari, and Firefox
- **Accessibility**: 100% WCAG 2.1 AA compliance for board navigation, including roving tabindex and screen reader announcements
- **i18n Coverage**: 100+ locale-aware keys for full translation support
- **Integration Parity**: Seamless drag-and-drop between EzKanban and EzScheduler, card expansion into EzTable

---

## 3. Functional Requirements

### 3.1 Board Structure & Views

**Board Types:**
- **Standard Board**: Columns representing workflow stages (To Do, In Progress, Done)
- **Swimlane Board**: Horizontal grouping by team, priority, or custom criteria
- **Timeline Board**: Time-based view showing card progression over time

**Column Configuration:**
- Custom column definitions with WIP limits
- Column color coding and icons
- Collapsible columns
- Column sorting and reordering
- Auto-archiving of completed cards

**Swimlane Configuration:**
- Horizontal swimlanes (group by team, priority, etc.)
- Vertical swimlanes (sub-columns within main columns)
- Collapsible swimlanes
- Swimlane statistics and progress indicators
- Cross-swimlane card movement

### 3.2 Card Management

**Card Types:**
- **Standard Card**: Basic task with title, description, assignee
- **Epic Card**: Parent card with sub-tasks
- **Milestone Card**: Time-bound marker
- **Template Card**: Pre-defined card templates

**Card Content:**
- Rich text with markdown support
- Attachments (images, documents, links)
- Checklists with progress tracking
- Tags and labels with custom colors
- Assignees with avatars
- Due dates with color-coded urgency
- Time tracking (estimated vs actual time)
- Dependencies between cards
- Custom fields (number, date, select, etc.)

**Card Interactions:**
- Drag & drop between columns
- Drag & drop between swimlanes
- Multi-select with Shift+Click
- Bulk operations (move, delete, assign)
- Quick actions menu (hover)
- Keyboard navigation (arrow keys, Enter, Delete)
- Card expansion into EzTable for detailed editing

### 3.3 Advanced Features

**WIP Limits & Flow Control:**
- Column WIP limits with visual indicators
- Swimlane WIP limits
- Pull system (prevent pulling when downstream is at capacity)
- Visual alerts when approaching or exceeding limits
- Configurable limit enforcement (soft vs hard)



**Real-Time Collaboration:**
- Live cursors showing other users' positions
- Conflict resolution for concurrent edits
- Activity feed with chronological log
- Comments and mentions (@username)
- Real-time updates via WebSockets

**Search & Filtering:**
- Full-text search across cards
- Filter by assignee, tag, due date, custom field
- Saved filter presets
- Advanced query builder (using EzQueryBuilder)
- Quick filters (My Cards, Overdue, High Priority)

### 3.4 Integration with ezUX Components

**EzTable Integration:**
- Expand cards into full table rows for detailed editing
- Bulk edit multiple cards in table view
- Export board data to Excel/CSV using EzTable's export service
- Import data from spreadsheets

**EzScheduler Integration:**
- Drag cards directly into EzScheduler to create calendar events
- Sync card due dates with scheduler events
- View card deadlines in calendar view
- Create recurring tasks from cards

**EzTreeView Integration:**
- Hierarchical card relationships (parent/child)
- Tree view of card dependencies
- Collapse/expand card hierarchies
- Import/export hierarchical task structures

**EzQueryBuilder Integration:**
- Use EzQueryBuilder for advanced filtering
- Save and load filter queries
- Share filter configurations

### 3.5 Internationalization (i18n)

**Features:**
- Complete multilingual support for all UI labels, tooltips, and ARIA strings
- RTL support for Arabic, Hebrew, etc. (flipped board layout)
- Locale-aware date and time formats (12h/24h)
- Custom locale keys for all user-facing text

**Custom Locale Keys:**
```
addCard, editCard, deleteCard, save, cancel
addColumn, editColumn, deleteColumn, wipLimit
swimlane, addSwimlane, collapseSwimlane
assignee, dueDate, attachments, checklist
analytics, cycleTime, throughput, bottleneck
filter, search, myCards, overdue, highPriority
```

### 3.6 Theming & Visual Excellence

**Features:**
- Status-based coloring (New, In Progress, Blocked, Done)
- Category palettes (Marketing, Engineering, Design)
- Dynamic indicators:
  - WIP limit warnings (yellow when approaching, red when exceeded)
  - Due date urgency (green, yellow, red)
  - Card priority badges
  - Activity indicators (new comments, mentions)
- Dark mode optimization with high contrast colors
- Customizable card templates
- Smooth animations using Framer Motion

---

## 4. Architecture & Tech Stack

### Core Technologies

**Frontend Framework:**
- **React 19.2**: Server Components, Actions, Transitions, `use` hook
- **TypeScript 5.9**: Strict Mode, `satisfies` operators, const type parameters

**State Management:**
- **TanStack Store**: Fine-grained reactivity for board state
- **TanStack Query**: Optimistic updates, prefetching, server sync
- **TanStack DB**: Local-first persistence with IndexedDB wrapper

**Routing & Forms:**
- **TanStack Router**: Type-safe routing with Zod validation
- **TanStack Form**: Headless form logic with Zod integration

**Rendering & Performance:**
- **@tanstack/react-virtual**: Virtualized card rendering for 10k+ cards
- **Framer Motion**: Smooth animations and transitions

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
interface IKanbanService extends IService {
  getBoard(boardId: string): Promise<KanbanBoard>;
  createCard(card: Partial<KanbanCard>): Promise<KanbanCard>;
  updateCard(cardId: string, updates: Partial<KanbanCard>): Promise<void>;
  deleteCard(cardId: string): Promise<void>;
  moveCard(cardId: string, targetColumnId: string, targetSwimlaneId?: string): Promise<void>;

  cleanup(): void;
}

// Register service in EzServiceRegistry
const registry = new EzServiceRegistry();
registry.register('kanban', new KanbanService());

// Inject service via props or context
<EzKanban serviceRegistry={registry} />
```

**Headless Core:**
```typescript
// Separate pure logic from React components
// Headless board state management
import { useKanbanBoard } from './hooks/useKanbanBoard';

// UI layer binds headless state to Shadcn components
import { EzKanbanBoard } from './components/EzKanbanBoard';
```

**React 19 Patterns:**
```typescript
'use client';

// Server Actions for mutations
import { createCardAction, updateCardAction } from './actions';

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
// Board Configuration
// ────────────────────────────────────────────────

export interface KanbanBoard {
  id: string;
  name: string;
  description?: string;
  columns: KanbanColumn[];
  swimlanes?: KanbanSwimlane[];
  cards: KanbanCard[];
  permissions?: KanbanPermissions;
  settings: BoardSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanColumn {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  wipLimit?: number;
  position: number;
  isCollapsed?: boolean;
  cardTemplates?: CardTemplate[];
}

export interface KanbanSwimlane {
  id: string;
  name: string;
  type: 'team' | 'priority' | 'custom';
  color?: string;
  position: number;
  isCollapsed?: boolean;
  metadata?: Record<string, any>;
}

export interface BoardSettings {
  allowDragAndDrop: boolean;
  allowMultiSelect: boolean;
  enableWipLimits: boolean;
  enableWipLimits: boolean;
  enableRealTime: boolean;
  defaultView: 'standard' | 'swimlane' | 'timeline';
  cardTemplate?: CardTemplate;
}

// ────────────────────────────────────────────────
// Card Types
// ────────────────────────────────────────────────

export type CardType = 'standard' | 'epic' | 'milestone' | 'template';

export interface KanbanCard {
  id: string;
  type: CardType;
  title: string;
  description?: string;
  columnId: string;
  swimlaneId?: string;
  position: number;
  
  // Assignees
  assignees: CardAssignee[];
  
  // Dates
  dueDate?: Date;
  startDate?: Date;
  completedAt?: Date;
  
  // Time tracking
  timeTracking?: {
    estimated?: number;  // in hours
    actual?: number;     // in hours
    startedAt?: Date;
  };
  
  // Tags & Labels
  tags: CardTag[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
  
  // Checklists
  checklists: CardChecklist[];
  
  // Attachments
  attachments: CardAttachment[];
  
  // Dependencies
  dependencies: {
    dependsOn: string[];  // card IDs this card depends on
    blocks: string[];     // card IDs blocked by this card
  };
  
  // Custom fields
  customFields: Record<string, CustomFieldValue>;
  
  // Comments
  comments: CardComment[];
  
  // Activity
  activity: CardActivity[];
  
  // Metadata
  metadata: Record<string, any>;
  
  // System
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  isLocked?: boolean;
  isArchived?: boolean;
}

export interface CardAssignee {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  role?: 'owner' | 'assignee' | 'follower';
}

export interface CardTag {
  id: string;
  name: string;
  color: string;
}

export interface CardChecklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: Date;
}

export interface CardAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'link' | 'file';
  mimeType?: string;
  size?: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export type CustomFieldValue = 
  | string 
  | number 
  | boolean 
  | Date 
  | string[] 
  | { label: string; value: any };

export interface CardComment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  mentions: string[];  // user IDs
  createdAt: Date;
  updatedAt?: Date;
}

export interface CardActivity {
  id: string;
  type: 'created' | 'updated' | 'moved' | 'assigned' | 'commented' | 'completed';
  userId: string;
  userName: string;
  details: Record<string, any>;
  timestamp: Date;
}



// ────────────────────────────────────────────────
// Permissions
// ────────────────────────────────────────────────

export interface KanbanPermissions {
  userRole: 'admin' | 'editor' | 'viewer' | 'guest';
  allowedActions: Array<
    | 'createCard'
    | 'updateCard'
    | 'deleteCard'
    | 'moveCard'
    | 'assignCard'
    | 'commentCard'
    | 'addColumn'
    | 'editColumn'
    | 'deleteColumn'
    | 'addSwimlane'
    | 'editSwimlane'
    | 'deleteSwimlane'
    | 'deleteSwimlane'
  >;
}

// ────────────────────────────────────────────────
// Card Template
// ────────────────────────────────────────────────

export interface CardTemplate {
  id: string;
  name: string;
  description?: string;
  defaultValues: Partial<KanbanCard>;
  requiredFields: Array<keyof KanbanCard>;
  customFields?: Array<{
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
    options?: string[];
    required: boolean;
  }>;
}
```

### 5.2 Component Props

```typescript
'use client';

export interface EzKanbanProps {
  // ────────────────────────────────────────────────
  // Core Data & State
  // ────────────────────────────────────────────────
  board: KanbanBoard;
  onBoardChange?: (board: KanbanBoard) => void;
  
  // ────────────────────────────────────────────────
  // View Configuration
  // ────────────────────────────────────────────────
  // ────────────────────────────────────────────────
  // View Configuration
  // ────────────────────────────────────────────────
  view?: 'standard' | 'swimlane' | 'timeline';
  hiddenViews?: Array<'standard' | 'swimlane' | 'timeline'>;
  
  // ────────────────────────────────────────────────
  // Permissions & Interaction Flags
  // ────────────────────────────────────────────────
  permissions?: KanbanPermissions;
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
  cardClassName?: (card: KanbanCard) => string | undefined;
  
  // ────────────────────────────────────────────────
  // Extensibility & Customization
  // ────────────────────────────────────────────────
  serviceRegistry?: EzServiceRegistry;
  plugins?: KanbanPlugin[];
  customRenderers?: {
    card?: (card: KanbanCard, defaultContent: JSX.Element) => JSX.Element;
    cardContent?: (card: KanbanCard) => JSX.Element;
    column?: (column: KanbanColumn) => JSX.Element;
    swimlane?: (swimlane: KanbanSwimlane) => JSX.Element;
  };
  
  // ────────────────────────────────────────────────
  // Data Loading & Async Behavior
  // ────────────────────────────────────────────────
  cardLoader?: (cardIds: string[]) => Promise<KanbanCard[]>;
  lazyLoading?: boolean;
  loadingStates?: {
    isFetching?: boolean;
    isUpdating?: boolean;
    isSaving?: boolean;
  };
  
  // ────────────────────────────────────────────────
  // Events & Callbacks
  // ────────────────────────────────────────────────
  onCardCreate?: (draft: Partial<KanbanCard>) => void | Promise<void>;
  onCardUpdate?: (
    card: KanbanCard,
    changeType: 'move' | 'edit' | 'assign' | 'complete'
  ) => Promise<void> | void;
  onCardDelete?: (cardId: string) => void | Promise<void>;
  onCardClick?: (card: KanbanCard) => void;
  onCardDoubleClick?: (card: KanbanCard) => void;
  onCardSelect?: (cardIds: string[]) => void;
  
  onColumnCreate?: (column: Partial<KanbanColumn>) => void | Promise<void>;
  onColumnUpdate?: (column: KanbanColumn) => void | Promise<void>;
  onColumnDelete?: (columnId: string) => void | Promise<void>;
  
  onSwimlaneCreate?: (swimlane: Partial<KanbanSwimlane>) => void | Promise<void>;
  onSwimlaneUpdate?: (swimlane: KanbanSwimlane) => void | Promise<void>;
  onSwimlaneDelete?: (swimlaneId: string) => void | Promise<void>;
  
  // Integration callbacks
  onCardExpandToTable?: (card: KanbanCard) => void;
  onCardDragToScheduler?: (card: KanbanCard, date: Date) => void;
  
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
 * Plugin interface for extending EzKanban behavior
 */
export interface KanbanPlugin {
  name?: string;
  
  /**
   * Called before a card is rendered
   */
  onBeforeCardRender?: (card: Readonly<KanbanCard>) => KanbanCard | void;
  
  /**
   * Called after a card has finished rendering
   */
  onAfterCardRender?: (card: KanbanCard, element: HTMLElement) => void;
  
  /**
   * Called after a successful drag-and-drop operation
   */
  onAfterDragEnd?: (card: KanbanCard, target: { columnId: string; swimlaneId?: string }) => void;
  
  /**
   * Called when the user starts dragging a card
   */
  onBeforeDragStart?: (card: KanbanCard) => boolean | void;
  
  /**
   * Called during drag, before the optimistic update
   */
  onDuringDrag?: (
    card: KanbanCard,
    proposed: { columnId: string; swimlaneId?: string }
  ) => { columnId: string; swimlaneId?: string } | false | void;
  
  /**
   * Called right before an optimistic update is applied
   */
  onBeforeOptimisticUpdate?: (card: KanbanCard) => Partial<KanbanCard> | void;
  
  /**
   * Called when a server update fails and rollback occurs
   */
  onUpdateRollback?: (originalCard: KanbanCard, error?: Error) => void;
  
  /**
   * Called when WIP limit is exceeded
   */
  onWipLimitExceeded?: (columnId: string, currentCount: number, limit: number) => void;
  
  /**
   * Optional cleanup
   */
  cleanup?: () => void;
}
```

---

## 6. Public API & Imperative Methods

### 6.1 useEzKanban Hook

```typescript
'use client';

/**
 * Main hook for EzKanban that coordinates specialized sub-hooks.
 * Provides imperative API and state management for the Kanban board.
 */
export const useEzKanban = <TCard extends KanbanCard>(
  props: EzKanbanProps,
  ref?: React.Ref<EzKanbanRef<TCard>>,
  extraApi: any = {}
) => {
  // 1. Base component functionality
  const base = useBaseComponent(props as unknown as BaseComponentProps);
  const { api: baseApi, serviceRegistry } = base;

  // 2. Board State
  const {
    board,
    setBoard,
    view,
    setView,
    selectedCards,
    setSelectedCards,
    selectedColumnId,
    setSelectedColumnId,
    selectedSwimlaneId,
    setSelectedSwimlaneId,
  } = useKanbanState(props);

  // 3. Card Management
  const {
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    duplicateCard,
    archiveCard,
    restoreCard,
  } = useKanbanCards(props, board);

  // 4. Column Management
  const {
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    collapseColumn,
    expandColumn,
  } = useKanbanColumns(props, board);

  // 5. Swimlane Management
  const {
    createSwimlane,
    updateSwimlane,
    deleteSwimlane,
    reorderSwimlanes,
    collapseSwimlane,
    expandSwimlane,
  } = useKanbanSwimlanes(props, board);

  // 6. Drag & Drop
  const {
    isDragging,
    draggedCard,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
  } = useKanbanDragDrop(props, board);

  // 7. Filtering & Search
  const {
    filteredCards,
    searchQuery,
    setSearchQuery,
    activeFilters,
    setActiveFilters,
    clearFilters,
  } = useKanbanFilters(props, board);



  // 9. Virtualization
  const {
    columnVirtualizers,
    cardVirtualizers,
    scrollToColumn,
    scrollToCard,
  } = useKanbanVirtualization(props, board);

  // 10. Imperative API
  const imperativeAPI = useKanbanImperative(props, board, {
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    duplicateCard,
    archiveCard,
    restoreCard,
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    createSwimlane,
    updateSwimlane,
    deleteSwimlane,
    reorderSwimlanes,
    scrollToColumn,
    scrollToCard,
    exportBoard,
    importBoard,

  }, ref as any, extraApi);

  return {
    // Base API / State
    ...baseApi,
    ...imperativeAPI,

    // Board State
    board,
    setBoard,
    view,
    setView,
    selectedCards,
    setSelectedCards,
    selectedColumnId,
    setSelectedColumnId,
    selectedSwimlaneId,
    setSelectedSwimlaneId,

    // Card Management
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    duplicateCard,
    archiveCard,
    restoreCard,

    // Column Management
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    collapseColumn,
    expandColumn,

    // Swimlane Management
    createSwimlane,
    updateSwimlane,
    deleteSwimlane,
    reorderSwimlanes,
    collapseSwimlane,
    expandSwimlane,

    // Drag & Drop
    isDragging,
    draggedCard,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,

    // Filtering & Search
    filteredCards,
    searchQuery,
    setSearchQuery,
    activeFilters,
    setActiveFilters,
    clearFilters,



    // Virtualization
    columnVirtualizers,
    cardVirtualizers,
    scrollToColumn,
    scrollToCard,

    // Service Registry
    serviceRegistry,
  };
};
```

### 6.2 EzKanbanRef Interface

```typescript
/**
 * Imperative API for EzKanban component.
 * Provides methods to programmatically control the board.
 */
export interface EzKanbanRef<TCard = KanbanCard> {
  // ────────────────────────────────────────────────
  // Card Operations
  // ────────────────────────────────────────────────
  /**
   * Create a new card
   */
  addCard(draft: Partial<TCard>): Promise<TCard>;

  /**
   * Update an existing card
   */
  updateCard(cardId: string, updates: Partial<TCard>): Promise<void>;

  /**
   * Delete a card
   */
  deleteCard(cardId: string): Promise<void>;

  /**
   * Move a card to a different column/swimlane
   */
  moveCard(
    cardId: string,
    targetColumnId: string,
    targetSwimlaneId?: string,
    targetPosition?: number
  ): Promise<void>;

  /**
   * Duplicate a card
   */
  duplicateCard(cardId: string): Promise<TCard>;

  /**
   * Archive a card
   */
  archiveCard(cardId: string): Promise<void>;

  /**
   * Restore an archived card
   */
  restoreCard(cardId: string): Promise<void>;

  /**
   * Get a card by ID
   */
  getCard(cardId: string): TCard | undefined;

  /**
   * Get all cards
   */
  getCards(): TCard[];

  /**
   * Get cards in a specific column
   */
  getCardsInColumn(columnId: string): TCard[];

  /**
   * Get cards in a specific swimlane
   */
  getCardsInSwimlane(swimlaneId: string): TCard[];

  // ────────────────────────────────────────────────
  // Column Operations
  // ────────────────────────────────────────────────
  /**
   * Create a new column
   */
  addColumn(column: Partial<KanbanColumn>): Promise<KanbanColumn>;

  /**
   * Update a column
   */
  updateColumn(columnId: string, updates: Partial<KanbanColumn>): Promise<void>;

  /**
   * Delete a column
   */
  deleteColumn(columnId: string): Promise<void>;

  /**
   * Reorder columns
   */
  reorderColumns(columnIds: string[]): Promise<void>;

  /**
   * Collapse a column
   */
  collapseColumn(columnId: string): void;

  /**
   * Expand a column
   */
  expandColumn(columnId: string): void;

  /**
   * Get a column by ID
   */
  getColumn(columnId: string): KanbanColumn | undefined;

  /**
   * Get all columns
   */
  getColumns(): KanbanColumn[];

  // ────────────────────────────────────────────────
  // Swimlane Operations
  // ────────────────────────────────────────────────
  /**
   * Create a new swimlane
   */
  addSwimlane(swimlane: Partial<KanbanSwimlane>): Promise<KanbanSwimlane>;

  /**
   * Update a swimlane
   */
  updateSwimlane(swimlaneId: string, updates: Partial<KanbanSwimlane>): Promise<void>;

  /**
   * Delete a swimlane
   */
  deleteSwimlane(swimlaneId: string): Promise<void>;

  /**
   * Reorder swimlanes
   */
  reorderSwimlanes(swimlaneIds: string[]): Promise<void>;

  /**
   * Collapse a swimlane
   */
  collapseSwimlane(swimlaneId: string): void;

  /**
   * Expand a swimlane
   */
  expandSwimlane(swimlaneId: string): void;

  /**
   * Get a swimlane by ID
   */
  getSwimlane(swimlaneId: string): KanbanSwimlane | undefined;

  /**
   * Get all swimlanes
   */
  getSwimlanes(): KanbanSwimlane[];

  // ────────────────────────────────────────────────
  // Selection Operations
  // ────────────────────────────────────────────────
  /**
   * Select a card
   */
  selectCard(cardId: string): void;

  /**
   * Select multiple cards
   */
  selectCards(cardIds: string[]): void;

  /**
   * Deselect a card
   */
  deselectCard(cardId: string): void;

  /**
   * Deselect all cards
   */
  deselectAllCards(): void;

  /**
   * Get selected cards
   */
  getSelectedCards(): TCard[];

  /**
   * Select a column
   */
  selectColumn(columnId: string): void;

  /**
   * Deselect column
   */
  deselectColumn(): void;

  /**
   * Select a swimlane
   */
  selectSwimlane(swimlaneId: string): void;

  /**
   * Deselect swimlane
   */
  deselectSwimlane(): void;

  // ────────────────────────────────────────────────
  // View Operations
  // ────────────────────────────────────────────────
  /**
   * Set the current view
   */
  setView(view: LayoutType): void;

  /**
   * Get the current view
   */
  getView(): LayoutType;

  /**
   * Scroll to a specific column
   */
  scrollToColumn(columnId: string, options?: ScrollIntoViewOptions): void;

  /**
   * Scroll to a specific card
   */
  scrollToCard(cardId: string, options?: ScrollIntoViewOptions): void;

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
   * Reset zoom
   */
  resetZoom(): void;

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
   * Get filtered cards
   */
  getFilteredCards(): TCard[];



  // ────────────────────────────────────────────────
  // Export/Import Operations
  // ────────────────────────────────────────────────
  /**
   * Export board to JSON
   */
  exportBoard(format: 'json' | 'csv' | 'excel'): Promise<Blob>;

  /**
   * Import board from JSON
   */
  importBoard(data: string | File): Promise<void>;

  /**
   * Export to EzTable format
   */
  exportToTable(): Promise<{ columns: ColumnDef<TCard>[]; data: TCard[] }>;

  /**
   * Export to EzScheduler format
   */
  exportToScheduler(): Promise<SchedulerEvent[]>;

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
  // Board Operations
  // ────────────────────────────────────────────────
  /**
   * Get the board
   */
  getBoard(): KanbanBoard;

  /**
   * Set the board
   */
  setBoard(board: KanbanBoard): void;

  /**
   * Refresh the board
   */
  refresh(): Promise<void>;

  /**
   * Reset the board to initial state
   */
  reset(): void;

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
   * Get board statistics
   */
  getStatistics(): BoardStatistics;

  /**
   * Validate board configuration
   */
  validate(): ValidationResult;
}
```

### 6.3 Sub-Hooks

```typescript
// ────────────────────────────────────────────────
// State Management Hooks
// ────────────────────────────────────────────────

/**
 * Hook for managing board state
 */
export const useKanbanState = (props: EzKanbanProps) => {
  const [board, setBoard] = useState<KanbanBoard>(props.board);
  const [view, setView] = useState<LayoutType>(props.view || 'standard');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [selectedSwimlaneId, setSelectedSwimlaneId] = useState<string | null>(null);

  return {
    board,
    setBoard,
    view,
    setView,
    selectedCards,
    setSelectedCards,
    selectedColumnId,
    setSelectedColumnId,
    selectedSwimlaneId,
    setSelectedSwimlaneId,
  };
};

/**
 * Hook for managing cards
 */
export const useKanbanCards = (props: EzKanbanProps, board: KanbanBoard) => {
  const queryClient = useQueryClient();

  const createCard = useCallback(async (draft: Partial<KanbanCard>) => {
    const newCard: KanbanCard = {
      id: `card-${Date.now()}`,
      type: 'standard',
      title: draft.title || 'New Card',
      columnId: draft.columnId || board.columns[0].id,
      position: board.cards.filter(c => c.columnId === draft.columnId).length,
      assignees: [],
      tags: [],
      checklists: [],
      attachments: [],
      dependencies: { dependsOn: [], blocks: [] },
      customFields: {},
      comments: [],
      activity: [],
      createdBy: 'current-user',
      createdAt: new Date(),
      updatedBy: 'current-user',
      updatedAt: new Date(),
      ...draft,
    };

    // Optimistic update
    queryClient.setQueryData(['board', board.id], (old: KanbanBoard) => ({
      ...old,
      cards: [...old.cards, newCard],
    }));

    // Server update
    await props.onCardCreate?.(newCard);
    return newCard;
  }, [board, queryClient, props]);

  const updateCard = useCallback(async (cardId: string, updates: Partial<KanbanCard>) => {
    // Optimistic update
    queryClient.setQueryData(['board', board.id], (old: KanbanBoard) => ({
      ...old,
      cards: old.cards.map(card =>
        card.id === cardId ? { ...card, ...updates, updatedAt: new Date() } : card
      ),
    }));

    // Server update
    await props.onCardUpdate?.(
      board.cards.find(c => c.id === cardId)!,
      'edit'
    );
  }, [board, queryClient, props]);

  const deleteCard = useCallback(async (cardId: string) => {
    // Optimistic update
    queryClient.setQueryData(['board', board.id], (old: KanbanBoard) => ({
      ...old,
      cards: old.cards.filter(card => card.id !== cardId),
    }));

    // Server update
    await props.onCardDelete?.(cardId);
  }, [board, queryClient, props]);

  const moveCard = useCallback(async (
    cardId: string,
    targetColumnId: string,
    targetSwimlaneId?: string,
    targetPosition?: number
  ) => {
    // Optimistic update
    queryClient.setQueryData(['board', board.id], (old: KanbanBoard) => {
      const card = old.cards.find(c => c.id === cardId);
      if (!card) return old;

      const updatedCard = {
        ...card,
        columnId: targetColumnId,
        swimlaneId: targetSwimlaneId,
        position: targetPosition ?? old.cards.filter(c => c.columnId === targetColumnId).length,
      };

      return {
        ...old,
        cards: old.cards.map(c => c.id === cardId ? updatedCard : c),
      };
    });

    // Server update
    const card = board.cards.find(c => c.id === cardId);
    if (card) {
      await props.onCardUpdate?.(card, 'move');
    }
  }, [board, queryClient, props]);

  const duplicateCard = useCallback(async (cardId: string) => {
    const originalCard = board.cards.find(c => c.id === cardId);
    if (!originalCard) throw new Error('Card not found');

    const duplicatedCard: KanbanCard = {
      ...originalCard,
      id: `card-${Date.now()}`,
      title: `${originalCard.title} (Copy)`,
      position: board.cards.filter(c => c.columnId === originalCard.columnId).length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await createCard(duplicatedCard);
    return duplicatedCard;
  }, [board, createCard]);

  const archiveCard = useCallback(async (cardId: string) => {
    await updateCard(cardId, { isArchived: true });
  }, [updateCard]);

  const restoreCard = useCallback(async (cardId: string) => {
    await updateCard(cardId, { isArchived: false });
  }, [updateCard]);

  return {
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    duplicateCard,
    archiveCard,
    restoreCard,
  };
};

/**
 * Hook for managing columns
 */
export const useKanbanColumns = (props: EzKanbanProps, board: KanbanBoard) => {
  const queryClient = useQueryClient();

  const createColumn = useCallback(async (column: Partial<KanbanColumn>) => {
    const newColumn: KanbanColumn = {
      id: `col-${Date.now()}`,
      name: column.name || 'New Column',
      position: board.columns.length,
      isCollapsed: false,
      ...column,
    };

    queryClient.setQueryData(['board', board.id], (old: KanbanBoard) => ({
      ...old,
      columns: [...old.columns, newColumn],
    }));

    await props.onColumnCreate?.(newColumn);
    return newColumn;
  }, [board, queryClient, props]);

  const updateColumn = useCallback(async (columnId: string, updates: Partial<KanbanColumn>) => {
    queryClient.setQueryData(['board', board.id], (old: KanbanBoard) => ({
      ...old,
      columns: old.columns.map(col =>
        col.id === columnId ? { ...col, ...updates } : col
      ),
    }));

    await props.onColumnUpdate?.(board.columns.find(c => c.id === columnId)!);
  }, [board, queryClient, props]);

  const deleteColumn = useCallback(async (columnId: string) => {
    queryClient.setQueryData(['board', board.id], (old: KanbanBoard) => ({
      ...old,
      columns: old.columns.filter(col => col.id !== columnId),
      cards: old.cards.filter(card => card.columnId !== columnId),
    }));

    await props.onColumnDelete?.(columnId);
  }, [board, queryClient, props]);

  const reorderColumns = useCallback(async (columnIds: string[]) => {
    queryClient.setQueryData(['board', board.id], (old: KanbanBoard) => ({
      ...old,
      columns: columnIds.map((id, index) => ({
        ...old.columns.find(c => c.id === id)!,
        position: index,
      })),
    }));
  }, [queryClient]);

  const collapseColumn = useCallback((columnId: string) => {
    updateColumn(columnId, { isCollapsed: true });
  }, [updateColumn]);

  const expandColumn = useCallback((columnId: string) => {
    updateColumn(columnId, { isCollapsed: false });
  }, [updateColumn]);

  return {
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    collapseColumn,
    expandColumn,
  };
};

/**
 * Hook for managing swimlanes
 */
export const useKanbanSwimlanes = (props: EzKanbanProps, board: KanbanBoard) => {
  const queryClient = useQueryClient();

  const createSwimlane = useCallback(async (swimlane: Partial<KanbanSwimlane>) => {
    const newSwimlane: KanbanSwimlane = {
      id: `swimlane-${Date.now()}`,
      name: swimlane.name || 'New Swimlane',
      type: 'custom',
      position: (board.swimlanes || []).length,
      isCollapsed: false,
      ...swimlane,
    };

    queryClient.setQueryData(['board', board.id], (old: KanbanBoard) => ({
      ...old,
      swimlanes: [...(old.swimlanes || []), newSwimlane],
    }));

    await props.onSwimlaneCreate?.(newSwimlane);
    return newSwimlane;
  }, [board, queryClient, props]);

  const updateSwimlane = useCallback(async (swimlaneId: string, updates: Partial<KanbanSwimlane>) => {
    queryClient.setQueryData(['board', board.id], (old: KanbanBoard) => ({
      ...old,
      swimlanes: (old.swimlanes || []).map(swim =>
        swim.id === swimlaneId ? { ...swim, ...updates } : swim
      ),
    }));

    await props.onSwimlaneUpdate?.(board.swimlanes?.find(s => s.id === swimlaneId)!);
  }, [board, queryClient, props]);

  const deleteSwimlane = useCallback(async (swimlaneId: string) => {
    queryClient.setQueryData(['board', board.id], (old: KanbanBoard) => ({
      ...old,
      swimlanes: (old.swimlanes || []).filter(swim => swim.id !== swimlaneId),
      cards: old.cards.map(card =>
        card.swimlaneId === swimlaneId ? { ...card, swimlaneId: undefined } : card
      ),
    }));

    await props.onSwimlaneDelete?.(swimlaneId);
  }, [board, queryClient, props]);

  const reorderSwimlanes = useCallback(async (swimlaneIds: string[]) => {
    queryClient.setQueryData(['board', board.id], (old: KanbanBoard) => ({
      ...old,
      swimlanes: swimlaneIds.map((id, index) => ({
        ...(old.swimlanes || []).find(s => s.id === id)!,
        position: index,
      })),
    }));
  }, [queryClient]);

  const collapseSwimlane = useCallback((swimlaneId: string) => {
    updateSwimlane(swimlaneId, { isCollapsed: true });
  }, [updateSwimlane]);

  const expandSwimlane = useCallback((swimlaneId: string) => {
    updateSwimlane(swimlaneId, { isCollapsed: false });
  }, [updateSwimlane]);

  return {
    createSwimlane,
    updateSwimlane,
    deleteSwimlane,
    reorderSwimlanes,
    collapseSwimlane,
    expandSwimlane,
  };
};

/**
 * Hook for managing drag and drop
 */
export const useKanbanDragDrop = (props: EzKanbanProps, board: KanbanBoard) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedCard, setDraggedCard] = useState<KanbanCard | null>(null);

  const handleDragStart = useCallback((card: KanbanCard) => {
    setIsDragging(true);
    setDraggedCard(card);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedCard(null);
  }, []);

  const handleDrop = useCallback(async (
    targetColumnId: string,
    targetSwimlaneId?: string,
    targetPosition?: number
  ) => {
    if (!draggedCard) return;

    await props.onCardUpdate?.(draggedCard, 'move');
    setIsDragging(false);
    setDraggedCard(null);
  }, [draggedCard, props]);

  return {
    isDragging,
    draggedCard,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
  };
};

/**
 * Hook for managing filters and search
 */
export const useKanbanFilters = (props: EzKanbanProps, board: KanbanBoard) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterConfig>({});

  const filteredCards = useMemo(() => {
    return board.cards.filter(card => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          card.title.toLowerCase().includes(query) ||
          card.description?.toLowerCase().includes(query) ||
          card.tags.some(tag => tag.name.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Active filters
      if (activeFilters.category && !activeFilters.category.includes(card.tags[0]?.id)) {
        return false;
      }

      if (activeFilters.assignee && !card.assignees.some(a => activeFilters.assignee?.includes(a.id))) {
        return false;
      }

      if (activeFilters.status && !activeFilters.status.includes(card.priority)) {
        return false;
      }

      return true;
    });
  }, [board.cards, searchQuery, activeFilters]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilters({});
  }, []);

  return {
    filteredCards,
    searchQuery,
    setSearchQuery,
    activeFilters,
    setActiveFilters,
    clearFilters,
  };
};



/**
 * Hook for managing virtualization
 */
export const useKanbanVirtualization = (props: EzKanbanProps, board: KanbanBoard) => {
  const columnRefs = useRef<Record<string, HTMLDivElement>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement>>({});

  const columnVirtualizers = useMemo(() => {
    return board.columns.map(column => {
      const parentRef = columnRefs.current[column.id];
      if (!parentRef) return null;

      return useVirtualizer({
        count: board.cards.filter(c => c.columnId === column.id).length,
        getScrollElement: () => parentRef,
        estimateSize: () => 120,
        overscan: 5,
      });
    });
  }, [board.columns, board.cards]);

  const cardVirtualizers = useMemo(() => {
    return board.swimlanes?.map(swimlane => {
      const parentRef = cardRefs.current[swimlane.id];
      if (!parentRef) return null;

      return useVirtualizer({
        count: board.cards.filter(c => c.swimlaneId === swimlane.id).length,
        getScrollElement: () => parentRef,
        estimateSize: () => 120,
        overscan: 5,
      });
    }) || [];
  }, [board.swimlanes, board.cards]);

  const scrollToColumn = useCallback((columnId: string, options?: ScrollIntoViewOptions) => {
    columnRefs.current[columnId]?.scrollIntoView(options);
  }, []);

  const scrollToCard = useCallback((cardId: string, options?: ScrollIntoViewOptions) => {
    cardRefs.current[cardId]?.scrollIntoView(options);
  }, []);

  return {
    columnVirtualizers,
    cardVirtualizers,
    scrollToColumn,
    scrollToCard,
  };
};

/**
 * Hook for imperative API
 */
export const useKanbanImperative = (
  props: EzKanbanProps,
  board: KanbanBoard,
  methods: any,
  ref?: React.Ref<EzKanbanRef>,
  extraApi: any = {}
) => {
  const imperativeAPI = useMemo<EzKanbanRef>(() => ({
    // Card operations
    addCard: methods.createCard,
    updateCard: methods.updateCard,
    deleteCard: methods.deleteCard,
    moveCard: methods.moveCard,
    duplicateCard: methods.duplicateCard,
    archiveCard: methods.archiveCard,
    restoreCard: methods.restoreCard,
    getCard: (cardId: string) => board.cards.find(c => c.id === cardId),
    getCards: () => board.cards,
    getCardsInColumn: (columnId: string) => board.cards.filter(c => c.columnId === columnId),
    getCardsInSwimlane: (swimlaneId: string) => board.cards.filter(c => c.swimlaneId === swimlaneId),

    // Column operations
    addColumn: methods.createColumn,
    updateColumn: methods.updateColumn,
    deleteColumn: methods.deleteColumn,
    reorderColumns: methods.reorderColumns,
    collapseColumn: methods.collapseColumn,
    expandColumn: methods.expandColumn,
    getColumn: (columnId: string) => board.columns.find(c => c.id === columnId),
    getColumns: () => board.columns,

    // Swimlane operations
    addSwimlane: methods.createSwimlane,
    updateSwimlane: methods.updateSwimlane,
    deleteSwimlane: methods.deleteSwimlane,
    reorderSwimlanes: methods.reorderSwimlanes,
    collapseSwimlane: methods.collapseSwimlane,
    expandSwimlane: methods.expandSwimlane,
    getSwimlane: (swimlaneId: string) => board.swimlanes?.find(s => s.id === swimlaneId),
    getSwimlanes: () => board.swimlanes || [],

    // Selection operations
    selectCard: (cardId: string) => props.onCardSelect?.([cardId]),
    selectCards: (cardIds: string[]) => props.onCardSelect?.(cardIds),
    deselectCard: (cardId: string) => props.onCardSelect?.(board.cards.filter(c => c.id !== cardId).map(c => c.id)),
    deselectAllCards: () => props.onCardSelect?.([]),
    getSelectedCards: () => board.cards.filter(c => props.selectedCards?.includes(c.id)),
    selectColumn: (columnId: string) => {/* TODO */},
    deselectColumn: () => {/* TODO */},
    selectSwimlane: (swimlaneId: string) => {/* TODO */},
    deselectSwimlane: () => {/* TODO */},

    // View operations
    setView: props.onViewChange,
    getView: () => props.view || 'standard',
    scrollToColumn: methods.scrollToColumn,
    scrollToCard: methods.scrollToCard,
    fitToScreen: () => {/* TODO */},
    zoomIn: () => {/* TODO */},
    zoomOut: () => {/* TODO */},
    resetZoom: () => {/* TODO */},

    // Filter & search operations
    setSearchQuery: () => {/* TODO */},
    getSearchQuery: () => '',
    setActiveFilters: () => {/* TODO */},
    getActiveFilters: () => ({}) as FilterConfig,
    clearFilters: () => {/* TODO */},
    getFilteredCards: () => board.cards,



    // Export/Import operations
    exportBoard: methods.exportBoard,
    importBoard: methods.importBoard,
    exportToTable: () => ({ columns: [], data: [] }),
    exportToScheduler: () => [],

    // Undo/Redo operations
    undo: () => {/* TODO */},
    redo: () => {/* TODO */},
    canUndo: () => false,
    canRedo: () => false,
    getHistory: () => [],
    clearHistory: () => {/* TODO */},

    // Board operations
    getBoard: () => board,
    setBoard: props.onBoardChange,
    refresh: () => {/* TODO */},
    reset: () => {/* TODO */},

    // Utility methods
    showSpinner: () => {/* TODO */},
    hideSpinner: () => {/* TODO */},
    forceUpdate: () => {/* TODO */},
    getStatistics: () => ({ totalCards: board.cards.length, totalColumns: board.columns.length }),
    validate: () => ({ isValid: true, errors: [] }),

    ...extraApi,
  }), [board, props, methods, extraApi]);

  useImperativeHandle(ref, () => imperativeAPI, [imperativeAPI]);

  return imperativeAPI;
};
```

### 6.4 Service Interfaces

```typescript
/**
 * Kanban service interface for board operations
 */
export interface IKanbanService extends IService {
  /**
   * Get a board by ID
   */
  getBoard(boardId: string): Promise<KanbanBoard>;

  /**
   * Create a new board
   */
  createBoard(board: Partial<KanbanBoard>): Promise<KanbanBoard>;

  /**
   * Update a board
   */
  updateBoard(boardId: string, updates: Partial<KanbanBoard>): Promise<void>;

  /**
   * Delete a board
   */
  deleteBoard(boardId: string): Promise<void>;

  /**
   * Create a card
   */
  createCard(boardId: string, card: Partial<KanbanCard>): Promise<KanbanCard>;

  /**
   * Update a card
   */
  updateCard(cardId: string, updates: Partial<KanbanCard>): Promise<void>;

  /**
   * Delete a card
   */
  deleteCard(cardId: string): Promise<void>;

  /**
   * Move a card
   */
  moveCard(
    cardId: string,
    targetColumnId: string,
    targetSwimlaneId?: string,
    targetPosition?: number
  ): Promise<void>;

  /**
   * Create a column
   */
  createColumn(boardId: string, column: Partial<KanbanColumn>): Promise<KanbanColumn>;

  /**
   * Update a column
   */
  updateColumn(columnId: string, updates: Partial<KanbanColumn>): Promise<void>;

  /**
   * Delete a column
   */
  deleteColumn(columnId: string): Promise<void>;

  /**
   * Create a swimlane
   */
  createSwimlane(boardId: string, swimlane: Partial<KanbanSwimlane>): Promise<KanbanSwimlane>;

  /**
   * Update a swimlane
   */
  updateSwimlane(swimlaneId: string, updates: Partial<KanbanSwimlane>): Promise<void>;

  /**
   * Delete a swimlane
   */
  deleteSwimlane(swimlaneId: string): Promise<void>;

  /**
   * Get analytics for a board
   */


  /**
   * Export board data
   */
  exportBoard(boardId: string, format: 'json' | 'csv' | 'excel'): Promise<Blob>;

  /**
   * Import board data
   */
  importBoard(boardId: string, data: string | File): Promise<void>;

  /**
   * Cleanup service resources
   */
  cleanup(): void;
}

/**
 * Export service interface
 */
export interface IKanbanExportService extends IService {
  exportToJSON(board: KanbanBoard): Promise<Blob>;
  exportToCSV(board: KanbanBoard): Promise<Blob>;
  exportToExcel(board: KanbanBoard): Promise<Blob>;
  exportToTable(board: KanbanBoard): Promise<{ columns: ColumnDef[]; data: any[] }>;
  exportToScheduler(board: KanbanBoard): Promise<SchedulerEvent[]>;
  cleanup(): void;
}

/**

  calculateCumulativeFlow(board: KanbanBoard, dateRange?: DateRange): CumulativeFlowData[];
  calculateCycleTime(board: KanbanBoard): CycleTimeData;
  calculateThroughput(board: KanbanBoard): ThroughputData;
  detectBottlenecks(board: KanbanBoard): BottleneckData[];
  calculateLeadTimeDistribution(board: KanbanBoard): LeadTimeDistributionData;
  calculateVelocity(board: KanbanBoard): VelocityData;
  cleanup(): void;
}
```

### 6.5 Event Handlers

```typescript
/**
 * Complete event handler interface for EzKanban
 */
export interface EzKanbanEventHandlers {
  // ────────────────────────────────────────────────
  // Card Events
  // ────────────────────────────────────────────────
  /**
   * Fired when a card is created
   */
  onCardCreate?: (draft: Partial<KanbanCard>) => void | Promise<void>;

  /**
   * Fired when a card is updated
   */
  onCardUpdate?: (
    card: KanbanCard,
    changeType: 'move' | 'edit' | 'assign' | 'complete'
  ) => Promise<void> | void;

  /**
   * Fired when a card is deleted
   */
  onCardDelete?: (cardId: string) => void | Promise<void>;

  /**
   * Fired when a card is clicked
   */
  onCardClick?: (card: KanbanCard) => void;

  /**
   * Fired when a card is double-clicked
   */
  onCardDoubleClick?: (card: KanbanCard) => void;

  /**
   * Fired when card selection changes
   */
  onCardSelect?: (cardIds: string[]) => void;

  /**
   * Fired when card drag starts
   */
  onCardDragStart?: (card: KanbanCard) => void;

  /**
   * Fired when card drag ends
   */
  onCardDragEnd?: (card: KanbanCard, target: { columnId: string; swimlaneId?: string }) => void;

  /**
   * Fired when card is expanded to table view
   */
  onCardExpandToTable?: (card: KanbanCard) => void;

  /**
   * Fired when card is dragged to scheduler
   */
  onCardDragToScheduler?: (card: KanbanCard, date: Date) => void;

  // ────────────────────────────────────────────────
  // Column Events
  // ────────────────────────────────────────────────
  /**
   * Fired when a column is created
   */
  onColumnCreate?: (column: Partial<KanbanColumn>) => void | Promise<void>;

  /**
   * Fired when a column is updated
   */
  onColumnUpdate?: (column: KanbanColumn) => void | Promise<void>;

  /**
   * Fired when a column is deleted
   */
  onColumnDelete?: (columnId: string) => void | Promise<void>;

  /**
   * Fired when columns are reordered
   */
  onColumnReorder?: (columnIds: string[]) => void;

  /**
   * Fired when a column is collapsed
   */
  onColumnCollapse?: (columnId: string) => void;

  /**
   * Fired when a column is expanded
   */
  onColumnExpand?: (columnId: string) => void;

  // ────────────────────────────────────────────────
  // Swimlane Events
  // ────────────────────────────────────────────────
  /**
   * Fired when a swimlane is created
   */
  onSwimlaneCreate?: (swimlane: Partial<KanbanSwimlane>) => void | Promise<void>;

  /**
   * Fired when a swimlane is updated
   */
  onSwimlaneUpdate?: (swimlane: KanbanSwimlane) => void | Promise<void>;

  /**
   * Fired when a swimlane is deleted
   */
  onSwimlaneDelete?: (swimlaneId: string) => void | Promise<void>;

  /**
   * Fired when swimlanes are reordered
   */
  onSwimlaneReorder?: (swimlaneIds: string[]) => void;

  /**
   * Fired when a swimlane is collapsed
   */
  onSwimlaneCollapse?: (swimlaneId: string) => void;

  /**
   * Fired when a swimlane is expanded
   */
  onSwimlaneExpand?: (swimlaneId: string) => void;

  // ────────────────────────────────────────────────
  // Board Events
  // ────────────────────────────────────────────────
  /**
   * Fired when board data changes
   */
  onBoardChange?: (board: KanbanBoard) => void;

  /**
   * Fired when view changes
   */
  onViewChange?: (view: LayoutType) => void;

  /**
   * Fired when board is refreshed
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

  // ────────────────────────────────────────────────
  /**
   * Fired when analytics are loaded
   */


  /**
   * Fired when WIP limit is exceeded
   */
  onWipLimitExceeded?: (columnId: string, currentCount: number, limit: number) => void;

  // ────────────────────────────────────────────────
  // Lifecycle Events
  // ────────────────────────────────────────────────
  /**
   * Fired when board starts rendering
   */
  onBoardRenderStart?: () => void;

  /**
   * Fired when board finishes rendering
   */
  onBoardRenderComplete?: () => void;

  /**
   * Fired when board encounters an error
   */
  onError?: (error: Error) => void;
}
```

---

## 7. Advanced Features (EzSuite Extensions)

### 6.1 EzTable Integration

**Card Expansion:**
```typescript
// Expand card into EzTable for detailed editing
const handleCardExpand = (card: KanbanCard) => {
  // Open modal with EzTable showing card details
  // Allow editing of all card fields in table format
  // Supports bulk edit of multiple selected cards
};
```

**Export/Import:**
```typescript
// Use EzTable's ExportService
import { ExportService } from '../shared/services/ExportService';

const exportBoard = async (board: KanbanBoard) => {
  const exportService = registry.get<ExportService>('export');
  await exportService.exportToExcel(board.cards, 'board-data.xlsx');
};
```

### 6.2 EzScheduler Integration

**Drag to Scheduler:**
```typescript
// Drag card from Kanban to EzScheduler to create event
const handleCardDragToScheduler = (card: KanbanCard, date: Date) => {
  const event: SchedulerEvent = {
    id: `event-${card.id}`,
    title: card.title,
    start: date,
    end: new Date(date.getTime() + (card.timeTracking?.estimated || 1) * 60 * 60 * 1000),
    description: card.description,
    categoryId: card.tags[0]?.id,
  };
  // Create event in scheduler
};
```

### 6.3 EzTreeView Integration

**Hierarchical Cards:**
```typescript
// Use EzTreeView for card dependencies
const renderDependencyTree = (card: KanbanCard) => {
  const dependencies = card.dependencies.dependsOn.map(id => 
    board.cards.find(c => c.id === id)
  ).filter(Boolean);
  
  return (
    <EzTreeView
      data={dependencies}
      renderItem={(item) => <CardNode card={item} />}
    />
  );
};
```



**Cumulative Flow Diagram:**
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CumulativeFlowChart = ({ data }: { data: CumulativeFlowData[] }) => {
  return (
    <LineChart width={800} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      {Object.keys(data[0]?.columns || {}).map(columnId => (
        <Line 
          key={columnId}
          type="monotone" 
          dataKey={`columns.${columnId}`} 
          stroke={getColumnColor(columnId)} 
        />
      ))}
    </LineChart>
  );
};
```

### 6.5 Real-Time Collaboration

**WebSocket Integration:**
```typescript
// Use TanStack Query for real-time updates
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const useRealTimeBoard = (boardId: string) => {
  const queryClient = useQueryClient();
  
  // Subscribe to real-time updates
  useEffect(() => {
    const ws = new WebSocket(`wss://api.example.com/boards/${boardId}`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      queryClient.setQueryData(['board', boardId], (old: KanbanBoard) => ({
        ...old,
        ...update,
      }));
    };
    
    return () => ws.close();
  }, [boardId, queryClient]);
  
  const { data: board } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoard(boardId),
  });
  
  return { board };
};
```

---

## 7. Performance & React 19 Optimizations

### 7.1 Virtualization Strategy

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const EzKanbanColumn = ({ column, cards }: { column: KanbanColumn; cards: KanbanCard[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: cards.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,  // estimated card height
    overscan: 5,  // render 5 extra cards above/below viewport
  });
  
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const card = cards[virtualRow.index];
          return (
            <div
              key={card.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <KanbanCard card={card} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

### 7.2 React 19 Transitions

```typescript
import { useTransition } from 'react';

const EzKanbanBoard = ({ board }: EzKanbanProps) => {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  
  const handleCardMove = async (cardId: string, targetColumnId: string) => {
    // Optimistic update
    queryClient.setQueryData(['board', board.id], (old: KanbanBoard) => ({
      ...old,
      cards: old.cards.map(card => 
        card.id === cardId ? { ...card, columnId: targetColumnId } : card
      ),
    }));
    
    // Non-blocking server update
    startTransition(async () => {
      try {
        await updateCardMutation.mutateAsync({ cardId, columnId: targetColumnId });
      } catch (error) {
        // Rollback on error
        queryClient.invalidateQueries(['board', board.id]);
      }
    });
  };
  
  return (
    <div className={isPending ? 'opacity-50' : ''}>
      {/* Board content */}
    </div>
  );
};
```

### 7.3 TanStack Query Optimistic Updates

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useUpdateCard = (boardId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ cardId, updates }: { cardId: string; updates: Partial<KanbanCard> }) => {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      return response.json();
    },
    onMutate: async ({ cardId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['board', boardId] });
      
      // Snapshot previous value
      const previousBoard = queryClient.getQueryData<KanbanBoard>(['board', boardId]);
      
      // Optimistically update
      queryClient.setQueryData<KanbanBoard>(['board', boardId], (old) => ({
        ...old!,
        cards: old!.cards.map(card => 
          card.id === cardId ? { ...card, ...updates } : card
        ),
      }));
      
      return { previousBoard };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['board', boardId], context?.previousBoard);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });
};
```

### 7.4 Component Decomposition

```typescript
// Split into specialized sub-components to isolate re-renders
export const EzKanban = (props: EzKanbanProps) => {
  return (
    <div className="ez-kanban">
      <EzKanbanToolbar {...props} />
      <EzKanbanBoard {...props} />
      <EzKanbanStatusBar {...props} />
    </div>
  );
};

// Toolbar: Search, filters, view switcher (memoized)
export const EzKanbanBoard = React.memo(({ board, view, ...props }: EzKanbanProps) => {
  return (
    <div className="ez-kanban-board">
      {view === 'standard' && <StandardBoard board={board} {...props} />}
      {view === 'swimlane' && <SwimlaneBoard board={board} {...props} />}
      {view === 'timeline' && <TimelineBoard board={board} {...props} />}

    </div>
  );
});

// Status bar: Card count, WIP status, activity (memoized)
```

### 7.5 TanStack DB for Local Persistence

```typescript
import { TanStackDB } from '@tanstack/db';

const useKanbanDB = () => {
  const db = useMemo(() => {
    return new TanStackDB({
      name: 'ez-kanban',
      tables: {
        boards: {
          schema: {
            id: 'string',
            name: 'string',
            data: 'json',
          },
          primaryKey: 'id',
        },
        cards: {
          schema: {
            id: 'string',
            boardId: 'string',
            columnId: 'string',
            data: 'json',
          },
          primaryKey: 'id',
          indexes: ['boardId', 'columnId'],
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
import { useKanbanBoard } from './hooks/useKanbanBoard';

describe('useKanbanBoard', () => {
  it('should create a new card', async () => {
    const { result } = renderHook(() => useKanbanBoard(mockBoard));
    
    await act(async () => {
      await result.current.createCard({
        title: 'Test Card',
        columnId: 'col-1',
      });
    });
    
    expect(result.current.board.cards).toHaveLength(1);
    expect(result.current.board.cards[0].title).toBe('Test Card');
  });
  
  it('should enforce WIP limits', async () => {
    const boardWithWipLimit = {
      ...mockBoard,
      columns: [{ id: 'col-1', name: 'To Do', wipLimit: 3, position: 0 }],
      cards: [
        { id: 'card-1', title: 'Card 1', columnId: 'col-1' },
        { id: 'card-2', title: 'Card 2', columnId: 'col-1' },
        { id: 'card-3', title: 'Card 3', columnId: 'col-1' },
      ],
    };
    
    const { result } = renderHook(() => useKanbanBoard(boardWithWipLimit));
    
    await act(async () => {
      const canMove = result.current.canMoveCard('card-4', 'col-1');
      expect(canMove).toBe(false);
    });
  });
});
```

### 8.2 E2E Testing (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test.describe('EzKanban E2E', () => {
  test('should drag and drop card between columns', async ({ page }) => {
    await page.goto('/kanban');
    
    const card = page.locator('[data-testid="card-1"]');
    const targetColumn = page.locator('[data-testid="column-2"]');
    
    await card.dragTo(targetColumn);
    
    await expect(card).toBeInViewport();
    await expect(card).toHaveAttribute('data-column-id', 'column-2');
  });
  
  test('should expand card into EzTable', async ({ page }) => {
    await page.goto('/kanban');
    
    const card = page.locator('[data-testid="card-1"]');
    await card.dblclick();
    
    const tableModal = page.locator('[data-testid="card-table-modal"]');
    await expect(tableModal).toBeVisible();
    await expect(tableModal.locator('table')).toBeVisible();
  });
  
  test('should drag card to EzScheduler', async ({ page }) => {
    await page.goto('/kanban');
    
    const card = page.locator('[data-testid="card-1"]');
    const scheduler = page.locator('[data-testid="ez-scheduler"]');
    
    await card.dragTo(scheduler.locator('[data-date="2026-02-06"]'));
    
    const event = scheduler.locator('[data-testid="event-card-1"]');
    await expect(event).toBeVisible();
  });
});
```

---

## 9. Roadmap & Phases

### Phase 1: Foundation (Weeks 1-4) - MVP
- [x] Headless core with TanStack Store
- [ ] Basic board with columns
- [ ] Card creation and movement
- [ ] Drag & drop with @dnd-kit
- [ ] EzTable integration (card expansion)
- [ ] Basic card template

### Phase 2: Advanced Features (Weeks 5-8)
- [ ] Swimlanes
- [ ] WIP limits with visual indicators
- [ ] Multi-select and bulk operations
- [ ] Card templates
- [ ] Rich card content (checklists, attachments, tags)
- [ ] Keyboard navigation


- [ ] Cumulative flow diagram
- [ ] Cycle time analysis
- [ ] EzScheduler integration (drag to create events)
- [ ] EzTreeView integration (dependencies)
- [ ] EzQueryBuilder integration (advanced filtering)

### Phase 4: Enterprise Features (Weeks 13-16)
- [ ] Real-time collaboration with WebSockets
- [ ] AI-powered suggestions
- [ ] Advanced analytics (bottleneck detection, velocity)
- [ ] Timeline view
- [ ] Export/Import with EzTable's ExportService
- [ ] Full i18n and RTL support

### Phase 5: Polish & Optimization (Weeks 17-20)
- [ ] Performance optimization (virtualization for 10k+ cards)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Comprehensive testing (70% coverage)
- [ ] Documentation and examples
- [ ] v1.0.0 release

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Performance** | <16ms drag latency | Performance API measurements |
| **Bundle Size** | <200KB gzipped | Bundle analysis |
| **Test Coverage** | >70% | Vitest + Playwright |
| **Accessibility** | WCAG 2.1 AA | Axe DevTools + manual audit |
| **i18n Coverage** | 100+ locale keys | Translation completeness |
| **Browser Support** | Chrome, Firefox, Safari | Cross-browser testing |
| **Card Capacity** | 10,000+ cards | Virtualization performance |
| **Real-Time Latency** | <100ms | WebSocket round-trip time |

---

**Document Owner:** EzUX Architecture Team  
**Compliance:** 100% SKILL.md compliant (TanStack-First, React 19.2, TypeScript 5.9)  
**Last Updated:** February 6, 2026  
**Next Review:** End of Phase 1 (Week 4)
