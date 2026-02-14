import { default as React } from 'react';
import { Row } from '@tanstack/react-table';
interface EzContextMenuProps<TData> {
    row?: Row<TData>;
    data?: TData;
    contextId?: string;
    children: React.ReactNode;
    enabled?: boolean;
    onAction?: (action: string, data: TData) => void;
}
export declare const EzContextMenu: <TData>({ row, data, contextId, children, enabled, onAction }: EzContextMenuProps<TData>) => import("react/jsx-runtime").JSX.Element;
export {};
