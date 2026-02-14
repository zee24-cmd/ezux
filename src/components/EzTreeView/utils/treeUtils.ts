import { TreeNode, EzTreeViewProps } from '../EzTreeView.types';
import { findNodeById as sharedFindNodeById, updateNodeInNodes as sharedUpdateNodeInNodes } from '../../../shared/utils/commonUtils';

/**
 * Utility to map custom fields to TreeNode structure
 */
export const mapFieldsToTreeNode = (data: any, fields?: EzTreeViewProps['fields']): TreeNode => {
    if (!fields) return data;
    return {
        id: fields.id ? data[fields.id] : data.id,
        label: fields.text ? data[fields.text] : data.label,
        children: fields.children ? data[fields.children] : data.children,
        icon: fields.icon ? data[fields.icon] : data.icon,
        ...(data as any),
    };
};

/**
 * Utility to sort tree data
 */
export const sortTreeData = (data: TreeNode[], sortOrder?: 'None' | 'Ascending' | 'Descending'): TreeNode[] => {
    if (!sortOrder || sortOrder === 'None') return data;

    const sorted = [...data].sort((a, b) => {
        const compareResult = a.label.localeCompare(b.label);
        return sortOrder === 'Ascending' ? compareResult : -compareResult;
    });

    return sorted.map(node => ({
        ...node,
        children: node.children ? sortTreeData(node.children, sortOrder) : undefined
    }));
};

/**
 * Utility to find a node by ID
 */
export const findNodeById = sharedFindNodeById;

/**
 * Utility to update a node in the tree
 */
export const updateNodeInNodes = sharedUpdateNodeInNodes;
