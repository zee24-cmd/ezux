import type { IService } from '../../shared/services/ServiceRegistry';
import { SharedBaseProps } from '../../shared/types/BaseProps';

// ────────────────────────────────────────────────
// Board Configuration
// ────────────────────────────────────────────────

/**
 * Represents the entire Kanban board structure.
 * @group Models
 */
export interface KanbanBoard {
  /** Unique identifier for the board. @group Properties */
  id: string;
  /** Display name of the board. @group Properties */
  name: string;
  /** Optional description of the board. @group Properties */
  description?: string;
  /** List of columns in the board. @group Properties */
  columns: KanbanColumn[];
  /** List of swimlanes (if enabled). @group Properties */
  swimlanes?: KanbanSwimlane[];
  /** List of all cards on the board. @group Properties */
  cards: KanbanCard[];
  /** User permissions for this board. @group Properties */
  permissions?: KanbanPermissions;
  /** Board-specific settings. @group Properties */
  settings: BoardSettings;
  /** Custom field definitions. @group Properties */
  customFields?: CustomFieldDefinition[];
  /** Creation timestamp. @group Properties */
  createdAt: Date;
  /** Last update timestamp. @group Properties */
  updatedAt: Date;
}

/**
 * Represents a swimlane in the Kanban board.
 * @group Models
 */
export interface KanbanSwimlane {
  /** Unique identifier for the swimlane. @group Properties */
  id: string;
  /** Display name of the swimlane. @group Properties */
  name: string;
  /** Type of swimlane grouping. @group Properties */
  type: 'team' | 'priority' | 'custom';
  /** Optional background or accent color. @group Properties */
  color?: string;
  /** Vertical sorting position. @group Properties */
  position: number;
  /** Whether the swimlane is currently collapsed. @group State */
  isCollapsed?: boolean;
}

/**
 * Represents a column in the Kanban board.
 * @group Models
 */
export interface KanbanColumn {
  /** Unique identifier for the column. @group Properties */
  id: string;
  /** Display name of the column. @group Properties */
  name: string;
  /** Header color of the column. @group Properties */
  color?: string;
  /** Icon for the column header. @group Properties */
  icon?: string;
  /** Work-in-progress limit for the column. @group Properties */
  wipLimit?: number;
  /** Sorting position of the column. @group Properties */
  position: number;
  /** Whether the column is collapsed. @group State */
  isCollapsed?: boolean;
}

/**
 * Configuration settings for a Kanban board.
 * @group Models
 */
export interface BoardSettings {
  /** Whether to allow drag and drop. @group Properties */
  allowDragAndDrop: boolean;
  /** Whether to allow multi-select. @group Properties */
  allowMultiSelect: boolean;
  /** Whether to respect WIP limits. @group Properties */
  enableWipLimits: boolean;
  /** Initial view mode. @group Properties */
  defaultView: 'standard' | 'swimlane' | 'timeline';
}

// ────────────────────────────────────────────────
// Card Types
// ────────────────────────────────────────────────

export type CardType = 'standard' | 'epic' | 'milestone' | 'template';

/**
 * Represents a single task or card on the Kanban board.
 */
export interface KanbanCard {
  /** Unique identifier for the card */
  id: string;
  /** Type of card (e.g., standard, epic) */
  type: CardType;
  /** Title of the card */
  title: string;
  /** Description of the card */
  description?: string;

  /** ID of the column the card belongs to */
  columnId: string;
  /** ID of the swimlane the card belongs to (if any) */
  swimlaneId?: string;
  /** Sorting position within the column */
  position: number;

  /** Users assigned to this card */
  assignees: CardAssignee[];

  // Dates
  dueDate?: Date;
  startDate?: Date;
  completedAt?: Date;

  // Tags & Labels
  tags: CardTag[];
  priority?: 'low' | 'medium' | 'high' | 'critical';

  // Metadata
  metadata: Record<string, unknown>;

