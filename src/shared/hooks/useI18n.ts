
import { useI18nService } from '../contexts/EzProvider';

/**
 * Hook for accessing the internationalization service.
 * 
 * Provides access to the `I18nService` for translation, localization, and language management.
 * 
 * @group Hooks
 */
export const useI18n = () => {
    return useI18nService();
};
