import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { EzThemeSwitcher } from './EzThemeSwitcher';
import { EzThemeColorChanger } from './EzThemeColorChanger';
import { EzLanguageSwitcher } from './EzLanguageSwitcher';
import { EzUserProfile } from './EzUserProfile';
import { EzOrganizationSwitcher, Organization } from './EzOrganizationSwitcher';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

/**
 * Configuration for the EzLayout header.
 * @group Properties
 */
export interface EzHeaderProps {
    /** Custom logo element or URL. @group Appearance */
    logo?: React.ReactNode;
    /** Company or application name displayed in the header. @group High Level */
    companyName?: string;
    /** Organization switching configuration. @group Data */
    orgConfig?: {
        currentOrg: Organization;
        organizations: Organization[];
        onSelect: (org: Organization) => void;
    };
    /** Custom breadcrumb or navigation path element. @group Navigation */
    breadcrumb?: React.ReactNode;
    /** Whether to show the theme mode switcher (Light/Dark). @default true @group Integration */
    showThemeSwitcher?: boolean;
    /** Whether to show the theme color palette picker. @default true @group Integration */
    showThemeColorChanger?: boolean;
    /** Whether to show the language selection dropdown. @default true @group Integration */
    showLanguageSwitcher?: boolean;
    /** Whether to show notification bell. @default true @group Integration */
    showNotifications?: boolean;
    /** Essential user information for the profile section. @group Data */
    user?: {
        /** Full name of the user. @group Data */
        name: string;
        /** URL to the user's avatar image. @group Appearance */
        avatarUrl?: string;
        /** Fallback initials if avatar is missing. @group Appearance */
        initials?: string;
    };
    /** Callback triggered when the user clicks 'Sign Out'. @group Events */
    onLogout?: () => void;
    /** Callback to toggle sidebar. @internal */
    toggleSidebar?: () => void;
    /** Sidebar open state. @internal */
    sidebarOpen?: boolean;
    /** Custom class name for the header. @group Appearance */
    className?: string;
    /** Extra content to render in the right-side actions area. @group Data */
    children?: React.ReactNode;
}

export const EzHeader: React.FC<EzHeaderProps> = ({
    logo,
    companyName,
    orgConfig,
    breadcrumb,
    showThemeSwitcher = true,
    showThemeColorChanger = true,
    showLanguageSwitcher = true,
    showNotifications = true,
    user,
    onLogout,
    toggleSidebar,
    className,
    children
}) => {
    return (
        <div className={cn("w-full flex items-center justify-between h-full", className)}>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="mr-1 h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {logo && <div className="flex-shrink-0 flex items-center">{logo}</div>}

                {companyName && !orgConfig && (
                    <span className="font-bold text-lg text-foreground tracking-tight ml-1">
                        {companyName}
                    </span>
                )}

                {orgConfig && (
                    <EzOrganizationSwitcher
                        currentOrg={orgConfig.currentOrg}
                        organizations={orgConfig.organizations}
                        onSelect={orgConfig.onSelect}
                        className="ml-1"
                    />
                )}

                {breadcrumb && (
                    <div className="hidden lg:flex items-center pl-2">
                        <div className="h-6 w-px bg-border mx-4" />
                        {breadcrumb}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1">
                {children}

                <div className="flex items-center gap-1 pr-2">
                    {showNotifications && (
                        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        </Button>
                    )}

                    {showThemeColorChanger && <EzThemeColorChanger />}
                    {showThemeSwitcher && <EzThemeSwitcher />}
                    {showLanguageSwitcher && <EzLanguageSwitcher />}
                </div>

                {user && (
                    <div className="ml-2 border-l border-border pl-3 py-1">
                        <EzUserProfile user={user} onLogout={onLogout} />
                    </div>
                )}
            </div>
        </div>
    );
};