  // Advanced Features
  coverImage?: string;
  checklists?: Checklist[];
  attachments?: Attachment[];
  comments?: Comment[];
  customFieldValues?: Record<string, unknown>;
  timeTracking?: {
    estimated: number; // in hours
    actual: number;    // in hours
  };
  activity?: CardActivity[];
  parentId?: string;
  subtasks?: { id: string; title: string; isCompleted: boolean }[];

  // System
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
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

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string; // mime type
  size?: number;
  uploadedAt: Date;
}

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  isAutoGenerated?: boolean; // For activity log
  createdAt: Date;
}

export interface CardActivity {
  id: string;
  type: 'create' | 'move' | 'update' | 'comment' | 'attachment' | 'delete';
  text: string;
  userId: string;
  userName: string;
  createdAt: Date;
  metadata?: Record<string, unknown>; // e.g., { fromColumn: 'A', toColumn: 'B' }
}

export interface CustomFieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  options?: string[]; // For 'select' type
  required?: boolean;
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
    | 'addColumn'
    | 'editColumn'

    | 'deleteColumn'
    | 'addSwimlane'
    | 'editSwimlane'
    | 'deleteSwimlane'
  >;
}

// ────────────────────────────────────────────────
// Filter Configuration
// ────────────────────────────────────────────────

export interface FilterConfig {
  tags?: string[];
  assignees?: string[];
  priority?: Array<'low' | 'medium' | 'high' | 'critical'>;
  columns?: string[];
}

// ────────────────────────────────────────────────
// Component Props & Slots
// ────────────────────────────────────────────────

/**
 * Configuration for component slots and their props.
 * @group Extensibility
 */
export interface KanbanSlotConfig {
  slots?: {
    toolbar?: React.ComponentType<any>;
    board?: React.ComponentType<any>;
    column?: React.ComponentType<any>;
    card?: React.ComponentType<any>;
    cardContent?: React.ComponentType<any>;
    swimlane?: React.ComponentType<any>;
    cardEditor?: React.ComponentType<any>;
    [key: string]: React.ComponentType<any> | undefined;
  };
  slotProps?: {
    toolbar?: Record<string, unknown>;
    board?: Record<string, unknown>;
    column?: Record<string, unknown>;
    card?: Record<string, unknown>;
    cardContent?: Record<string, unknown>;
    swimlane?: Record<string, unknown>;
    cardEditor?: Record<string, unknown>;
    [key: string]: Record<string, unknown> | undefined;
  };
}

/**
 * Props for the EzKanban component.
 */
export interface EzKanbanProps extends SharedBaseProps {
  // Core Data & State
  /** 
   * The board data object.
   * @group Properties 
   */
  board: KanbanBoard;
  /** 
   * Callback when the board state changes.
   * @group Events 
   */
  onBoardChange?: (board: KanbanBoard) => void;

  // View Configuration
  /** 
   * The current view mode.
   * @group Properties 
   */
  view?: 'standard' | 'swimlane' | 'timeline';

  // Permissions & Interaction Flags
  /** 
   * User permissions config.
   * @group Properties 
   */
  permissions?: KanbanPermissions;
  /** 
   * Enable read-only mode.
   * @group Properties 
   */
  readOnly?: boolean;
  /** 
   * Allow drag and drop.
   * @group Properties 
   */
  allowDragAndDrop?: boolean;
  /** 
   * Allow selecting multiple cards.
   * @group Properties 
   */
  allowMultiSelect?: boolean;
  /** 
   * Confirm before deleting items.
   * @group Properties 
   */
  confirmOnDelete?: boolean;
  /** 
   * Enforce strict WIP limits.
   * @group Properties 
   */
  wipStrict?: boolean;

