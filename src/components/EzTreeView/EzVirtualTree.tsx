import React, { useState, useMemo, useCallback, memo } from 'react';
import { useVirtualization } from '../../shared/hooks/useVirtualization';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TreeNode } from './EzTreeView.types';
import { EzTreeViewItem } from './EzTreeViewItem';
import { cn } from '../../lib/utils';

/**
 * Props for the EzVirtualTree component.
 * @group Properties
 */
interface EzVirtualTreeProps {
    /** Flattened list of visible nodes and their nesting levels. @group Data */
    items: { node: TreeNode; level: number }[];
    /** Set of IDs for currently expanded nodes. @group State */
    expandedNodes: Set<string>;
    /** Set of IDs for currently selected nodes. @group State */
    selectedNodes: Set<string>;
    /** Set of IDs for currently checked nodes. @group State */
    checkedNodes: Set<string>;
    /** Set of IDs for nodes in an indeterminate state. @group State */
    indeterminateNodes: Set<string>;
    /** Set of IDs for nodes currently loading data. @group State */
    loadingNodes: Set<string>;
    /** Callback to toggle expansion state of a node. @group Events */
    onToggleExpand: (nodeId: string) => void;
    /** Callback to toggle selection state of a node. @group Events */
    onToggleSelect: (nodeId: string) => void;
    /** Callback to toggle check state of a node. @group Events */
    onToggleCheck: (nodeId: string) => void;
    /** Callback triggered when a node label is renamed. @group Events */
    onNodeRename: (nodeId: string, newLabel: string) => void;
    /** Custom class name for the tree container. @group Appearance */
    className?: string;
    /** Text direction. @group Appearance */
    dir?: 'ltr' | 'rtl' | 'auto';
    /** Whether to show checkboxes. @group Appearance */
    showCheckboxes?: boolean;
    /** Whether inline editing is allowed. @group Appearance */
    allowEditing?: boolean;
    /** Current search query for highlighting. @group Data */
    searchTerm?: string;
    /** Slots for modular composition. @group Extensibility */
    slots?: {
        node?: React.ComponentType<unknown>;
        expandIcon?: React.ComponentType<unknown>;
        checkbox?: React.ComponentType<unknown>;
        dragHandle?: React.ComponentType<unknown>;
    };
    /** Props for slots. @group Extensibility */
    slotProps?: {
        node?: Record<string, unknown>;
        expandIcon?: Record<string, unknown>;
        checkbox?: Record<string, unknown>;
        dragHandle?: Record<string, unknown>;
    };
    /** Whether text wrapping is allowed. @group Appearance */
    allowTextWrap?: boolean;
    /** Animation configuration. @group Appearance */
    animation?: boolean | { expand?: boolean; collapse?: boolean };
    /** Whether to check on click. @group Properties */
    checkOnClick?: boolean;
    /** Whether full row selection is enabled. @group Appearance */
    fullRowSelect?: boolean;
    /** Whether full row navigation is enabled. @group Appearance */
    fullRowNavigable?: boolean;
    /** Keyboard event handler for the tree. @group Events */
    onKeyPress?: (event: React.KeyboardEvent) => void;
    /** Callback triggered when a node is clicked. @group Events */
    onNodeClicked?: (nodeId: string) => void;
    /** Callback triggered before drawing a node. @group Events */
    onDrawNode?: (node: TreeNode) => void;
    /** ID of the node currently being edited. @group State */
    editingNodeId: string | null;
    /** Handler to set the editing node. @group Methods */
    setEditingNodeId: (id: string | null) => void;
}

/**
 * Internal virtualized tree renderer that handles keyboard navigation and efficient row rendering.
 * @group Components
 */
