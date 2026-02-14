
import { useState, useMemo } from 'react';
import { EzLayoutProps, EzLayoutRef } from '../EzLayout.types';
import { LayoutService } from '../../../shared/services/LayoutService';
import { ServiceRegistry } from '../../../shared/services/ServiceRegistry';
import { useComponentImperativeAPI } from '../../../shared/hooks/useComponentImperativeAPI';

/**
 * Internal hook to define the imperative API for EzLayout.
 * 
 * Maps internal layout services and state management to the public ref methods.
 * 
 * @param ref Forwarded ref for the imperative API.
 * @param props The EzLayout configuration props.
 * @param services Internal service instances.
 * @group Hooks
 */
export const useLayoutImperative = (
    ref: React.Ref<EzLayoutRef>,
    props: EzLayoutProps,
    services: {
        layoutService: LayoutService;
        serviceRegistry: ServiceRegistry;
    }
) => {
    const { layoutService, serviceRegistry } = services;
    const { onModeChange, onSidebarToggle, onAuthPageChange } = props;
    const [, forceUpdate] = useState({});

    const api = useMemo<any>(() => ({
        // SidebarControl
        toggleSidebar: (open?: boolean) => {
            layoutService.toggleSidebar(open);
            const newState = layoutService.getState();
            onSidebarToggle?.(newState.sidebarOpen);
        },
        openSidebar: () => {
            layoutService.toggleSidebar(true);
            onSidebarToggle?.(true);
        },
        closeSidebar: () => {
            layoutService.toggleSidebar(false);
            onSidebarToggle?.(false);
        },
        isSidebarOpen: () => layoutService.getState().sidebarOpen,

        // ModeManagement
        setMode: (mode: 'dashboard' | 'auth' | 'minimal') => {
            layoutService.setMode(mode);
            onModeChange?.(mode);
        },
        getMode: () => layoutService.getState().mode,
        showDashboard: () => {
            layoutService.setMode('dashboard');
            onModeChange?.('dashboard');
        },
        showAuth: () => {
            layoutService.setMode('auth');
            onModeChange?.('auth');
        },
        showMinimal: () => {
            layoutService.setMode('minimal');
            onModeChange?.('minimal');
        },

        // AuthPageControl
        setAuthPage: (page: 'signin' | 'signup') => {
            layoutService.setAuthPage(page);
            onAuthPageChange?.(page);
        },
        getAuthPage: () => layoutService.getState().authPage,
        showSignIn: () => {
            layoutService.setAuthPage('signin');
            onAuthPageChange?.('signin');
        },
        showSignUp: () => {
            layoutService.setAuthPage('signup');
            onAuthPageChange?.('signup');
        },

        // StateAccess
        getState: () => layoutService.getState(),
        getViewport: () => ({
            height: layoutService.getState().viewportHeight,
            isMobile: layoutService.getState().isMobile
        }),
        isMobile: () => layoutService.getState().isMobile,

        // LayoutDimensions
        getHeaderHeight: () => layoutService.getState().headerHeight,
        getSidebarWidth: () => layoutService.getState().sidebarWidth,
        getMainContentStyle: () => layoutService.getMainContentStyle(),

        // ServiceAccess
        getLayoutService: () => layoutService,
        getServiceRegistry: () => serviceRegistry,

        // Panels
        addPanel: (panel: any) => layoutService.addPanel(panel),
        removePanel: (id: string) => layoutService.removePanel(id),

        // Refresh
        refresh: () => forceUpdate({})

    }), [layoutService, serviceRegistry, onModeChange, onSidebarToggle, onAuthPageChange]);

    useComponentImperativeAPI(ref, api);
};
