import React, { useRef, memo } from 'react';
import { cn } from '../../lib/utils';
import { LayoutService } from '../../shared/services/LayoutService';
import { FocusManagerService } from '../../shared/services/FocusManagerService';
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from '../ui/resizable';

interface EzSidebarProps {
    sidebarOpen: boolean;
    isMobile: boolean;
    sidebarWidth: number;
    children: React.ReactNode;
    /** The content to render in the main panel (only used when resizable) */
    mainContent?: React.ReactNode;
    layoutService: LayoutService;
    focusManager: FocusManagerService;
    className?: string;
    /** Enable drag-to-resize on the sidebar */
    sidebarResizable?: boolean;
    /** Min sidebar width in pixels (resizable mode) @default 200 */
    sidebarMinWidth?: number;
    /** Max sidebar width in pixels (resizable mode) @default 480 */
    sidebarMaxWidth?: number;
    /** Callback when sidebar is resized */
    onSidebarResize?: (width: number) => void;
}

export const EzSidebar = memo(({
    sidebarOpen,
    isMobile,
    sidebarWidth,
    children,
    mainContent,
    layoutService,
    focusManager,
    className,
    sidebarResizable = false,
    sidebarMinWidth = 200,
    sidebarMaxWidth = 480,
    onSidebarResize,
}: EzSidebarProps) => {
    const sidebarRef = useRef<HTMLElement>(null);

    // Trap focus when mobile drawer is open
    React.useEffect(() => {
        if (isMobile && sidebarOpen && sidebarRef.current) {
            return focusManager.trapFocus(sidebarRef.current);
        }
    }, [isMobile, sidebarOpen, focusManager]);

    // Effective width - when collapsed (expanded but toggle closed) it's 72px in the design
    const effectiveWidth = isMobile
        ? (sidebarOpen ? sidebarWidth : 0)
        : (sidebarOpen ? sidebarWidth : 72);

    // The sidebar inner content (shared between resizable and non-resizable modes)
    const sidebarInner = (
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {children}
        </div>
    );

    // Mobile overlay backdrop
    const mobileOverlay = isMobile && sidebarOpen && (
        <div
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
            onClick={() => layoutService.toggleSidebar(false)}
        />
    );

    // --- Resizable mode (desktop only, sidebar open) ---

    if (sidebarResizable && !isMobile) {
        if (sidebarOpen) {
            return (
                <div className="flex-1 flex overflow-hidden w-full h-full relative">
                    <ResizablePanelGroup
                        orientation="horizontal"
                        className="flex-1 w-full h-full min-h-[500px]"
                    >
                        <ResizablePanel
                            id="ez-sidebar-panel"
                            defaultSize={sidebarWidth}
                            minSize={sidebarMinWidth}
                            maxSize={sidebarMaxWidth}
                            onResize={(size: any) => {
                                const pxWidth = typeof size === 'number' ? size : parseFloat(size);
                                onSidebarResize?.(Math.round(pxWidth));
                            }}
                            className="h-full"
                        >
                            <aside
                                ref={sidebarRef}
                                aria-label="Main Navigation"
                                className={cn(
                                    "border-e border-border h-full flex flex-col relative w-full bg-card/30 backdrop-blur-sm",
                                    className
                                )}
                            >
                                {sidebarInner}
                            </aside>
                        </ResizablePanel>

                        <ResizableHandle withHandle className="z-50" />

                        <ResizablePanel id="ez-main-panel" className="h-full">
                            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                                {mainContent}
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            );
        } else {
            // Collapsed mode: fixed 72px width, no resizable handle
            return (
                <div className="flex-1 flex overflow-hidden w-full h-full relative">
                    <aside
                        ref={sidebarRef}
                        aria-label="Main Navigation"
                        style={{
                            width: 72,
                            transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                            contain: 'content',
                        }}
                        className={cn(
                            "border-e border-border flex-shrink-0 bg-card/30 backdrop-blur-sm h-full flex flex-col transition-all duration-300 relative",
                            className
                        )}
                    >
                        {sidebarInner}
                    </aside>
                    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                        {mainContent}
                    </div>
                </div>
            );
        }
    }

    // --- Non-resizable mode (original behavior) ---
    return (
        <>
            <aside
                ref={sidebarRef}
                aria-label="Main Navigation"
                style={{
                    width: effectiveWidth,
                    transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                    contain: 'content',
                }}
                className={cn(
                    "border-e border-border flex-shrink-0 bg-card/30 backdrop-blur-sm h-full flex flex-col transition-all duration-300 relative",
                    isMobile
                        ? "fixed inset-y-0 left-0 z-50 shadow-2xl"
                        : "relative",
                    className
                )}
            >
                {sidebarInner}
            </aside>

            {mobileOverlay}
        </>
    );
});

EzSidebar.displayName = 'EzSidebar';
