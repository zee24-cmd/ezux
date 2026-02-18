import { Header, flexRender } from '@tanstack/react-table';
import { cn } from '../../../lib/utils';
import { getDensityClass } from '../../../shared/utils/ezStyleUtils';
import { GripVertical } from 'lucide-react';

interface EzHeaderDragPreviewProps {
    header: Header<any, any>;
    density?: string;
}

export const EzHeaderDragPreview = ({ header, density }: EzHeaderDragPreviewProps) => {
    const align = header.column.columnDef.meta?.align || 'left';

    return (
        <div
            className={cn(
                "relative h-full font-semibold text-foreground flex items-center select-none px-4",
                "bg-background/90 border border-border/50 shadow-lg rounded-md opacity-90 cursor-grabbing",
                "ring-2 ring-primary/20",
                getDensityClass(density as any),
                align === 'center' && "justify-center text-center",
                align === 'right' && "justify-end text-right"
            )}
            style={{
                width: header.getSize(),
                maxWidth: header.column.columnDef.maxSize,
                minWidth: header.column.columnDef.minSize
            }}
        >
            <div className={cn(
                "flex items-center w-full gap-2",
                align === 'center' && "justify-center relative",
                align === 'right' && "justify-end"
            )}>
                <div className="p-1 text-zinc-400">
                    <GripVertical className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                </span>
            </div>
        </div>
    );
};
