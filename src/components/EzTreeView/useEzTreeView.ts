import { useState, useEffect, useCallback, useMemo } from 'react';
import { EzTreeViewProps, TreeNode, ITreeService } from './EzTreeView.types';
import { useBaseComponent, BaseComponentProps } from '../../shared/hooks/useBaseComponent';
import { HierarchyService, HierarchyNode } from '../../shared/services/HierarchyService';
import { useTreeState } from './hooks/useTreeState';
import { useTreeExpansion } from './hooks/useTreeExpansion';
import { useTreeSelection } from './hooks/useTreeSelection';
import { useTreeVirtualization } from './hooks/useTreeVirtualization';
import { useTreeImperative } from './hooks/useTreeImperative';
import { globalServiceRegistry } from '../../shared/services/ServiceRegistry';
import { useService } from '../../shared/hooks/useService';
import { useServiceState } from '../../shared/hooks/useServiceState';
import { I18nState } from '../../shared/services/I18nService';

/**
 * The main orchestrator hook for EzTreeView.
 * 
 * Coordinates specialized hooks for tree state, expansion, multi-selection,
 * virtualization, and imperative API access.
 * 
 * @param props Props for the EzTreeView component.
 * @group Hooks
 */
export const useEzTreeView = (props: EzTreeViewProps) => {
    // Reactively track I18n state for global direction
    const i18nState = useServiceState<I18nState>('I18nService');
    const globalDir = i18nState?.dir || 'ltr';

    // 1. Base component functionality
    const base = useBaseComponent(props as unknown as BaseComponentProps);
    const { serviceRegistry, api: baseApi } = base;
    const { dir: propsDir, apiRef, searchTerm } = props;

    // Determine direction: prop > global
    const effectiveDir = (propsDir === 'auto' || !propsDir) ? globalDir : propsDir;

    // 2. Core State
    const {
        treeData,
        setInternalTreeData,
        loadingNodes,
        setLoadingNodes,
        updateNode
    } = useTreeState(props);

    // 2b. Service Integration
    const service = useMemo(() => {
        if (props.service) return props.service;
        if (props.serviceName) return globalServiceRegistry.get(props.serviceName) as ITreeService;
        return null;
    }, [props.service, props.serviceName]);

    // Initial load for remote data
    useEffect(() => {
        if (service) {
            service.loadNodes().then(nodes => {
                setInternalTreeData(nodes);
            });
        }
    }, [service, setInternalTreeData]);

    // 3. Hierarchy Service
    const hierarchyService = useService(
        'HierarchyService',
        () => new HierarchyService(),
        serviceRegistry || globalServiceRegistry
    );

    // Populate HierarchyService
    const registerNodes = useCallback((nodes: TreeNode[], level = 0, parentId?: string) => {
        nodes.forEach(node => {
            const hNode: HierarchyNode = {
                id: node.id,
                level,
                parentId,
                children: node.children?.map((c: TreeNode) => c.id)
            };
            hierarchyService!.registerNode(hNode);
            if (node.children) {
                registerNodes(node.children, level + 1, node.id);
            }
        });
    }, [hierarchyService]);

    useEffect(() => {
        if (!hierarchyService) return;
        hierarchyService.cleanup();
        registerNodes(treeData);
    }, [treeData, hierarchyService, registerNodes]);

    // 4. Selection & Checked State
    const {
        selectedNodes,
        setInternalSelectedNodes,
        toggleSelect,
        checkedNodes,
        setInternalCheckedNodes,
        indeterminateNodes,
        setIndeterminateNodes,
        toggleCheck,
        updateCheckState
    } = useTreeSelection(props, hierarchyService);

    // 5. Expansion State
    const {
        expandedNodes,
        setInternalExpandedNodes,
        toggleExpand
    } = useTreeExpansion(props, treeData, updateNode, setLoadingNodes, service);

    // 6. Virtualization & Search
    const { flattenedNodes } = useTreeVirtualization(treeData, expandedNodes, searchTerm);

    // 7. Editing state
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

    const handleNodeRename = useCallback((nodeId: string, newLabel: string) => {
        updateNode(nodeId, { label: newLabel });
        props.onNodeRename?.(nodeId, newLabel);
    }, [updateNode, props.onNodeRename]);

    // 8. Imperative API
    useTreeImperative(
        props,
        treeData,
        setInternalTreeData,
        expandedNodes,
        setInternalExpandedNodes,
        checkedNodes,
        setInternalCheckedNodes,
        setInternalSelectedNodes,
        setIndeterminateNodes,
        updateCheckState,
        flattenedNodes,
        hierarchyService,
        setEditingNodeId,
        apiRef as any, // Cast to any to avoid complex ref types mismatch
        baseApi
    );

    return {
        /** The current state of the tree nodes. @group State */
        treeData,
        /** Set of IDs for currently expanded nodes. @group State */
        expandedNodes,
        /** Set of IDs for currently selected nodes. @group State */
        selectedNodes,
        /** Set of IDs for currently checked nodes. @group State */
        checkedNodes,
        /** Set of IDs for nodes in an indeterminate check state. @group State */
        indeterminateNodes,
        /** Map of nodes currently being loaded (async). @group State */
        loadingNodes,
        /** Flattened list of visible nodes for rendering. @group State */
        flattenedNodes,
        /** Toggle expansion state of a node. @group Methods */
        toggleExpand,
        /** Toggle selection state of a node. @group Methods */
        toggleSelect,
        /** Toggle check state of a node. @group Methods */
        toggleCheck,
        /** Rename a node. @group Methods */
        handleNodeRename,
        /** Text direction (ltr/rtl). @group Properties */
        dir: effectiveDir,
        // Prop forwarding/computed
        /** Whether text wrapping is allowed. @group Properties */
        allowTextWrap: props.allowTextWrap,
        /** Animation configuration. @group Properties */
        animation: props.animation,
        /** Whether to check on click. @group Properties */
        checkOnClick: props.checkOnClick,
        /** Whether full row selection is enabled. @group Properties */
        fullRowSelect: props.fullRowSelect,
        /** Whether full row navigation is enabled. @group Properties */
        fullRowNavigable: props.fullRowNavigable,
        /** Key press handler. @group Events */
        onKeyPress: props.onKeyPress,
        /** Node click handler. @group Events */
        onNodeClicked: props.onNodeClicked,
        /** Draw node callback. @group Events */
        onDrawNode: props.onDrawNode,
        // Editing
        /** ID of the node currently being edited. @group State */
        editingNodeId,
        /** Handler to set the editing node. @group Methods */
        setEditingNodeId,
    };
};
