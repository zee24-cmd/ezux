import './style.css';

// Advanced and override-oriented exports. Prefer component subpaths for regular app code.

export { EzTablePrimitive, calculateColWidth } from './components/EzTable';
export { EzTableToolbar } from './components/EzTable/EzTableToolbar';
export { EzTableFooter } from './components/EzTable/EzTableFooter';
export * from './components/EzTable/renderers';

export { EzSchedulerToolbar } from './components/EzScheduler/EzSchedulerToolbar';
export { EzEventModal } from './components/EzScheduler/components/EzEventModal';
export { EzSchedulerQuickAdd } from './components/EzScheduler/components/EzSchedulerQuickAdd';
export { EzResourceSidebar } from './components/EzScheduler/components/EzResourceSidebar';

export { CardEditorModal as EzKanbanCardEditor } from './components/EzKanban/components/CardEditorModal';
export { KanbanBoardComponent as EzKanbanBoard } from './components/EzKanban/components/KanbanBoard';
export { KanbanColumn as EzKanbanColumn } from './components/EzKanban/components/KanbanColumn';
export { KanbanCard as EzKanbanCard } from './components/EzKanban/components/KanbanCard';

export { StatusBadge } from './shared/components/StatusBadge';
export { AnimatedText } from './shared/components/AnimatedText';
export type { AnimatedTextProps } from './shared/components/AnimatedText';
export { NotificationPanel } from './shared/components/NotificationPanel';
export { EzNotificationDropdown } from './shared/components/EzNotificationDropdown';

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
export { Combobox, type ComboboxOption } from './components/ui/combobox';
