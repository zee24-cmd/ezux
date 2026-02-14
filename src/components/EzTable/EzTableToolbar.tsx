import React, { memo, useCallback } from 'react';
import { Download, Undo, Redo, Loader2, Plus, Printer, Columns3, Save, XCircle } from 'lucide-react';
import { globalServiceRegistry } from '../../shared/services/ServiceRegistry';
import { NotificationService } from '../../shared/services/NotificationService';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { EzGlobalFilterState } from './EzTable.types';
import { cn } from '../../lib/utils';

/**
 * Props for the EzTable toolbar component.
 * @group Models
 */
interface EzTableToolbarProps {
    /** Current global filter state. @group State */
    globalFilter: EzGlobalFilterState;
    /** Handler to set the global filter. @group Methods */
    setGlobalFilter: (val: EzGlobalFilterState) => void;
    /** Whether advanced filtering is enabled. @group Properties */
    enableAdvancedFiltering?: boolean;
    /** Whether export functionality is enabled. @group Properties */
    enableExport?: boolean;
    /** Handler for Excel export. @group Events */
    onExportExcel?: () => void;
    /** Handler for CSV export. @group Events */
    onExportCSV?: () => void;
    /** Handler for PDF export. @group Events */
    onExportPDF?: () => void;
    /** Whether change tracking (undo/redo) is enabled. @group Properties */
    enableChangeTracking?: boolean;
    /** Whether undo is available. @group State */
    canUndo: boolean;
    /** Whether redo is available. @group State */
    canRedo: boolean;
    /** Handler for undo. @group Events */
    undo: () => void;
    /** Handler for redo. @group Events */
    redo: () => void;
    /** List of columns for visibility toggle. @group Properties */
    columns: any[];
    /** Whether a filtering operation is pending. @group State */
    isPending?: boolean;
    /** Handler for adding a new record. @group Events */
    onAdd?: () => void;
    /** Handler for saving changes. @group Events */
    onSave?: () => void;
    /** Handler for discarding changes. @group Events */
    onDiscard?: () => void;
    /** Whether editing is enabled. @group Properties */
    enableEditing?: boolean;
    /** Current change counts for badge display. @group State */
    changes?: { added: number; edited: number; deleted: number };
    /** The TanStack Table instance. @group Properties */
    table?: any;
}

/**
 * Renders the toolbar for EzTable, providing search, editing actions, and exports.
 * @group Components
 */
export const EzTableToolbar = memo(({
    globalFilter,
    setGlobalFilter,
    onExportExcel,
    onExportCSV,
    onExportPDF,
    enableChangeTracking,
    canUndo,
    canRedo,
    undo,
    redo,
    isPending,
    onAdd,
    onSave,
    onDiscard,
    enableEditing,
    changes,
    table
}: EzTableToolbarProps) => {
    const handleQuickSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        if (typeof globalFilter === 'object' && globalFilter !== null) {
            setGlobalFilter({ ...globalFilter, quickSearch: val });
        } else {
            setGlobalFilter(val);
        }
    }, [globalFilter, setGlobalFilter]);

    return (
        <div className="flex flex-wrap items-center justify-between gap-y-2">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                {enableEditing && onAdd && (
                    <Button
                        variant="default"
                        size="sm"
                        className="h-8 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={onAdd}
                    >
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        Add New
                    </Button>
                )}

                {enableEditing && (changes?.added || 0) + (changes?.edited || 0) + (changes?.deleted || 0) > 0 && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        <Button
                            variant="default"
                            size="sm"
                            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-bold gap-1.5"
                            onClick={onSave}
                        >
                            <Save className="h-3.5 w-3.5" />
                            Save
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold gap-1.5"
                            onClick={onDiscard}
                        >
                            <XCircle className="h-3.5 w-3.5" />
                            Discard
                        </Button>
                    </div>
                )}

                <div className="relative">
                    <Input
                        placeholder="Filter all columns..."
                        value={(typeof globalFilter === 'string' ? globalFilter : globalFilter?.quickSearch) ?? ''}
                        onChange={handleQuickSearchChange}
                        className={cn(
                            "h-8 min-w-[150px] flex-1 lg:max-w-[250px]",
                            isPending && "opacity-70"
                        )}
                    />
                    {isPending && (
                        <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                </div>

                {enableChangeTracking && (
                    <div className="flex items-center gap-1 ml-2 border-l border-border pl-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={!canUndo}
                            onClick={undo}
                            title="Undo"
                        >
                            <Undo className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={!canRedo}
                            onClick={redo}
                            title="Redo"
                        >
                            <Redo className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {(onExportCSV || onExportExcel || onExportPDF) && (
                <div className="flex justify-end gap-2">
                    {table && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-2">
                                    <Columns3 className="w-4 h-4" /> Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                                {table.getAllLeafColumns()
                                    .filter((column: any) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                                    .map((column: any) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {column.columnDef.header}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.print()}
                        className="h-8 gap-2"
                    >
                        <Printer className="w-4 h-4" /> Print
                    </Button>

                    {onExportCSV && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                onExportCSV?.();
                                globalServiceRegistry.get<NotificationService>('NotificationService')?.add({
                                    type: 'info',
                                    message: 'Preparing CSV export...',
                                    duration: 8000
                                });
                            }}
                            className="h-8 gap-2"
                        >
                            <Download className="w-4 h-4" /> Export CSV
                        </Button>
                    )}

                    {onExportExcel && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                onExportExcel?.();
                                globalServiceRegistry.get<NotificationService>('NotificationService')?.add({
                                    type: 'info',
                                    message: 'Preparing Excel export...',
                                    duration: 8000
                                });
                            }}
                            className="h-8 gap-2"
                        >
                            <Download className="w-4 h-4" /> Export Excel
                        </Button>
                    )}

                    {onExportPDF && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                onExportPDF?.();
                                globalServiceRegistry.get<NotificationService>('NotificationService')?.add({
                                    type: 'info',
                                    message: 'Preparing PDF export...',
                                    duration: 8000
                                });
                            }}
                            className="h-8 gap-2"
                        >
                            <Download className="w-4 h-4" /> Export PDF
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
});

EzTableToolbar.displayName = 'EzTableToolbar';
