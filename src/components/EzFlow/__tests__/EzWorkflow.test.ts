import { describe, expect, it } from 'vitest';
import { createLargeEzWorkflow, measureEzWorkflowValidation } from '../EzWorkflowPerformance';
import { createLocalEzWorkflowService, EzWorkflowOptimisticService, EzWorkflowRestService } from '../EzWorkflowServiceAdapters';
import { validateEzWorkflow } from '../EzWorkflow';
import {
  apiRequestWorkflowExample,
  approvalWorkflowExample,
  humanReviewWorkflowExample,
  scheduledWorkflowExample,
} from '../EzFlow.examples';
import type { EzFlowSerializedState } from '../EzFlow.types';

describe('EzWorkflow validation', () => {
  it('accepts bundled production workflow examples', () => {
    [
      approvalWorkflowExample,
      apiRequestWorkflowExample,
      scheduledWorkflowExample,
      humanReviewWorkflowExample,
    ].forEach((workflow) => {
      expect(validateEzWorkflow(workflow).valid).toBe(true);
    });
  });

  it('requires start and end nodes', () => {
    const workflow: EzFlowSerializedState = {
      nodes: [{ id: 'action', type: 'actionNode', position: { x: 0, y: 0 }, data: { label: 'Run', actionType: 'sync' } }],
      edges: [],
    };

    const result = validateEzWorkflow(workflow);

    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain('missing_start');
    expect(result.issues.map((issue) => issue.code)).toContain('missing_end');
  });

  it('blocks cycles unless a loop node participates', () => {
    const workflow: EzFlowSerializedState = {
      nodes: [
        { id: 'start', type: 'startNode', position: { x: 0, y: 0 }, data: { label: 'Start' } },
        { id: 'a', type: 'actionNode', position: { x: 100, y: 0 }, data: { label: 'A', actionType: 'sync' } },
        { id: 'b', type: 'actionNode', position: { x: 200, y: 0 }, data: { label: 'B', actionType: 'sync' } },
        { id: 'end', type: 'endNode', position: { x: 300, y: 0 }, data: { label: 'End' } },
      ],
      edges: [
        { id: 'start-a', source: 'start', target: 'a' },
        { id: 'a-b', source: 'a', target: 'b' },
        { id: 'b-a', source: 'b', target: 'a' },
        { id: 'b-end', source: 'b', target: 'end' },
      ],
    };

    expect(validateEzWorkflow(workflow).issues.map((issue) => issue.code)).toContain('invalid_cycle');
  });

  it('allows cycles when a loop node participates', () => {
    const workflow: EzFlowSerializedState = {
      nodes: [
        { id: 'start', type: 'startNode', position: { x: 0, y: 0 }, data: { label: 'Start' } },
        { id: 'loop', type: 'loopNode', position: { x: 100, y: 0 }, data: { label: 'Loop', iteratorSource: 'items' } },
        { id: 'a', type: 'actionNode', position: { x: 200, y: 0 }, data: { label: 'A', actionType: 'sync' } },
        { id: 'end', type: 'endNode', position: { x: 300, y: 0 }, data: { label: 'End' } },
      ],
      edges: [
        { id: 'start-loop', source: 'start', target: 'loop' },
        { id: 'loop-a', source: 'loop', target: 'a' },
        { id: 'a-loop', source: 'a', target: 'loop' },
        { id: 'loop-end', source: 'loop', target: 'end' },
      ],
    };

    expect(validateEzWorkflow(workflow).issues.map((issue) => issue.code)).not.toContain('invalid_cycle');
  });

  it('reports required node config, decision branches, orphan nodes, and missing end paths', () => {
    const workflow: EzFlowSerializedState = {
      nodes: [
        { id: 'start', type: 'startNode', position: { x: 0, y: 0 }, data: { label: 'Start' } },
        { id: 'decision', type: 'decisionNode', position: { x: 100, y: 0 }, data: { label: 'Decision', branches: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }] } },
        { id: 'request', type: 'requestNode', position: { x: 200, y: 0 }, data: { label: 'Request', method: 'GET', url: '' } },
        { id: 'approval', type: 'approvalNode', position: { x: 300, y: 0 }, data: { label: 'Approval', approverRole: '' } },
        { id: 'end', type: 'endNode', position: { x: 400, y: 0 }, data: { label: 'End' } },
        { id: 'orphan', type: 'actionNode', position: { x: 0, y: 160 }, data: { label: 'Orphan', actionType: '' } },
      ],
      edges: [
        { id: 'start-decision', source: 'start', target: 'decision' },
        { id: 'decision-request', source: 'decision', target: 'request' },
        { id: 'request-approval', source: 'request', target: 'approval' },
      ],
    };

    const codes = validateEzWorkflow(workflow).issues.map((issue) => issue.code);

    expect(codes).toContain('missing_required_config');
    expect(codes).toContain('missing_decision_branch');
    expect(codes).toContain('orphan_node');
    expect(codes).toContain('missing_end_path');
  });

  it('runs custom registry validators', () => {
    const workflow: EzFlowSerializedState = {
      nodes: [
        { id: 'start', type: 'startNode', position: { x: 0, y: 0 }, data: { label: 'Start' } },
        { id: 'custom', type: 'customNode', position: { x: 100, y: 0 }, data: { label: 'Custom' } },
        { id: 'end', type: 'endNode', position: { x: 200, y: 0 }, data: { label: 'End' } },
      ],
      edges: [
        { id: 'start-custom', source: 'start', target: 'custom' },
        { id: 'custom-end', source: 'custom', target: 'end' },
      ],
    };

    const result = validateEzWorkflow(workflow, {
      customNode: {
        type: 'customNode',
        label: 'Custom',
        category: 'execution',
        defaultData: { label: 'Custom' },
        validate: (node) => [{ code: 'missing_required_config', severity: 'warning', message: 'Custom warning', nodeId: node.id }],
      },
    });

    expect(result.valid).toBe(true);
    expect(result.issues).toEqual(expect.arrayContaining([expect.objectContaining({ message: 'Custom warning' })]));
  });
});

