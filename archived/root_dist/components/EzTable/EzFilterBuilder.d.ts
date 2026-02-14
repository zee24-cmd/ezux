import { default as React } from 'react';
import { FilterGroup } from './EzTable.types';
import { ColumnDef } from '@tanstack/react-table';
interface EzFilterBuilderProps {
    filter: FilterGroup;
    columns: ColumnDef<any>[];
    onChange: (filter: FilterGroup) => void;
    depth?: number;
    onRemove?: () => void;
}
export declare const EzFilterBuilder: React.FC<EzFilterBuilderProps>;
export {};
