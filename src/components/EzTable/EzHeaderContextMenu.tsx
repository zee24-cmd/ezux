import React from 'react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from '../ui/context-menu';
import { Pin, PinOff, Group, Ungroup } from 'lucide-react';
import { Header } from '@tanstack/react-table';

interface EzHeaderContextMenuProps {
    header: Header<any, any>;
    children: React.ReactNode;
}

export function EzHeaderContextMenu({ header, children }: EzHeaderContextMenuProps) {
    const column = header.column;
    const isPinned = column.getIsPinned();
    const canGroup = column.getCanGroup();
    const isGrouped = column.getIsGrouped();

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
                {canGroup && (
                    <>
                        <ContextMenuItem
                            onClick={() => column.toggleGrouping()}
                            className="gap-2"
                        >
                            {isGrouped ? (
                                <>
                                    <Ungroup className="w-3.5 h-3.5" />
                                    Ungroup {column.id}
                                </>
                            ) : (
                                <>
                                    <Group className="w-3.5 h-3.5 text-zinc-500/70" />
                                    Group by column
                                </>
                            )}
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                    </>
                )}
                <ContextMenuItem
                    onClick={() => column.pin('left')}
                    disabled={isPinned === 'left'}
                    className="gap-2"
                >
                    <Pin className="w-3.5 h-3.5 rotate-[-45deg]" />
                    Pin to Left
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => column.pin('right')}
                    disabled={isPinned === 'right'}
                    className="gap-2"
                >
                    <Pin className="w-3.5 h-3.5 rotate-[45deg]" />
                    Pin to Right
                </ContextMenuItem>
                {isPinned && (
                    <>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                            onClick={() => column.pin(false)}
                            className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20 gap-2"
                        >
                            <PinOff className="w-3.5 h-3.5" />
                            Unpin Column
                        </ContextMenuItem>
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}
