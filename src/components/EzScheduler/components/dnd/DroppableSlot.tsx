import React from 'react';
import { useDroppable, useDndContext } from '@dnd-kit/core';
import { cn } from '../../../../lib/utils';

// ... (props interface)

interface DroppableSlotProps {
    date: Date;
    resourceId?: string;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    onDoubleClick?: () => void;
    onMouseDown?: () => void;
    onMouseEnter?: () => void;
    onContextMenu?: (e: React.MouseEvent) => void;
    data?: any; // Extra data for drop event
    isSelected?: boolean;
    isWorkHour?: boolean;
    width?: number; // pass through style width if needed
}

export const DroppableSlot = ({
    date,
    resourceId,
    children,
    className,
    style,
    onClick,
    onDoubleClick,
    onMouseDown,
    onMouseEnter,
    onContextMenu,
    data,
    isSelected,
    isWorkHour
}: DroppableSlotProps) => {
    const { active } = useDndContext();
    const { setNodeRef, isOver } = useDroppable({
        id: `slot-${date.toISOString()}-${resourceId || 'none'}`,
        data: { date, resourceId, ...(data || {}) }
    });

    const isDragging = !!active;

    return (
        <div
            ref={setNodeRef}
            data-testid="scheduler-slot"
            data-shaded={isWorkHour === false}
            className={cn(
                "relative transition-all duration-200",
                isSelected && "bg-primary/15",
                !isSelected && isWorkHour === false && "bg-background",
                // Highlight valid drop areas when dragging
                isDragging && "before:absolute before:inset-0 before:border before:border-dashed before:border-primary/10 before:pointer-events-none before:z-0",
                isOver && "bg-primary/20 ring-2 ring-primary ring-inset z-10 before:opacity-0",
                className
            )}
            style={style}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onContextMenu={onContextMenu}
        >
            {children}
        </div>
    );
};
