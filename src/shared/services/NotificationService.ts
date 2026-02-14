import type { IService } from './ServiceRegistry';

/**
 * Represents a single user notification item.
 * @group Services
 */
export interface Notification {
    /** Unique identifier for the notification. @group Data */
    id: string;
    /** The alert level: info, success, warning, or error. @group Data */
    type: 'info' | 'success' | 'warning' | 'error';
    /** The message content to display. @group Data */
    message: string;
    /** Optional auto-dismiss duration in milliseconds (0 for persistent). @group Properties */
    duration?: number;
}

/**
 * A central service for managing application-wide alerts and feedback.
 * 
 * Supports multiple concurrent notifications with automatic dismissal and 
 * reactive state synchronization for UI panels.
 * 
 * @group Services
 */
export class NotificationService implements IService {
    name = 'NotificationService';
    private subscribers: Set<(notifications: Notification[]) => void> = new Set();
    private notifications: Notification[] = [];

    /** Adds a new notification to the active queue. @group Methods */
    add(notification: Omit<Notification, 'id'>) {
        const id = crypto.randomUUID();
        const newNotification = { ...notification, id };
        this.notifications.push(newNotification);
        this.notify();

        if (notification.duration !== 0) {
            setTimeout(() => this.remove(id), notification.duration || 5000);
        }
    }

    /** Direct alias for `add`. @group Methods */
    show(notification: Omit<Notification, 'id'>) {
        this.add(notification);
    }

    /** Manually removes a notification by its ID. @group Methods */
    remove(id: string) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.notify();
    }

    /** Clears all active notifications. @group Methods */
    clearAll() {
        this.notifications = [];
        this.notify();
    }

    /**
     * Subscribes to notifications queue changes.
     * @param callback Callback triggered when notifications are added or removed.
     * @returns Unsubscribe function.
     * @group Methods
     */
    subscribe(callback: (notifications: Notification[]) => void) {
        this.subscribers.add(callback);
        callback(this.notifications);
        return () => this.subscribers.delete(callback);
    }

    private notify() {
        this.subscribers.forEach(cb => cb(this.notifications));
    }
}
