import type { Edge, Node } from '@xyflow/react';
import { CheckCircle2, Circle, Clock, Diamond, GitBranch, Hand, Play, Send, SquareStack } from 'lucide-react';
import {
  ActionNode,
  ApprovalNode,
  DecisionNode,
  DelayNode,
  EndNode,
  GroupNode,
  LoopNode,
  RequestNode,
  StartNode,
} from './nodes';
import type {
  EzFlowBaseNodeData,
  EzFlowNodeData,
  EzFlowNodeLibraryCategory,
  EzFlowNodeType,
  EzFlowSerializedState,
  EzWorkflowNodeRegistry,
  EzWorkflowValidationIssue,
  EzWorkflowValidationResult,
} from './EzFlow.types';

export const emptyWorkflow: EzFlowSerializedState = {
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  metadata: { title: 'Untitled Workflow', status: 'draft', version: 1 },
};

const defaultNodeData: Record<EzFlowNodeType, EzFlowNodeData> = {
  startNode: { label: 'Start', triggerType: 'manual' },
  endNode: { label: 'End', outcome: 'success' },
  decisionNode: { label: 'Decision', branches: [] },
  loopNode: { label: 'Loop', iteratorSource: '', maxIterations: 10 },
  actionNode: { label: 'Action', actionType: '', config: {} },
  requestNode: { label: 'API Request', method: 'GET', url: '' },
  delayNode: { label: 'Delay', duration: 1, unit: 'hours' },
  approvalNode: { label: 'Approval', approverRole: '' },
  groupNode: { label: 'Group', collapsed: false },
};

export const ezWorkflowDefaultNodeRegistry = {
  startNode: {
    type: 'startNode',
    label: 'Start',
    description: 'Workflow entry point',
    category: 'flow_control',
    icon: <Play size={16} />,
    component: StartNode,
    defaultData: defaultNodeData.startNode,
  },
  endNode: {
    type: 'endNode',
    label: 'End',
    description: 'Workflow completion',
    category: 'flow_control',
    icon: <CheckCircle2 size={16} />,
    component: EndNode,
    defaultData: defaultNodeData.endNode,
  },
  decisionNode: {
    type: 'decisionNode',
    label: 'Decision',
    description: 'Branch by condition',
    category: 'logic',
    icon: <Diamond size={16} />,
    component: DecisionNode,
    defaultData: defaultNodeData.decisionNode,
    requiredDataKeys: ['branches'],
  },
  loopNode: {
    type: 'loopNode',
    label: 'Loop',
    description: 'Repeat a path',
    category: 'flow_control',
    icon: <GitBranch size={16} />,
    component: LoopNode,
    defaultData: defaultNodeData.loopNode,
    requiredDataKeys: ['iteratorSource'],
  },
  actionNode: {
    type: 'actionNode',
    label: 'Action',
    description: 'Run an action',
    category: 'execution',
    icon: <Circle size={16} />,
    component: ActionNode,
    defaultData: defaultNodeData.actionNode,
    requiredDataKeys: ['actionType'],
  },
  requestNode: {
    type: 'requestNode',
    label: 'API Request',
    description: 'Call an HTTP endpoint',
    category: 'execution',
    icon: <Send size={16} />,
    component: RequestNode,
    defaultData: defaultNodeData.requestNode,
    requiredDataKeys: ['url'],
  },
  delayNode: {
    type: 'delayNode',
    label: 'Delay',
    description: 'Pause execution',
    category: 'logic',
    icon: <Clock size={16} />,
    component: DelayNode,
    defaultData: defaultNodeData.delayNode,
    requiredDataKeys: ['duration'],
  },
  approvalNode: {
    type: 'approvalNode',
    label: 'Approval',
    description: 'Wait for a person',
    category: 'human',
    icon: <Hand size={16} />,
    component: ApprovalNode,
    defaultData: defaultNodeData.approvalNode,
    requiredDataKeys: ['approverRole'],
  },
  groupNode: {
    type: 'groupNode',
    label: 'Group',
    description: 'Organize nodes',
    category: 'structural',
    icon: <SquareStack size={16} />,
    component: GroupNode,
    defaultData: defaultNodeData.groupNode,
  },
} satisfies EzWorkflowNodeRegistry;

const categoryOrder = ['flow_control', 'logic', 'execution', 'human', 'structural'];
const categoryLabels: Record<string, string> = {
  flow_control: 'Flow',
  logic: 'Logic',
  execution: 'Work',
  human: 'Human',
  structural: 'Structure',
};

export const cloneWorkflow = (workflow: EzFlowSerializedState): EzFlowSerializedState => ({
  ...workflow,
  nodes: workflow.nodes.map((node) => ({ ...node, data: { ...node.data } })),
  edges: workflow.edges.map((edge) => ({ ...edge, data: edge.data ? { ...edge.data } : edge.data })),
  metadata: workflow.metadata ? { ...workflow.metadata } : undefined,
  viewport: workflow.viewport ? { ...workflow.viewport } : undefined,
});

const isMissing = (value: unknown) =>
  value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

