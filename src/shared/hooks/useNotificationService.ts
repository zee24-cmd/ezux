
import { useNotificationService as useNotifContext } from '../contexts/EzProvider';
/**
 * Internal hook to ensure the `NotificationService` is registered and initialized.
 * 
 * Typically used by components that provide user feedback via snackbars or alerts.
 * 
 * @group Hooks
 */
export const useNotificationService = () => {
    // Context handles initialization now
    return useNotifContext();
};