  // Appearance & Theming
  /** 
   * Locale for the board.
   * @group Properties 
   */
  locale?: string;
  /** 
   * Enable RTL layout.
   * @group Properties 
   */
  rtl?: boolean;
  /** 
   * Color theme.
   * @group Properties 
   */
  theme?: 'light' | 'dark' | 'system';
  /** 
   * Text direction.
   * @group Properties 
   */
  dir?: 'ltr' | 'rtl' | 'auto';
  /** 
   * Function to determine card class names.
   * @group Properties 
   */
  cardClassName?: (card: KanbanCard) => string | undefined;

  // Extensibility & Customization
  /** 
   * List of plugins to enhance functionality.
   * @group Extensibility 
   */
  plugins?: KanbanPlugin[];

  /**
   * Slots for modular composition.
   * @group Extensibility
   */
  slots?: KanbanSlotConfig['slots'];

  /**
   * Props for slots.
   * @group Extensibility
   */
  slotProps?: KanbanSlotConfig['slotProps'];

  // Events & Callbacks
  /** 
   * Callback when a new card is being created.
   * @group Events 
   */
  onCardCreate?: (draft: Partial<KanbanCard>) => void | Promise<void>;
  /** 
   * Callback when a card is updated.
   * @group Events 
   */
  onCardUpdate?: (
    card: KanbanCard,
    changeType: 'move' | 'edit' | 'assign' | 'complete'
  ) => Promise<void> | void;
  /** 
   * Callback when a card is deleted.
   * @group Events 
   */
  onCardDelete?: (cardId: string) => void | Promise<void>;
  /** 
   * Callback when a card is clicked.
   * @group Events 
   */
  onCardClick?: (card: KanbanCard) => void;
  /** 
   * Callback when a card is double-clicked.
   * @group Events 
   */
  onCardDoubleClick?: (card: KanbanCard) => void;
  /** 
   * Callback when cards are selected.
   * @group Events 
   */
  onCardSelect?: (cardIds: string[]) => void;

  /** 
   * Callback when a column is created.
   * @group Events 
   */
  onColumnCreate?: (column: Partial<KanbanColumn>) => void | Promise<void>;
  /** 
   * Callback when a column is updated.
   * @group Events 
   */
  onColumnUpdate?: (column: KanbanColumn) => void | Promise<void>;
  /** 
   * Callback when a column is deleted.
   * @group Events 
   */
  onColumnDelete?: (columnId: string) => void | Promise<void>;
  /** 
   * Callback when a swimlane is created.
   * @group Events 
   */
  onSwimlaneCreate?: (swimlane: Partial<KanbanSwimlane>) => void | Promise<void>;
  /** 
   * Callback when a swimlane is updated.
   * @group Events 
   */
  onSwimlaneUpdate?: (swimlane: KanbanSwimlane) => void | Promise<void>;
  /** 
   * Callback when a swimlane is deleted.
   * @group Events 
   */
  onSwimlaneDelete?: (swimlaneId: string) => void | Promise<void>;

  // Enterprise Settings
  /** 
   * Configuration for swimlanes.
   * @group Enterprise 
   */
  swimlaneSettings?: {
    allowDragBetweenSwimlanes?: boolean;
    allowReordering?: boolean;
    collapsible?: boolean;
    emptySwimlaneTemplate?: React.ReactNode;
  };
  /** 
   * Configuration for columns.
   * @group Enterprise 
   */
  columnSettings?: {
    minWidth?: number;
    maxWidth?: number;
    allowCollapse?: boolean;
    showItemCount?: boolean;
  };
  /** 
   * Configuration for drag and drop behavior.
   * @group Enterprise 
   */
  dragSettings?: {
    dragClass?: string;
    dropClass?: string;
    dragClone?: boolean;
    minDragDistance?: number;
  };
  /** 
   * Configuration for dialogs (editor, confirmation).
   * @group Enterprise 
   */
  dialogSettings?: {
    modalZIndex?: number;
    closeOnEscape?: boolean;
    showCloseIcon?: boolean;
  };
  /** 
   * Enable tooltips for cards.
   * @group Properties 
   */
  enableTooltip?: boolean;
  /** 
   * Template for card tooltips.
   * @group Templates 
   */
  tooltipTemplate?: (data: KanbanCard) => React.ReactNode;

