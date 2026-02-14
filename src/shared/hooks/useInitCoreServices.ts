import { globalServiceRegistry } from '../services/ServiceRegistry';
import { I18nService } from '../services/I18nService';
import { NotificationService } from '../services/NotificationService';

/**
 * Hook to ensure core services are registered in the global service registry.
 * This is crucial for isolated environments like Storybook or unit tests.
 */
export const useInitCoreServices = () => {
    // We register services immediately if they are missing to avoid crashes 
    // during the first render of components that use getOrThrow.

    if (!globalServiceRegistry.get('I18nService')) {
        globalServiceRegistry.register('I18nService', new I18nService());
    }

    if (!globalServiceRegistry.get('NotificationService')) {
        globalServiceRegistry.register('NotificationService', new NotificationService());
    }

    // You can add other core services here if needed (ThemeService, etc.)
};
