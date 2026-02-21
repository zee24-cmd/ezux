import React, { useState, useEffect, useRef } from 'react';
import { SchedulerEvent, Resource } from '../EzScheduler.types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { cn } from '../../../lib/utils';
import { format } from 'date-fns';
import { MoreHorizontal, Calendar, Clock, X, AlertCircle } from 'lucide-react';
import { isBefore } from 'date-fns';

interface EzSchedulerQuickAddProps {
    start: Date;
    end: Date;
    resourceId?: string;
    resources?: Resource[];
    onSave: (event: Partial<SchedulerEvent>) => void;
    onCancel: () => void;
    onMoreOptions: (event: Partial<SchedulerEvent>) => void;
    position: { x: number; y: number };
}

export const EzSchedulerQuickAdd: React.FC<EzSchedulerQuickAddProps> = ({
    start,
    end,
    resourceId,
    resources,
    onSave,
    onCancel,
    onMoreOptions,
    position
}) => {
    const [title, setTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onCancel();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onCancel]);

    const handleSave = () => {
        if (!title.trim()) return;
        onSave({
            title,
            start,
            end,
            resourceId
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') onCancel();
    };

    const resource = resources?.find(r => r.id === resourceId);
    const isPast = isBefore(start, new Date());

    return (
        <div
            ref={containerRef}
            className={cn(
                "fixed z-[100] w-[320px] p-4 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200",
                "bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/10",
                "shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            )}
            style={{
                left: Math.min(position.x, window.innerWidth - 340),
                top: Math.min(position.y, window.innerHeight - 200),
            }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Add</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={onCancel}>
                    <X className="h-3 w-3" />
                </Button>
            </div>

            <Input
                ref={inputRef}
                placeholder="What's the plan?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="mb-4 bg-transparent border-none text-lg font-bold p-0 focus-visible:ring-0 placeholder:text-muted-foreground/50 h-auto"
            />

            <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{format(start, 'EEE, MMM d')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{format(start, 'h:mm a')} - {format(end, 'h:mm a')}</span>
                </div>
                {resource && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: resource.color || 'hsl(var(--primary))' }} />
                        <span>{resource.name}</span>
                    </div>
                )}
                {isPast && (
                    <div className="flex items-center gap-2 text-xs text-warning-foreground font-medium">
                        <AlertCircle className="h-3 w-3" />
                        <span>This event is in the past</span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => onMoreOptions({ title, start, end, resourceId })}
                >
                    <MoreHorizontal className="h-4 w-4" />
                    More
                </Button>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={onCancel} className="h-8">Cancel</Button>
                    <Button size="sm" onClick={handleSave} className="h-8 px-4" disabled={!title.trim()}>Save</Button>
                </div>
            </div>
        </div>
    );
};
