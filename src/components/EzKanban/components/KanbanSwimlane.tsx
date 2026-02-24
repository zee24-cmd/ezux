'use client';

import React from 'react';
import type { KanbanSwimlane as KanbanSwimlaneType, KanbanColumn, KanbanCard, CustomFieldDefinition, KanbanSlotConfig } from '../EzKanban.types';
import { KanbanCard as KanbanCardComponent } from './KanbanCard';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { useI18n } from '../../../shared/hooks/useI18n';
import { cn } from '../../../lib/utils';
import { useDroppable } from '@dnd-kit/core';

const SwimlaneCell = ({
    swimlaneId,
    columnId,
    children,
    className
}: {
    swimlaneId: string;
    columnId: string;
    children: React.ReactNode;
    className?: string;
}) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `swimlane-cell-${swimlaneId}-${columnId}`,
        data: {
            type: 'swimlane-cell',
            swimlaneId,
            columnId
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(className, isOver && "bg-primary/5 transition-colors")}
        >
            {children}
        </div>
    );
};

/**
 * Props for the KanbanSwimlane component.
 * @group Properties
 */
export interface KanbanSwimlaneProps {
    /** The swimlane definition object. @group Data */
    swimlane: KanbanSwimlaneType;
    /** List of columns to display within the swimlane. @group Data */
    columns: KanbanColumn[];
    /** List of cards belonging to this swimlane. @group Data */
    cards: KanbanCard[];
    /** Callback when a card is clicked. @group Events */
    onCardClick?: (card: KanbanCard) => void;
    /** Callback when a card is double-clicked. @group Events */
    onCardDoubleClick?: (card: KanbanCard) => void;
    /** Callback when card drag starts. @group Events */
    onCardDragStart?: (card: KanbanCard) => void;
    /** Callback when card drag ends. @group Events */
    onCardDragEnd?: () => void;
    /** Callback when a card is dropped into a cell. @group Events */
    onDrop?: (columnId: string, swimlaneId: string) => void;
    /** Callback to toggle swimlane collapse state. @group Events */
    onToggleCollapse?: (swimlaneId: string) => void;
    /** ID of the card currently being dragged. @group State */
    draggedCardId?: string | null;
    /** ID of the card currently highlighted. @group State */
    highlightedCardId?: string | null;
    /** Custom field definitions for card rendering. @group Data */
    customFields?: CustomFieldDefinition[];

    /** Custom class name for the swimlane container. @group Appearance */
    className?: string;
    /** Text direction. @group Appearance */
    dir?: 'ltr' | 'rtl' | 'auto';
    /** Slots for modular composition. @group Extensibility */
    slots?: KanbanSlotConfig['slots'];
    /** Props for slots. @group Extensibility */
    slotProps?: KanbanSlotConfig['slotProps'];
}

/**
 * Renders a swimlane grouping, displaying a horizontal row of columns for cards.
 * @group Components
 */
export const KanbanSwimlane: React.FC<KanbanSwimlaneProps> = ({
    swimlane,
    columns,
    cards,
    onCardClick,
    onCardDoubleClick,
    onCardDragStart,
    onCardDragEnd,
    onToggleCollapse,
    draggedCardId,
    highlightedCardId, // Added
    customFields,
    className,
    dir,
    slots,
    slotProps,
}) => {
    const isRtl = dir === 'rtl';
    const { t } = useI18n();
    const CardComponent = slots?.card || KanbanCardComponent;

    return (
        <div className={cn('flex flex-col border rounded-lg bg-card text-card-foreground shadow-sm mb-4', className)}>
            {/* Swimlane Header */}
            <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onToggleCollapse?.(swimlane.id)}
                >
                    {swimlane.isCollapsed ? (
                        isRtl ? <ChevronRight className="h-4 w-4 rotate-180" /> : <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
                <h3 className="font-semibold text-sm">{swimlane.name}</h3>
                <span className="text-xs text-muted-foreground">({cards.length} {t('items')})</span>
            </div>

            {/* Swimlane Content (Grid of Cells) */}
            {!swimlane.isCollapsed && (
                <div className={cn("flex divide-x", isRtl && "divide-x-reverse")}>
                    {columns.map((column) => {
                        const cellCards = cards.filter(c => c.columnId === column.id);

                        return (
                            <SwimlaneCell
                                key={column.id}
                                swimlaneId={swimlane.id}
                                columnId={column.id}
                                className="flex-1 min-w-[280px] p-2 min-h-[100px]"
                            >
                                <div className="space-y-2">
                                    {cellCards.map((card) => (
                                        <CardComponent
                                            key={card.id}
                                            card={card}
                                            onClick={onCardClick}
                                            onDoubleClick={onCardDoubleClick}
                                            onDragStart={onCardDragStart}
                                            onDragEnd={onCardDragEnd}
                                            isDragging={draggedCardId === card.id}
                                            isHighlighted={highlightedCardId === card.id}
                                            customFields={customFields}
                                            dir={dir}
                                            {...(slotProps?.card as Record<string, any>)}
                                        />
                                    ))}
                                </div>
                            </SwimlaneCell>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
