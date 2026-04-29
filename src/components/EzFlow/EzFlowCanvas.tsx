import React from 'react';
import { ReactFlow, type EdgeTypes } from '@xyflow/react';
import type { EzFlowCanvasProps } from './EzFlow.types';
import { cn } from '../../lib/utils';
import {
  StartNode,
  EndNode,
  DecisionNode,
  LoopNode,
  ActionNode,
  RequestNode,
  DelayNode,
  ApprovalNode,
  GroupNode,
} from './nodes';
import { EzFlowEdge } from './EzFlowEdge';
import { EzConnectionLine } from './EzConnectionLine';
import { EzFlowBackground } from './EzFlowBackground';
import { EzFlowControls } from './EzFlowControls';

const defaultNodeTypes = {
  startNode: StartNode,
  endNode: EndNode,
  decisionNode: DecisionNode,
  loopNode: LoopNode,
  actionNode: ActionNode,
  requestNode: RequestNode,
  delayNode: DelayNode,
  approvalNode: ApprovalNode,
  groupNode: GroupNode,
};

export const EzFlowCanvas = React.forwardRef<HTMLDivElement, EzFlowCanvasProps>(
  (
    {
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      onDrop,
      onDragOver,
      onNodeClick,
      onNodeDoubleClick,
      onEdgeClick,
      onEdgeDelete,
      onPaneClick,
      nodeTypes = defaultNodeTypes,
      edgeTypes,
      isValidConnection: isValidConnectionProp,
      snapToGrid = true,
      snapGrid = [15, 15],
      showGrid = true,
      fitView = false,
      readOnly = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const resolvedEdgeTypes = React.useMemo<EdgeTypes>(
      () =>
        edgeTypes ?? {
          ezEdge: (edgeProps) => <EzFlowEdge {...edgeProps} onDelete={onEdgeDelete} />,
        },
      [edgeTypes, onEdgeDelete]
    );

    const isValidConnection = React.useCallback(
      (connection: { source: string | null; target: string | null }) => {
        if (isValidConnectionProp) return isValidConnectionProp(connection);
        if (!connection.source || !connection.target) return false;
        if (connection.source === connection.target) return false;

        const nodeById = new Map(nodes.map((node) => [node.id, node]));
        const visited = new Set<string>();
        const queue: Array<{ id: string; path: string[] }> = [{ id: connection.target, path: [connection.target] }];

        while (queue.length > 0) {
          const current = queue.shift();
          if (!current || visited.has(current.id)) continue;
          visited.add(current.id);

          for (const edge of edges) {
            if (edge.source === current.id) {
              if (edge.target === connection.source) {
                const cycleNodeIds = [...current.path, edge.target];
                return cycleNodeIds.some((nodeId) => nodeById.get(nodeId)?.type === 'loopNode');
              }
              queue.push({ id: edge.target, path: [...current.path, edge.target] });
            }
          }
        }

        return true;
      },
      [edges, isValidConnectionProp, nodes]
    );

    return (
      <div
        ref={ref}
        className={cn(
          'w-full h-full min-h-0 relative',
          className
        )}
        style={style}
        {...props}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={readOnly ? undefined : onNodesChange}
          onEdgesChange={readOnly ? undefined : onEdgesChange}
          onConnect={readOnly ? undefined : onConnect}
          onDrop={readOnly ? undefined : onDrop}
          onDragOver={readOnly ? undefined : onDragOver}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={resolvedEdgeTypes}
          connectionLineComponent={EzConnectionLine}
          isValidConnection={isValidConnection}
          fitView={fitView}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          panOnScroll
          zoomOnScroll={false}
          snapToGrid={snapToGrid}
          snapGrid={snapGrid}
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly}
          elementsSelectable={!readOnly}
          defaultEdgeOptions={{
            type: 'ezEdge',
            animated: true,
            selectable: true,
          }}
          proOptions={{ hideAttribution: true }}
        >
          {showGrid && <EzFlowBackground gap={snapGrid[0]} size={1.5} />}
          <EzFlowControls aria-label="Canvas controls" />
        </ReactFlow>
      </div>
    );
  }
);

EzFlowCanvas.displayName = 'EzFlowCanvas';
