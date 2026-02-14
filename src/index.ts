// --- Core Components ---

/** @group Core Components */
export * from './components/EzLayout';

/** @group Core Components */
export { EzTable } from './components/EzTable';

/** @group Core Components */
export { EzScheduler } from './components/EzScheduler';

/** @group Core Components */
export { EzTreeView } from './components/EzTreeView';

/** @group Core Components */
export { EzKanban } from './components/EzKanban';

/** @group Core Components */
export { EzSignature } from './components/EzSignature';

/** @group Core Components */
export { SignInForm } from './components/EzLayout/Authentication/SignInForm';

// --- Services ---

/** @group Services */
export { TableService } from './components/EzTable/services/TableService';

/** @group Services */
export { SchedulerService } from './components/EzScheduler/services/SchedulerService';

/** @group Services */
export { TreeService } from './components/EzTreeView/services/TreeService';

/** @group Services */
export { KanbanService } from './components/EzKanban/services/KanbanService';

/** @group Services */
export { EzServiceRegistry, globalServiceRegistry } from './shared/services/ServiceRegistry';

/** @group Services */
export { LayoutService } from './shared/services/LayoutService';

/** @group Services */
export { I18nService } from './shared/services/I18nService';

/** @group Services */
export { ThemeService } from './shared/services/ThemeService';

/** @group Services */
export { NotificationService } from './shared/services/NotificationService';

// --- Interfaces & Types ---

/** @group Interfaces */
export type { EzTableProps, EzTableRef, ColumnDef, EzColumnMeta, FilterOperator, FilterRule, FilterGroup, EzTableCellProps, EzTableEditorProps, ITableService, TableParams } from './components/EzTable/EzTable.types';

/** @group Interfaces */
export type { EzSchedulerProps, SchedulerEvent, Resource, EzSchedulerComponents, EzSchedulerRef, ISchedulerService } from './components/EzScheduler/EzScheduler.types';

/** @group Interfaces */
export type { EzTreeViewProps, TreeNode, EzTreeViewComponents, EzTreeViewApi, ITreeService } from './components/EzTreeView/EzTreeView.types';

/** @group Interfaces */
export type { EzKanbanProps, KanbanBoard, KanbanColumn, KanbanCard, EzKanbanRef, CardAssignee, KanbanSwimlane, IKanbanService } from './components/EzKanban/EzKanban.types';

/** @group Interfaces */
export type { EzSignatureProps, EzSignatureRef } from './components/EzSignature/EzSignature.types';

/** @group Interfaces */
export type { EzLayoutProps, EzLayoutRef } from './components/EzLayout/EzLayout.types';

/** @group Interfaces */
export type { AnimatedTextProps } from './shared/components/AnimatedText';

/** @group Types */
export * from './shared/types/BaseProps';

// --- Utils & Hooks ---

/** @group Methods */
export { useI18n } from './shared/hooks/useI18n';

/** @group Methods */
export { cn } from './lib/utils';

/** @group Methods */
export { formatNumber, formatDate, formatCurrency, formatPercent, formatDateTime } from './shared/utils/formatUtils';

/** @group Methods */
export { convertToCSV } from './shared/utils/csvUtils';

/** @group Core Components */
export { EzResourceSidebar } from './components/EzScheduler/components/EzResourceSidebar';

/** @group Core Components */
export { StatusBadge } from './shared/components/StatusBadge';

/** @group Core Components */
export { AnimatedText } from './shared/components/AnimatedText';

/** @group Core Components */
export { NotificationPanel } from './shared/components/NotificationPanel';

/** @group Core Components */
export { EzNotificationDropdown } from './shared/components/EzNotificationDropdown';

/** @group Core Components */
export * from './components/EzTable/renderers';

/** @group UI Components */
export * from './components/ui';
