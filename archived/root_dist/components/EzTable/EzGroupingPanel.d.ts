import { default as React } from 'react';
import { GroupingState, Column } from '@tanstack/react-table';
interface EzGroupingPanelProps {
    grouping: GroupingState;
    onGroupingChange: (grouping: GroupingState) => void;
    columns: Column<any, any>[];
}
export declare const EzGroupingPanel: React.FC<EzGroupingPanelProps>;
export {};
