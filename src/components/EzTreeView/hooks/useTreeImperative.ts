
import { useMemo } from 'react';
import { EzTreeViewProps, TreeNode, EzTreeViewApi } from '../EzTreeView.types';
import { HierarchyService } from '../../../shared/services/HierarchyService';
import { findNodeById, updateNodeInNodes } from '../utils/treeUtils';
import { useComponentImperativeAPI } from '../../../shared/hooks/useComponentImperativeAPI';
import { globalServiceRegistry } from '../../../shared/services/ServiceRegistry';
import { NotificationService } from '../../../shared/services/NotificationService';

/**
 * Hook for building and exposing the imperative API for EzTreeView.
 * 
 * Agregates all tree operations into a single API object and registers it with the component's ref.
 * 
 * @param props Props for the EzTreeView component.
 * @param treeData The current tree data.
 * @param setTreeData Callback to update the tree data.
 * @param expandedNodes The current expansion state.
 * @param setExpandedNodes Callback to update expansion state.
 * @param checkedNodes The current checked state.
 * @param setCheckedNodes Callback to update checked state.
 * @param setSelectedNodes Callback to update selection state.
 * @param setIndeterminateNodes Callback to update indeterminate state.
 * @param updateCheckState Core check state logic.
 * @param flattenedNodes The current visible list of nodes.
 * @param hierarchyService Service for tree structure operations.
 * @param setEditingNodeId Callback to enter node editing mode.
 * @param ref The ref to attach the API to.
 * @param baseApi Optional base API methods.
 * @group Hooks
 */
