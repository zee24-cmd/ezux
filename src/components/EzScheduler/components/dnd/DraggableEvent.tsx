import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../../../lib/utils';
import { SchedulerEvent, EzSchedulerComponents } from '../../EzScheduler.types';
import { format, addMinutes } from 'date-fns';
import { EzContextMenu } from '../../../../shared/components/EzContextMenu';
import { X } from 'lucide-react';
import { TooltipWrapper } from '../../../../shared/components/TooltipWrapper';

interface DraggableEventProps {
    event: SchedulerEvent;
    style?: React.CSSProperties;
    components?: EzSchedulerComponents;
    onClick?: (event: SchedulerEvent) => void;
    onDoubleClick?: (event: SchedulerEvent) => void;
    onDelete?: (eventId: string) => void;
    orientation?: 'vertical' | 'horizontal';
    resizable?: boolean;
    className?: string;
    showTime?: boolean;
    isBlocked?: boolean;
    isPast?: boolean;
    isHighlighted?: boolean;
    slotDuration?: number;
    pixelsPerSlot?: number;
}


export const DraggableEvent = ({
    event,
    style,
    onClick,
    onDoubleClick,
    onDelete,
    orientation = 'vertical',
    resizable = false,
    className,
    showTime = true,
    isBlocked = false,
    isPast = false,
    isHighlighted = false,
    slotDuration = 30,
    pixelsPerSlot
}: DraggableEventProps) => {
    const isExplicitBlock = isBlocked || event.isBlock;
    const isRestricted = isExplicitBlock || isPast;

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: event.id,
        data: event,
        disabled: isRestricted
    });

    const currentPixelsPerSlot = pixelsPerSlot || (orientation === 'vertical' ? 64 : 80);

    const { attributes: resizeBottomAttrs, listeners: resizeBottomListeners, setNodeRef: setResizeBottomRef, transform: resizeBottomTransform, isDragging: isResizingBottom } = useDraggable({
        id: `resize-bottom-${event.id}`,
        data: {
            type: 'resize-bottom',
            eventId: event.id,
            orientation,
            pixelsPerSlot: currentPixelsPerSlot
        },
        disabled: !resizable || isRestricted
    });

    const { attributes: resizeTopAttrs, listeners: resizeTopListeners, setNodeRef: setResizeTopRef, transform: resizeTopTransform, isDragging: isResizingTop } = useDraggable({
        id: `resize-top-${event.id}`,
        data: {
            type: 'resize-top',
            eventId: event.id,
            orientation,
            pixelsPerSlot: currentPixelsPerSlot
        },
        disabled: !resizable || isRestricted
    });

    const isResizing = isResizingBottom || isResizingTop;

    // Calculation logic for real-time preview
    const pixelsPerMinute = currentPixelsPerSlot / slotDuration;

    let displayStart = new Date(event.start);
    let displayEnd = new Date(event.end);

    if (isDragging && transform) {
        const dVal = orientation === 'vertical' ? transform.y : transform.x;
        const deltaMinutes = Math.round(dVal / pixelsPerMinute / 15) * 15;
        displayStart = addMinutes(displayStart, deltaMinutes);
        displayEnd = addMinutes(displayEnd, deltaMinutes);
    } else if (isResizingTop && resizeTopTransform) {
        const dVal = orientation === 'vertical' ? resizeTopTransform.y : resizeTopTransform.x;
        const deltaMinutes = Math.round(dVal / pixelsPerMinute / 15) * 15;
        displayStart = addMinutes(displayStart, deltaMinutes);
    } else if (isResizingBottom && resizeBottomTransform) {
        const dVal = orientation === 'vertical' ? resizeBottomTransform.y : resizeBottomTransform.x;
        const deltaMinutes = Math.round(dVal / pixelsPerMinute / 15) * 15;
        displayEnd = addMinutes(displayEnd, deltaMinutes);
    }

    // Extract color from style (set by parent) or event
    const eventColor = style?.borderColor || event.color || 'hsl(var(--primary))';

    const blockedStyle: React.CSSProperties = isExplicitBlock ? {
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)`,
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: 'gray',
        borderLeftWidth: '4px',
        borderColor: '#d1d5db',
        borderStyle: 'solid',
        opacity: 1
    } : {};

    const combinedStyle: React.CSSProperties = {
        ...style,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.6 : (isPast ? 0.7 : 1),
        zIndex: isDragging || isResizing ? 100 : (isRestricted ? 10 : 20),
        touchAction: 'none',
        pointerEvents: (isDragging || isResizing) ? 'none' : 'auto',
        position: 'absolute',
        backgroundColor: `color-mix(in srgb, ${eventColor} 12%, transparent)`,
        color: `color-mix(in srgb, ${eventColor} 90%, black)`,
        borderLeftWidth: '4px',
        borderColor: eventColor,
        ...(isExplicitBlock ? blockedStyle : {}),
        ...(isResizingBottom && orientation === 'vertical' && resizeBottomTransform ? {
            height: `${Math.max((parseInt(style?.height as string) || 0) + resizeBottomTransform.y, 24)}px`
        } : {}),
        ...(isResizingTop && orientation === 'vertical' && resizeTopTransform ? {
            top: `${(parseInt(style?.top as string) || 0) + resizeTopTransform.y}px`,
            height: `${Math.max((parseInt(style?.height as string) || 0) - resizeTopTransform.y, 24)}px`
        } : {}),
        ...(isResizingBottom && orientation === 'horizontal' && resizeBottomTransform ? {
            width: `${Math.max((parseInt(style?.width as string) || 0) + resizeBottomTransform.x, 24)}px`
        } : {}),
        ...(isResizingTop && orientation === 'horizontal' && resizeTopTransform ? {
            left: `${(parseInt(style?.left as string) || 0) + resizeTopTransform.x}px`,
            width: `${Math.max((parseInt(style?.width as string) || 0) - resizeTopTransform.x, 24)}px`
        } : {}),
    };

    const content = (
        <div
            ref={setNodeRef}
            style={combinedStyle}
            {...attributes}
            {...listeners}
            className={cn(
                'absolute rounded-md text-xs border overflow-hidden group select-none flex flex-col',
                'bg-primary/10 border-primary/20 text-foreground shadow-sm hover:shadow-md transition-shadow',
                isDragging && 'opacity-50 z-50 shadow-xl scale-105 cursor-grabbing ring-2 ring-primary ring-offset-2',
                isHighlighted && 'ring-2 ring-primary ring-offset-1 bg-primary/20 shadow-md transition-all duration-300',
                isExplicitBlock && 'bg-muted/50 border-muted opacity-80',
                !isExplicitBlock && "pointer-events-auto",
                isExplicitBlock && "pointer-events-auto select-none grayscale",
                className
            )}
            onClick={(e) => {
                if (!isDragging && !isResizing) {
                    e.stopPropagation();
                    onClick?.(event);
                }
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                onDoubleClick?.(event);
            }}
            role="button"
            aria-label={`Event: ${event.title}`}
        >
            <div className="flex-1 min-h-0 relative px-2 py-1">
                <div className="flex items-start justify-between gap-1">
                    <div className="font-semibold truncate pr-4 leading-tight">
                        {event.title}
                    </div>
                    {!isExplicitBlock && (
                        <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-destructive/10 rounded absolute top-0 right-0 z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(event.id);
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                        </button>
                    )}
                </div>
                {showTime && !isExplicitBlock && (
                    <div className="text-[10px] text-muted-foreground truncate leading-tight">
                        {format(displayStart, 'h:mm a')} - {format(displayEnd, 'h:mm a')}
                    </div>
                )}
                {event.description && (
                    <div className="text-[10px] text-muted-foreground line-clamp-2 leading-tight mt-0.5">
                        {event.description}
                    </div>
                )}
                {isExplicitBlock && (
                    <div className="flex items-center justify-center h-full">
                        <span className="text-xs font-medium text-muted-foreground opacity-70 -rotate-45 select-none">
                            BLOCKED
                        </span>
                    </div>
                )}
            </div>

            {/* Resize Handles */}
            {resizable && !isExplicitBlock && (
                <>
                    {/* Bottom/Right Handle */}
                    <div
                        ref={setResizeBottomRef}
                        {...resizeBottomAttrs}
                        {...resizeBottomListeners}
                        className={cn(
                            "absolute z-20 hover:bg-primary/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100",
                            orientation === 'vertical'
                                ? "bottom-0 left-0 right-0 h-3 cursor-ns-resize"
                                : "right-0 top-0 bottom-0 w-3 cursor-ew-resize"
                        )}
                        style={{ touchAction: 'none' }}
                    >
                        <div className={cn(
                            "bg-primary/40 rounded-full",
                            orientation === 'vertical' ? "w-10 h-1" : "h-10 w-1"
                        )} />
                    </div>

                    {/* Top/Left Handle */}
                    <div
                        ref={setResizeTopRef}
                        {...resizeTopAttrs}
                        {...resizeTopListeners}
                        className={cn(
                            "absolute z-20 hover:bg-primary/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100",
                            orientation === 'vertical'
                                ? "top-0 left-0 right-0 h-3 cursor-ns-resize"
                                : "left-0 top-0 bottom-0 w-3 cursor-ew-resize"
                        )}
                        style={{ touchAction: 'none' }}
                    >
                        <div className={cn(
                            "bg-primary/40 rounded-full",
                            orientation === 'vertical' ? "w-10 h-1 shadow-[0_-1px_0_rgba(0,0,0,0.1)]" : "h-10 w-1 shadow-[-1px_0_0_rgba(0,0,0,0.1)]"
                        )} />
                    </div>
                </>
            )}
        </div>
    );

    return (
        <TooltipWrapper content={event.description} enabled={!!event.description && !isDragging}>
            <EzContextMenu contextId="scheduler-event" data={event}>
                {content}
            </EzContextMenu>
        </TooltipWrapper>
    );
};
