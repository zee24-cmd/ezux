import { IService } from './ServiceRegistry';
type LayoutMode = 'dashboard' | 'auth' | 'minimal';
export declare class LayoutService implements IService {
    name: string;
    private listeners;
    private state;
    constructor();
    private handleResize;
    toggleSidebar(open?: boolean): void;
    setMode(mode: LayoutMode): void;
    setAuthPage(page: 'signin' | 'signup'): void;
    getState(): {
        sidebarOpen: boolean;
        mode: LayoutMode;
        headerHeight: number;
        sidebarWidth: number;
        viewportHeight: number;
        isMobile: boolean;
        authPage: "signin" | "signup";
    };
    getMainContentStyle(): {
        height: string;
        marginLeft: string;
        transition: string;
    };
    subscribe(listener: (state: any) => void): () => void;
    private notify;
    cleanup(): void;
}
export {};
