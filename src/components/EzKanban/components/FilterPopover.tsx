import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Button } from '../../ui/button';
import { Filter } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { ScrollArea } from '../../ui/scroll-area';
import type { KanbanBoard, FilterConfig } from '../EzKanban.types';

interface FilterPopoverProps {
    board: KanbanBoard;
    activeFilters: FilterConfig;
    onFiltersChange: (filters: FilterConfig) => void;
    onClearFilters: () => void;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
    board,
    activeFilters,
    onFiltersChange,
    onClearFilters,
}) => {
    // Extract unique values
    const uniqueTags = Array.from(new Set(board.cards.flatMap(c => c.tags).map(t => JSON.stringify(t)))).map(s => JSON.parse(s));
    // Deduplicate tags by ID
    const tags = uniqueTags.filter((tag, index, self) => index === self.findIndex((t) => t.id === tag.id));

    const uniqueAssignees = Array.from(new Set(board.cards.flatMap(c => c.assignees).map(a => JSON.stringify(a)))).map(s => JSON.parse(s));
    const assignees = uniqueAssignees.filter((a, index, self) => index === self.findIndex((t) => t.id === a.id));

    const priorities = ['low', 'medium', 'high', 'critical'];

    // Handlers
    const togglePriority = (priority: string) => {
        const current = activeFilters.priority || [];
        const updated = current.includes(priority as any)
            ? current.filter(p => p !== priority)
            : [...current, priority as any];
        onFiltersChange({ ...activeFilters, priority: updated.length ? updated : undefined });
    };

    const toggleTag = (tagId: string) => {
        const current = activeFilters.tags || [];
        const updated = current.includes(tagId)
            ? current.filter(t => t !== tagId)
            : [...current, tagId];
        onFiltersChange({ ...activeFilters, tags: updated.length ? updated : undefined });
    };

    const toggleAssignee = (assigneeId: string) => {
        const current = activeFilters.assignees || [];
        const updated = current.includes(assigneeId)
            ? current.filter(a => a !== assigneeId)
            : [...current, assigneeId];
        onFiltersChange({ ...activeFilters, assignees: updated.length ? updated : undefined });
    };

    const activeCount = (activeFilters.priority?.length || 0) + (activeFilters.tags?.length || 0) + (activeFilters.assignees?.length || 0);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeCount > 0 && (
                        <Badge variant="secondary" className="ml-2 h-5 min-w-[20px] px-1 text-[10px] flex items-center justify-center">
                            {activeCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium leading-none">Filters</h4>
                    {activeCount > 0 && (
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground" onClick={onClearFilters}>
                            Clear all
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-6">
                        {/* Priority */}
                        <div className="space-y-3">
                            <h5 className="text-sm font-medium text-muted-foreground">Priority</h5>
                            <div className="space-y-2">
                                {priorities.map(priority => (
                                    <div key={priority} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`priority-${priority}`}
                                            checked={activeFilters.priority?.includes(priority as any)}
                                            onCheckedChange={() => togglePriority(priority)}
                                        />
                                        <Label htmlFor={`priority-${priority}`} className="capitalize text-sm font-normal cursor-pointer">
                                            {priority}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Assignees */}
                        {assignees.length > 0 && (
                            <div className="space-y-3">
                                <h5 className="text-sm font-medium text-muted-foreground">Assignees</h5>
                                <div className="space-y-2">
                                    {assignees.map(assignee => (
                                        <div key={assignee.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`assignee-${assignee.id}`}
                                                checked={activeFilters.assignees?.includes(assignee.id)}
                                                onCheckedChange={() => toggleAssignee(assignee.id)}
                                            />
                                            <Label htmlFor={`assignee-${assignee.id}`} className="text-sm font-normal cursor-pointer flex items-center gap-2">
                                                {assignee.avatarUrl && (
                                                    <img src={assignee.avatarUrl} alt="" className="w-4 h-4 rounded-full" />
                                                )}
                                                {assignee.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="space-y-3">
                                <h5 className="text-sm font-medium text-muted-foreground">Tags</h5>
                                <div className="space-y-2">
                                    {tags.map(tag => (
                                        <div key={tag.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`tag-${tag.id}`}
                                                checked={activeFilters.tags?.includes(tag.id)}
                                                onCheckedChange={() => toggleTag(tag.id)}
                                            />
                                            <Label htmlFor={`tag-${tag.id}`} className="text-sm font-normal cursor-pointer flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                                                {tag.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};
