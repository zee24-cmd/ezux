import React from 'react';
import { useEzTreeView } from './useEzTreeView';
import type { EzTreeViewProps } from './EzTreeView.types';
import {
    DndContext,
    closestCenter,
} from '@dnd-kit/core';
import { EzErrorBoundary } from '../shared/components/EzErrorBoundary';
import { EzTreeViewErrorFallback } from '../shared/components/EzTreeViewErrorFallback';
import { EzVirtualTree } from './EzVirtualTree';
import { useTreeDragDrop } from './hooks/useTreeDragDrop';

import { useInitCoreServices } from '../../shared/hooks';
import { cn } from '../../lib/utils';


/**
 * EzTreeView is a high-performance hierarchical data explorer.
 * It uses a virtualized engine to efficiently render trees with thousands of 
 * nodes while providing rich interactive features like drag-and-drop and 
 * multi-level selection.
 * 

 * ### Key Features
 * - **Superior Virtualization**: Flat-list virtualization for smooth scrolling even with deep, expanded trees.
 * - **Flexible Selection**: Supports `single`, `multiple`, and `checkbox` selection modes with indeterminate state support.
 * - **Drag & Drop**: Native `@dnd-kit` integration for reordering nodes and changing parent-child relationships.
 * - **Inline Editing**: Double-click to rename nodes with built-in validation.
 * - **Search & Filter**: Real-time filtering with automatic expansion of matching parent nodes.
 * - **Custom Rendering**: Fully customizable node templates and icons via the `components` prop.
 * 
 * ### Minimal Example
 * ```tsx
 * <EzTreeView
 *   data={myTreeData}
 *   showCheckboxes
 *   onNodeClicked={(node) => console.log('Clicked:', node.text)}
 * />
 * ```
 * 
 * ### Advanced Config: Virtualization & DND
 * ```tsx
 * <EzTreeView
 *   data={largeTreeData}
 *   allowDragAndDrop
 *   allowEditing
 *   onNodeDrop={(dragged, target, position) => handleMove(dragged, target, position)}
 *   className="h-[400px] border rounded-md"
 * />
 * ```
 * 
 * @group Core Components
 */
export const EzTreeView: React.FC<EzTreeViewProps> = (props) => {
    // Initialize core services (I18n, Notifications, etc.)
    useInitCoreServices();
    const {
        expandedNodes,
        selectedNodes,
        checkedNodes,
        indeterminateNodes,
        loadingNodes,
        flattenedNodes,
        toggleExpand,
        toggleSelect,
        toggleCheck,
        handleNodeRename,
        dir,
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
    } = useEzTreeView(props);

    const { handleDragEnd, sensors } = useTreeDragDrop({
        onDragEnd: (draggedNode, targetNode, position) => {
            if (props.onNodeDrop) {
                props.onNodeDrop(draggedNode, targetNode, position);
            }
        }
    });

    return (
        <EzErrorBoundary fallback={<EzTreeViewErrorFallback />}>
            <div className={cn("relative flex-1 w-full h-full min-h-0", props.className)}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <EzVirtualTree
                        items={flattenedNodes}
                        expandedNodes={expandedNodes}
                        selectedNodes={selectedNodes}
                        checkedNodes={checkedNodes}
                        indeterminateNodes={indeterminateNodes}
                        loadingNodes={loadingNodes}
                        onToggleExpand={toggleExpand}
                        onToggleSelect={toggleSelect}
                        onToggleCheck={toggleCheck}
                        onNodeRename={handleNodeRename}
                        dir={dir}
                        showCheckboxes={props.showCheckboxes}
                        allowEditing={props.allowEditing}
                        searchTerm={props.searchTerm}

                        slots={props.slots}
                        slotProps={props.slotProps}
                        allowTextWrap={allowTextWrap}
                        animation={animation}
                        checkOnClick={checkOnClick}
                        fullRowSelect={fullRowSelect}
                        fullRowNavigable={fullRowNavigable}
                        onKeyPress={onKeyPress}
                        onNodeClicked={onNodeClicked}
                        onDrawNode={onDrawNode}
                        editingNodeId={editingNodeId}
                        setEditingNodeId={setEditingNodeId}
                    />
                </DndContext>
            </div>
        </EzErrorBoundary>
    );
};
