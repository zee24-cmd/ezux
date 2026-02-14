import { memo } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { SchedulerEvent } from '../EzScheduler.types';
import { Button } from '../../ui/button';
import { format } from 'date-fns';

interface EzOverlapAlertProps {
    isOpen: boolean;
    onClose: () => void;
    conflicts: SchedulerEvent[];
    onResolve?: (action: 'keep-both' | 'cancel') => void;
}

/**
 * Overlap alert dialog - warns when events overlap and allowOverlap is false
 */
export const EzOverlapAlert = memo(({
    isOpen,
    onClose,
    conflicts,
    onResolve,
}: EzOverlapAlertProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card border border-border rounded-lg shadow-lg p-6 max-w-[500px] w-full mx-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <h2 className="text-lg font-semibold">Event Overlap Detected</h2>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                    The event you're trying to create or move overlaps with existing events.
                </p>

                {/* Conflicting Events List */}
                <div className="mb-6 space-y-2">
                    <p className="text-sm font-medium">Conflicting events:</p>
                    <div className="max-h-[200px] overflow-y-auto space-y-2">
                        {conflicts.map((event) => (
                            <div
                                key={event.id}
                                className="p-3 rounded-md border border-border bg-muted/50"
                            >
                                <div className="font-medium text-sm">{event.title}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {format(event.start, 'PPp')} - {format(event.end, 'PPp')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-2 justify-end">
                    <Button
                        variant="outline"
                        onClick={() => {
                            onResolve?.('cancel');
                            onClose();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onResolve?.('keep-both');
                            onClose();
                        }}
                    >
                        Allow Overlap
                    </Button>
                </div>
            </div>
        </div>
    );
});

EzOverlapAlert.displayName = 'EzOverlapAlert';


EzOverlapAlert.displayName = 'EzOverlapAlert';
