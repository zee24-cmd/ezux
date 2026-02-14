import { AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/button';

export const EzKanbanErrorFallback = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="flex flex-col items-center gap-4 max-w-md">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-lg font-semibold">Kanban Board Error</h2>
                    <p className="text-sm text-muted-foreground">
                        An error occurred while rendering the Kanban board. Please refresh the page or contact support if the issue persists.
                    </p>
                </div>
                <Button onClick={() => window.location.reload()}>
                    Reload Board
                </Button>
            </div>
        </div>
    );
};
