import { EzTreeViewProps, TreeNode } from './EzTreeView.types';
export declare const useEzTreeView: (props: EzTreeViewProps) => {
    expandedNodes: Set<string>;
    selectedNodes: Set<string>;
    flattenedNodes: {
        node: TreeNode;
        level: number;
    }[];
    toggleExpand: (nodeId: string) => void;
    toggleSelect: (nodeId: string) => void;
    dir: "ltr" | "rtl" | "auto";
};
