import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EzFlowCanvas } from '../EzFlowCanvas';
import { EzFlowEdge } from '../EzFlowEdge';
import type { EzFlowCanvasProps } from '../EzFlow.types';

const reactFlowMock = vi.hoisted(() => ({
  latestProps: undefined as Record<string, unknown> | undefined,
}));

vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ children, ...props }: Record<string, unknown> & { children?: React.ReactNode }) => {
    reactFlowMock.latestProps = props;
    return <div data-testid="react-flow">{children}</div>;
  },
  BaseEdge: () => <path data-testid="base-edge" />,
  EdgeLabelRenderer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  getSmoothStepPath: () => ['M 0 0 L 1 1', 10, 20],
  Controls: (props: Record<string, unknown>) => <div data-testid="controls" {...props} />,
  Background: () => <div data-testid="background" />,
  Handle: (props: Record<string, unknown>) => <div data-testid="handle" {...props} />,
  NodeResizer: () => <div data-testid="node-resizer" />,
  Position: { Top: 'top', Bottom: 'bottom', Left: 'left', Right: 'right' },
}));

const baseCanvasProps: EzFlowCanvasProps = {
  nodes: [
    { id: 'start', type: 'startNode', position: { x: 0, y: 0 }, data: { label: 'Start' } },
    { id: 'loop', type: 'loopNode', position: { x: 100, y: 0 }, data: { label: 'Loop' } },
    { id: 'action', type: 'actionNode', position: { x: 200, y: 0 }, data: { label: 'Action' } },
  ],
  edges: [
    { id: 'start-loop', source: 'start', target: 'loop' },
    { id: 'loop-action', source: 'loop', target: 'action' },
  ],
  onNodesChange: vi.fn(),
  onEdgesChange: vi.fn(),
  onConnect: vi.fn(),
};

describe('EzFlowCanvas', () => {
  it('passes read-only state through to React Flow interaction props', () => {
    render(<EzFlowCanvas {...baseCanvasProps} readOnly />);

    expect(reactFlowMock.latestProps?.onNodesChange).toBeUndefined();
    expect(reactFlowMock.latestProps?.onEdgesChange).toBeUndefined();
    expect(reactFlowMock.latestProps?.onConnect).toBeUndefined();
    expect(reactFlowMock.latestProps?.nodesDraggable).toBe(false);
    expect(reactFlowMock.latestProps?.nodesConnectable).toBe(false);
    expect(reactFlowMock.latestProps?.elementsSelectable).toBe(false);
  });

  it('allows loop-backed cycles but blocks non-loop cycles', () => {
    render(<EzFlowCanvas {...baseCanvasProps} />);
    const isValidConnection = reactFlowMock.latestProps?.isValidConnection as EzFlowCanvasProps['isValidConnection'];

    expect(isValidConnection?.({ source: 'action', target: 'loop' })).toBe(true);
    expect(isValidConnection?.({ source: 'action', target: 'action' })).toBe(false);

    render(
      <EzFlowCanvas
        {...baseCanvasProps}
        nodes={[
          { id: 'start', type: 'startNode', position: { x: 0, y: 0 }, data: { label: 'Start' } },
          { id: 'action', type: 'actionNode', position: { x: 100, y: 0 }, data: { label: 'Action' } },
        ]}
        edges={[{ id: 'start-action', source: 'start', target: 'action' }]}
      />
    );
    const nonLoopValidation = reactFlowMock.latestProps?.isValidConnection as EzFlowCanvasProps['isValidConnection'];

    expect(nonLoopValidation?.({ source: 'action', target: 'start' })).toBe(false);
  });

  it('supports consumer connection validation overrides', () => {
    const isValidConnection = vi.fn(() => false);
    render(<EzFlowCanvas {...baseCanvasProps} isValidConnection={isValidConnection} />);
    const passedValidation = reactFlowMock.latestProps?.isValidConnection as EzFlowCanvasProps['isValidConnection'];

    expect(passedValidation?.({ source: 'start', target: 'action' })).toBe(false);
    expect(isValidConnection).toHaveBeenCalledWith({ source: 'start', target: 'action' });
  });

  it('injects edge delete handling into the default edge renderer', async () => {
    const onEdgeDelete = vi.fn();
    render(<EzFlowCanvas {...baseCanvasProps} onEdgeDelete={onEdgeDelete} />);
    const edgeTypes = reactFlowMock.latestProps?.edgeTypes as Record<string, React.ComponentType<Record<string, unknown>>>;
    const Edge = edgeTypes.ezEdge;

    render(<Edge id="edge-1" selected sourceX={0} sourceY={0} targetX={10} targetY={10} />);
    await userEvent.click(screen.getByRole('button', { name: /delete edge/i }));

    expect(onEdgeDelete).toHaveBeenCalledWith('edge-1');
  });
});

describe('EzFlowEdge', () => {
  it('calls onDelete when the selected edge delete button is clicked', async () => {
    const onDelete = vi.fn();
    render(<EzFlowEdge id="edge-1" selected sourceX={0} sourceY={0} targetX={10} targetY={10} onDelete={onDelete} />);

    await userEvent.click(screen.getByRole('button', { name: /delete edge/i }));

    expect(onDelete).toHaveBeenCalledWith('edge-1');
  });
});
