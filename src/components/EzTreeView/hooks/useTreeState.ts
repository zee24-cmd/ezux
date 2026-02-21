import { useMemo, useEffect, useRef, useCallback } from 'react';
import { EzTreeViewProps, TreeNode } from '../EzTreeView.types';
import { mapFieldsToTreeNode, sortTreeData, updateNodeInNodes } from '../utils/treeUtils';
import { useComponentState } from '../../../shared/hooks/useComponentState';

/**
 * Hook for managing the core data and processing logic for the tree.
 * 
 * Handles field mapping, sorting, and synchronizing external data changes.
 * 
 * @param props Props for the EzTreeView component.
 * @group Hooks
 */
export const useTreeState = (props: EzTreeViewProps) => {
    const {
        data: initialData,
        fields,
        sortOrder,
        onDataSourceChanged,
        onDataBound
    } = props;

    const { state, setState } = useComponentState({
        initialState: {
            internalTreeData: initialData,
            loadingNodes: new Set<string>()
        }
    });

    const isMountedRef = useRef(false);

    // Proxies for compatibility
    const setInternalTreeData = useCallback((updater: TreeNode[] | ((prev: TreeNode[]) => TreeNode[])) => {
        setState(prev => ({
            ...prev,
            internalTreeData: typeof updater === 'function' ? updater(prev.internalTreeData) : updater
        }));
    }, [setState]);

    const setLoadingNodes = useCallback((updater: Set<string> | ((prev: Set<string>) => Set<string>)) => {
        setState(prev => ({
            ...prev,
            loadingNodes: typeof updater === 'function' ? updater(prev.loadingNodes) : updater
        }));
    }, [setState]);

    const { internalTreeData, loadingNodes } = state;

    // Process tree data: field mapping and sorting
    const treeData = useMemo(() => {
        let processed = internalTreeData;

        // Apply field mapping if provided
        if (fields) {
            const mapNodes = (nodes: TreeNode[]): TreeNode[] => {
                return nodes.map(node => {
                    const mapped = mapFieldsToTreeNode(node, fields);
                    if (mapped.children) {
                        mapped.children = mapNodes(mapped.children);
                    }
                    return mapped;
                });
            };
            processed = mapNodes(processed);
        }

        // Apply sorting
        if (sortOrder) {
            processed = sortTreeData(processed, sortOrder);
        }

        return processed;
    }, [internalTreeData, fields, sortOrder]);

    // Track data changes for onDataSourceChanged event
    const prevDataRef = useRef(initialData);
    useEffect(() => {
        if (prevDataRef.current !== initialData) {
            setInternalTreeData(initialData);
            onDataSourceChanged?.();
            prevDataRef.current = initialData;
        }
    }, [initialData, onDataSourceChanged]);

    // Call onDataBound after data is processed
    useEffect(() => {
        if (isMountedRef.current) {
            onDataBound?.();
        }
    }, [treeData, onDataBound]);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const updateNode = useCallback((id: string, updates: Partial<TreeNode>) => {
        setInternalTreeData((prev: TreeNode[]) => updateNodeInNodes(prev, id, updates));
    }, [setInternalTreeData]);

    return {
        /** The processed tree data structure. @group State */
        treeData,
        /** Update the internal tree data. @group Methods */
        setInternalTreeData,
        /** Set of node IDs currently in a loading state. @group State */
        loadingNodes,
        /** Update the loading state of nodes. @group Methods */
        setLoadingNodes,
        /** Update a specific node by ID. @group Methods */
        updateNode
    };
};
