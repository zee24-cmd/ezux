'use client';

import React, { memo } from 'react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import type { KanbanCard as KanbanCardType, CustomFieldDefinition, KanbanSlotConfig } from '../EzKanban.types';
import { Calendar, Paperclip, MessageSquare, CheckSquare, Clock, List } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../../lib/utils';
import { TooltipWrapper } from '../../../shared/components/TooltipWrapper';
import { dateUtils } from '../../../shared/utils/dateUtils';

/** @internal */
export interface CardSlotProps extends Record<string, unknown> {
    card: KanbanCardType;
    defaultContent: React.ReactNode;
}

/** @internal */
export interface CardContentSlotProps extends Record<string, unknown> {
    card: KanbanCardType;
}

/**
 * Props for the KanbanCard component.
 * @group Properties
 */
export interface KanbanCardProps {
    /** The card data object. @group Data */
    card: KanbanCardType;
    /** Callback when the card is clicked. @group Events */
    onClick?: (card: KanbanCardType) => void;
    /** Callback when the card is double-clicked. @group Events */
    onDoubleClick?: (card: KanbanCardType) => void;
    /** Callback when card drag starts. @group Events */
    onDragStart?: (card: KanbanCardType) => void;
    /** Callback when card drag ends. @group Events */
    onDragEnd?: () => void;
    /** Whether the card is currently being dragged. @group State */
    isDragging?: boolean;
    /** Whether the card is currently highlighted. @group State */
    isHighlighted?: boolean;
    /** Whether to enable tooltips for the card. @group Appearance */
    enableTooltip?: boolean;
    /** Custom template for the card tooltip. @group Extensibility */
    tooltipTemplate?: (data: KanbanCardType) => React.ReactNode;
    /** Custom field definitions for rendering values. @group Data */
    customFields?: CustomFieldDefinition[];
    /** Slots for modular composition. @group Extensibility */
    slots?: KanbanSlotConfig['slots'];
    /** Props for slots. @group Extensibility */
    slotProps?: KanbanSlotConfig['slotProps'];
    /** Custom class name for the card container. @group Appearance */
    className?: string;
    /** Text direction. @group Appearance */
    dir?: 'ltr' | 'rtl' | 'auto';
}

/**
 * Renders an individual Kanban card with support for cover images, metadata, and custom fields.
 * @group Components
 */
