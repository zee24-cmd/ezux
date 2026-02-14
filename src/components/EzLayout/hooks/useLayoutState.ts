import { useEffect, useTransition } from 'react';
import { useComponentState } from '../../../shared/hooks/useComponentState';
import { EzLayoutProps } from '../EzLayout.types';
import { LayoutService } from '../../../shared/services/LayoutService';
import { I18nService } from '../../../shared/services/I18nService';
import { FocusManagerService } from '../../../shared/services/FocusManagerService';
import { globalServiceRegistry } from '../../../shared/services/ServiceRegistry';
import { NotificationService } from '../../../shared/services/NotificationService';

import { ensureServices } from '../../../shared/utils/serviceUtils';

/**
 * Internal hook to manage the reactive state of the EzLayout.
 * 
 * Handles service initialization, synchronization between services (Layout, I18n),
 * and provides a unified state object for the component.
 * 
 * @param props The EzLayout configuration props.
 * @group Hooks
 */
export const useLayoutState = (props: EzLayoutProps) => {
    const {
        serviceRegistry = globalServiceRegistry,
        headerHeight,
        sidebarWidth,
        breakpoint,
        onSidebarToggle
    } = props;

    // 1. Service Initialization
    ensureServices(serviceRegistry, {
        'LayoutService': () => new LayoutService(),
        'FocusManagerService': () => new FocusManagerService(),
        'NotificationService': () => new NotificationService(),
        'I18nService': () => new I18nService()
    });

    const layoutService = serviceRegistry.getOrThrow<LayoutService>('LayoutService');
    const i18nService = serviceRegistry.getOrThrow<I18nService>('I18nService');
    const focusManager = serviceRegistry.getOrThrow<FocusManagerService>('FocusManagerService');

    // 2. Reactive State
    const { state: layoutState, setImmediateState: setLayoutState } = useComponentState({
        initialState: layoutService.getState(),
        service: layoutService as any,
        onChange: (state) => {
            onSidebarToggle?.(state.sidebarOpen);
        }
    });

    const { state: i18nState, setImmediateState: setI18nState } = useComponentState({
        initialState: { locale: i18nService.locale, dir: i18nService.dir },
        service: i18nService as any
    });

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        layoutService.updateConfig({ headerHeight, sidebarWidth, breakpoint });
    }, [layoutService, headerHeight, sidebarWidth, breakpoint]);

    useEffect(() => {
        const unsubLayout = layoutService.subscribe((state: any) => {
            startTransition(() => setLayoutState(state));
        });
        const unsubI18n = i18nService.subscribe((state: any) => {
            startTransition(() => setI18nState(state));
        });
        return () => {
            unsubLayout();
            unsubI18n();
        };
    }, [layoutService, i18nService, setLayoutState, setI18nState]);

    return {
        layoutState,
        i18nState,
        isPending,
        layoutService,
        i18nService,
        focusManager,
        serviceRegistry
    };
};
