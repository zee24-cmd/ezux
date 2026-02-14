import { memo } from 'react';
import { X } from 'lucide-react';
import { SchedulerEvent } from '../EzScheduler.types';
import { Button } from '../../ui/button';
import { format } from 'date-fns';

interface EzQuickInfoPopupProps {
    event: SchedulerEvent;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (event: SchedulerEvent) => void;
    onDelete?: (id: string) => void;
    position?: { x: number; y: number };
    // QuickInfo templates
    templates?: {
        header?: (event: SchedulerEvent) => React.ReactNode;
        content?: (event: SchedulerEvent) => React.ReactNode;
        footer?: (event: SchedulerEvent, onEdit: () => void, onDelete: () => void) => React.ReactNode;
    };
}

/**
 * Quick info popup component - displays event summary on hover/click
 */
export const EzQuickInfoPopup = memo(({
    event,
    isOpen,
    onClose,
    onEdit,
    onDelete,
    position = { x: 0, y: 0 },
    templates,
}: EzQuickInfoPopupProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed z-50 bg-card border border-border rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px]"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                {templates?.header ? (
                    templates.header(event)
                ) : (
                    <>
                        <h3 className="font-semibold text-lg text-foreground pr-4 flex-1">
                            {event.title}
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-6 w-6 p-0"
                        >
                            <X className="h-4 h-4" />
                        </Button>
                    </>
                )}
            </div>

            {/* Event Details */}
            {templates?.content ? (
                templates.content(event)
            ) : (
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div>
                        <strong className="text-foreground">Start:</strong>{' '}
                        {format(event.start, 'PPp')}
                    </div>
                    <div>
                        <strong className="text-foreground">End:</strong>{' '}
                        {format(event.end, 'PPp')}
                    </div>
                    {event.description && (
                        <div>
                            <strong className="text-foreground">Description:</strong>
                            <p className="mt-1 text-foreground/80">{event.description}</p>
                        </div>
                    )}
                    {event.allDay && (
                        <div className="text-primary font-medium">All Day Event</div>
                    )}
                </div>
            )}

            {/* Actions */}
            {templates?.footer ? (
                templates.footer(event, () => { onEdit?.(event); onClose(); }, () => { onDelete?.(event.id); onClose(); })
            ) : (
                <div className="flex gap-2">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                            onEdit?.(event);
                            onClose();
                        }}
                        className="flex-1"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            onDelete?.(event.id);
                            onClose();
                        }}
                        className="flex-1"
                    >
                        Delete
                    </Button>
                </div>
            )}
        </div>
    );
});

EzQuickInfoPopup.displayName = 'EzQuickInfoPopup';
