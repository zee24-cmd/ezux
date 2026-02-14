import { useState, useCallback } from 'react';
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
    hierarchyService: HierarchyService
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

        if (controlledCheckedNodes) {
            onCheckedChange?.(Array.from(newChecked));
        } else {
            setInternalCheckedNodes(newChecked);
            setIndeterminateNodes(newIndeterminate);
            onCheckedChange?.(Array.from(newChecked));
        }

        onNodeChecked?.(nodeId, isChecked);
    }, [checkedNodes, indeterminateNodes, hierarchyService, onCheckedChange, autoCheck, controlledCheckedNodes, onNodeChecked]);

    const toggleCheck = useCallback((nodeId: string) => {
        const isChecked = checkedNodes.has(nodeId);
        if (onNodeChecking?.(nodeId, !isChecked) === false) return;
        updateCheckState(nodeId, !isChecked);
    }, [checkedNodes, updateCheckState, onNodeChecking]);

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
