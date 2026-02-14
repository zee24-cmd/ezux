import { useMemo } from 'react';
import { TreeNode } from '../EzTreeView.types';

/**
 * Hook for flattening tree data for virtualization and applying search filters.
 * 
 * Computes a visible flat list of nodes based on expansion state and search term matches.
 * 
 * @param treeData The full tree data.
 * @param expandedNodes Set of IDs for currently expanded nodes.
 * @param searchTerm Optional search query for filtering nodes.
 * @group Hooks
 */
export const useTreeVirtualization = (
    treeData: TreeNode[],
    expandedNodes: Set<string>,
    searchTerm: string = ''
) => {
    // Flatten nodes for virtualization with search filtering
    const normalizedTerm = searchTerm.toLowerCase();

    // 1. Optimized filtering pass: Only runs when data or search term changes
    const matchMap = useMemo(() => {
        if (!normalizedTerm) return null;

        const map = new Map<string, { matches: boolean; hasChildMatch: boolean }>();
        const checkMatch = (node: TreeNode): { matches: boolean; hasChildMatch: boolean } => {
            if (map.has(node.id)) return map.get(node.id)!;

            let selfMatch = node.label.toLowerCase().includes(normalizedTerm);
            let childMatch = false;

            if (node.children) {
                for (const child of node.children) {
                    const cResult = checkMatch(child);
                    if (cResult.matches) childMatch = true;
                }
            }

            const result = { matches: selfMatch || childMatch, hasChildMatch: childMatch };
            map.set(node.id, result);
            return result;
        };

        treeData.forEach(node => checkMatch(node));
        return map;
    }, [treeData, normalizedTerm]);

    // 2. Flattening pass: Runs when expansion or matches change
    const flattenedNodes = useMemo(() => {
        const result: { node: TreeNode; level: number }[] = [];

        const flatten = (nodes: TreeNode[], level = 0) => {
            nodes.forEach(node => {
                const matchInfo = matchMap ? matchMap.get(node.id) : undefined;
                const isMatch = matchMap ? matchInfo?.matches : true;

                if (isMatch === false) return;

                result.push({ node, level });

                // Automatic expansion during search if children match
                const hasMatchingChildren = matchMap && matchInfo?.hasChildMatch;
                const shouldExpand = expandedNodes.has(node.id) || hasMatchingChildren;

                if (shouldExpand && node.children) {
                    flatten(node.children, level + 1);
                }
            });
        };
        flatten(treeData);
        return result;
    }, [treeData, expandedNodes, matchMap]);


    return {
        /** The flattened list of visible nodes and their levels. @group State */
        flattenedNodes
    };
};
