import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { EzKanban } from '../index';
import { EzProvider } from '../../../shared/contexts/EzProvider';
import '@testing-library/jest-dom';

describe('EzKanban', () => {
    it('renders the board without crashing', () => {
        const { container } = render(
            <EzProvider>
                <EzKanban data={[]} columns={[]} />
            </EzProvider>
        );
        expect(container).toBeInTheDocument();
    });
});
