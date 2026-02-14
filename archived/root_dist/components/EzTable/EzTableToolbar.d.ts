import { default as React } from 'react';
import { EzGlobalFilterState } from './EzTable.types';
interface EzTableToolbarProps {
    globalFilter: EzGlobalFilterState;
    setGlobalFilter: (val: EzGlobalFilterState) => void;
    enableAdvancedFiltering?: boolean;
    enableExport?: boolean;
    onExport?: (type: 'csv' | 'excel') => void;
    enableChangeTracking?: boolean;
    canUndo: boolean;
    canRedo: boolean;
    undo: () => void;
    redo: () => void;
    columns: any[];
}
export declare const EzTableToolbar: React.MemoExoticComponent<({ globalFilter, setGlobalFilter, enableAdvancedFiltering, enableExport, onExport, enableChangeTracking, canUndo, canRedo, undo, redo, columns }: EzTableToolbarProps) => import("react/jsx-runtime").JSX.Element>;
export {};
