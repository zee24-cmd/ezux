import React from 'react';
import { cn } from '../../../lib/utils';

export interface EzSidebarNavProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Container for sidebar navigation items.
 * Groups and spaces EzSidebarNavItem components.
 */
export const EzSidebarNav: React.FC<EzSidebarNavProps> = ({ children, className }) => {
    return (
        <nav className={cn("flex flex-col gap-1 p-2", className)}>
            {children}
        </nav>
    );
};
