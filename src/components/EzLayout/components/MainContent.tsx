import React, { memo } from 'react';
import { cn } from '../../../lib/utils';
import { Skeleton } from '../../ui/skeleton';

interface MainContentProps {
    isPending: boolean;
    children: React.ReactNode;
    contentClassName?: string;
}

/**
 * Internal component to wrap the primary content area of the layout.
 * Handles loading overlays and content-specific styling.
 * @group Subcomponents
 */
export const MainContent = memo(({ isPending, children, contentClassName }: MainContentProps) => (
    <main
        aria-label="Main Content"
        className={cn("flex-1 overflow-hidden relative min-w-0 flex flex-col", contentClassName)}
    >
        {isPending ? (
            <div className="flex-1 space-y-4 animate-pulse p-6">
                <Skeleton className="h-8 w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Skeleton className="h-32 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                </div>
                <Skeleton className="h-64 w-full rounded-lg" />
            </div>
        ) : (
            <div className="flex-1 min-h-0 w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
                {children}
            </div>
        )}
    </main>
));

MainContent.displayName = 'MainContent';
