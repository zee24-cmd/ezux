import { default as React } from 'react';
import { Resource } from '../EzScheduler.types';
interface EzResourceSidebarProps {
    resources: Resource[];
    selectedResourceIds: string[];
    onSelectionChange: (selectedIds: string[]) => void;
    className?: string;
}
export declare const EzResourceSidebar: React.FC<EzResourceSidebarProps>;
export {};
