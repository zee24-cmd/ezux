import './style.css';

// --- STABLE PUBLIC API ---
// The following exports constitute the formal, stable public API surface of ezux.

// --- Core Layout & Shell ---
/** @public @group Core Components */
export { EzLayout } from './components/EzLayout';

// --- Data Grid (EzTable) ---
/** @public @group Core Components */
export { EzTable } from './components/EzTable';
/** @public @group Methods */
export { useEzTable } from './components/EzTable/useEzTable';

// --- Scheduler ---
/** @public @group Core Components */
export { EzScheduler } from './components/EzScheduler';
/** @public @group Methods */
export { useEzScheduler } from './components/EzScheduler/useEzScheduler';

// --- TreeView ---
/** @public @group Core Components */
export { EzTreeView } from './components/EzTreeView';

// --- Kanban ---
/** @public @group Core Components */
export { EzKanban } from './components/EzKanban';
/** @public @group Methods */
export { useEzKanban } from './components/EzKanban/useEzKanban';

// --- Signature ---
/** @public @group Core Components */
export { EzSignature } from './components/EzSignature';

// --- Flow / Workflow ---
/** @public @group Core Components */
export { EzWorkflow, EzFlow } from './components/EzFlow';
/** @group Interfaces */
export type { EzFlowSerializedState, EzWorkflowValidationResult, EzWorkflowRef, EzWorkflowProps, EzFlowProps, EzFlowRef } from './components/EzFlow';

// --- Services ---
// The following services are stable and intended for imperative state management.

/** @public @group Services */
export { SchedulerService } from './components/EzScheduler/services/SchedulerService';

/** @public @group Services */
export { KanbanService } from './components/EzKanban/services/KanbanService';

/** @public @group Services */
export { EzServiceRegistry } from './shared/services/ServiceRegistry';

/** @public @group Services */
export { LayoutService } from './shared/services/LayoutService';

/** @public @group Services */
export { I18nService } from './shared/services/I18nService';

/** @public @group Services */
export { ThemeService } from './shared/services/ThemeService';

/** @public @group Services */
export { NotificationService } from './shared/services/NotificationService';

// --- Context & Providers ---
/** @public @group Core Components */
export { EzProvider, useEzServiceRegistry, useThemeService, useI18nService, useNotificationService } from './shared/contexts/EzProvider';

// --- Interfaces & Types ---

/** @group Interfaces */
export type { EzTableProps, EzTableRef, EzTableBaseRef, EzTableChanges, EzTableValidateFieldParams, ColumnDef, EzColumnMeta, FilterOperator, FilterRule, FilterGroup, EzTableCellProps, EzTableEditorProps, ITableService, TableParams } from './components/EzTable/EzTable.types';

/** @group Interfaces */
export type { EzSchedulerProps, SchedulerEvent, SchedulerAttachment, Resource, ViewType, EzSchedulerRef, ISchedulerService, DragEventArgs, DropEventArgs, ResizeEventArgs, BeforeEventCreateArgs, BeforeEventChangeArgs, BeforeEventDeleteArgs, BeforeEventResizeArgs, BeforeEventDropArgs } from './components/EzScheduler/EzScheduler.types';

/** @group Interfaces */
export type { EzTreeViewProps, TreeNode, EzTreeViewApi, ITreeService } from './components/EzTreeView/EzTreeView.types';

/** @group Interfaces */
export type { EzKanbanProps, KanbanBoard, KanbanColumn, KanbanCard, EzKanbanRef, CardAssignee, KanbanSwimlane, IKanbanService } from './components/EzKanban/EzKanban.types';

/** @group Interfaces */
export type { EzSignatureProps, EzSignatureRef } from './components/EzSignature/EzSignature.types';

/** @group Interfaces */
export type { EzLayoutProps, EzLayoutRef } from './components/EzLayout/EzLayout.types';

/** @group Types */
export * from './shared/types/BaseProps';

// --- Shared Utility Hooks ---
// Selectively exposed reusable hooks.

/** @public @group Methods */
export { useI18n } from './shared/hooks/useI18n';
/** @public @group Methods */
export { useEzTheme } from './shared/hooks/useEzTheme';
/** @public @group Methods */
export { useMediaQuery } from './shared/hooks/useMediaQuery';
/** @public @group Methods */
export { useDebounce } from './shared/hooks/useDebounce';

// --- Utilities ---

/** @public @group Methods */
export { cn } from './lib/utils';
/** @public @group Methods */
export { formatNumber, formatDate, formatCurrency, formatPercent, formatDateTime } from './shared/utils/formatUtils';
/** @public @group Methods */
export { convertToCSV } from './shared/utils/csvUtils';
