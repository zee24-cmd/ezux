import React, { memo } from 'react';
import { cn } from '../../../lib/utils';

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
export const MainContent = memo(({ children, contentClassName }: Omit<MainContentProps, 'isPending'>) => (
    <main
        aria-label="Main Content"
        className={cn("flex-1 overflow-hidden relative min-w-0 flex flex-col", contentClassName)}
    >
        <div className="flex-1 min-h-0 w-full h-full flex flex-col">
            {children}
        </div>
    </main>
));

MainContent.displayName = 'MainContent';
