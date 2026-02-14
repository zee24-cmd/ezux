import { Store } from '@tanstack/store';
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';

// 1. Define the State Shape
export interface TableState<TData> {
    data: TData[];
    globalFilter: string;
    columnFilters: ColumnFiltersState;
    sorting: SortingState;
    pagination: { pageIndex: number; pageSize: number };
    rowSelection: Record<string, boolean>;
    columnVisibility: VisibilityState;
    isPending: boolean; // For transitions
}

// 2. Initial State Factory
export const createTableStore = <TData>(initialData: TData[] = []) => {
    return new Store<TableState<TData>>({
        data: initialData,
        globalFilter: '',
        columnFilters: [],
        sorting: [],
        pagination: { pageIndex: 0, pageSize: 10 },
        rowSelection: {},
        columnVisibility: {},
        isPending: false
    });
};

export type TableStore<TData> = ReturnType<typeof createTableStore<TData>>;
