import { default as React } from 'react';
import { ServiceRegistry } from '../../shared/services/ServiceRegistry';
import { EzHeaderProps } from './EzHeader';
export interface EzLayoutProps {
    components?: {
        header?: React.ReactNode;
        sidebar?: React.ReactNode;
        footer?: React.ReactNode;
        commandPalette?: React.ReactNode;
    };
    authConfig?: {
        signInSlot: React.ReactNode;
        signUpSlot: React.ReactNode;
    };
    headerConfig?: EzHeaderProps;
    serviceRegistry?: ServiceRegistry;
    children?: React.ReactNode;
    className?: string;
    contentClassName?: string;
}
export declare const EzLayout: React.FC<EzLayoutProps>;
export * from './EzLanguageSwitcher';
export * from './EzThemeSwitcher';
export * from './EzThemeColorChanger';
export * from './EzHeader';
