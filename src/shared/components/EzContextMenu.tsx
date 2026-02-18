import React from 'react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
    ContextMenuShortcut
} from '../../components/ui/context-menu';
import { Row } from '@tanstack/react-table';
import { globalServiceRegistry } from '../services/ServiceRegistry';
import { ContextMenuService, MenuItem } from '../services/ContextMenuService';

interface EzContextMenuProps<TData> {
    row?: Row<TData>; // Legacy (EzTable)
    data?: TData;     // Generic data
    contextId?: string;
    children: React.ReactNode;
    enabled?: boolean;
    onAction?: (action: string, data: TData) => void;
}

export const EzContextMenu = <TData,>({ row, data, contextId, children, enabled = true, onAction }: EzContextMenuProps<TData>) => {
    if (!enabled) {
        return <>{children}</>;
    }

    const effectiveData = data || (row?.original as TData);

    const getServiceItems = (): MenuItem[] => {
        if (!contextId) return [];
        const service = globalServiceRegistry.get<ContextMenuService>('ContextMenuService');
        return service ? service.getItems(contextId, effectiveData) : [];
    };

    const serviceItems = getServiceItems();
    const hasServiceItems = serviceItems.length > 0;

    const handleAction = (action: string) => {
        onAction?.(action, effectiveData);
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <span className="contents">{children}</span>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
                {hasServiceItems ? (
                    serviceItems.map((item, idx) => (
                        <React.Fragment key={item.id || idx}>
                            {item.isSeparator ? (
                                <ContextMenuSeparator />
                            ) : (
                                <ContextMenuItem
                                    inset
                                    onSelect={() => {
                                        if (item.onClick) {
                                            item.onClick(effectiveData);
                                        } else {
                                            handleAction(item.action);
                                        }
                                    }}
                                    disabled={item.disabled}
                                    className={item.className}
                                >
                                    {item.label}
                                    {item.shortcut && <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>}
                                </ContextMenuItem>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    /* Default EzTable Actions (Legacy Fallback) */
                    <>
                        <ContextMenuItem inset onSelect={() => handleAction('copy')}>
                            Copy Data
                            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        {row && (
                            <>
                                {row.getIsPinned() !== 'top' && (
                                    <ContextMenuItem inset onSelect={() => handleAction('pin-top')}>
                                        Pin to Top
                                    </ContextMenuItem>
                                )}
                                {row.getIsPinned() !== 'bottom' && (
                                    <ContextMenuItem inset onSelect={() => handleAction('pin-bottom')}>
                                        Pin to Bottom
                                    </ContextMenuItem>
                                )}
                                {row.getIsPinned() && (
                                    <ContextMenuItem inset onSelect={() => handleAction('unpin')}>
                                        Unpin Row
                                    </ContextMenuItem>
                                )}
                                <ContextMenuSeparator />
                            </>
                        )}
                        <ContextMenuItem inset className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50" onSelect={() => handleAction('delete')}>
                            Delete Row
                            <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
                        </ContextMenuItem>
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
};
