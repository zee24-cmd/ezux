export type TableActionType = 'ADD_ROW' | 'DELETE_ROW' | 'EDIT_CELL';
export interface TableAction<TData> {
    type: TableActionType;
    payload: {
        rowIndex?: number;
        rowId?: string | number;
        columnId?: string;
        oldValue?: any;
        newValue?: any;
        row?: TData;
    };
    timestamp: number;
}
export interface HistoryState<TData> {
    past: TableAction<TData>[];
    future: TableAction<TData>[];
}
export interface ChangeCounts {
    added: number;
    edited: number;
    deleted: number;
}
export declare const useTableHistory: <TData extends object>(initialData: TData[]) => {
    data: TData[];
    setData: import('react').Dispatch<import('react').SetStateAction<TData[]>>;
    performEdit: (rowIndex: number, columnId: string, newValue: any) => void;
    addRow: (newRow: TData, index?: number) => void;
    deleteRows: (rowIndices: number[]) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    changes: {
        added: number;
        edited: number;
        deleted: number;
    };
};
