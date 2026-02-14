import { BaseService } from './BaseService';

type LayoutMode = 'dashboard' | 'auth' | 'minimal';

/**
 * Reactive state for the application layout system.
 * @group State
 */
export interface LayoutState {
    /** Whether the primary sidebar is visible. @group State */
    sidebarOpen: boolean;
    /** Current high-level layout mode. @group Properties */
    mode: LayoutMode;
    /** Fixed height of the application header. @group Appearance */
    headerHeight: number;
    /** Fixed width of the application sidebar. @group Appearance */
    sidebarWidth: number;
    /** Viewport width threshold for mobile behavior (in px). @group Properties */
    breakpoint: number;
    /** Current tracked height of the viewport. @group State */
    viewportHeight: number;
    /** Whether the current viewport is considered mobile. @group State */
    isMobile: boolean;
    /** Active page in the auth flow. @group State */
    authPage: 'signin' | 'signup';
    /** Dynamic overlay or side panels currently active. @group State */
    panels: { id: string; content: any; position: 'left' | 'right' | 'bottom' }[];
}

/**
 * Service for managing the application's shell, responsiveness, and dynamic panels.
 * 
 * Centralizes layout configuration, viewport tracking, and provides a reactive
 * API for controlling the UI frame from anywhere in the application.
 * 
 * @group Services
 */
export class LayoutService extends BaseService<LayoutState> {
    name = 'LayoutService';

    constructor() {
        super({
            sidebarOpen: true,
            mode: 'dashboard',
            headerHeight: 64,
            sidebarWidth: 256,
            breakpoint: 768,
            viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
            isMobile: false,
            authPage: 'signin',
            panels: []
        });

        if (typeof window !== 'undefined') {
            this.handleResize(); // Initial check
            window.addEventListener('resize', this.handleResize);
            this.registerCleanup(() => window.removeEventListener('resize', this.handleResize));
        }
    }

    private handleResize = () => {
        const viewportHeight = window.innerHeight;
        const isMobile = window.innerWidth < this.state.breakpoint;

        this.setState(prev => {
            let updates: Partial<LayoutState> = { viewportHeight };
            if (isMobile !== prev.isMobile) {
                updates.isMobile = isMobile;
                if (isMobile) updates.sidebarOpen = false;
            }
            return updates;
        });
    };

    /**
     * Updates the core layout dimensions and breakpoints.
     * @group Methods
     */
    updateConfig(config: { headerHeight?: number; sidebarWidth?: number; breakpoint?: number }): void {
        this.setState(prev => {
            const updates: Partial<LayoutState> = {};

            // Protect against undefined values overwriting state
            if (config.headerHeight !== undefined) updates.headerHeight = config.headerHeight;
            if (config.sidebarWidth !== undefined) updates.sidebarWidth = config.sidebarWidth;
            if (config.breakpoint !== undefined) updates.breakpoint = config.breakpoint;

            // Re-evaluate isMobile if breakpoint changes (or uses existing)
            const breakpoint = updates.breakpoint ?? prev.breakpoint;
            if (typeof window !== 'undefined') {
                const newIsMobile = window.innerWidth < breakpoint;
                if (newIsMobile !== prev.isMobile) {
                    updates.isMobile = newIsMobile;
                    if (newIsMobile) updates.sidebarOpen = false;
                }
            }
            return updates;
        });
    }

    /**
     * Toggles the sidebar visibility.
     * @param open Optional explicit state to set.
     * @group Methods
     */
    toggleSidebar(open?: boolean): void {
        this.setState(prev => ({
            sidebarOpen: open !== undefined ? open : !prev.sidebarOpen
        }));
    }

    /** Sets the active layout mode. @group Methods */
    setMode(mode: LayoutMode): void {
        this.setState({ mode });
    }

    /** Switches the active auth page view. @group Methods */
    setAuthPage(page: 'signin' | 'signup'): void {
        this.setState({ authPage: page });
    }

    /** Registers a new floating or docked panel. @group Methods */
    addPanel(panel: { id: string; content: any; position: 'left' | 'right' | 'bottom' }): void {
        this.setState(prev => ({
            panels: [...prev.panels, panel]
        }));
    }

    /** Removes a registered panel by ID. @group Methods */
    removePanel(id: string): void {
        this.setState(prev => ({
            panels: prev.panels.filter(p => p.id !== id)
        }));
    }

    /**
     * Helper to get CSS styles for the main content area based on layout state.
     * @group Methods
     */
    getMainContentStyle() {
        return {
            height: `calc(100vh - ${this.state.headerHeight}px)`,
            marginLeft: this.state.sidebarOpen && !this.state.isMobile ? `${this.state.sidebarWidth}px` : '0px',
            transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }
    }

}
