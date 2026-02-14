import { Column } from '@tanstack/react-table';
interface EzExcelFilterProps<TData, TValue> {
    column: Column<TData, TValue>;
}
export declare function EzExcelFilter<TData, TValue>({ column }: EzExcelFilterProps<TData, TValue>): import("react/jsx-runtime").JSX.Element;
export {};
