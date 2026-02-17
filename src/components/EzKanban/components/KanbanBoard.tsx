'use client';

import React from 'react';
import type { KanbanBoard, KanbanCard } from '../EzKanban.types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanSwimlane } from './KanbanSwimlane';
import { KanbanTimelineView } from '../views/KanbanTimelineView';
import { useI18n } from '../../../shared/hooks/useI18n';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Plus } from 'lucide-react';

/**
 * Props for the KanbanBoard component.
 * @group Properties
 */
export interface KanbanBoardProps {
    /** The board data object. @group Data */
    board: KanbanBoard;
    /** Callback when a card is clicked. @group Events */
    onCardClick?: (card: KanbanCard) => void;
    /** Callback when a card is double-clicked. @group Events */
    onCardDoubleClick?: (card: KanbanCard) => void;
    /** Callback when card drag starts. @group Events */
    onCardDragStart?: (card: KanbanCard) => void;

    /** Callback when card drag ends. @group Events */
    onCardDragEnd?: () => void;
    /** Callback when a card is dropped into a column/swimlane. @group Events */
    onCardDrop?: (columnId: string, swimlaneId?: string) => void;
    /** Callback to add a new card to a specific location. @group Events */
    onAddCard?: (columnId: string, swimlaneId?: string) => void;
    /** Callback to toggle column collapse state. @group Events */
    onToggleColumnCollapse?: (columnId: string) => void;
    /** Callback to toggle swimlane collapse state. @group Events */
    onToggleSwimlaneCollapse?: (swimlaneId: string) => void;
    /** Callback to add a new column. @group Events */
    onAddColumn?: () => void;
    /** Callback to delete a column. @group Events */
    onDeleteColumn?: (columnId: string) => void;
    /** Callback to update column settings. @group Events */
    onUpdateColumn?: (columnId: string, updates: any) => void;
    /** Callback when a column header is clicked. @group Events */
    onColumnClick?: (columnId: string) => void;
    /** Callback to create a new card from a draft. @group Events */
    onCreateCard?: (card: Partial<KanbanCard>) => Promise<void> | void;
    /** ID of the currently selected column. @group State */
    selectedColumnId?: string | null;
    /** ID of the card currently being dragged. @group State */
    draggedCardId?: string | null;
    /** ID of the card currently highlighted. @group State */
    highlightedCardId?: string | null;
    /** Optional list of filtered cards to display instead of all board cards. @group Data */
    filteredCards?: KanbanCard[];
    /** Slots for modular composition. @group Extensibility */
    slots?: any;
    /** Props for slots. @group Extensibility */
    slotProps?: any;
    /** Custom class name for the board container. @group Appearance */
    className?: string;
    /** Current view mode of the board. @group State */
    view?: 'standard' | 'swimlane' | 'timeline' | 'analytics';
    /** Text direction. @group Appearance */
    dir?: 'ltr' | 'rtl' | 'auto';
}

/**
 * Renders the main Kanban board surface, supporting standard, swimlane, and timeline views.
 * @group Components
 */