const KanbanCardComponent: React.FC<KanbanCardProps> = ({
    card,
    onClick,
    onDoubleClick,
    isDragging: externalIsDragging,
    isHighlighted,
    enableTooltip,
    tooltipTemplate,
    customFields,
    slots,
    slotProps,
    className,
    dir,
}) => {
    const isRtl = dir === 'rtl';
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging
    } = useSortable({
        id: card.id,
        data: { type: 'card', card }
    });

    const isDragging = externalIsDragging || isSortableDragging;

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    // Map priority to status for StatusBadge
    const priorityToStatus: Record<string, string> = {
        low: 'Pending',
        medium: 'In Progress',
        high: 'Active',
        critical: 'Inactive', // Using red color for critical
    };

    const totalChecklistItems = card.checklists?.reduce((acc, cl) => acc + cl.items.length, 0) || 0;
    const completedChecklistItems = card.checklists?.reduce((acc, cl) => acc + cl.items.filter(i => i.isChecked).length, 0) || 0;

    const totalSubtasks = card.subtasks?.length || 0;
    const completedSubtasks = card.subtasks?.filter(s => s.isCompleted).length || 0;

    const defaultContent = (
        <div className="p-0 space-y-2">
            {/* Cover Image */}
            {card.coverImage && (
                <div className="h-32 w-full overflow-hidden rounded-t-lg">
                    <img src={card.coverImage} alt="Cover" className="w-full h-full object-cover" />
                </div>
            )}

            <div className={cn("p-3 space-y-2", card.coverImage ? "pt-1" : "")}>
                {/* Title and Priority */}
                <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm line-clamp-2 flex-1">{card.title}</h4>
                    {card.priority && (
                        <StatusBadge
                            status={priorityToStatus[card.priority] || 'Pending'}
                            className="shrink-0"
                        />
                    )}
                </div>

                {/* Description */}
                {card.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {card.description}
                    </p>
                )}

                {/* Tags */}
                {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {card.tags.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant="secondary"
                                className="text-xs px-2 py-0"
                                style={{
                                    backgroundColor: tag.color,
                                    color: '#fff',
                                }}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Metadata Badges */}
                {(totalChecklistItems > 0 || (card.attachments && card.attachments.length > 0) || (card.comments && card.comments.length > 0) || totalSubtasks > 0 || card.timeTracking) && (
                    <div className="flex items-center gap-3 text-muted-foreground pt-1 flex-wrap">
                        {/* Attachments */}
                        {card.attachments && card.attachments.length > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                                <Paperclip className="w-3 h-3" />
                                <span>{card.attachments.length}</span>
                            </div>
                        )}
                        {/* Comments */}
                        {card.comments && card.comments.length > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                                <MessageSquare className="w-3 h-3" />
                                <span>{card.comments.length}</span>
                            </div>
                        )}
                        {/* Checklists */}
                        {totalChecklistItems > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                                <CheckSquare className="w-3 h-3" />
                                <span>{completedChecklistItems}/{totalChecklistItems}</span>
                            </div>
                        )}
                        {/* Subtasks */}
                        {totalSubtasks > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                                <List className="w-3 h-3" />
                                <span>{completedSubtasks}/{totalSubtasks}</span>
                            </div>
                        )}
                        {/* Time Tracking */}
                        {card.timeTracking && (card.timeTracking.estimated > 0 || card.timeTracking.actual > 0) && (
                            <div className="flex items-center gap-1 text-xs" title={`Estimated: ${card.timeTracking.estimated}h, Actual: ${card.timeTracking.actual}h`}>
                                <Clock className="w-3 h-3" />
                                <span>{card.timeTracking.actual}h / {card.timeTracking.estimated}h</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer: Assignees and Due Date */}
                <div className="flex items-center justify-between pt-1">
                    {/* Assignees */}
                    {card.assignees && card.assignees.length > 0 && (
                        <div className="flex -space-x-2">
                            {card.assignees.slice(0, 3).map((assignee) => (
                                <Avatar key={assignee.id} className="w-6 h-6 border-2 border-background">
                                    {assignee.avatarUrl ? (
                                        <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                                    ) : (
                                        <AvatarFallback className="text-xs">
                                            {assignee.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            ))}
                            {card.assignees.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                    <span className="text-xs">+{card.assignees.length - 3}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Due Date */}
                    {card.dueDate && (
                        <div className={cn("flex items-center gap-1 text-xs text-muted-foreground", isRtl ? "mr-auto" : "ml-auto")}>
                            <Calendar className="w-3 h-3" />
                            <span>{dateUtils.formatDate(card.dueDate)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Fields Display */}
            {customFields && customFields.length > 0 && card.customFieldValues && (
                <div className="px-3 pb-3 gap-1 flex flex-wrap">
                    {customFields.map(field => {
                        const value = card.customFieldValues?.[field.id];
                        if (value === undefined || value === null || value === '') return null;

                        return (
                            <div key={field.id} className="text-xs bg-muted px-1.5 py-0.5 rounded flex items-center gap-1 max-w-full truncate">
                                <span className="text-muted-foreground opacity-70">{field.name}:</span>
                                <span className="font-medium truncate">
                                    {field.type === 'date' ? dateUtils.formatDate(value as string | number | Date) : String(value)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    const CardContentSlot = slots?.cardContent;
    const cardContent = CardContentSlot ? <CardContentSlot card={card} {...(slotProps?.cardContent as Record<string, unknown>)} /> : defaultContent;

    const standardCard = (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick?.(card)}
            onDoubleClick={() => onDoubleClick?.(card)}
            id={card.id}
            data-card-id={card.id}
            className={cn(
                'cursor-pointer transition-all hover:shadow-md overflow-hidden',
                isDragging && 'opacity-50 ring-2 ring-primary/50',
                isHighlighted && 'ring-2 ring-primary bg-primary/5 transition-colors duration-300', // Highlight style
                className
            )}
        >
            {cardContent}
        </Card>
    );

    const CardSlot = slots?.card;
    if (CardSlot) {
        return <CardSlot card={card} defaultContent={standardCard} {...(slotProps?.card as Record<string, unknown>)} />;
    }

    return (
        <TooltipWrapper enabled={enableTooltip} content={tooltipTemplate ? tooltipTemplate(card) : null}>
            {standardCard}
        </TooltipWrapper>
    );
};




// Memoize component to prevent unnecessary re-renders
KanbanCardComponent.displayName = 'KanbanCard';
export const KanbanCard = memo(KanbanCardComponent);
