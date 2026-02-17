import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { AuthSlider } from './Authentication/AuthSlider';
import { EzHeader } from './EzHeader';
import { EzSidebar } from './EzSidebar';
import { EzLayoutProps, EzLayoutRef } from './EzLayout.types';
import { useEzLayout } from './useEzLayout';
import { MainContent } from './components/MainContent';
import { EzErrorBoundary } from '../shared/components/EzErrorBoundary';
import { EzLayoutErrorFallback } from '../shared/components/EzLayoutErrorFallback';
import { NotificationPanel } from '../../shared/components/NotificationPanel';

import { useInitCoreServices } from '../../shared/hooks';

export type { EzLayoutProps, EzLayoutRef } from './EzLayout.types';

/**
 * EzLayout is the foundational multi lingigual layout engine for Web/SaaS applications.
 * It provides a highly configurable and responsive shell that handles authentication,
 * headers, sidebars, and enterprise-grade multi-panel layouts.
 * 
 * ### Visual Preview
 * ![EzLayout](../../media/ezlayout.png)
 * 
 * ### Key Features
 * - **Modular Architecture**: Injected components for Header, Sidebar, Footer, and Command Palette.
 * - **Auth Integration**: Built-in support for sliding sign-in/sign-up forms.
 * - **Enterprise Panels**: Support for dynamic panels on the left, right, and bottom of the viewport.
 * - **Responsive Design**: Automatically handles mobile viewports with collapsible sidebars.
 * - **Service Support**: Integrated with `focusManager` and `layoutService` for imperative control.
 * 
 * ### Basic Usage
 * ```tsx
 * import { EzLayout } from '@ezux/core';
 * 
 * function App() {
 *   return (
 *     <EzLayout
 *       headerConfig={{ title: 'Global Dashboard' }}
 *       sidebarWidth={280}
 *     >
 *       <YourMainContent />
 *     </EzLayout>
 *   );
 * }
 * ```
 * 
 * ### Authentication Mode
 * ```tsx
 * <EzLayout
 *   authConfig={{
 *     signInSlot: <MySignInForm />,
 *     signUpSlot: <MySignUpForm />
 *   }}
 * >
 *   <Dashboard />
 * </EzLayout>
 * ```
 * 
 * @group Core Components
 */
/**
 * EzLayout core implementation.
 * @group Core Components
 */
/**
 * EzLayout core implementation.
 * @group Core Components
 */
const EzLayoutImpl = forwardRef<EzLayoutRef, EzLayoutProps>((props, ref) => {
    // Initialize core services (I18n, Notifications, etc.)
    useInitCoreServices();
    const {
        slots,
        slotProps,
        authConfig,
        headerConfig,
        children,
        className,
        contentClassName,
        headerClassName,
        sidebarClassName,
        footerClassName,
    } = props;

    const {
        layoutState,
        i18nState,
        isPending,
        layoutService,
        focusManager,
        renderInjected
    } = useEzLayout(props, ref);

    const isMinimal = layoutState.mode === 'minimal';
    const isAuth = layoutState.mode === 'auth' && authConfig;

    // Early return for auth mode
    if (isAuth) {
        return <AuthSlider signInSlot={authConfig.signInSlot} signUpSlot={authConfig.signUpSlot} initialMode={layoutState.authPage || 'signin'} />;
    }

    return (
        <EzErrorBoundary fallback={<EzLayoutErrorFallback />}>
            <div
                dir={i18nState.dir}
                className={cn(
                    "flex flex-col h-screen bg-background text-foreground transition-opacity duration-300",
                    className
                )}
                style={{ height: '100vh', overflow: 'hidden' }}
            >
                <NotificationPanel />
                {renderInjected(slots?.commandPalette, { ...slotProps?.commandPalette })}

                {!isMinimal && (slots?.header || headerConfig) && (
                    <header
                        aria-label="Global Header"
                        style={{ height: layoutState.headerHeight }}
                        className={cn("border-b border-border flex-shrink-0 px-4 flex items-center", headerClassName)}
                    >
                        {renderInjected(slots?.header, {
                            ...headerConfig,
                            sidebarOpen: layoutState.sidebarOpen,
                            isMobile: layoutState.isMobile,
                            headerHeight: layoutState.headerHeight,
                            toggleSidebar: () => layoutService.toggleSidebar(),
                            ...slotProps?.header
                        }) || (headerConfig && <EzHeader {...headerConfig} />)}
                    </header>
                )}

                <div className="flex flex-1 overflow-hidden relative">
                    {!isMinimal && (slots?.sidebar) && (
                        <EzSidebar
                            sidebarOpen={layoutState.sidebarOpen}
                            isMobile={layoutState.isMobile}
                            sidebarWidth={layoutState.sidebarWidth}
                            layoutService={layoutService}
                            focusManager={focusManager}
                        >
                            {renderInjected(slots?.sidebar, {
                                open: layoutState.sidebarOpen,
                                isMobile: layoutState.isMobile,
                                onClose: () => layoutService.toggleSidebar(false),
                                className: sidebarClassName,
                                ...slotProps?.sidebar
                            })}
                        </EzSidebar>
                    )}

                    {/* Enterprise Panels: Left */}
                    {layoutState.panels?.filter((p: any) => p.position === 'left').map((p: any) => (
                        <aside key={p.id} className="border-r border-border bg-background w-64 overflow-y-auto flex-shrink-0 relative z-20">
                            {p.content}
                        </aside>
                    ))}

                    <MainContent isPending={isPending} contentClassName={contentClassName}>
                        {children}
                    </MainContent>

                    {/* Enterprise Panels: Right */}
                    {layoutState.panels?.filter((p: any) => p.position === 'right').map((p: any) => (
                        <aside key={p.id} className="border-l border-border bg-background w-64 overflow-y-auto flex-shrink-0 relative z-20">
                            {p.content}
                        </aside>
                    ))}
                </div>

                {/* Enterprise Panels: Bottom */}
                {layoutState.panels?.filter((p: any) => p.position === 'bottom').map((p: any) => (
                    <div key={p.id} className="border-t border-border bg-background h-64 overflow-y-auto flex-shrink-0 relative z-30">
                        {p.content}
                    </div>
                ))}

                {!isMinimal && (slots?.footer) && (
                    <footer aria-label="Global Footer" className={cn("flex-shrink-0 border-t border-border bg-background", footerClassName)}>
                        {renderInjected(slots?.footer, { ...slotProps?.footer })}
                    </footer>
                )}
            </div>
        </EzErrorBoundary>
    );
});

EzLayoutImpl.displayName = 'EzLayout';

/**
 * EzLayout is the foundational multi lingigual layout engine for Web/SaaS applications.
 * It provides a highly configurable and responsive shell that handles authentication,
 * headers, sidebars, and enterprise-grade multi-panel layouts.
 * 

 * @group Core Components
 */
export const EzLayout = EzLayoutImpl as React.ForwardRefExoticComponent<
    EzLayoutProps & React.RefAttributes<EzLayoutRef>
>;

export * from './EzLanguageSwitcher';
export * from './EzThemeSwitcher';
export * from './EzThemeColorChanger';
export * from './EzHeader';
export * from './EzUserProfile';
export * from './Authentication/SignInForm';
export * from './Authentication/SignUpForm';
// Note: PasswordInput is exported from ./components/ui/password-input instead


