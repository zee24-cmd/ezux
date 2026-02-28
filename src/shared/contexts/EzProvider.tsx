import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { EzServiceRegistry, ServiceRegistry } from '../services/ServiceRegistry';
import { ThemeService } from '../services/ThemeService';
import { I18nService } from '../services/I18nService';
import { NotificationService } from '../services/NotificationService';
import { LayoutService } from '../services/LayoutService';

interface EzProviderContextProps {
    registry: ServiceRegistry;
}

const EzContext = createContext<EzProviderContextProps | null>(null);

export interface EzProviderProps {
    children: React.ReactNode;
    /**
     * Optional default locale to initialize the I18nService.
     */
    defaultLocale?: string;
    /**
     * Optional custom translations to merge on initialization.
     */
    translations?: Record<string, Record<string, string>>;
}

/**
 * `<EzProvider>` serves as the central orchestration point for all EzUX global services.
 * It initializes a localized `ServiceRegistry`, instantiates core services, and 
 * provides them to child components via React Context safely resolving SSR problems.
 * 
 * @group Core Components
 */
export const EzProvider: React.FC<EzProviderProps> = ({ children, defaultLocale = 'en', translations }) => {
    // 1. Stable, lazy initialization of the registry
    // We use a ref and render-time initialization to ensure it's available 
    // immediately for children and survives StrictMode's virtual unmounts.
    const registryRef = React.useRef<EzServiceRegistry | null>(null);

    // Initialization helper
    const getOrInitRegistry = () => {
        if (!registryRef.current) {
            const r = new EzServiceRegistry();

            const i18n = new I18nService(defaultLocale);
            if (translations) {
                Object.entries(translations).forEach(([locale, data]) => {
                    i18n.registerTranslations(locale, data);
                });
            }
            r.register('I18nService', i18n);

            r.register('ThemeService', new ThemeService());
            r.register('NotificationService', new NotificationService());
            r.register('LayoutService', new LayoutService());

            registryRef.current = r;
        }
        return registryRef.current;
    };

    const registry = getOrInitRegistry();

    // 2. Sync translations reactively if They change
    useEffect(() => {
        if (translations) {
            const i18n = registry.get<I18nService>('I18nService');
            if (i18n) {
                Object.entries(translations).forEach(([locale, data]) => {
                    i18n.registerTranslations(locale, data);
                });
            }
        }
    }, [translations, registry]);

    // Note: We intentionally avoid cleaning up the registry here to avoid 
    // breaking child components during StrictMode double-mounts.

    const contextValue = useMemo(() => ({
        registry
    }), [registry]);

    return (
        <EzContext.Provider value={contextValue}>
            {children}
        </EzContext.Provider>
    );
};

// --- Factory Hooks ---

/**
 * Hook to access the current `ServiceRegistry`.
 * Throws if called outside of `<EzProvider>`.
 * 
 * @group Hooks
 */
export const useEzServiceRegistry = (): ServiceRegistry => {
    const context = useContext(EzContext);
    if (!context) {
        throw new Error('useEzServiceRegistry must be used within an <EzProvider>');
    }
    return context.registry;
};

/**
 * Access the application-wide `ThemeService`.
 * 
 * @group Hooks
 */
export const useThemeService = (): ThemeService => {
    const registry = useEzServiceRegistry();
    return registry.getOrThrow<ThemeService>('ThemeService');
};

/**
 * Access the application-wide `I18nService`.
 * 
 * @group Hooks
 */
export const useI18nService = (): I18nService => {
    const registry = useEzServiceRegistry();
    return registry.getOrThrow<I18nService>('I18nService');
};

/**
 * Access the application-wide `NotificationService`.
 * 
 * @group Hooks
 */
export const useNotificationService = (): NotificationService => {
    const registry = useEzServiceRegistry();
    return registry.getOrThrow<NotificationService>('NotificationService');
};

/**
 * Access the application-wide `LayoutService`.
 * 
 * @group Hooks
 */
export const useLayoutService = (): LayoutService => {
    const registry = useEzServiceRegistry();
    return registry.getOrThrow<LayoutService>('LayoutService');
};