  // Enterprise Events
  /** 
   * Callback when card drag starts.
   * @group Events 
   */
  onCardDragStart?: (args: { card: KanbanCard; columnId: string; cancel?: boolean }) => void;
  /** 
   * Callback when card drag stops.
   * @group Events 
   */
  onCardDragStop?: (args: { card: KanbanCard; columnId: string; cancel?: boolean }) => void;
  /** 
   * Callback when card enters a column.
   * @group Events 
   */
  onCardDragEnter?: (args: { card: KanbanCard; targetColumnId: string }) => void;
  /** 
   * Callback when card leaves a column.
   * @group Events 
   */
  onCardDragLeave?: (args: { card: KanbanCard; targetColumnId: string }) => void;
  /** 
   * Callback before card render.
   * @group Events 
   */
  onBeforeCardRender?: (args: { card: KanbanCard }) => void;
  /** 
   * Callback when swimlane toggle.
   * @group Events 
   */
  onSwimlaneToggle?: (args: { swimlaneId: string; isCollapsed: boolean }) => void;

  // Performance & Accessibility
  /** 
   * Threshold for virtualization.
   * @group Performance 
   */
  virtualizationThreshold?: number;
  /** 
   * Accessibility configuration.
   * @group Accessibility 
   */
  ariaConfig?: Record<string, string>;
  /** 
   * Enable keyboard navigation.
   * @group Accessibility 
   */
  keyboardNavigation?: boolean;
}

// ────────────────────────────────────────────────
// Plugin Interface
// ────────────────────────────────────────────────

export interface KanbanPlugin {
  name?: string;

  onBeforeCardRender?: (card: Readonly<KanbanCard>) => KanbanCard | void;
  onAfterCardRender?: (card: KanbanCard, element: HTMLElement) => void;
  onAfterDragEnd?: (card: KanbanCard, target: { columnId: string }) => void;
  onBeforeDragStart?: (card: KanbanCard) => boolean | void;
  onBeforeOptimisticUpdate?: (card: KanbanCard) => Partial<KanbanCard> | void;
  onUpdateRollback?: (originalCard: KanbanCard, error?: Error) => void;
  onWipLimitExceeded?: (columnId: string, currentCount: number, limit: number) => void;

  cleanup?: () => void;
}

// ────────────────────────────────────────────────
// Imperative API (Ref Interface)
// ────────────────────────────────────────────────

export interface EzKanbanRef<TCard = KanbanCard> {
  // Card Operations
  /** 
   * Add a new card.
   * @group Methods 
   */
  addCard(draft: Partial<TCard>): Promise<TCard>;
  /** 
   * Update an existing card.
   * @group Methods 
   */
  updateCard(cardId: string, updates: Partial<TCard>): Promise<unknown>;
  /** 
   * Delete a card by ID.
   * @group Methods 
   */
  deleteCard(cardId: string): Promise<unknown>;
  /** 
   * Move a card to a new column/swimlane.
   * @group Methods 
   */
  moveCard(
    cardId: string,
    targetColumnId: string,
    targetSwimlaneId?: string,
    targetPosition?: number
  ): Promise<unknown>;
  /** 
   * Duplicate a card.
   * @group Methods 
   */
  duplicateCard(cardId: string): Promise<TCard>;
  /** 
   * Archive a card.
   * @group Methods 
   */
  archiveCard(cardId: string): Promise<unknown>;
  /** 
   * Restore an archived card.
   * @group Methods 
   */
  restoreCard(cardId: string): Promise<unknown>;
  /** 
   * Get a card by ID.
   * @group Methods 
   */
  getCard(cardId: string): TCard | undefined;
  /** 
   * Get all cards.
   * @group Methods 
   */
  getCards(): TCard[];
  /** 
   * Get cards in a specific column.
   * @group Methods 
   */
  getCardsInColumn(columnId: string): TCard[];
  /** 
   * Get ordered cards in a column.
   * @group Methods 
   */
  getOrderedCards(columnId: string): TCard[]; // Enterprise

