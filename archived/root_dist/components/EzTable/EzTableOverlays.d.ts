import { default as React } from 'react';
interface EzTableOverlaysProps {
    isLoading: boolean;
    rowCount: number;
    renderNoRowsOverlay?: () => React.ReactNode;
}
export declare const EzTableOverlays: React.MemoExoticComponent<({ isLoading, rowCount, renderNoRowsOverlay }: EzTableOverlaysProps) => import("react/jsx-runtime").JSX.Element | null>;
export {};
