
import { render, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React, { useRef } from 'react';
import { EzTable } from '../index';
import { EzTableRef, ColumnDef } from '../EzTable.types';

// Mock data
interface User {
    id: number;
    name: string;
    role: string;
}

const data: User[] = [
    { id: 1, name: 'Alice', role: 'Admin' },
    { id: 2, name: 'Bob', role: 'User' },
];

const columns: ColumnDef<User>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'role', header: 'Role' },
];

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

describe('EzTable Enterprise API', () => {
    it('exposes essential imperative methods via ref', () => {
        let tableRef: EzTableRef<User> | null = null;

        const TestComponent = () => {
            const ref = useRef<EzTableRef<User>>(null);
            React.useEffect(() => {
                tableRef = ref.current;
            }, []);

            return <EzTable ref={ref} data={data} columns={columns} />;
        };

        render(<TestComponent />);

        expect(tableRef).not.toBeNull();
        const api = (tableRef as any) as EzTableRef<User>;
        if (api) {
            // Core Data
            expect(api.getData).toBeDefined();
            expect(api.refresh).toBeDefined();
            expect(api.getColumns).toBeDefined(); // New
            expect(api.getRowInfo).toBeDefined(); // New
            expect(api.getDataModule).toBeDefined(); // New

            // Interaction
            expect(api.selectRow).toBeDefined();
            expect(api.selectRowByRange).toBeDefined(); // New
            expect(api.clearRowSelection).toBeDefined(); // New

            // CRUD
            expect(api.addRecord).toBeDefined();

            // UI
            expect(api.showSpinner).toBeDefined();
            expect(api.setPagerMessage).toBeDefined(); // New
        }
    });

    it('imperative getData returns current data', () => {
        let tableRef: EzTableRef<User> | null = null;
        const TestComponent = () => {
            const ref = useRef<EzTableRef<User>>(null);
            React.useEffect(() => {
                tableRef = ref.current;
            }, []);
            return <EzTable ref={ref} data={data} columns={columns} />;
        };

        render(<TestComponent />);
        expect((tableRef as any)?.getData()).toEqual(data);
    });

    it('supports alias prop dataSource', () => {
        let tableRef: EzTableRef<User> | null = null;
        const TestComponent = () => {
            const ref = useRef<EzTableRef<User>>(null);
            React.useEffect(() => {
                tableRef = ref.current;
            }, []);
            // @ts-ignore - explicitly testing missing data prop alias
            return <EzTable ref={ref} dataSource={data} columns={columns} />;
        };

        render(<TestComponent />);
        expect((tableRef as any)?.getData()).toEqual(data);
    });

    it('calls new alias event handlers', async () => {
        const onRowSelect = vi.fn();

        let tableRef: EzTableRef<User> | null = null;
        const TestComponent = () => {
            const ref = useRef<EzTableRef<User>>(null);
            React.useEffect(() => { tableRef = ref.current; }, []);
            return (
                <EzTable
                    ref={ref}
                    data={data}
                    columns={columns}
                    enableRowSelection={true}
                    onRowSelect={onRowSelect}
                />
            );
        };

        render(<TestComponent />);

        await act(async () => {
            tableRef?.selectRow(0);
        });

        // Allow timeout in hook to fire
        await new Promise(r => setTimeout(r, 10));

        // onRowSelect alias should be called
        // Note: As per implementation, it fires on generic selection change.
        // Optimally it should check if a row was actually selected.
        // For now, checking call count.
        expect(onRowSelect).toHaveBeenCalled();
    });
});