  /** 
   * Add a new column.
   * @group Methods 
   */
  addColumn(column: Partial<KanbanColumn>): Promise<KanbanColumn>;
  /** 
   * Update a column.
   * @group Methods 
   */
  updateColumn(columnId: string, updates: Partial<KanbanColumn>): Promise<unknown>;
  /** 
   * Delete a column.
   * @group Methods 
   */
  deleteColumn(columnId: string): Promise<unknown>;
  /** 
   * Reorder columns.
   * @group Methods 
   */
  reorderColumns(columnIds: string[]): Promise<unknown>;
  /** 
   * Collapse a column.
   * @group Methods 
   */
  collapseColumn(columnId: string): void;
  /** 
   * Expand a column.
   * @group Methods 
   */
  expandColumn(columnId: string): void;
  /** 
   * Get a column by ID.
   * @group Methods 
   */
  getColumn(columnId: string): KanbanColumn | undefined;
  /** 
   * Get all columns.
   * @group Methods 
   */
  getColumns(): KanbanColumn[];

  /** 
   * Add a new swimlane.
   * @group Methods 
   */
  addSwimlane(swimlane: Partial<KanbanSwimlane>): Promise<KanbanSwimlane>;
  /** 
   * Update a swimlane.
   * @group Methods 
   */
  updateSwimlane(swimlaneId: string, updates: Partial<KanbanSwimlane>): Promise<unknown>;
  /** 
   * Delete a swimlane.
   * @group Methods 
   */
  deleteSwimlane(swimlaneId: string): Promise<unknown>;
  /** 
   * Reorder swimlanes.
   * @group Methods 
   */
  reorderSwimlanes(swimlaneIds: string[]): Promise<unknown>;
  /** 
   * Collapse a swimlane.
   * @group Methods 
   */
  collapseSwimlane(swimlaneId: string): void;
  /** 
   * Expand a swimlane.
   * @group Methods 
   */
  expandSwimlane(swimlaneId: string): void;
  /** 
   * Get a swimlane by ID.
   * @group Methods 
   */
  getSwimlane(swimlaneId: string): KanbanSwimlane | undefined;
  /** 
   * Get all swimlanes.
   * @group Methods 
   */
  getSwimlanes(): KanbanSwimlane[];

  /** 
   * Select a card.
   * @group Methods 
   */
  selectCard(cardId: string): void;
  /** 
   * Select multiple cards.
   * @group Methods 
   */
  selectCards(cardIds: string[]): void;
  /** 
   * Deselect a card.
   * @group Methods 
   */
  deselectCard(cardId: string): void;
  /** 
   * Deselect all cards.
   * @group Methods 
   */
  deselectAllCards(): void;
  /** 
   * Get currently selected cards.
   * @group Methods 
   */
  getSelectedCards(): TCard[];

  /** 
   * Focus a card.
   * @group Methods 
   */
  focusCard(cardId: string): void;
  /** 
   * Highlight a card.
   * @group Methods 
   */
  highlightCard(cardId: string, duration?: number): void;

  /** 
   * Set the current view.
   * @group Methods 
   */
  setView(view: 'standard' | 'swimlane' | 'timeline'): void;
  /** 
   * Get the current view.
   * @group Methods 
   */
  getView(): 'standard' | 'swimlane' | 'timeline';
  /** 
   * Scroll to a column.
   * @group Methods 
   */
  scrollToColumn(columnId: string, options?: ScrollIntoViewOptions): void;
  /** 
   * Scroll to a card.
   * @group Methods 
   */
  scrollToCard(cardId: string, options?: ScrollIntoViewOptions): void;

