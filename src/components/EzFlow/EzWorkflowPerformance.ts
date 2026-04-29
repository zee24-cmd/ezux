import { validateEzWorkflow } from './EzWorkflow';
import type { EzFlowSerializedState, EzWorkflowPerformanceSample } from './EzFlow.types';

export const createLargeEzWorkflow = (nodeCount: number): EzFlowSerializedState => {
  const safeCount = Math.max(2, Math.floor(nodeCount));
  const nodes = Array.from({ length: safeCount }, (_, index) => {
    if (index === 0) {
      return { id: 'node-0', type: 'startNode', position: { x: 0, y: 0 }, data: { label: 'Start' } };
    }
    if (index === safeCount - 1) {
      return { id: `node-${index}`, type: 'endNode', position: { x: index * 180, y: 0 }, data: { label: 'End' } };
    }
    return {
      id: `node-${index}`,
      type: 'actionNode',
      position: { x: index * 180, y: (index % 5) * 120 },
      data: { label: `Action ${index}`, actionType: 'noop' },
    };
  });

  return {
    nodes,
    edges: nodes.slice(0, -1).map((node, index) => ({
      id: `${node.id}-${nodes[index + 1].id}`,
      source: node.id,
      target: nodes[index + 1].id,
      type: 'ezEdge',
    })),
    metadata: {
      title: `${safeCount} node performance workflow`,
      status: 'draft',
      version: 1,
    },
  };
};

export const measureEzWorkflowValidation = (nodeCount: number): EzWorkflowPerformanceSample => {
  const workflow = createLargeEzWorkflow(nodeCount);
  const now = typeof performance !== 'undefined' ? () => performance.now() : () => Date.now();
  const start = now();
  const result = validateEzWorkflow(workflow);

  return {
    nodeCount: workflow.nodes.length,
    edgeCount: workflow.edges.length,
    validateMs: now() - start,
    valid: result.valid,
    issueCount: result.issues.length,
  };
};
