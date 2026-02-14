import React from 'react';
import { ServiceRegistry } from '../../shared/services/ServiceRegistry';
import { SharedBaseProps } from '../../shared/types/BaseProps';
import { EzHeaderProps } from './EzHeader';

/**
 * Specialized props for a custom header component.
 * @group Subcomponents
 */
export interface EzHeaderComponentProps extends EzHeaderProps {
    /** Whether the sidebar is currently open. @group State */
    sidebarOpen: boolean;
    /** Whether the layout is currently in mobile mode. @group State */
    isMobile: boolean;
    /** Current effective header height. @group Appearance */
    headerHeight: number;
    /** Callback to manually toggle the sidebar. @group Events */
    toggleSidebar: () => void;
}

/**
 * Specialized props for a custom sidebar component.
 * @group Subcomponents
 */
export interface EzSidebarComponentProps {
    /** Whether the sidebar is visible. @group Properties */
    open: boolean;
    /** Whether the layout is in mobile mode. @group State */
    isMobile: boolean;
    /** Callback to close the sidebar (typically on overlay click). @group Events */
    onClose: () => void;
    /** Content to render inside the sidebar. @group Data */
    children?: React.ReactNode;
}

export interface EzLayoutProps extends SharedBaseProps {
    /** 
     * Injected components to override or extend the default layout sections.
     * @group Subcomponents 
     */
    components?: {
        header?: React.ReactNode | React.ComponentType<EzHeaderComponentProps>;
        sidebar?: React.ReactNode | React.ComponentType<EzSidebarComponentProps>;
        footer?: React.ReactNode | React.ComponentType<any>;
        commandPalette?: React.ReactNode | React.ComponentType<any>;
    };
    /** 
     * Configuration for the built-in authentication slider.
     * Provides slots for sign-in and sign-up forms.
     * @group Properties 
     */
    authConfig?: {
        /** Slot for custom sign-in form content. @group Subcomponents */
        signInSlot?: React.ReactNode;
        /** Slot for custom sign-up form content. @group Subcomponents */
        signUpSlot?: React.ReactNode;
    };
    /** 
     * Configuration props passed to the default EzHeader component.
     * @group Properties 
     */
    headerConfig?: EzHeaderProps;
    /** 
     * Main content to be rendered within the layout.
     * @group Data 
     */
    children?: React.ReactNode;
    /** 
     * Custom class name for the main content area.
     * @group Appearance 
     */
    contentClassName?: string;
    /** 
     * Custom class name for the header container.
     * @group Appearance 
     */
    headerClassName?: string;
    /** 
     * Custom class name for the sidebar container.
     * @group Appearance 
     */
    sidebarClassName?: string;
    /** 
     * Custom class name for the footer container.
     * @group Appearance 
     */
    footerClassName?: string;

    // Lifecycle Events
    /** 
     * Callback fired when the layout mode changes (e.g. dashboard <-> auth).
     * @group Events 
     */
    onModeChange?: (mode: 'dashboard' | 'auth' | 'minimal') => void;
    /** 
     * Callback fired when the sidebar is toggled.
     * @group Events 
     */
    onSidebarToggle?: (isOpen: boolean) => void;
    /** 
     * Callback fired when the auth page changes (signin <-> signup).
     * @group Events 
     */
    onAuthPageChange?: (page: 'signin' | 'signup') => void;
    /** 
     * Callback fired when the viewport resizes.
     * @group Events 
     */
    onViewportResize?: (dimensions: { width: number; height: number; isMobile: boolean }) => void;

    // Configuration
    /** 
     * Height of the header in pixels.
     * @default 64
     * @group Appearance
     */
    headerHeight?: number;

    /**
     * Width of the sidebar in pixels.
     * @default 256
     * @group Appearance
     */
    sidebarWidth?: number;

    /**
     * Breakpoint in pixels for mobile view.
     * @default 768
     * @group Properties
     */
    breakpoint?: number;

    /** 
     * Enable state persistence to localStorage for layout preferences.
     * @group Properties 
     */
    enablePersistence?: boolean;
    /** 
     * Custom media query for fine-grained mobile breakpoint control.
     * @group Properties 
     */
    mediaQuery?: string;

    // Enterprise Events
    /** 
     * Callback when layout is created.
     * @group Events 
     */
    onCreate?: () => void;
    /** 
     * Callback when layout is destroyed.
     * @group Events 
     */
    onDestroy?: () => void;
    /** 
     * Callback when resizing starts.
     * @group Events 
     */
    onResizeStart?: () => void;
    /** 
     * Callback when resizing stops.
     * @group Events 
     */
    onResizeStop?: () => void;
}

/**
 * Imperative API for the EzLayout component.
 * Access via ref to programmatically control layout state and shell behavior.
 * @group Methods
 */
export interface EzLayoutRef {
    // Sidebar Control
    /** Toggles sidebar visibility or sets it explicitly. @group Methods */
    toggleSidebar: (open?: boolean) => void;

    /** Programmatically opens the sidebar. @group Methods */
    openSidebar: () => void;

    /** Programmatically closes the sidebar. @group Methods */
    closeSidebar: () => void;

    /** Returns current visibility of the sidebar. @group Methods */
    isSidebarOpen: () => boolean;

    /** Sets the top-level layout mode. @group Methods */
    setMode: (mode: 'dashboard' | 'auth' | 'minimal') => void;

    /** Gets the current layout mode. @group Methods */
    getMode: () => 'dashboard' | 'auth' | 'minimal';

    /** Switches layout to dashboard mode. @group Methods */
    showDashboard: () => void;

    /** Switches layout to authentication mode. @group Methods */
    showAuth: () => void;

    /** Switches layout to minimal mode. @group Methods */
    showMinimal: () => void;

    /** Switches the active auth view (signin/signup). @group Methods */
    setAuthPage: (page: 'signin' | 'signup') => void;

    /** Gets the current auth view. @group Methods */
    getAuthPage: () => 'signin' | 'signup';

    /** Programmatically shows the sign-in form. @group Methods */
    showSignIn: () => void;

    /** Programmatically shows the sign-up form. @group Methods */
    showSignUp: () => void;

    // State Access
    /** Returns a snapshot of the internal layout state. @group Methods */
    getState: () => {
        sidebarOpen: boolean;
        mode: 'dashboard' | 'auth' | 'minimal';
        headerHeight: number;
        sidebarWidth: number;
        viewportHeight: number;
        isMobile: boolean;
        authPage: 'signin' | 'signup';
    };

    /** Returns current viewport dimensions and mobile status. @group Methods */
    getViewport: () => {
        height: number;
        isMobile: boolean;
    };

    /** Direct check if the layout is in mobile mode. @group Methods */
    isMobile: () => boolean;

    /** Gets the configured header height. @group Methods */
    getHeaderHeight: () => number;

    /** Gets the configured sidebar width. @group Methods */
    getSidebarWidth: () => number;

    /** Returns calculated CSS styles for the main content area. @group Methods */
    getMainContentStyle: () => React.CSSProperties;

    /** Returns the underlying LayoutService instance. @group Services */
    getLayoutService: () => any;

    /** Returns the service registry used by the layout. @group Services */
    getServiceRegistry: () => ServiceRegistry;

    /** Forces a re-calculation of layout dimensions. @group Methods */
    refresh: () => void;

    /** Programmatically adds a side panel. @group Methods */
    addPanel: (panel: any) => void;
    /** Removes a side panel by its ID. @group Methods */
    removePanel: (id: string) => void;
}
