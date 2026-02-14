import React, { useState, useEffect } from 'react';
import { globalServiceRegistry } from '../services/ServiceRegistry';
import { Notification, NotificationService } from '../services/NotificationService';
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../components/ui/popover";
import { ScrollArea } from "../../components/ui/scroll-area";

export const EzNotificationDropdown = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        let unsubscribeService: (() => void) | undefined;

        const connectService = () => {
            const service = globalServiceRegistry.get<NotificationService>('NotificationService');
            if (service && !unsubscribeService) {
                unsubscribeService = service.subscribe((n: Notification[]) => setNotifications(n));
            }
        };

        connectService();
        const unsubscribeRegistry = globalServiceRegistry.subscribe(() => {
            connectService();
        });

        return () => {
            if (unsubscribeService) unsubscribeService();
            unsubscribeRegistry();
        };
    }, []);

    const clearAll = () => {
        const service = globalServiceRegistry.get<NotificationService>('NotificationService');
        service?.clearAll();
    };

    const remove = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const service = globalServiceRegistry.get<NotificationService>('NotificationService');
        service?.remove(id);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
            case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-600" />;
            default: return <Info className="h-4 w-4 text-blue-600" />;
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground relative">
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background animate-in zoom-in duration-300">
                            {notifications.length > 9 ? '9+' : notifications.length}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 mr-4" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {notifications.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-destructive"
                            onClick={clearAll}
                        >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Clear all
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                            <Bell className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs">No notifications</p>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y">
                            {notifications.map((n) => (
                                <div key={n.id} className="p-4 hover:bg-muted/50 transition-colors relative group">
                                    <div className="flex gap-3">
                                        <div className="shrink-0 mt-0.5">
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="space-y-1 flex-1 min-w-0">
                                            <p className="text-xs leading-relaxed text-foreground/90 break-words">
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                Just now
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => remove(n.id, e)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 p-1 hover:bg-background rounded-md text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};
