import { RowPinningState } from '@tanstack/react-table';
import { EzTableProps, EzGlobalFilterState } from './EzTable.types';
export declare const useEzTable: <TData extends object>(props: EzTableProps<TData>) => {
    parentRef: import('react').RefObject<HTMLDivElement | null>;
    rowVirtualizer: import('@tanstack/virtual-core').Virtualizer<HTMLDivElement, Element>;
    columnVirtualizer: import('@tanstack/virtual-core').Virtualizer<HTMLDivElement, Element>;
    rows: import('@tanstack/table-core').Row<TData>[];
    table: import('@tanstack/table-core').Table<TData>;
    dir: "ltr" | "rtl" | "auto";
    paginationEnabled: boolean;
    exportEnabled: boolean;
    onExport: (type: "csv" | "excel") => void;
    addRow: (newRow: TData, index?: number) => void;
    deleteRows: (rowIndices: number[]) => void;
    rangeSelection: {
        start: {
            r: number;
            c: number;
        };
        end: {
            r: number;
            c: number;
        };
    } | null;
    onCellMouseDown: (rowIndex: number, colIndex: number) => void;
    onCellMouseEnter: (rowIndex: number, colIndex: number) => void;
    globalFilter: EzGlobalFilterState;
    setGlobalFilter: import('react').Dispatch<import('react').SetStateAction<EzGlobalFilterState>>;
    rowPinning: RowPinningState;
    setRowPinning: import('react').Dispatch<import('react').SetStateAction<RowPinningState>>;
    enableStickyHeader: boolean;
    enableStickyPagination: boolean;
    enableChangeTracking: boolean;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    changes: {
        added: number;
        edited: number;
        deleted: number;
    };
    toggleRowEditing: (rowIndex: number, editing?: boolean) => void;
    density: "compact" | "standard" | "comfortable";
};