export const KanbanBoardComponent: React.FC<KanbanBoardProps> = ({
    board,
    onCardClick,
    onCardDoubleClick,
    onCardDragStart,
    onCardDragEnd,
    onCardDrop,
    onAddCard,
    onToggleColumnCollapse,
    onToggleSwimlaneCollapse,
    onAddColumn,
    onDeleteColumn,
    onUpdateColumn,
    onColumnClick,
    onCreateCard,
    selectedColumnId,
    draggedCardId,
    filteredCards,
    slots,
    slotProps,
    className,
    view = 'standard',
    dir,
}) => {
    const cards = filteredCards || board.cards;
    const { t } = useI18n();

    if (view === 'timeline') {
        return (
            <KanbanTimelineView
                cards={cards}
                columns={board.columns}
                swimlanes={board.swimlanes}
                onCardUpdate={onCardDrop ? async (card, type) => {
                    // Reuse onCardDrop for moves, or adapt if needed
                    if (type === 'move') {
                        onCardDrop(card.columnId, card.swimlaneId);
                    }
                } : undefined}
                onCardClick={onCardClick}
                onCardCreate={onCreateCard}
                className={className}
                dir={dir}
            />
        );
    }

    if (view === 'swimlane' && board.swimlanes && board.swimlanes.length > 0) {
        return (
            <div className={cn('flex flex-col p-4 overflow-y-auto h-full', className)}>
                {board.swimlanes
                    .sort((a, b) => a.position - b.position)
                    .map((swimlane) => {
                        const swimlaneCards = cards.filter((card) => card.swimlaneId === swimlane.id);
                        return (
                            <KanbanSwimlane
                                key={swimlane.id}
                                swimlane={swimlane}
                                columns={board.columns.sort((a, b) => a.position - b.position)}
                                cards={swimlaneCards}
                                onCardClick={onCardClick}
                                onCardDoubleClick={onCardDoubleClick}
                                onCardDragStart={onCardDragStart}
                                onCardDragEnd={onCardDragEnd}
                                onDrop={onCardDrop}
                                onToggleCollapse={onToggleSwimlaneCollapse}
                                draggedCardId={draggedCardId}
                                customFields={board.customFields}
                                slots={slots}
                                slotProps={slotProps}
                                dir={dir}
                            />
                        );
                    })}
                {/* Uncategorized Cards Swimlane (if any) */}
                {cards.some(c => !c.swimlaneId) && (
                    <KanbanSwimlane
                        swimlane={{
                            id: 'uncategorized',
                            name: t('uncategorized'),
                            type: 'custom',
                            position: 9999,
                            isCollapsed: false
                        }}
                        columns={board.columns.sort((a, b) => a.position - b.position)}
                        cards={cards.filter(c => !c.swimlaneId)}
                        onCardClick={onCardClick}
                        onCardDoubleClick={onCardDoubleClick}
                        onCardDragStart={onCardDragStart}
                        onCardDragEnd={onCardDragEnd}
                        onDrop={onCardDrop}
                        onToggleCollapse={() => { }} // Cannot collapse 'uncategorized' for now
                        draggedCardId={draggedCardId}
                        customFields={board.customFields}
                        slots={slots}
                        slotProps={slotProps}
                        dir={dir}
                    />
                )}
            </div>
        );
    }

    return (
        <div className={cn('flex gap-4 overflow-x-auto p-4', className)}>
            {board.columns
                .sort((a, b) => a.position - b.position)
                .map((column) => {
                    const columnCards = cards.filter((card) => card.columnId === column.id);

                    return (
                        <KanbanColumn
                            key={column.id}
                            column={column}
                            cards={columnCards}
                            onCardClick={onCardClick}
                            onCardDoubleClick={onCardDoubleClick}
                            onCardDragStart={onCardDragStart}
                            onCardDragEnd={onCardDragEnd}
                            onDrop={onCardDrop}
                            onAddCard={onAddCard}
                            onToggleCollapse={onToggleColumnCollapse}
                            onDeleteColumn={onDeleteColumn}
                            onUpdateColumn={onUpdateColumn}
                            onColumnClick={onColumnClick}
                            selectedColumnId={selectedColumnId}
                            draggedCardId={draggedCardId}
                            customFields={board.customFields}
                            slots={slots}
                            slotProps={slotProps}
                            dir={dir}
                        />
                    );
                })}

            {/* Add Column Button */}
            {onAddColumn && (
                <div className="w-80 shrink-0">
                    <Button
                        variant="outline"
                        className="w-full h-12 border-dashed"
                        onClick={onAddColumn}
                    >
                        <Plus className="me-2 h-4 w-4" />
                        {t('add_column') || 'Add Column'}
                    </Button>
                </div>
            )}
        </div>
    );
};

