import { IService } from './ServiceRegistry';
export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    duration?: number;
}
export declare class NotificationService implements IService {
    name: string;
    private subscribers;
    private notifications;
    add(notification: Omit<Notification, 'id'>): void;
    remove(id: string): void;
    subscribe(callback: (notifications: Notification[]) => void): () => boolean;
    private notify;
}
