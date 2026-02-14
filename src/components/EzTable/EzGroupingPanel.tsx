import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { GroupingState, Column } from '@tanstack/react-table';
import { cn } from '../../lib/utils';
import { X, Layers, ChevronRight } from 'lucide-react';

interface EzGroupingPanelProps {
    grouping: GroupingState;
    onGroupingChange: (grouping: GroupingState) => void;
    columns: Column<any, any>[];
}

export const EzGroupingPanel: React.FC<EzGroupingPanelProps> = ({
    grouping,
    onGroupingChange,
    columns
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'grouping-panel',
    });

    const removeGroup = (id: string) => {
        onGroupingChange(grouping.filter(g => g !== id));
    };

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
                isOver && "bg-blue-50 dark:bg-blue-900/20 border-blue-400 ring-1 ring-blue-400"
            )}
        >
            <div className="flex items-center gap-2 text-muted-foreground mr-2">
                <Layers className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Group By</span>
            </div>

            <div className="flex flex-wrap gap-2">
                {grouping.length === 0 && !isOver && (
                    <span className="text-sm text-muted-foreground/70 italic">Drag columns here to group</span>
                )}

                {grouping.map((groupId, index) => (
                    <React.Fragment key={groupId}>
                        {index > 0 && (
                            <div className="flex items-center text-muted-foreground">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        )}
                        <div
                            className="flex items-center gap-1.5 px-2 py-1 bg-card border border-border rounded-md shadow-sm animate-in fade-in zoom-in duration-200"
                        >
                            <span className="text-sm font-medium text-foreground">
                                {getColumnHeader(groupId)}
                            </span>
                            <button
                                onClick={() => removeGroup(groupId)}
                                className="p-0.5 hover:bg-muted rounded transition-colors"
                            >
                                <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                            </button>
                        </div>
                    </React.Fragment>
                ))}

                {isOver && (
                    <div className="px-2 py-1 border border-blue-400 border-dashed bg-blue-50/50 dark:bg-blue-900/20 rounded-md text-sm text-blue-500 animate-pulse">
                        Drop to Group
                    </div>
                )}
            </div>
        </div>
    );
};