export const EzVirtualTree = memo(({
    items,
    expandedNodes,
    selectedNodes,
    checkedNodes,
    indeterminateNodes,
    loadingNodes,
    onToggleExpand,
    onToggleSelect,
    onToggleCheck,
    onNodeRename,
    className,
    dir,
    showCheckboxes,
    allowEditing,
    searchTerm,
    slots,
    slotProps,
    allowTextWrap,
    animation,
    checkOnClick,
    fullRowSelect,
    fullRowNavigable,
    onKeyPress,
    onNodeClicked,
    onDrawNode,
    editingNodeId,
    setEditingNodeId,
}: EzVirtualTreeProps) => {
    const { rowVirtualizer, parentRef, getVirtualItems } = useVirtualization({
        rowCount: items.length,
        rowHeight: 32,
        overscanCount: 10,
        progressiveRendering: true, // Default to true for tree as well
    });
    const [focusedIndex, setFocusedIndex] = useState<number>(0);

    // Fast lookup Map for keyboard navigation
    const nodeIdToIndexMap = useMemo(() => {
        const map = new Map<string, number>();
        items.forEach((item, index) => map.set(item.node.id, index));
        return map;
    }, [items]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number, node: TreeNode) => {
        const isRtl = dir === 'rtl';
        const expandKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
        const collapseKey = isRtl ? 'ArrowRight' : 'ArrowLeft';

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = Math.min(items.length - 1, index + 1);
            setFocusedIndex(nextIndex);
            rowVirtualizer.scrollToIndex(nextIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = Math.max(0, index - 1);
            setFocusedIndex(prevIndex);
            rowVirtualizer.scrollToIndex(prevIndex);
        } else if (e.key === expandKey) {
            e.preventDefault();
            if ((node.children?.length || (!node.isLoaded && !node.isLeaf)) && !expandedNodes.has(node.id)) {
                onToggleExpand(node.id);
            } else if (node.children?.length && expandedNodes.has(node.id)) {
                if (index + 1 < items.length && items[index + 1].level > (node.level ?? 0)) {
                    setFocusedIndex(index + 1);
                    rowVirtualizer.scrollToIndex(index + 1);
                }
            }
        } else if (e.key === collapseKey) {
            e.preventDefault();
            if (expandedNodes.has(node.id)) {
                onToggleExpand(node.id);
            } else if (node.parentId) {
                const parentIdx = nodeIdToIndexMap.get(node.parentId);
                if (parentIdx !== undefined) {
                    setFocusedIndex(parentIdx);
                    rowVirtualizer.scrollToIndex(parentIdx);
                }
            }
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (showCheckboxes) {
                onToggleCheck(node.id);
            } else {
                onToggleSelect(node.id);
            }
        }
    }, [items, expandedNodes, onToggleExpand, onToggleSelect, onToggleCheck, showCheckboxes, nodeIdToIndexMap, rowVirtualizer]);

    return (
        <div
            ref={parentRef}
            className={cn("absolute inset-0 overflow-y-auto bg-background border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20", className)}
            dir={dir}
            role="tree"
            onKeyDown={(e) => onKeyPress?.(e)}
        >
            <div
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                <SortableContext
                    items={items.map(item => item.node.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {getVirtualItems().map((virtualRow) => {
                        const item = items[virtualRow.index];
                        const { node, level } = item;
                        const isFocused = focusedIndex === virtualRow.index;

                        return (
                            <EzTreeViewItem
                                key={node.id}
                                node={node}
                                level={level}
                                isExpanded={expandedNodes.has(node.id)}
                                isSelected={selectedNodes.has(node.id)}
                                isChecked={checkedNodes.has(node.id)}
                                isIndeterminate={indeterminateNodes.has(node.id)}
                                isLoading={loadingNodes.has(node.id)}
                                hasChildren={!!node.children?.length || (!node.isLoaded && !node.isLeaf)}
                                onToggleExpand={onToggleExpand}
                                onToggleSelect={onToggleSelect}
                                onToggleCheck={onToggleCheck}
                                onRename={onNodeRename}
                                showCheckboxes={showCheckboxes}
                                allowEditing={allowEditing}
                                searchTerm={searchTerm}
                                onKeyDown={(e) => handleKeyDown(e, virtualRow.index, node)}
                                style={{
                                    position: 'absolute',
                                    top: `${virtualRow.start}px`,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                }}
                                tabIndex={isFocused ? 0 : -1}
                                autoFocus={isFocused}
                                slots={slots}
                                slotProps={slotProps}
                                allowTextWrap={allowTextWrap}
                                animation={animation}
                                checkOnClick={checkOnClick}
                                fullRowSelect={fullRowSelect}
                                fullRowNavigable={fullRowNavigable}
                                onNodeClicked={onNodeClicked}
                                onDrawNode={onDrawNode}
                                isEditing={editingNodeId === node.id}
                                onEditingChange={(editing) => setEditingNodeId(editing ? node.id : null)}
                                dir={dir}
                            />
                        );
                    })}
                </SortableContext>
            </div>
        </div>
    );
});

EzVirtualTree.displayName = 'EzVirtualTree';
