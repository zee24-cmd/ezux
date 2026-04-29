import type { EzFlowSerializedState } from './EzFlow.types';

export const approvalWorkflowExample: EzFlowSerializedState = {
  nodes: [
    { id: 'start', type: 'startNode', position: { x: 0, y: 120 }, data: { label: 'Request submitted', triggerType: 'manual' } },
    { id: 'approval', type: 'approvalNode', position: { x: 280, y: 120 }, data: { label: 'Manager approval', approverRole: 'manager', slaHours: 24 } },
    { id: 'decision', type: 'decisionNode', position: { x: 560, y: 120 }, data: { label: 'Approved?', branches: [{ id: 'yes', label: 'Approved' }, { id: 'no', label: 'Rejected' }] } },
    { id: 'end-success', type: 'endNode', position: { x: 840, y: 40 }, data: { label: 'Approved', outcome: 'success' } },
    { id: 'end-failure', type: 'endNode', position: { x: 840, y: 200 }, data: { label: 'Rejected', outcome: 'failure' } },
  ],
  edges: [
    { id: 'start-approval', source: 'start', target: 'approval', type: 'ezEdge' },
    { id: 'approval-decision', source: 'approval', target: 'decision', type: 'ezEdge' },
    { id: 'decision-success', source: 'decision', target: 'end-success', type: 'ezEdge' },
    { id: 'decision-failure', source: 'decision', target: 'end-failure', type: 'ezEdge' },
  ],
  metadata: { title: 'Approval workflow', description: 'Human approval with positive and negative outcomes.', status: 'draft', version: 1 },
};

export const apiRequestWorkflowExample: EzFlowSerializedState = {
  nodes: [
    { id: 'start', type: 'startNode', position: { x: 0, y: 100 }, data: { label: 'Webhook received', triggerType: 'webhook' } },
    { id: 'request', type: 'requestNode', position: { x: 280, y: 100 }, data: { label: 'Create ticket', method: 'POST', url: 'https://api.example.com/tickets' } },
    { id: 'end', type: 'endNode', position: { x: 560, y: 100 }, data: { label: 'Ticket created', outcome: 'success' } },
  ],
  edges: [
    { id: 'start-request', source: 'start', target: 'request', type: 'ezEdge' },
    { id: 'request-end', source: 'request', target: 'end', type: 'ezEdge' },
  ],
  metadata: { title: 'API request workflow', description: 'Webhook to HTTP request.', status: 'draft', version: 1 },
};

export const scheduledWorkflowExample: EzFlowSerializedState = {
  nodes: [
    { id: 'start', type: 'startNode', position: { x: 0, y: 100 }, data: { label: 'Nightly schedule', triggerType: 'scheduled' } },
    { id: 'delay', type: 'delayNode', position: { x: 280, y: 100 }, data: { label: 'Wait for upstream data', duration: 30, unit: 'minutes' } },
    { id: 'action', type: 'actionNode', position: { x: 560, y: 100 }, data: { label: 'Run reconciliation', actionType: 'reconcile' } },
    { id: 'end', type: 'endNode', position: { x: 840, y: 100 }, data: { label: 'Completed', outcome: 'success' } },
  ],
  edges: [
    { id: 'start-delay', source: 'start', target: 'delay', type: 'ezEdge' },
    { id: 'delay-action', source: 'delay', target: 'action', type: 'ezEdge' },
    { id: 'action-end', source: 'action', target: 'end', type: 'ezEdge' },
  ],
  metadata: { title: 'Scheduled workflow', description: 'Scheduled job with delayed execution.', status: 'draft', version: 1 },
};

export const humanReviewWorkflowExample: EzFlowSerializedState = {
  nodes: [
    { id: 'start', type: 'startNode', position: { x: 0, y: 100 }, data: { label: 'Case opened', triggerType: 'manual' } },
    { id: 'review', type: 'approvalNode', position: { x: 280, y: 100 }, data: { label: 'Specialist review', approverRole: 'specialist', escalationRole: 'team-lead', slaHours: 8 } },
    { id: 'action', type: 'actionNode', position: { x: 560, y: 100 }, data: { label: 'Apply decision', actionType: 'apply-review-outcome' } },
    { id: 'end', type: 'endNode', position: { x: 840, y: 100 }, data: { label: 'Case closed', outcome: 'success' } },
  ],
  edges: [
    { id: 'start-review', source: 'start', target: 'review', type: 'ezEdge' },
    { id: 'review-action', source: 'review', target: 'action', type: 'ezEdge' },
    { id: 'action-end', source: 'action', target: 'end', type: 'ezEdge' },
  ],
  metadata: { title: 'Human review workflow', description: 'Human review followed by an automated action.', status: 'draft', version: 1 },
};
