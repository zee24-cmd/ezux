import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import {
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../../ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../../ui/tooltip';

export interface EzSidebarNavItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    collapsed?: boolean;
    children?: React.ReactNode;
    onClick?: (e?: React.MouseEvent) => void;
    className?: string;
}

export const EzSidebarNavItem: React.FC<EzSidebarNavItemProps> = ({
    icon: Icon,
    label,
    active,
    collapsed,
    children,
    onClick,
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = React.Children.count(children) > 0;

    const content = (
        <button
            onClick={() => {
                if (hasChildren && !collapsed) {
                    setIsOpen(!isOpen);
                }
                onClick?.();
            }}
            className={cn(
                "flex items-center w-full px-3 py-2 text-sm font-medium transition-colors rounded-md group relative",
                active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed ? "justify-center px-2" : "gap-3",
                className
            )}
        >
            <Icon className={cn("h-5 w-5 shrink-0", active ? "text-primary" : "group-hover:text-foreground")} />
            {!collapsed && <span className="truncate">{label}</span>}
            {!collapsed && hasChildren && (
                <div className="ml-auto">
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
            )}

            {/* Active Indicator Bar (optional based on design, common in premium layouts) */}
            {active && !collapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full" />
            )}
        </button>
    );

    if (collapsed) {
        return (
            <div className="flex flex-col items-center">
                {hasChildren ? (
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                            {content}
                        </PopoverTrigger>
                        <PopoverContent side="right" sideOffset={10} className="w-56 p-2">
                            <div className="mb-2 px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
                                {label}
                            </div>
                            <div className="flex flex-col gap-1">
                                {children}
                            </div>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                {content}
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                {label}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {content}
            {hasChildren && isOpen && !collapsed && (
                // <div className="ml-8 mt-1 flex flex-col gap-5 pl-2">
                <div className="ml-5 mt-1 flex flex-col gap-1 pl-3 ">
                    {children}
                </div>
            )}
        </div>
    );
};
