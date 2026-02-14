'use client';

import React, { useMemo, useCallback } from 'react';
import { EzScheduler } from '../../EzScheduler';
import { SchedulerEvent, Resource } from '../../EzScheduler/EzScheduler.types';
import type { KanbanCard, KanbanColumn, KanbanSwimlane } from '../EzKanban.types';
import { addDays, startOfDay } from 'date-fns';

interface KanbanTimelineViewProps {
    cards: KanbanCard[];
    columns: KanbanColumn[];
    swimlanes?: KanbanSwimlane[];
    onCardUpdate?: (card: KanbanCard, changeType: 'move' | 'edit' | 'assign' | 'complete') => Promise<void> | void;
    onCardClick?: (card: KanbanCard) => void;
    onCardCreate?: (card: Partial<KanbanCard>) => Promise<void> | void;
    className?: string;
    /** Text direction. @group Appearance */
    dir?: 'ltr' | 'rtl' | 'auto';
}

// Helper to get color from column or priority
const getCardColor = (card: KanbanCard, cols: KanbanColumn[]): string => {
    const column = cols.find(c => c.id === card.columnId);
    // Priority colors could also be used here
    return column?.color || 'hsl(var(--primary))';
};

export const KanbanTimelineView: React.FC<KanbanTimelineViewProps> = ({
    cards,
    columns,
    swimlanes,
    onCardUpdate,
    onCardClick,
    onCardCreate,
    className,
    dir
}) => {
    // 1. Adapt Swimlanes/Columns to Resources
    const resources = useMemo<Resource[]>(() => {
        let baseResources: Resource[] = [];
        if (swimlanes && swimlanes.length > 0) {
            baseResources = swimlanes
                .sort((a, b) => a.position - b.position)
                .map(swimlane => ({
                    id: swimlane.id,
                    name: swimlane.name,
                    color: swimlane.color
                }));

            // Add uncategorized if there are cards without swimlane
            if (cards.some(c => !c.swimlaneId)) {
                baseResources.push({
                    id: 'uncategorized',
                    name: 'Uncategorized',
                    color: 'hsl(var(--muted-foreground))'
                });
            }
            return baseResources;
        }

        // Fallback: If no swimlanes, treat columns as resources
        return columns
            .sort((a, b) => a.position - b.position)
            .map(col => ({
                id: col.id,
                name: col.name,
                color: col.color
            }));
    }, [swimlanes, columns, cards]);

    // 2. Adapt Cards to SchedulerEvents
    const events = useMemo<SchedulerEvent[]>(() => {
        return cards.map(card => {
            // Determine resourceId based on what we are grouping by
            const resourceId = (swimlanes && swimlanes.length > 0)
                ? (card.swimlaneId || 'uncategorized')
                : (card.columnId || 'uncategorized');

            // Default dates if missing
            const start = card.startDate ? new Date(card.startDate) : (card.dueDate ? startOfDay(new Date(card.dueDate)) : startOfDay(new Date()));
            const end = card.dueDate ? new Date(card.dueDate) : addDays(start, 1);

            const column = columns.find(c => c.id === card.columnId);

            return {
                id: card.id,
                title: card.title,
                start,
                end,
                resourceId: resourceId || 'uncategorized',
                description: card.description,
                color: getCardColor(card, columns),
                status: column?.name,
                // Store original card for easy access
                originalCard: card
            };
        });
    }, [cards, swimlanes, columns]);

    // 3. Handle Event Updates (Bidirectional Sync)
    const handleEventChange = useCallback((updatedEvent: SchedulerEvent) => {
        const originalCard = (updatedEvent as any).originalCard as KanbanCard;
        if (!originalCard) return;

        // Map scheduler changes back to card
        const updatedCard: KanbanCard = {
            ...originalCard,
            startDate: updatedEvent.start,
            dueDate: updatedEvent.end,
            // If we dragged to a different resource (swimlane/column), update that too
            ...(swimlanes && swimlanes.length > 0
                ? { swimlaneId: updatedEvent.resourceId }
                : { columnId: updatedEvent.resourceId || originalCard.columnId || columns[0]?.id || '' }
            )
        };

        onCardUpdate?.(updatedCard, 'move');
    }, [onCardUpdate, swimlanes, columns]);

    const handleEventCreate = useCallback((newEvent: Partial<SchedulerEvent>) => {
        // Determine placement based on grouping
        const isGroupedBySwimlane = swimlanes && swimlanes.length > 0;

        const cardDraft: Partial<KanbanCard> = {
            title: newEvent.title || 'New Card',
            startDate: newEvent.start,
            dueDate: newEvent.end,
            columnId: !isGroupedBySwimlane && newEvent.resourceId ? newEvent.resourceId : (columns[0]?.id || ''),
            swimlaneId: isGroupedBySwimlane && newEvent.resourceId ? newEvent.resourceId : undefined,
            description: newEvent.description || '',
            priority: 'medium'
        };

        onCardCreate?.(cardDraft);
    }, [swimlanes, columns, onCardCreate]);

    const handleEventClick = useCallback((event: SchedulerEvent) => {
        const originalCard = (event as any).originalCard as KanbanCard;
        if (originalCard) {
            onCardClick?.(originalCard);
        }
    }, [onCardClick]);

    return (
        <div className={className} style={{ height: '100%', minHeight: '600px' }}>
            <EzScheduler
                events={events}
                resources={resources}
                selectedDate={new Date()}
                view="TimelineMonth"
                views={['TimelineWeek', 'TimelineMonth']}
                onEventChange={handleEventChange}
                onEventCreate={handleEventCreate}
                onEventClick={handleEventClick}
                // Hide header bar if we want a pure embedded view, or keep it for navigation
                showHeaderBar={true}
                showResourceHeaders={true}
                dir={dir}
            />
        </div>
    );
};
