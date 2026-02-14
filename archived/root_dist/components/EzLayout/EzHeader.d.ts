import { default as React } from 'react';
export interface EzHeaderProps {
    logo?: React.ReactNode;
    companyName?: string;
    breadcrumb?: React.ReactNode;
    showThemeSwitcher?: boolean;
    showThemeColorChanger?: boolean;
    showLanguageSwitcher?: boolean;
    user?: {
        name: string;
        avatarUrl?: string;
        initials?: string;
    };
    className?: string;
    children?: React.ReactNode;
}
export declare const EzHeader: React.FC<EzHeaderProps>;