const reachableTargets = (nodeId: string, edges: Edge[]) => edges.filter((edge) => edge.source === nodeId).map((edge) => edge.target);

export const createEzWorkflowNodeLibrary = (
  registry: EzWorkflowNodeRegistry = ezWorkflowDefaultNodeRegistry
): EzFlowNodeLibraryCategory[] => {
  const categories = new Map<string, EzFlowNodeLibraryCategory>();

  Object.values(registry).forEach((item) => {
    const existing =
      categories.get(item.category) ??
      ({
        categoryKey: categoryLabels[item.category] ?? item.category,
        category: item.category,
        items: [],
      } satisfies EzFlowNodeLibraryCategory);

    existing.items.push({
      type: item.type as EzFlowNodeType,
      labelKey: item.label,
      descriptionKey: item.description,
      category: item.category,
      icon: item.icon ?? <Circle size={16} />,
      defaultData: item.defaultData,
    });
    categories.set(item.category, existing);
  });

  return Array.from(categories.values()).sort(
    (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
  );
};

export const validateEzWorkflow = (
  workflow: EzFlowSerializedState,
  registry: EzWorkflowNodeRegistry = ezWorkflowDefaultNodeRegistry
): EzWorkflowValidationResult => {
  const issues: EzWorkflowValidationIssue[] = [];
  const startNodes = workflow.nodes.filter((node) => node.type === 'startNode');
  const endNodes = workflow.nodes.filter((node) => node.type === 'endNode');
  const endNodeIds = new Set(endNodes.map((node) => node.id));
  const nodeById = new Map(workflow.nodes.map((node) => [node.id, node]));
  const incoming = new Map<string, number>();
  const outgoing = new Map<string, number>();

  workflow.edges.forEach((edge) => {
    incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1);
    outgoing.set(edge.source, (outgoing.get(edge.source) ?? 0) + 1);
  });

  if (startNodes.length === 0) {
    issues.push({ code: 'missing_start', severity: 'error', message: 'Workflow requires a start node.' });
  }
  if (endNodes.length === 0) {
    issues.push({ code: 'missing_end', severity: 'error', message: 'Workflow requires an end node.' });
  }

  workflow.nodes.forEach((node) => {
    if (node.type !== 'startNode' && node.type !== 'groupNode' && (incoming.get(node.id) ?? 0) === 0) {
      issues.push({ code: 'orphan_node', severity: 'error', message: 'Node has no incoming path.', nodeId: node.id });
    }

    const registryItem = registry[String(node.type ?? '')];
    registryItem?.requiredDataKeys?.forEach((field) => {
      if (isMissing(node.data?.[field])) {
        issues.push({
          code: 'missing_required_config',
          severity: 'error',
          message: `${registryItem.label} requires ${field}.`,
          nodeId: node.id,
          field,
        });
      }
    });

    if (!node.data?.label) {
      issues.push({ code: 'missing_required_config', severity: 'error', message: 'Node label is required.', nodeId: node.id, field: 'label' });
    }

    if (node.type === 'decisionNode') {
      const branches = Array.isArray(node.data?.branches) ? node.data.branches : [];
      if (branches.length < 2 || (outgoing.get(node.id) ?? 0) < branches.length) {
        issues.push({
          code: 'missing_decision_branch',
          severity: 'error',
          message: 'Decision nodes require branch coverage for each outcome.',
          nodeId: node.id,
          field: 'branches',
        });
      }
    }

    issues.push(...(registryItem?.validate?.(node as Node<EzFlowBaseNodeData>, workflow) ?? []));
  });

  workflow.nodes.forEach((node) => {
    if (node.type === 'endNode' || node.type === 'groupNode') return;

    const visited = new Set<string>();
    const queue = [node.id];
    let hasEndPath = false;

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || visited.has(current)) continue;
      visited.add(current);
      if (endNodeIds.has(current)) {
        hasEndPath = true;
        break;
      }
      queue.push(...reachableTargets(current, workflow.edges));
    }

    if (!hasEndPath) {
      issues.push({ code: 'missing_end_path', severity: 'error', message: 'Node has no path to an end node.', nodeId: node.id });
    }
  });

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (nodeId: string, path: string[]): void => {
    if (visiting.has(nodeId)) {
      const cycleNodes = path.slice(path.indexOf(nodeId));
      const hasLoopNode = cycleNodes.some((id) => nodeById.get(id)?.type === 'loopNode');
      if (!hasLoopNode) {
        issues.push({ code: 'invalid_cycle', severity: 'error', message: 'Workflow cycles require a loop node.', nodeId });
      }
      return;
    }
    if (visited.has(nodeId)) return;

    visiting.add(nodeId);
    reachableTargets(nodeId, workflow.edges).forEach((targetId) => visit(targetId, [...path, targetId]));
    visiting.delete(nodeId);
    visited.add(nodeId);
  };

  workflow.nodes.forEach((node) => visit(node.id, [node.id]));
  return { valid: !issues.some((issue) => issue.severity === 'error'), issues };
};

export const validateWorkflow = validateEzWorkflow;
