import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GroupingState, Column } from '@tanstack/react-table';
import { cn } from '../../lib/utils';
import { X, Layers, ChevronRight, GripVertical } from 'lucide-react';
import { EzSortableList, horizontalListSortingStrategy } from '../shared/components/EzSortableList';

interface EzGroupingPanelProps {
    grouping: GroupingState;
    onGroupingChange: (grouping: GroupingState) => void;
    columns: Column<any, any>[];
}

interface SortableGroupingChipProps {
    id: string;
    label: string;
    onRemove: () => void;
    showSeparator: boolean;
}

const SortableGroupingChip: React.FC<SortableGroupingChipProps> = ({ id, label, onRemove, showSeparator }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center">
            {showSeparator && (
                <div className="flex items-center text-muted-foreground mr-2">
                    <ChevronRight className="w-4 h-4" />
                </div>
            )}
            <div
                className={cn(
                    "flex items-center gap-1.5 px-2 py-1 bg-card border border-border rounded-md shadow-sm transition-all duration-200",
                    isDragging ? "opacity-50 scale-105 border-primary shadow-lg" : "hover:border-primary/50"
                )}
            >
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-primary transition-colors">
                    <GripVertical className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium text-foreground">
                    {label}
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="p-0.5 hover:bg-muted rounded transition-colors"
                >
                    <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                </button>
            </div>
        </div>
    );
};

export const EzGroupingPanel: React.FC<EzGroupingPanelProps> = ({
    grouping,
    onGroupingChange,
    columns
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'grouping-panel',
    });

    const getColumnHeader = (id: string) => {
        const col = columns.find(c => c.id === id);
        return col?.columnDef.header as string || id;
    };

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex items-center gap-2 p-2 min-h-[40px] border rounded-md transition-all duration-200",
                "bg-muted/40 border-dashed border-border",
                isOver && "bg-highlight border-selection ring-1 ring-selection"
            )}
        >
            <div className="flex items-center gap-2 text-muted-foreground mr-2">
                <Layers className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider">Group By</span>
            </div>

            <div className="flex flex-wrap gap-2">
                {grouping.length === 0 && !isOver && (
                    <span className="text-sm text-muted-foreground/70 italic">Drag columns here to group</span>
                )}

                <EzSortableList
                    items={grouping}
                    onReorder={onGroupingChange}
                    getId={(id) => id}
                    strategy={horizontalListSortingStrategy}
                    className="flex flex-wrap gap-y-2"
                    renderItem={(groupId, index) => (
                        <SortableGroupingChip
                            key={groupId}
                            id={groupId}
                            label={getColumnHeader(groupId)}
                            onRemove={() => onGroupingChange(grouping.filter(g => g !== groupId))}
                            showSeparator={index > 0}
                        />
                    )}
                />

                {isOver && (
                    <div className="px-2 py-1 border border-selection border-dashed bg-highlight/50 rounded-md text-sm text-selection animate-pulse">
                        Drop to Group
                    </div>
                )}
            </div>
        </div>
    );
};
