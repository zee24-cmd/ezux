import { useMemo } from 'react';
import { globalServiceRegistry } from '../services/ServiceRegistry';
import { I18nService } from '../services/I18nService';

/**
 * Hook for accessing the internationalization service.
 * 
 * Provides access to the `I18nService` for translation, localization, and language management.
 * 
 * @group Hooks
 */
export const useI18n = () => {
    return useMemo(
        () => globalServiceRegistry.getOrThrow<I18nService>('I18nService'),
        []
    );
};
