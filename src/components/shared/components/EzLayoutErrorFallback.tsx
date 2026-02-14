import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const EzLayoutErrorFallback: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="flex flex-col items-center gap-4 max-w-md w-full">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
                <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="text-lg font-semibold">Layout Error</h2>
                <p className="text-sm text-muted-foreground">
                    Something went wrong with the layout. Please refresh the page.
                </p>
            </div>
            <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
            >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
            </button>
        </div>
    </div>
);