describe('EzWorkflow service adapters', () => {
  it('provides a local service for examples and tests', async () => {
    const service = createLocalEzWorkflowService({ approval: approvalWorkflowExample });

    await expect(service.loadWorkflow('approval')).resolves.toEqual(approvalWorkflowExample);
    await service.publishWorkflow('approval', approvalWorkflowExample);

    expect(service.workflows.get('approval')?.metadata?.status).toBe('live');
  });

  it('wraps REST calls with workflow endpoints', async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const fetcher: typeof fetch = async (url, init) => {
      calls.push({ url: String(url), init });
      return new Response(JSON.stringify(approvalWorkflowExample), { status: 200, headers: { 'content-type': 'application/json' } });
    };
    const service = new EzWorkflowRestService({ baseUrl: 'https://api.example.com', fetcher });

    await service.loadWorkflow('wf 1');
    await service.saveWorkflow('wf 1', approvalWorkflowExample);
    await service.publishWorkflow('wf 1', approvalWorkflowExample);
    await service.validateWorkflow(approvalWorkflowExample);

    expect(calls.map((call) => call.url)).toEqual([
      'https://api.example.com/workflows/wf%201',
      'https://api.example.com/workflows/wf%201',
      'https://api.example.com/workflows/wf%201/publish',
      'https://api.example.com/workflows/validate',
    ]);
    expect(calls[1].init?.method).toBe('PUT');
    expect(calls[2].init?.method).toBe('POST');
  });

  it('rolls optimistic state back when a save fails', async () => {
    const stable = approvalWorkflowExample;
    const next = { ...approvalWorkflowExample, metadata: { ...approvalWorkflowExample.metadata, title: 'Changed' } };
    const failing = createLocalEzWorkflowService({ stable });
    failing.saveWorkflow = async () => {
      throw new Error('offline');
    };
    const service = new EzWorkflowOptimisticService(failing);

    await service.loadWorkflow('stable');
    await expect(service.saveWorkflow('stable', next)).rejects.toThrow('offline');

    expect(service.getRollbackWorkflow()).toBe(stable);
  });
});

describe('EzWorkflow performance helpers', () => {
  it.each([100, 500, 1000])('creates and validates a %i node workflow fixture', (nodeCount) => {
    const workflow = createLargeEzWorkflow(nodeCount);
    const sample = measureEzWorkflowValidation(nodeCount);

    expect(workflow.nodes).toHaveLength(nodeCount);
    expect(workflow.edges).toHaveLength(nodeCount - 1);
    expect(sample).toMatchObject({ nodeCount, edgeCount: nodeCount - 1, valid: true, issueCount: 0 });
    expect(sample.validateMs).toBeGreaterThanOrEqual(0);
  });
});
