import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown, Building2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '../ui/dropdown-menu';

export interface Organization {
    id: string;
    name: string;
    logo?: string;
}

export interface EzOrganizationSwitcherProps {
    currentOrg: Organization;
    organizations: Organization[];
    onSelect: (org: Organization) => void;
    collapsed?: boolean;
    className?: string;
}

export const EzOrganizationSwitcher: React.FC<EzOrganizationSwitcherProps> = ({
    currentOrg,
    organizations,
    onSelect,
    collapsed,
    className
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20",
                        collapsed ? "justify-center p-2" : "gap-2",
                        className
                    )}
                >
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
                        {currentOrg?.logo ? (
                            <span className="font-bold text-xs">{currentOrg.logo}</span>
                        ) : (
                            <Building2 className="h-4 w-4" />
                        )}
                    </div>
                    {!collapsed && currentOrg && (
                        <>
                            <span className="truncate max-w-[120px]">{currentOrg.name}</span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
                        </>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {organizations.map((org) => (
                    <DropdownMenuItem
                        key={org.id}
                        onClick={() => onSelect(org)}
                        className={cn(org.id === currentOrg.id && "bg-muted font-semibold")}
                    >
                        <Building2 className="mr-2 h-4 w-4" />
                        <span>{org.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
