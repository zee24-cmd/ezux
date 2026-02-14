import { TableRowData, SharedBaseProps } from '../../shared/types/BaseProps';
export interface TreeNode extends TableRowData {
    id: string;
    label: string;
    children?: TreeNode[];
    icon?: React.ReactNode;
    level?: number;
    parentId?: string;
}
export interface EzTreeViewProps extends SharedBaseProps {
    data: TreeNode[];
    /**
     * Selection mode.
     * Default: 'single'
     */
    selectionMode?: 'single' | 'multiple';
    /**
     * Callback on node selection.
     */
    onSelectionChange?: (selectedIds: string[]) => void;
    /**
     * Callback on node expansion.
     */
    onNodeExpand?: (nodeId: string, isExpanded: boolean) => void;
    /**
     * Callback when a node is dropped.
     */
    onNodeDrop?: (dragged: TreeNode, target: TreeNode, pos: 'inside' | 'before' | 'after') => void;
    config?: {
        dragDropEnabled?: boolean;
        multiSelectEnabled?: boolean;
        virtualizationThreshold?: number;
        collisionPolicy?: string;
        rtl?: boolean;
    };
}
