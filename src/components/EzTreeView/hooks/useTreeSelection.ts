import { useState, useCallback, useEffect } from 'react';
import { EzTreeViewProps } from '../EzTreeView.types';
import { HierarchyService } from '../../../shared/services/HierarchyService';

/**
 * Hook for managing tree selection (single/multiple) and tri-state check states.
 * 
 * Handles propagation of check states to ancestors and descendants when autoCheck is enabled.
 * 
 * @param props Props for the EzTreeView component.
 * @param hierarchyService Service providing structural information about the tree.
 * @group Hooks
 */
export const useTreeSelection = (
    props: EzTreeViewProps,
    hierarchyService: HierarchyService,
    treeData: any[] // Use any[] for compatibility if TreeNode/HierarchyNode types differ slightly in imports
) => {
    const {
        selectedNodes: controlledSelectedNodes,
        checkedNodes: controlledCheckedNodes,
        selectionMode = 'single',
        onSelectionChange,
        onCheckedChange,
        onNodeSelecting,
        onNodeSelected,
        onNodeChecking,
        onNodeChecked,
        autoCheck = true
    } = props;

    // Selection State
    const [internalSelectedNodes, setInternalSelectedNodes] = useState<Set<string>>(new Set());
    const selectedNodes = controlledSelectedNodes ? new Set(controlledSelectedNodes) : internalSelectedNodes;

    // Checked State
    const [internalCheckedNodes, setInternalCheckedNodes] = useState<Set<string>>(new Set());
    const checkedNodes = controlledCheckedNodes ? new Set(controlledCheckedNodes) : internalCheckedNodes;
    const [indeterminateNodes, setIndeterminateNodes] = useState<Set<string>>(new Set());

    const toggleSelect = useCallback((nodeId: string) => {
        if (onNodeSelecting?.(nodeId) === false) return;

        const newSelected = new Set(selectionMode === 'multiple' ? selectedNodes : []);
        if (newSelected.has(nodeId)) {
            newSelected.delete(nodeId);
        } else {
            newSelected.add(nodeId);
        }

        if (controlledSelectedNodes) {
            onSelectionChange?.(Array.from(newSelected));
        } else {
            setInternalSelectedNodes(newSelected);
            onSelectionChange?.(Array.from(newSelected));
        }

        onNodeSelected?.(nodeId);
    }, [selectedNodes, selectionMode, onSelectionChange, controlledSelectedNodes, onNodeSelecting, onNodeSelected]);

    const updateCheckState = useCallback((nodeId: string, isChecked: boolean) => {
        const newChecked = new Set(checkedNodes);
        const newIndeterminate = new Set(indeterminateNodes);

        const descendants = hierarchyService.getDescendants(nodeId);
        const ancestors = hierarchyService.getAncestors(nodeId);

        // Update target and descendants
        if (isChecked) {
            newChecked.add(nodeId);
            newIndeterminate.delete(nodeId);
            if (autoCheck) {
                descendants.forEach(d => {
                    newChecked.add(d);
                    newIndeterminate.delete(d);
                });
            }
        } else {
            newChecked.delete(nodeId);
            newIndeterminate.delete(nodeId);
            if (autoCheck) {
                descendants.forEach(d => {
                    newChecked.delete(d);
                    newIndeterminate.delete(d);
                });
            }
        }

        // Update ancestors
        if (autoCheck) {
            ancestors.forEach(aId => {
                const children = hierarchyService.getChildren(aId);
                const allChecked = children.every(c => newChecked.has(c.id));
                const noneChecked = children.every(c => !newChecked.has(c.id) && !newIndeterminate.has(c.id));

                if (allChecked) {
                    newChecked.add(aId);
                    newIndeterminate.delete(aId);
                } else if (noneChecked) {
                    newChecked.delete(aId);
                    newIndeterminate.delete(aId);
                } else {
                    newChecked.delete(aId);
                    newIndeterminate.add(aId);
                }
            });
        }

        setIndeterminateNodes(newIndeterminate);
        if (controlledCheckedNodes) {
            onCheckedChange?.(Array.from(newChecked));
        } else {
            setInternalCheckedNodes(newChecked);
            onCheckedChange?.(Array.from(newChecked));
        }

        onNodeChecked?.(nodeId, isChecked);
    }, [checkedNodes, indeterminateNodes, hierarchyService, onCheckedChange, autoCheck, controlledCheckedNodes, onNodeChecked]);

    const toggleCheck = useCallback((nodeId: string) => {
        const isChecked = checkedNodes.has(nodeId);
        if (onNodeChecking?.(nodeId, !isChecked) === false) return;
        updateCheckState(nodeId, !isChecked);
    }, [checkedNodes, updateCheckState, onNodeChecking]);

    // Derived Indeterminate State Sync
    // This effect ensures that indeterminateNodes are correctly calculated
    // when checkedNodes are provided externally (controlled mode) or on initial load.
    useEffect(() => {
        if (!autoCheck || !hierarchyService || !treeData.length) return;

        const newIndeterminate = new Set<string>();
        const syncedChecked = new Set(checkedNodes);

        const processNode = (node: any): { isChecked: boolean; isIndeterminate: boolean } => {
            const hasChildren = node.children && node.children.length > 0;

            if (!hasChildren) {
                const checked = syncedChecked.has(node.id);
                return { isChecked: checked, isIndeterminate: false };
            }

            const childResults = node.children.map((c: any) => processNode(c));
            const allUnchecked = childResults.every((r: any) => !r.isChecked && !r.isIndeterminate);
            const allChecked = childResults.every((r: any) => r.isChecked && !r.isIndeterminate);

            if (allChecked) {
                // Sync: parent should be checked when all children are checked
                syncedChecked.add(node.id);
                return { isChecked: true, isIndeterminate: false };
            } else if (allUnchecked) {
                // Sync: parent should be unchecked when no children are checked
                syncedChecked.delete(node.id);
                return { isChecked: false, isIndeterminate: false };
            } else {
                // Some children checked, some not — parent is indeterminate
                syncedChecked.delete(node.id);
                newIndeterminate.add(node.id);
                return { isChecked: false, isIndeterminate: true };
            }
        };

        treeData.forEach(node => processNode(node));

        // Only update indeterminate state if it actually changed
        const currentIndeterminateIds = Array.from(indeterminateNodes).sort().join(',');
        const newIndeterminateIds = Array.from(newIndeterminate).sort().join(',');

        if (currentIndeterminateIds !== newIndeterminateIds) {
            setIndeterminateNodes(newIndeterminate);
        }

        // Sync parent checked state if it changed due to child state derivation
        const currentCheckedIds = Array.from(checkedNodes).sort().join(',');
        const syncedCheckedIds = Array.from(syncedChecked).sort().join(',');

        if (currentCheckedIds !== syncedCheckedIds) {
            if (controlledCheckedNodes) {
                onCheckedChange?.(Array.from(syncedChecked));
            } else {
                setInternalCheckedNodes(syncedChecked);
                onCheckedChange?.(Array.from(syncedChecked));
            }
        }
        // Note: indeterminateNodes is intentionally excluded from deps to prevent re-trigger loops
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkedNodes, hierarchyService, autoCheck, treeData, controlledCheckedNodes, onCheckedChange, setInternalCheckedNodes]);

    return {
        /** Set of IDs for currently selected nodes. @group State */
        selectedNodes,
        /** Manually set the set of selected node IDs. @group Methods */
        setInternalSelectedNodes,
        /** Toggle selection state of a node. @group Methods */
        toggleSelect,
        /** Set of IDs for currently checked nodes. @group State */
        checkedNodes,
        /** Manually set the set of checked node IDs. @group Methods */
        setInternalCheckedNodes,
        /** Set of IDs for nodes with indeterminate check state. @group State */
        indeterminateNodes,
        /** Manually set the set of indeterminate node IDs. @group Methods */
        setIndeterminateNodes,
        /** Toggle check state of a node. @group Methods */
        toggleCheck,
        /** Core logic to update check state and propagate changes. @group Methods */
        updateCheckState
    };
};
