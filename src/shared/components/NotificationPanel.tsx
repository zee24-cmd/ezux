import React, { useState, useEffect } from 'react';
import { globalServiceRegistry } from '../services/ServiceRegistry';
import { Notification, NotificationService } from '../services/NotificationService';
import { cn } from '../../lib/utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const NotificationPanel: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        let unsubscribeService: (() => void) | undefined;

        const connectService = () => {
            const service = globalServiceRegistry.get<NotificationService>('NotificationService');
            if (service && !unsubscribeService) {
                unsubscribeService = service.subscribe(setNotifications);
            }
        };

        // Try connecting immediately
        connectService();

        // Listen for registry changes in case service is added later
        const unsubscribeRegistry = globalServiceRegistry.subscribe(() => {
            connectService();
        });

        return () => {
            if (unsubscribeService) unsubscribeService();
            unsubscribeRegistry();
        };
    }, []);

    const remove = (id: string) => {
        const service = globalServiceRegistry.get<NotificationService>('NotificationService');
        if (service) {
            service.remove(id);
        }
    };

    return (
        <div
            data-testid="notification-panel"
            className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 pointer-events-none w-[384px] max-w-[calc(100vw-2rem)]"
        >
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className={cn(
                        "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl animate-in slide-in-from-right-full duration-300",
                        n.type === 'success' && "bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-100",
                        n.type === 'error' && "bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-100",
                        n.type === 'warning' && "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-100",
                        n.type === 'info' && "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-100"
                    )}
                >
                    <div className="shrink-0 mt-0.5">
                        {n.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {n.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
                        {n.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-600" />}
                        {n.type === 'info' && <Info className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="flex-1 text-sm font-medium leading-relaxed">
                        {n.message}
                    </div>
                    <button
                        onClick={() => remove(n.id)}
                        className="shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
                    >
                        <X className="h-4 w-4 opacity-50" />
                    </button>
                </div>
            ))}
        </div>
    );
};
