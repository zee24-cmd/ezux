import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../../components/ui/tooltip';

interface TooltipWrapperProps {
    children: React.ReactNode;
    content?: React.ReactNode;
    enabled?: boolean;
    delayDuration?: number;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    className?: string; // For TooltipContent custom styling if needed
}

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
    children,
    content,
    enabled = true,
    delayDuration = 300,
    side,
    align,
    className
}) => {
    if (!enabled || !content) return <>{children}</>;

    return (
        <TooltipProvider>
            <Tooltip delayDuration={delayDuration}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align} className={className}>
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
