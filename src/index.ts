import './style.css';

// --- STABLE PUBLIC API ---
// The following exports constitute the formal, stable public API surface of ezux.

// --- Core Layout & Shell ---
/** @public @group Core Components */
export * from './components/EzLayout';

// --- Data Grid (EzTable) ---
/** @public @group Core Components */
export { EzTable, EzTablePrimitive, calculateColWidth } from './components/EzTable';
/** @public @group Methods */
export { useEzTable } from './components/EzTable/useEzTable';
/** @internal @group Core Components */
export { EzTableToolbar } from './components/EzTable/EzTableToolbar';
/** @internal @group Core Components */
export { EzTableFooter } from './components/EzTable/EzTableFooter';

// --- Scheduler ---
/** @public @group Core Components */
export { EzScheduler } from './components/EzScheduler';
/** @public @group Methods */
export { useEzScheduler } from './components/EzScheduler/useEzScheduler';
/** @internal @group Core Components */
export { EzSchedulerToolbar } from './components/EzScheduler/EzSchedulerToolbar';
/** @internal @group Core Components */
export { EzEventModal } from './components/EzScheduler/components/EzEventModal';
/** @internal @group Core Components */
export { EzSchedulerQuickAdd } from './components/EzScheduler/components/EzSchedulerQuickAdd';
/** @internal @group Core Components */
export { EzResourceSidebar } from './components/EzScheduler/components/EzResourceSidebar';

// --- TreeView ---
/** @public @group Core Components */
export { EzTreeView } from './components/EzTreeView';

// --- Kanban ---
/** @public @group Core Components */
export { EzKanban } from './components/EzKanban';
/** @public @group Methods */
export { useEzKanban } from './components/EzKanban/useEzKanban';
/** @internal @group Core Components */
export { CardEditorModal as EzKanbanCardEditor } from './components/EzKanban/components/CardEditorModal';
export { KanbanBoardComponent as EzKanbanBoard } from './components/EzKanban/components/KanbanBoard';
export { KanbanColumn as EzKanbanColumn } from './components/EzKanban/components/KanbanColumn';
export { KanbanCard as EzKanbanCard } from './components/EzKanban/components/KanbanCard';

/** @public @group Core Components */
export { EzSignature } from './components/EzSignature';

// --- Services ---
// The following services are stable and intended for imperative state management.

/** @public @group Services */
export { TableService } from './components/EzTable/services/TableService';

/** @public @group Services */
export { SchedulerService } from './components/EzScheduler/services/SchedulerService';

/** @public @group Services */
export { TreeService } from './components/EzTreeView/services/TreeService';

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
export type { EzTableProps, EzTableRef, ColumnDef, EzColumnMeta, FilterOperator, FilterRule, FilterGroup, EzTableCellProps, EzTableEditorProps, ITableService, TableParams } from './components/EzTable/EzTable.types';

/** @group Interfaces */
export type { EzSchedulerProps, SchedulerEvent, Resource, ViewType, EzSchedulerRef, ISchedulerService } from './components/EzScheduler/EzScheduler.types';

/** @group Interfaces */
export type { EzTreeViewProps, TreeNode, EzTreeViewApi, ITreeService } from './components/EzTreeView/EzTreeView.types';

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
/** @public @group Methods */
export { useDialogState } from './shared/hooks/useDialogState';
/** @public @group Methods */
export { useRowSelectionEvents } from './shared/hooks/useRowSelectionEvents';

// --- Utilities ---

/** @public @group Methods */
export { cn } from './lib/utils';
/** @public @group Methods */
export { formatNumber, formatDate, formatCurrency, formatPercent, formatDateTime } from './shared/utils/formatUtils';
/** @public @group Methods */
export { convertToCSV } from './shared/utils/csvUtils';

// --- INTERNAL & ADVANCED API ---
// These components are primarily implementations details, but exported for advanced sub-component overrides.


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
export { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar';
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from './components/ui/breadcrumb';
export { Button, buttonVariants } from './components/ui/button';
export { Calendar } from './components/ui/calendar';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './components/ui/card';
export { Checkbox } from './components/ui/checkbox';
export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator } from './components/ui/command';
export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup } from './components/ui/context-menu';
export { DateTimePicker } from './components/ui/date-time-picker';
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup } from './components/ui/dropdown-menu';
export { Input } from './components/ui/input';
export { Label } from './components/ui/label';
export { PasswordInput } from './components/ui/password-input';
export { Popover, PopoverTrigger, PopoverContent } from './components/ui/popover';
export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from './components/ui/select';
export { Skeleton } from './components/ui/skeleton';
export { Switch } from './components/ui/switch';
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './components/ui/table';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
export { Textarea } from './components/ui/textarea';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/ui/tooltip';
export { ScrollArea, ScrollBar } from './components/ui/scroll-area';
export { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
export { Badge, badgeVariants } from './components/ui/badge';
export { Progress } from './components/ui/progress';
export { Modal } from './components/ui/modal';
