import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EzFlowToolbox } from '../EzFlowToolbox';
import type { EzFlowNodeLibraryCategory } from '../EzFlow.types';

const categories: EzFlowNodeLibraryCategory[] = [
  {
    category: 'execution',
    categoryKey: 'Work',
    items: [
      {
        type: 'actionNode',
        labelKey: 'Action',
        descriptionKey: 'Run an action',
        category: 'execution',
        icon: <span aria-hidden="true">A</span>,
      },
    ],
  },
];

describe('EzFlowToolbox accessibility', () => {
  it('activates a node from the keyboard', async () => {
    const onNodeActivate = vi.fn();
    render(<EzFlowToolbox categories={categories} onNodeActivate={onNodeActivate} />);

    await screen.getByRole('button', { name: /drag action node/i }).focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');

    expect(onNodeActivate).toHaveBeenCalledTimes(2);
    expect(onNodeActivate).toHaveBeenCalledWith(expect.objectContaining({ type: 'actionNode' }));
  });

  it('keeps collapsed library items keyboard accessible', async () => {
    const onNodeActivate = vi.fn();
    render(<EzFlowToolbox categories={categories} collapsed onNodeActivate={onNodeActivate} />);

    await screen.getByRole('button', { name: /drag action node/i }).focus();
    await userEvent.keyboard('{Enter}');

    expect(onNodeActivate).toHaveBeenCalledWith(expect.objectContaining({ type: 'actionNode' }));
  });
});
