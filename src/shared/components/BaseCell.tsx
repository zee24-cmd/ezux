import React from 'react';
import { cn } from '../../lib/utils';

export interface BaseCellProps {
    value: any;
    className?: string;
    title?: string;
    children?: React.ReactNode;
    fallback?: React.ReactNode;
    align?: 'left' | 'center' | 'right';
}

/**
 * BaseCell - Shared logic for all table cells
 * Handles null/undefined states, core typography, alignment, and tooltips.
 */
export const BaseCell: React.FC<BaseCellProps> = ({
    value,
    className,
    title,
    children,
    fallback = <span className="text-muted-foreground text-sm italic">—</span>,
    align = 'left'
}) => {
    if (value === null || value === undefined) {
        return <>{fallback}</>;
    }

    return (
        <div
            className={cn(
                "text-sm",
                align === 'center' && "text-center",
                align === 'right' && "text-right",
                className
            )}
            title={title !== undefined ? title : (typeof value === 'string' ? value : String(value))}
        >
            {children || String(value)}
        </div>
    );
};
