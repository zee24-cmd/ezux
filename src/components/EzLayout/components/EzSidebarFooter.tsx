import React from 'react';
import { cn } from '../../../lib/utils';
import {
    LogOut,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';

export interface EzSidebarFooterProps {
    collapsed: boolean;
    onToggle: () => void;
    onLogout?: () => void;
    className?: string;
}

export const EzSidebarFooter: React.FC<EzSidebarFooterProps> = ({
    collapsed,
    onToggle,
    onLogout,
    className
}) => {
    return (
        <div className={cn("mt-auto border-t border-border flex flex-col p-2 gap-1", className)}>
            <button
                onClick={onLogout}
                className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors",
                    collapsed && "justify-center px-2"
                )}
            >
                <LogOut className="h-5 w-5" />
                {!collapsed && <span>Logout</span>}
            </button>

            <button
                onClick={onToggle}
                className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors",
                    collapsed && "justify-center px-2"
                )}
            >
                {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
                {!collapsed && <span>Collapse</span>}
            </button>
        </div>
    );
};
