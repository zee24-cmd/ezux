import { useEffect } from 'react';
import { globalServiceRegistry } from '../services/ServiceRegistry';
import { NotificationService } from '../services/NotificationService';

/**
 * Internal hook to ensure the `NotificationService` is registered and initialized.
 * 
 * Typically used by components that provide user feedback via snackbars or alerts.
 * 
 * @group Hooks
 */
export const useNotificationService = () => {
    useEffect(() => {
        if (!globalServiceRegistry.get('NotificationService')) {
            globalServiceRegistry.register('NotificationService', new NotificationService());
        }
    }, []);
};