  /** 
   * Set the search query.
   * @group Methods 
   */
  setSearchQuery(query: string): void;
  /** 
   * Get the search query.
   * @group Methods 
   */
  getSearchQuery(): string;
  /** 
   * Set active filters.
   * @group Methods 
   */
  setActiveFilters(filters: FilterConfig): void;
  /** 
   * Get active filters.
   * @group Methods 
   */
  getActiveFilters(): FilterConfig;
  /** 
   * Clear all filters.
   * @group Methods 
   */
  clearFilters(): void;
  /** 
   * Get filtered cards.
   * @group Methods 
   */
  getFilteredCards(): TCard[];

  /** 
   * Get the full board object.
   * @group Methods 
   */
  getBoard(): KanbanBoard;
  /** 
   * Replace the board object.
   * @group Methods 
   */
  setBoard(board: KanbanBoard): void;
  /** 
   * Refresh the board layout.
   * @group Methods 
   */
  refresh(): Promise<void>;
  /** 
   * Reset the board state.
   * @group Methods 
   */
  reset(): void;

  /** 
   * Show the loading spinner.
   * @group Methods 
   */
  showSpinner(): void;
  /** 
   * Hide the loading spinner.
   * @group Methods 
   */
  hideSpinner(): void;
  /** 
   * Force a re-render.
   * @group Methods 
   */
  forceUpdate(): void;
  /** 
   * Get board statistics.
   * @group Methods 
   */
  getStatistics(): { totalCards: number; totalColumns: number };
  /** 
   * Validate the board state.
   * @group Methods 
   */
  validate(): { isValid: boolean; errors: string[] };
}

// ────────────────────────────────────────────────
// Service Interface
// ────────────────────────────────────────────────


/**
 * Service interface for Kanban board data operations.
 * @group Services
 */
export interface IKanbanService extends IService {
  /** Fetches a board by ID. @group Methods */
  getBoard(boardId: string): Promise<KanbanBoard>;
  /** Creates a new board. @group Methods */
  createBoard(board: Partial<KanbanBoard>): Promise<KanbanBoard>;
  /** Updates board metadata. @group Methods */
  updateBoard(boardId: string, updates: Partial<KanbanBoard>): Promise<void>;
  /** Deletes a board. @group Methods */
  deleteBoard(boardId: string): Promise<void>;

  /** Creates a card in a board. @group Methods */
  createCard(boardId: string, card: Partial<KanbanCard>): Promise<KanbanCard>;
  /** Updates an existing card. @group Methods */
  updateCard(cardId: string, updates: Partial<KanbanCard>): Promise<void>;
  /** Deletes a card. @group Methods */
  deleteCard(cardId: string): Promise<void>;
  /** Moves a card across columns/swimlanes. @group Methods */
  moveCard(
    cardId: string,
    targetColumnId: string,
    targetSwimlaneId?: string,
    targetPosition?: number
  ): Promise<void>;

  /** Creates a new column. @group Methods */
  createColumn(boardId: string, column: Partial<KanbanColumn>): Promise<KanbanColumn>;
  /** Updates column settings. @group Methods */
  updateColumn(columnId: string, updates: Partial<KanbanColumn>): Promise<void>;
  /** Deletes a column. @group Methods */
  deleteColumn(columnId: string): Promise<void>;

  /** Creates a new swimlane. @group Methods */
  createSwimlane(boardId: string, swimlane: Partial<KanbanSwimlane>): Promise<KanbanSwimlane>;
  /** Updates swimlane settings. @group Methods */
  updateSwimlane(swimlaneId: string, updates: Partial<KanbanSwimlane>): Promise<void>;
  /** Deletes a swimlane. @group Methods */
  deleteSwimlane(swimlaneId: string): Promise<void>;

  /** Optional method to pre-populate board data. @group Methods */
  initializeWithData?(boards: KanbanBoard[]): void;
  /** Service cleanup logic. @group Methods */
  cleanup(): void;
}
