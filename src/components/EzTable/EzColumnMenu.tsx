
import { Column, Table } from '@tanstack/react-table';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuCheckboxItem
} from '../ui/dropdown-menu';
import { MoreVertical, ArrowUp, ArrowDown, ArrowLeftToLine, ArrowRightToLine, EyeOff, XCircle } from 'lucide-react';

interface EzColumnMenuProps<TData, TValue> {
    column: Column<TData, TValue>;
    table: Table<TData>;
}

export function EzColumnMenu<TData, TValue>({ column, table }: EzColumnMenuProps<TData, TValue>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="h-8 w-8 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex items-center justify-center focus:outline-none"
                    onClick={(e) => e.stopPropagation()} // Prevent sort trigger if on header
                >
                    <MoreVertical className="h-4 w-4 text-zinc-500" />
                    <span className="sr-only">Open menu</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
                {/* Sorting */}
                {column.getCanSort() && (
                    <>
                        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                            <ArrowUp className="mr-2 h-3.5 w-3.5 text-zinc-500/70" />
                            Sort Ascending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                            <ArrowDown className="mr-2 h-3.5 w-3.5 text-zinc-500/70" />
                            Sort Descending
                        </DropdownMenuItem>
                        {column.getIsSorted() && (
                            <DropdownMenuItem onClick={() => column.clearSorting()}>
                                <XCircle className="mr-2 h-3.5 w-3.5 text-zinc-500/70" />
                                Clear Sort
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                    </>
                )}

                {/* Pinning (Requires column pinning state enabled in table, assuming supported or to be added) */}
                {/* TanStack Table supports pinning if configured. We assume standard pinning model. */}
                <DropdownMenuItem onClick={() => column.pin('left')}>
                    <ArrowLeftToLine className="mr-2 h-3.5 w-3.5 text-zinc-500/70" />
                    Pin Left
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.pin('right')}>
                    <ArrowRightToLine className="mr-2 h-3.5 w-3.5 text-zinc-500/70" />
                    Pin Right
                </DropdownMenuItem>
                {column.getIsPinned() && (
                    <DropdownMenuItem onClick={() => column.pin(false)}>
                        <XCircle className="mr-2 h-3.5 w-3.5 text-zinc-500/70" />
                        Unpin
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />

                {/* Visibility */}
                {column.getCanHide() && (
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                        <EyeOff className="mr-2 h-3.5 w-3.5 text-zinc-500/70" />
                        Hide Column
                    </DropdownMenuItem>
                )}

                {/* Columns Toggle (Submenu) */}
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Columns</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="p-0 max-h-[200px] overflow-y-auto">
                        {table.getAllLeafColumns().map((col) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={col.id}
                                    className="capitalize"
                                    checked={col.getIsVisible()}
                                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                                >
                                    {col.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
