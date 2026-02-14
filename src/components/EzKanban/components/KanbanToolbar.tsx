'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Search, Plus, Download, Layout, Layers, Undo2, Redo2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { globalServiceRegistry } from '../../../shared/services/ServiceRegistry';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useI18n } from '../../../shared/hooks/useI18n';
import type { FilterConfig, KanbanBoard } from '../EzKanban.types';
import { FilterPopover } from './FilterPopover';

/**
 * Props for the KanbanToolbar component.
 * @group Properties
 */
export interface KanbanToolbarProps {
    /** The current search query string. @group State */
    searchQuery: string;
    /** Callback when the search query changes. @group Events */
    onSearchChange: (query: string) => void;
    /** Callback to open the card creation dialog. @group Events */
    onAddCardClick?: () => void;
    /** Callback to add a new column. @group Events */
    onAddColumn?: () => void;
    /** The current active filter configuration. @group State */
    activeFilters?: FilterConfig;
    /** Callback when filters are modified. @group Events */
    onFiltersChange?: (filters: FilterConfig) => void;
    /** The current board data (for exports). @group Data */
    board?: KanbanBoard;
    /** Custom class name for the toolbar. @group Appearance */
    className?: string;
    /** Current view mode selected in the toolbar. @group State */
    view?: 'standard' | 'swimlane' | 'timeline';
    /** Callback when the view mode is changed. @group Events */
    onViewChange?: (view: 'standard' | 'swimlane' | 'timeline') => void;
    /** Callback to undo the last action. @group Events */
    onUndo?: () => void;
    /** Callback to redo the previously undone action. @group Events */
    onRedo?: () => void;
    /** Whether undo is currently possible. @group State */
    canUndo?: boolean;
    /** Whether redo is currently possible. @group State */
    canRedo?: boolean;
}

/**
 * Renders the toolbar for the Kanban board, providing search, filtering, view switching, and history controls.
 * @group Components
 */
export const KanbanToolbar: React.FC<KanbanToolbarProps> = ({
    searchQuery,
    onSearchChange,
    onAddCardClick,
    onAddColumn,
    board,
    className,
    view = 'standard',
    onViewChange,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    activeFilters,
    onFiltersChange,
}) => {
    // Removed duplicate local state for card editor
    // const [isCardEditorOpen, setIsCardEditorOpen] = useState(false);

    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    const { t } = useI18n();

    // Debounce search to avoid excessive filtering on every keystroke
    const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

    // Sync debounced value to parent
    useEffect(() => {
        onSearchChange(debouncedSearchQuery);
    }, [debouncedSearchQuery, onSearchChange]);

    // Sync external changes to local state
    useEffect(() => {
        setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    // Forward click to parent
    const handleAddCard = () => {
        onAddCardClick?.();
    };

    const handleExport = (format: 'csv' | 'json') => {
        if (!board) return;

        try {
            const exportService = globalServiceRegistry.get<any>('ExportService');

            if (format === 'csv') {
                // Export cards as CSV
                const csvData = board.cards.map(card => ({
                    id: card.id,
                    title: card.title,
                    description: card.description || '',
                    column: board.columns.find(c => c.id === card.columnId)?.name || '',
                    priority: card.priority || '',
                    assignees: card.assignees?.map(a => a.name).join('; ') || '',
                    tags: card.tags?.map(t => t.name).join('; ') || '',
                    dueDate: card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '',
                    isArchived: card.isArchived ? 'Yes' : 'No',
                }));

                if (exportService) {
                    const csv = exportService.toCSV(csvData);
                    exportService.download(csv, `kanban-board-${board.id}.csv`);
                } else {
                    // Fallback: manual CSV generation
                    const headers = Object.keys(csvData[0] || {});
                    const csvContent = [
                        headers.join(','),
                        ...csvData.map(row => headers.map(h => `"${row[h as keyof typeof row]}"`).join(','))
                    ].join('\n');

                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `kanban-board-${board.id}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            } else {
                // Export full board as JSON
                const jsonData = JSON.stringify(board, null, 2);

                if (exportService) {
                    exportService.download(jsonData, `kanban-board-${board.id}.json`);
                } else {
                    // Fallback: manual JSON download
                    const blob = new Blob([jsonData], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `kanban-board-${board.id}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            }

            // Show success notification
            const notificationService = globalServiceRegistry.get<any>('NotificationService');
            if (notificationService) {
                notificationService.add({
                    type: 'success',
                    message: `Board exported as ${format.toUpperCase()}`,
                    duration: 3000,
                });
            }
        } catch (error) {
            const notificationService = globalServiceRegistry.get<any>('NotificationService');
            if (notificationService) {
                notificationService.add({
                    type: 'error',
                    message: `Failed to export board: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    duration: 4000,
                });
            }
        }
    };

    return (
        <>
            <div className={`flex items-center gap-4 p-4 border-b ${className || ''}`}>
                {/* Undo / Redo */}
                <div className="flex gap-1 mr-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onUndo}
                        disabled={!canUndo}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onRedo}
                        disabled={!canRedo}
                        title="Redo (Ctrl+Shift+Z)"
                    >
                        <Redo2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('search_placeholder')}
                        value={localSearchQuery}
                        onChange={(e) => setLocalSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* View Switcher */}
                <div className="w-[180px]">
                    <Select value={view} onValueChange={(v) => onViewChange?.(v as any)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select view" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="standard">
                                <div className="flex items-center">
                                    <Layout className="h-4 w-4 mr-2" />
                                    {t('view_standard')}
                                </div>
                            </SelectItem>
                            <SelectItem value="swimlane">
                                <div className="flex items-center">
                                    <Layers className="h-4 w-4 mr-2" />
                                    {t('view_swimlane')}
                                </div>
                            </SelectItem>
                            <SelectItem value="timeline">
                                <div className="flex items-center">
                                    <Layout className="h-4 w-4 mr-2" /> {/* Reuse layout icon or add Calendar/Clock icon if available */}
                                    {t('view_timeline')}
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Filters */}
                {board && (
                    <FilterPopover
                        board={board}
                        activeFilters={activeFilters || {}}
                        onFiltersChange={(filters) => onFiltersChange?.(filters)}
                        onClearFilters={() => onFiltersChange?.({})}
                    />
                )}

                {/* Export */}
                {board && (
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport('csv')}
                            title="Export as CSV"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            CSV
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport('json')}
                            title="Export as JSON"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            JSON
                        </Button>
                    </div>
                )}

                {/* Actions */}
                <div className="ml-auto flex gap-2">

                    <Button variant="outline" size="sm" onClick={onAddColumn}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('add_column')}
                    </Button>
                    <Button size="sm" onClick={handleAddCard}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('add_card')}
                    </Button>
                </div>
            </div>

            {/* Removed internal CardEditorModal */}
        </>
    );
};
