import { Row } from '@tanstack/react-table';
import { EzGlobalFilterState } from './EzTable.types';
export declare const advancedFilterFn: <TData>(row: Row<TData>, _columnId: string, // Unused but part of signature
filterValue: EzGlobalFilterState) => boolean;
export declare const smartColumnFilterFn: <TData>(row: Row<TData>, columnId: string, filterValue: any) => boolean;
