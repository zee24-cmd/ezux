'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import type { KanbanColumn as KanbanColumnType, KanbanCard, CustomFieldDefinition } from '../EzKanban.types';
import { KanbanCard as KanbanCardComponent } from './KanbanCard';
import { useKanbanVirtualization } from '../hooks/useKanbanVirtualization';
import { Plus, ChevronDown, ChevronRight, MoreHorizontal, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { useI18n } from '../../../shared/hooks/useI18n';
import { cn } from '../../../lib/utils';

/**
 * Props for the KanbanColumn component.
 * @group Properties
 */
export interface KanbanColumnProps {
    /** The column definition object. @group Data */
    column: KanbanColumnType;
    /** List of cards in this column. @group Data */
    cards: KanbanCard[];
    /** Callback when a card is clicked. @group Events */
    onCardClick?: (card: KanbanCard) => void;
    /** Callback when a card is double-clicked. @group Events */
    onCardDoubleClick?: (card: KanbanCard) => void;
    /** Callback when card drag starts. @group Events */
    onCardDragStart?: (card: KanbanCard) => void;
    /** Callback when card drag ends. @group Events */
    onCardDragEnd?: () => void;
    /** Callback when a card is dropped into this column. @group Events */
    onDrop?: (columnId: string) => void;
    /** Callback to add a new card to this column. @group Events */
    onAddCard?: (columnId: string) => void;
    /** Callback to toggle column collapse state. @group Events */
    onToggleCollapse?: (columnId: string) => void;
    /** Callback to delete this column. @group Events */
    onDeleteColumn?: (columnId: string) => void;
    /** Callback to update column settings. @group Events */
    onUpdateColumn?: (columnId: string, updates: Partial<KanbanColumnType>) => void;
    /** Callback when the column is clicked. @group Events */
    onColumnClick?: (columnId: string) => void;
    /** ID of the currently selected column. @group State */
    selectedColumnId?: string | null;
    /** ID of the card currently being dragged. @group State */
    draggedCardId?: string | null;
    /** ID of the card currently highlighted. @group State */
    highlightedCardId?: string | null;
    /** Custom field definitions for card rendering. @group Data */
    customFields?: CustomFieldDefinition[];
    /** Custom renderers for column elements. @group Extensibility */
    customRenderers?: {
        card?: (card: KanbanCard, defaultContent: React.JSX.Element) => React.JSX.Element;
        cardContent?: (card: KanbanCard) => React.JSX.Element;
        column?: (column: KanbanColumnType) => React.JSX.Element;
    };
    /** Custom class name for the column container. @group Appearance */
    className?: string;
    /** Text direction. @group Appearance */
    dir?: 'ltr' | 'rtl' | 'auto';
}

/**
 * Renders a single Kanban column containing a list of cards.
 * @group Components
 */
export const KanbanColumn: React.FC<KanbanColumnProps> = ({
    column,
    cards,
    onCardClick,
    onCardDoubleClick,
    onCardDragStart,
    onCardDragEnd,
    onDrop, // Restoring onDrop
    onAddCard,
    onToggleCollapse,
    onDeleteColumn,
    onUpdateColumn, // Added
    onColumnClick, // Added
    selectedColumnId, // Added
    draggedCardId,
    highlightedCardId, // Added
    customFields,
    customRenderers,
    className,
    dir,
}) => {
    const isRtl = dir === 'rtl';
    const { t } = useI18n();
    const [isEditingName, setIsEditingName] = React.useState(false);
    const [editedName, setEditedName] = React.useState(column.name);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isEditingName && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditingName]);

    const handleNameSave = () => {
        if (editedName.trim() && editedName !== column.name) {
            onUpdateColumn?.(column.id, { name: editedName });
        } else {
            setEditedName(column.name); // Revert
        }
        setIsEditingName(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNameSave();
        } else if (e.key === 'Escape') {
            setEditedName(column.name);
            setIsEditingName(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        onDrop?.(column.id);
    };

    const isWipLimitExceeded = column.wipLimit && cards.length > column.wipLimit;
    const isWipLimitWarning = column.wipLimit && cards.length === column.wipLimit;

    const defaultColumn = (
        <Card
            className={cn(
                'flex flex-col w-80 shrink-0 transition-colors',
                selectedColumnId === column.id ? 'ring-2 ring-primary border-primary' : '',
                className
            )}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => onColumnClick?.(column.id)} // Select on click
        >
            <CardHeader className="pb-3" onDoubleClick={() => setIsEditingName(true)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => onToggleCollapse?.(column.id)}
                        >
                            {column.isCollapsed ? (
                                isRtl ? <ChevronRight className="h-4 w-4 rotate-180" /> : <ChevronRight className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            {isEditingName ? (
                                <input
                                    ref={inputRef}
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    onBlur={handleNameSave}
                                    onKeyDown={handleKeyDown}
                                    className="h-6 w-full text-sm font-semibold border rounded px-1 bg-background"
                                    onClick={(e) => e.stopPropagation()} // Prevent card click
                                />
                            ) : (
                                <h3 className="font-semibold text-sm truncate" title={column.name}>
                                    {column.name}
                                </h3>
                            )}
                            <span className="text-xs text-muted-foreground">{cards.length} {t('items')}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => onDeleteColumn?.(column.id)}>
                                    <Trash2 className="h-4 w-4 me-2" />
                                    {t('delete_column') || 'Delete Column'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => onAddCard?.(column.id)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* WIP Limit Indicator */}
                {column.wipLimit && (
                    <div className="mt-2">
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    'h-full transition-all',
                                    isWipLimitExceeded
                                        ? 'bg-red-500'
                                        : isWipLimitWarning
                                            ? 'bg-yellow-500'
                                            : 'bg-green-500'
                                )}
                                style={{ width: `${Math.min((cards.length / column.wipLimit) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                )}
            </CardHeader>

            {!column.isCollapsed && (() => {
                const sortedCards = cards.sort((a, b) => a.position - b.position);

                // Use virtualization for large card lists (>50 cards)
                if (sortedCards.length > 50) {
                    const { parentRef, virtualItems, totalSize } = useKanbanVirtualization({
                        cards: sortedCards,
                        estimateSize: 120,
                        overscan: 5,
                    });

                    return (
                        <CardContent
                            ref={parentRef}
                            className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]"
                        >
                            <div style={{ height: `${totalSize}px`, position: 'relative' }}>
                                {virtualItems.map((virtualItem) => {
                                    const card = sortedCards[virtualItem.index];
                                    return (
                                        <div
                                            key={card.id}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                transform: `translateY(${virtualItem.start}px)`,
                                                paddingBottom: '8px',
                                            }}
                                        >
                                            <KanbanCardComponent
                                                card={card}
                                                onClick={onCardClick}
                                                onDoubleClick={onCardDoubleClick}
                                                onDragStart={onCardDragStart}
                                                onDragEnd={onCardDragEnd}
                                                isDragging={draggedCardId === card.id}
                                                isHighlighted={highlightedCardId === card.id}
                                                customFields={customFields}
                                                customRenderers={customRenderers}
                                                dir={dir}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {sortedCards.length === 0 && (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                    {t('no_cards')}
                                </div>
                            )}
                        </CardContent>
                    );
                }

                // Standard rendering for smaller lists
                return (
                    <CardContent className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] space-y-2">
                        {sortedCards.map((card) => (
                            <KanbanCardComponent
                                key={card.id}
                                card={card}
                                onClick={onCardClick}
                                onDoubleClick={onCardDoubleClick}
                                onDragStart={onCardDragStart}
                                onDragEnd={onCardDragEnd}
                                isDragging={draggedCardId === card.id}
                                isHighlighted={highlightedCardId === card.id}
                                customFields={customFields}
                                customRenderers={customRenderers}
                                dir={dir}
                            />
                        ))}

                        {cards.length === 0 && (
                            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                                {t('no_cards')}
                            </div>
                        )}
                    </CardContent>
                );
            })()}
        </Card>
    );

    if (customRenderers?.column) {
        return customRenderers.column(column);
    }

    return defaultColumn;
};
