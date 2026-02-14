import React, { useRef, memo } from 'react';
import { cn } from '../../lib/utils';
import { LayoutService } from '../../shared/services/LayoutService';
import { FocusManagerService } from '../../shared/services/FocusManagerService';

interface EzSidebarProps {
    sidebarOpen: boolean;
    isMobile: boolean;
    sidebarWidth: number;
    children: React.ReactNode;
    layoutService: LayoutService;
    focusManager: FocusManagerService;
    className?: string;
}

export const EzSidebar = memo(({ sidebarOpen, isMobile, sidebarWidth, children, layoutService, focusManager, className }: EzSidebarProps) => {
    const sidebarRef = useRef<HTMLElement>(null);

    // Trap focus when mobile drawer is open
    React.useEffect(() => {
        if (isMobile && sidebarOpen && sidebarRef.current) {
            return focusManager.trapFocus(sidebarRef.current);
        }
    }, [isMobile, sidebarOpen, focusManager]);

    return (
        <>
            <aside
                ref={sidebarRef}
                aria-label="Main Navigation"
                style={{
                    width: sidebarOpen ? sidebarWidth : 0,
                    transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    contain: 'content',
                }}
                className={cn(
                    "border-e border-border flex-shrink-0 bg-background h-full transition-all duration-300",
                    isMobile
                        ? "fixed inset-y-0 left-0 z-50 shadow-2xl"
                        : "relative",
                    className
                )}
            >
                {children}
            </aside>

            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
                    onClick={() => layoutService.toggleSidebar(false)}
                />
            )}
        </>
    );
});

EzSidebar.displayName = 'EzSidebar';
