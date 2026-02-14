import { Column, Table } from '@tanstack/react-table';
interface EzColumnMenuProps<TData, TValue> {
    column: Column<TData, TValue>;
    table: Table<TData>;
}
export declare function EzColumnMenu<TData, TValue>({ column, table }: EzColumnMenuProps<TData, TValue>): import("react/jsx-runtime").JSX.Element;
export {};
