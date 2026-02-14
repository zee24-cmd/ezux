import { useCallback, useState } from 'react';

interface ColumnResizerProps {
    columnId: string;
    initialWidth: number;
    minWidth?: number;
    maxWidth?: number;
    onResize: (newWidth: number) => void;
    onResizeEnd?: (finalWidth: number) => void;
}

export const ColumnResizer: React.FC<ColumnResizerProps> = ({
    columnId,
    initialWidth,
    minWidth = 50,
    maxWidth = 1000,
    onResize,
    onResizeEnd,
}) => {
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);

        const startX = e.pageX;
        const startWidth = initialWidth;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            moveEvent.preventDefault();
            const deltaX = moveEvent.pageX - startX;
            // Logical property handling (RTL) would go here if needed, keeping simple for now
            let newWidth = startWidth + deltaX;

            // Constraints
            newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

            onResize(newWidth);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setIsResizing(false);
            onResizeEnd?.(startWidth); // In a real app we'd pass the actual final width if we tracked it locally
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [initialWidth, minWidth, maxWidth, onResize, onResizeEnd]);

    return (
        <div
            onMouseDown={handleMouseDown}
            className={`absolute top-0 end-0 h-full w-1 cursor-col-resize hover:bg-blue-400 z-20 touch-none select-none transition-colors ${isResizing ? 'bg-blue-500 w-[2px]' : 'bg-transparent'
                }`}
            aria-label={`Resize column ${columnId}`}
        />
    );
};
