import React from 'react';
import { EzThemeSwitcher } from './EzThemeSwitcher';
import { EzThemeColorChanger } from './EzThemeColorChanger';
import { EzLanguageSwitcher } from './EzLanguageSwitcher';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

/**
 * Configuration for the EzLayout header.
 * @group Properties
 */
export interface EzHeaderProps {
    /** Custom logo element or URL. @group Appearance */
    logo?: React.ReactNode;
    /** Company or application name displayed in the header. @group High Level */
    companyName?: string;
    /** Custom breadcrumb or navigation path element. @group Navigation */
    breadcrumb?: React.ReactNode;
    /** Whether to show the theme mode switcher (Light/Dark). @default true @group Integration */
    showThemeSwitcher?: boolean;
    /** Whether to show the theme color palette picker. @default true @group Integration */
    showThemeColorChanger?: boolean;
    /** Whether to show the language selection dropdown. @default true @group Integration */
    showLanguageSwitcher?: boolean;
    /** Essential user information for the profile section. @group Data */
    user?: {
        /** Full name of the user. @group Data */
        name: string;
        /** URL to the user's avatar image. @group Appearance */
        avatarUrl?: string;
        /** Fallback initials if avatar is missing. @group Appearance */
        initials?: string;
    };
    /** Custom class name for the header. @group Appearance */
    className?: string;
    /** Extra content to render in the right-side actions area. @group Data */
    children?: React.ReactNode;
}

export const EzHeader: React.FC<EzHeaderProps> = ({
    logo,
    companyName,
    breadcrumb,
    showThemeSwitcher = true,
    showThemeColorChanger = true,
    showLanguageSwitcher = true,
    user,
    className,
    children
}) => {
    return (
        <div className={`w-full flex items-center justify-between ${className || ''}`}>
            <div className="flex items-center gap-3">
                {logo && <div className="flex-shrink-0">{logo}</div>}
                {companyName && (
                    <span className="font-bold text-lg text-foreground tracking-tight">
                        {companyName}
                    </span>
                )}
                {breadcrumb && (
                    <div className="hidden md:flex items-center pl-2">
                        <div className="h-6 w-px bg-border mr-4" />
                        {breadcrumb}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                {children}

                {(showLanguageSwitcher || showThemeColorChanger || showThemeSwitcher) && (
                    <div className="flex items-center gap-2 border-l border-border pl-3 ml-2">
                        {showThemeColorChanger && <EzThemeColorChanger />}
                        {showThemeSwitcher && <EzThemeSwitcher />}
                        {showLanguageSwitcher && <EzLanguageSwitcher />}
                    </div>
                )}

                {user && (
                    <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
                        <div className="text-sm font-medium hidden md:block text-muted-foreground">
                            {user.name}
                        </div>
                        <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.initials || user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                )}
            </div>
        </div>
    );
};
