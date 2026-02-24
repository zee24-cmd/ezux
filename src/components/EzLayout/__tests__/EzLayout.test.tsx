import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { EzLayout } from '../index';
import { EzProvider } from '../../../shared/contexts/EzProvider';
import '@testing-library/jest-dom';

describe('EzLayout', () => {
    it('renders the layout and sidebar without crashing', () => {
        const { container } = render(
            <EzProvider>
                <EzLayout
                    sidebar={{ navigation: [] }}
                    header={{ title: 'Test App' }}
                >
                    <div data-testid="content">Content</div>
                </EzLayout>
            </EzProvider>
        );
        expect(container).toBeInTheDocument();
    });
});
