import { default as React } from 'react';
import { TreeNode } from './EzTreeView.types';
interface EzVirtualTreeProps {
    items: {
        node: TreeNode;
        level: number;
    }[];
    expandedNodes: Set<string>;
    selectedNodes: Set<string>;
    onToggleExpand: (nodeId: string) => void;
    onToggleSelect: (nodeId: string) => void;
    className?: string;
    dir?: 'ltr' | 'rtl' | 'auto';
    selectionMode?: 'single' | 'multiple';
}
export declare const EzVirtualTree: React.MemoExoticComponent<({ items, expandedNodes, selectedNodes, onToggleExpand, onToggleSelect, className, dir, selectionMode }: EzVirtualTreeProps) => import("react/jsx-runtime").JSX.Element>;
export {};
