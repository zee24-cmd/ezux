import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { EzTreeView } from '../index';
import { EzProvider } from '../../../shared/contexts/EzProvider';
import '@testing-library/jest-dom';

describe('EzTreeView', () => {
    it('renders tree view without crashing', () => {
        const { container } = render(
            <EzProvider>
                <EzTreeView
                    data={[{ id: '1', label: 'Root Node', children: [] }]}
                />
            </EzProvider>
        );
        expect(container).toBeInTheDocument();
    });
});
