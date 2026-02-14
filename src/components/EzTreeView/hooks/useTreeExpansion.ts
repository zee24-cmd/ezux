import { useState, useCallback } from 'react';
import { EzTreeViewProps, TreeNode, ITreeService } from '../EzTreeView.types';
import { findNodeById } from '../utils/treeUtils';

/**
 * Hook for managing tree expansion state and lazy loading of child nodes.
 * 
 * Handles optimistic updates and triggers "expanding/expanded" events.
 * 
 * @param props Props for the EzTreeView component.
 * @param treeData The current tree data.
 * @param updateNode Callback to update a node's data.
 * @param setLoadingNodes Callback to manage loading state.
 * @param service Optional data service for lazy loading.
 * @group Hooks
 */
export const useTreeExpansion = (
    props: EzTreeViewProps,
    treeData: TreeNode[],
    updateNode: (id: string, updates: Partial<TreeNode>) => void,
    setLoadingNodes: React.Dispatch<React.SetStateAction<Set<string>>>,
    service?: ITreeService | null
) => {
    const {
        expandedNodes: controlledExpandedNodes,
        onNodeExpanding,
        onNodeExpanded,
        onNodeCollapsing,
        onNodeCollapsed,
        onNodeExpand,
        onLoadChildren,
        onActionFailure
    } = props;

    const [internalExpandedNodes, setInternalExpandedNodes] = useState<Set<string>>(new Set());
    const expandedNodes = controlledExpandedNodes
        ? new Set(controlledExpandedNodes)
        : internalExpandedNodes;

    const toggleExpand = useCallback(async (nodeId: string) => {
        const isExpanded = expandedNodes.has(nodeId);
        const willExpand = !isExpanded;

        // Fire "before" events
        if (willExpand) {
            if (onNodeExpanding?.(nodeId) === false) return;
        } else {
            if (onNodeCollapsing?.(nodeId) === false) return;
        }

        // Lazy loading
        if (willExpand && (onLoadChildren || service)) {
            const node = findNodeById(treeData, nodeId);
            if (node && !node.isLoaded && !node.isLeaf) {
                setLoadingNodes(prev => new Set(prev).add(nodeId));
                try {
                    const children = service ? await service.loadNodes(nodeId) : await onLoadChildren!(nodeId);
                    updateNode(nodeId, { children, isLoaded: true });
                } catch (error) {
                    onActionFailure?.(error as Error);
                    return;
                } finally {
                    setLoadingNodes(prev => {
                        const next = new Set(prev);
                        next.delete(nodeId);
                        return next;
                    });
                }
            }
        }

        const newExpanded = new Set(expandedNodes);
        if (isExpanded) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }

        if (controlledExpandedNodes) {
            // Callback handles state change
            onNodeExpand?.(nodeId, willExpand);
        } else {
            setInternalExpandedNodes(newExpanded);
            onNodeExpand?.(nodeId, willExpand);
        }

        // Fire "after" events
        if (willExpand) {
            onNodeExpanded?.(nodeId);
        } else {
            onNodeCollapsed?.(nodeId);
        }
    }, [
        expandedNodes, treeData, onLoadChildren, onNodeExpand, controlledExpandedNodes,
        onNodeExpanding, onNodeCollapsing, onNodeExpanded, onNodeCollapsed,
        onActionFailure, updateNode, setLoadingNodes, service
    ]);

    return {
        /** Set of IDs for currently expanded nodes. @group State */
        expandedNodes,
        /** Manually set the set of expanded node IDs. @group Methods */
        setInternalExpandedNodes,
        /** Toggle the expansion state of a specific node. @group Methods */
        toggleExpand
    };
};
