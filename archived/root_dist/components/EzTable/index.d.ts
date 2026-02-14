import { default as React } from 'react';
import { EzTableProps } from './EzTable.types';
export declare const EzTable: <TData extends object>(props: EzTableProps<TData> & {
    ref?: React.ForwardedRef<{
        addRow: (row: TData, index?: number) => void;
        deleteRows: (indices: number[]) => void;
    }>;
}) => React.ReactElement;
