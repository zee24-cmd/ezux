import React, { useState } from 'react';
import type { KanbanBoard, KanbanCard, KanbanColumn as KanbanColumnType, KanbanSlotConfig } from '../EzKanban.types';
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverEvent, DragOverlay } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
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
    onCardDrop?: (columnId: string, swimlaneId?: string, targetPosition?: number) => void;
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
    onUpdateColumn?: (columnId: string, updates: Partial<KanbanColumnType>) => void;
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
    slots?: KanbanSlotConfig['slots'];
    /** Props for slots. @group Extensibility */
    slotProps?: KanbanSlotConfig['slotProps'];
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

    // Track which card is being dragged (for DragOverlay)
    const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);
    // Track which column is being hovered over
    const [overColumnId, setOverColumnId] = useState<string | null>(null);

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

    // Set up sensors for DnD - 5px activation distance prevents accidental drags on click
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 }
        })
    );

    const handleDndDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.type === 'card') {
            setActiveCard(active.data.current.card);
            onCardDragStart?.(active.data.current.card);
        }
    };

    const handleDndDragOver = (event: DragOverEvent) => {
        const { over } = event;
        if (!over) {
            setOverColumnId(null);
            return;
        }
        if (over.data.current?.type === 'column') {
            setOverColumnId(over.data.current.column.id);
        } else if (over.data.current?.type === 'card') {
            setOverColumnId(over.data.current.card.columnId);
        } else {
            setOverColumnId(null);
        }
    };

    const handleDndDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveCard(null);
        setOverColumnId(null);

        if (!over) {
            // Dropped outside any droppable — cancel
            onCardDragEnd?.();
            return;
        }

        if (active.data.current?.type === 'card') {
            // Determine target column and position based on what was dropped on
            let targetColumnId: string | undefined;
            let targetPosition: number | undefined;

            if (over.data.current?.type === 'column') {
                // Dropped directly on a column header/body — append at end
                targetColumnId = over.data.current.column.id;
                targetPosition = undefined; // will default to append in moveCard
            } else if (over.data.current?.type === 'card') {
                // Dropped on another card — insert at that card's position
                const overCard: KanbanCard = over.data.current.card;
                targetColumnId = overCard.columnId;
                // Find the position of the over card in its sorted column
                const columnCards = board.cards
                    .filter(c => c.columnId === targetColumnId)
                    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
                const overIndex = columnCards.findIndex(c => c.id === overCard.id);
                targetPosition = overIndex >= 0 ? overIndex : undefined;
            }

            if (targetColumnId) {
                onCardDrop?.(targetColumnId, undefined, targetPosition);
            } else {
                onCardDragEnd?.();
            }
        } else if (active.data.current?.type === 'column' && over.data.current?.type === 'column') {
            // Column reordering — no-op here, handled by parent if needed
            onCardDragEnd?.();
        } else {
            onCardDragEnd?.();
        }
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDndDragStart}
            onDragOver={handleDndDragOver}
            onDragEnd={handleDndDragEnd}
        >
            <div className={cn('flex gap-4 overflow-x-auto p-4', className)}>
                <SortableContext
                    items={board.columns.map(col => col.id)}
                    strategy={horizontalListSortingStrategy}
                >
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
                                    isDropTarget={overColumnId === column.id}
                                    customFields={board.customFields}
                                    slots={slots}
                                    slotProps={slotProps}
                                    dir={dir}
                                />
                            );
                        })}
                </SortableContext>

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
            {/* Floating drag overlay — shows ghost of card being dragged */}
            <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
                {activeCard ? (
                    <div className="rotate-2 opacity-90 shadow-2xl ring-2 ring-primary/60 rounded-lg pointer-events-none w-72">
                        <div className="bg-card border border-border rounded-lg p-3 space-y-1">
                            <p className="font-medium text-sm">{activeCard.title}</p>
                            {activeCard.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">{activeCard.description}</p>
                            )}
                        </div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

