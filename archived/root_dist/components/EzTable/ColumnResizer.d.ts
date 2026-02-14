interface ColumnResizerProps {
    columnId: string;
    initialWidth: number;
    minWidth?: number;
    maxWidth?: number;
    onResize: (newWidth: number) => void;
    onResizeEnd?: (finalWidth: number) => void;
}
export declare const ColumnResizer: React.FC<ColumnResizerProps>;
export {};