export const useTreeImperative = (
    props: EzTreeViewProps,
    treeData: TreeNode[],
    setTreeData: React.Dispatch<React.SetStateAction<TreeNode[]>>,
    expandedNodes: Set<string>,
    setExpandedNodes: React.Dispatch<React.SetStateAction<Set<string>>>,
    checkedNodes: Set<string>,
    setCheckedNodes: React.Dispatch<React.SetStateAction<Set<string>>>,
    setSelectedNodes: React.Dispatch<React.SetStateAction<Set<string>>>,
    setIndeterminateNodes: React.Dispatch<React.SetStateAction<Set<string>>>,
    updateCheckState: (id: string, check: boolean) => void,
    flattenedNodes: { node: TreeNode; level: number }[],
    hierarchyService: HierarchyService,
    setEditingNodeId: (id: string | null) => void,
    ref: React.Ref<EzTreeViewApi>,
    baseApi: any = {}
) => {
    const {
        expandedNodes: controlledExpandedNodes,
        checkedNodes: controlledCheckedNodes,
        selectedNodes: controlledSelectedNodes,
        onNodeExpand,
        onCheckedChange,
        onSelectionChange,
        onNodeEditing
    } = props;

    const api = useMemo(() => {
        const treeMethods = {
            expandAll: () => {
                const allIds = Array.from(hierarchyService['nodeMap'].keys());
                if (controlledExpandedNodes) {
                    onNodeExpand?.(allIds[0], true);
                } else {
                    setExpandedNodes(new Set(allIds));
                }
            },
            collapseAll: () => {
                if (controlledExpandedNodes) {
                    onNodeExpand?.('', false);
                } else {
                    setExpandedNodes(new Set());
                }
            },
            checkAll: () => {
                const allIds = Array.from(hierarchyService['nodeMap'].keys());
                if (controlledCheckedNodes) {
                    onCheckedChange?.(allIds);
                } else {
                    setCheckedNodes(new Set(allIds));
                    setIndeterminateNodes(new Set());
                }
            },
            uncheckAll: () => {
                if (controlledCheckedNodes) {
                    onCheckedChange?.([]);
                } else {
                    setCheckedNodes(new Set());
                    setIndeterminateNodes(new Set());
                }
            },
            selectNode: (id: string) => {
                if (controlledSelectedNodes) {
                    onSelectionChange?.([id]);
                } else {
                    setSelectedNodes(new Set([id]));
                }
            },
            expandNode: (id: string, expand = true) => {
                if (controlledExpandedNodes) {
                    onNodeExpand?.(id, expand);
                } else {
                    setExpandedNodes(prev => {
                        const next = new Set(prev);
                        expand ? next.add(id) : next.delete(id);
                        return next;
                    });
                }
            },
            checkNode: (id: string, check = true) => updateCheckState(id, check),
            getFlattenedNodes: () => flattenedNodes,

            addNodes: (nodes: TreeNode[], targetId?: string, index?: number) => {
                if (!targetId) {
                    setTreeData(prev => {
                        const newData = [...prev];
                        if (index !== undefined) newData.splice(index, 0, ...nodes);
                        else newData.push(...nodes);
                        return newData;
                    });
                } else {
                    const addRecursive = (nodeList: TreeNode[]): TreeNode[] => {
                        return nodeList.map(node => {
                            if (node.id === targetId) {
                                const newChildren = [...(node.children || [])];
                                if (index !== undefined) newChildren.splice(index, 0, ...nodes);
                                else newChildren.push(...nodes);
                                return { ...node, children: newChildren };
                            }
                            if (node.children) return { ...node, children: addRecursive(node.children) };
                            return node;
                        });
                    };
                    setTreeData(prev => addRecursive(prev));
                }
                globalServiceRegistry.get<NotificationService>('NotificationService')?.show({
                    type: 'success',
                    message: `${nodes.length} Node(s) Added`,
                    duration: 2000
                });
            },

            removeNodes: (ids: string[]) => {
                const idsToRemove = new Set(ids);
                const removeRecursive = (nodeList: TreeNode[]): TreeNode[] => {
                    return nodeList
                        .filter(node => !idsToRemove.has(node.id))
                        .map(node => ({
                            ...node,
                            children: node.children ? removeRecursive(node.children) : undefined
                        }));
                };
                setTreeData(prev => removeRecursive(prev));
                globalServiceRegistry.get<NotificationService>('NotificationService')?.show({
                    type: 'success',
                    message: `${ids.length} Node(s) Removed`,
                    duration: 2000
                });
            },

            updateNode: (id: string, updates: Partial<TreeNode>) => {
                setTreeData(prev => updateNodeInNodes(prev, id, updates));
                globalServiceRegistry.get<NotificationService>('NotificationService')?.show({
                    type: 'success',
                    message: 'Node Updated Successfully',
                    duration: 2000
                });
            },

            moveNodes: (ids: string[], targetId: string, index?: number) => {
                const nodesToMove: TreeNode[] = [];
                const idsToMove = new Set(ids);

                const collectAndRemove = (nodeList: TreeNode[]): TreeNode[] => {
                    return nodeList
                        .filter(node => {
                            if (idsToMove.has(node.id)) {
                                nodesToMove.push(node);
                                return false;
                            }
                            return true;
                        })
                        .map(node => ({
                            ...node,
                            children: node.children ? collectAndRemove(node.children) : undefined
                        }));
                };

                const withoutMoved = collectAndRemove(treeData);

                const addToTarget = (nodeList: TreeNode[]): TreeNode[] => {
                    return nodeList.map(node => {
                        if (node.id === targetId) {
                            const newChildren = [...(node.children || [])];
                            if (index !== undefined) newChildren.splice(index, 0, ...nodesToMove);
                            else newChildren.push(...nodesToMove);
                            return { ...node, children: newChildren };
                        }
                        if (node.children) return { ...node, children: addToTarget(node.children) };
                        return node;
                    });
                };

                setTreeData(addToTarget(withoutMoved));
                globalServiceRegistry.get<NotificationService>('NotificationService')?.show({
                    type: 'success',
                    message: 'Nodes Moved Successfully',
                    duration: 2000
                });
            },

            getNode: (id: string) => findNodeById(treeData, id),
            getTreeData: () => treeData,

            ensureVisible: (id: string) => {
                const ancestors = hierarchyService.getAncestors(id);
                if (controlledExpandedNodes) {
                    ancestors.forEach(aId => onNodeExpand?.(aId, true));
                    onNodeExpand?.(id, true);
                } else {
                    setExpandedNodes(prev => {
                        const next = new Set(prev);
                        ancestors.forEach(aId => next.add(aId));
                        next.add(id);
                        return next;
                    });
                }
            },

            beginEdit: (id: string) => {
                const node = findNodeById(treeData, id);
                if (!node) return;
                if (onNodeEditing?.(id) === false) return;
                setEditingNodeId(id);
            },

            disableNodes: (ids: string[], disable = true) => {
                ids.forEach(id => {
                    setTreeData(prev => updateNodeInNodes(prev, id, { disabled: disable } as any));
                });
            },

            enableNodes: (ids: string[]) => {
                ids.forEach(id => {
                    setTreeData(prev => updateNodeInNodes(prev, id, { disabled: false } as any));
                });
            },

            getAllCheckedNodes: () => Array.from(checkedNodes),

            getDisabledNodes: () => {
                const disabledIds: string[] = [];
                const checkRecursive = (nodes: TreeNode[]) => {
                    nodes.forEach(node => {
                        if ((node as any).disabled) disabledIds.push(node.id);
                        if (node.children) checkRecursive(node.children);
                    });
                };
                checkRecursive(treeData);
                return disabledIds;
            }
        };

        return { ...baseApi, ...treeMethods };
    }, [
        hierarchyService, treeData, expandedNodes, checkedNodes,
        controlledExpandedNodes, controlledCheckedNodes, controlledSelectedNodes,
        onNodeExpand, onCheckedChange, onSelectionChange, onNodeEditing,
        setTreeData, setExpandedNodes, setCheckedNodes, setSelectedNodes, setIndeterminateNodes,
        updateCheckState, flattenedNodes, setEditingNodeId, baseApi
    ]);

    useComponentImperativeAPI(ref, api);
};
