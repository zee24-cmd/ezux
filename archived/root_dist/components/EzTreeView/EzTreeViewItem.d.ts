import { default as React } from 'react';
import { TreeNode } from './EzTreeView.types';
interface EzTreeViewItemProps {
    node: TreeNode;
    level: number;
    isExpanded: boolean;
    isSelected: boolean;
    hasChildren: boolean;
    onToggleExpand: (id: string) => void;
    onToggleSelect: (id: string) => void;
    selectionMode?: 'single' | 'multiple';
    style: React.CSSProperties;
    onKeyDown: (e: React.KeyboardEvent, id: string) => void;
    tabIndex: number;
    autoFocus?: boolean;
}
export declare const EzTreeViewItem: React.MemoExoticComponent<({ node, level, isExpanded, isSelected, hasChildren, onToggleExpand, onToggleSelect, selectionMode, style, onKeyDown, tabIndex, autoFocus }: EzTreeViewItemProps) => import("react/jsx-runtime").JSX.Element>;
export {};
