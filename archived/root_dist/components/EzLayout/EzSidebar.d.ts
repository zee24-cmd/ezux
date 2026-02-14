import { default as React } from 'react';
import { LayoutService } from '../../shared/services/LayoutService';
import { FocusManagerService } from '../../shared/services/FocusManagerService';
interface EzSidebarProps {
    sidebarOpen: boolean;
    isMobile: boolean;
    children: React.ReactNode;
    layoutService: LayoutService;
    focusManager: FocusManagerService;
}
export declare const EzSidebar: React.MemoExoticComponent<({ sidebarOpen, isMobile, children, layoutService, focusManager }: EzSidebarProps) => import("react/jsx-runtime").JSX.Element>;
export {};
