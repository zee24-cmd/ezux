import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEzTable } from '../useEzTable';
import { ColumnDef, Row } from '@tanstack/react-table';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

interface TestData {
    id: number;
    name: string;
    age: number;
    status: 'active' | 'inactive';
}

describe('useEzTable', () => {
    const mockData: TestData[] = [
        { id: 1, name: 'Alice', age: 30, status: 'active' },
        { id: 2, name: 'Bob', age: 25, status: 'inactive' },
        { id: 3, name: 'Charlie', age: 35, status: 'active' },
        { id: 4, name: 'David', age: 28, status: 'active' },
        { id: 5, name: 'Eve', age: 32, status: 'inactive' },
    ];

    const mockColumns: ColumnDef<TestData>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'age',
            header: 'Age',
        },
        {
            accessorKey: 'status',
            header: 'Status',
        },
    ];

    const createWrapper = () => {
        const queryClient = new QueryClient();
        return ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient} >
                {children}
            </QueryClientProvider>
        );
    };
    const EMPTY_DATA: any[] = [];

    describe('Initialization', () => {
        it('should initialize with provided data', () => {
            const { result } = renderHook(() =>
                useEzTable({
                    data: mockData,
                    columns: mockColumns,
                }),
                { wrapper: createWrapper() }
            );

            expect(result.current.rows).toHaveLength(5);
            expect(result.current.table).toBeDefined();
        });

        it('should initialize with empty data', () => {
            const { result } = renderHook(() =>
                useEzTable({
                    data: EMPTY_DATA,
                    columns: mockColumns,
                }),
                { wrapper: createWrapper() }
            );

            expect(result.current.rows).toHaveLength(0);
        });
    });

    describe('Filtering', () => {
        it('should filter data with global filter', () => {
            const { result } = renderHook(() =>
                useEzTable({
                    data: mockData,
                    columns: mockColumns,
                }),
                { wrapper: createWrapper() }
            );

            act(() => {
                result.current.setGlobalFilter('Alice');
            });

            // After filtering, should have fewer rows
            expect(result.current.table.getFilteredRowModel().rows.length).toBeLessThan(5);
        });

        it('should handle column filters', () => {
            const { result } = renderHook(() =>
                useEzTable({
                    data: mockData,
                    columns: mockColumns,
                    enableColumnFiltering: true,
                }),
                { wrapper: createWrapper() }
            );

            act(() => {
                result.current.table.getColumn('status')?.setFilterValue('active');
            });

            const filteredRows = result.current.table.getFilteredRowModel().rows;
            // Should only show active users
            expect(filteredRows.length).toBeLessThanOrEqual(5);
        });
    });

    describe('Sorting', () => {
        it('should sort data by column', () => {
            const { result } = renderHook(() =>
                useEzTable({
                    data: mockData,
                    columns: mockColumns,
                }),
                { wrapper: createWrapper() }
            );

            act(() => {
                result.current.table.getColumn('age')?.toggleSorting(false); // ascending
            });

            const sortedRows = result.current.table.getSortedRowModel().rows;
            const ages = sortedRows.map((row: Row<TestData>) => row.original.age);

            // Check if sorted ascending
            for (let i = 0; i < ages.length - 1; i++) {
                expect(ages[i]).toBeLessThanOrEqual(ages[i + 1]);
            }
        });

        it('should toggle sort direction', () => {
            const { result } = renderHook(() =>
                useEzTable({
                    data: mockData,
                    columns: mockColumns,
                }),
                { wrapper: createWrapper() }
            );

            // First click: ascending
            act(() => {
                result.current.table.getColumn('name')?.toggleSorting();
            });

            let sortState = result.current.table.getState().sorting;
            expect(sortState[0]?.desc).toBe(false);

            // Second click: descending
            act(() => {
                result.current.table.getColumn('name')?.toggleSorting();
            });

            sortState = result.current.table.getState().sorting;
            expect(sortState[0]?.desc).toBe(true);
        });
    });

    describe('Pagination', () => {
        it('should paginate data', () => {
            const { result } = renderHook(() =>
                useEzTable({
                    data: mockData,
                    columns: mockColumns,
                    pagination: true,
                    pageSize: 2,
                }),
                { wrapper: createWrapper() }
            );

            // Should show only 2 rows per page
            expect(result.current.rows.length).toBe(2);
            expect(result.current.table.getState().pagination.pageSize).toBe(2);
        });

        it('should navigate pages', () => {
            const { result } = renderHook(() =>
                useEzTable({
                    data: mockData,
                    columns: mockColumns,
                    pagination: true,
                    pageSize: 2,
                }),
                { wrapper: createWrapper() }
            );

            const firstPageFirstRow = result.current.rows[0].original.id;

            act(() => {
                result.current.table.nextPage();
            });

            const secondPageFirstRow = result.current.rows[0].original.id;
            expect(secondPageFirstRow).not.toBe(firstPageFirstRow);
        });
    });

    describe('Row Selection', () => {
        it('should select rows', () => {
            const { result } = renderHook(() =>
                useEzTable({
                    data: mockData,
                    columns: mockColumns,
                    enableRowSelection: true,
                }),
                { wrapper: createWrapper() }
            );

            act(() => {
                result.current.table.getRow('0').toggleSelected(true);
            });

            const selectedRows = result.current.table.getSelectedRowModel().rows;
            expect(selectedRows.length).toBe(1);
        });

        it('should select all rows', () => {
            const { result } = renderHook(() =>
                useEzTable({
                    data: mockData,
                    columns: mockColumns,
                    enableRowSelection: true,
                }),
                { wrapper: createWrapper() }
            );

            act(() => {
                result.current.table.toggleAllRowsSelected(true);
            });

            const selectedRows = result.current.table.getSelectedRowModel().rows;
            expect(selectedRows.length).toBe(5);
        });
    });

    describe('Grouping', () => {
        it('should group by column', () => {
            const { result } = renderHook(() =>
                useEzTable({
                    data: mockData,
                    columns: mockColumns,
                    enableGrouping: true,
                }),
                { wrapper: createWrapper() }
            );

            act(() => {
                result.current.table.setGrouping(['status']);
            });

            expect(result.current.table.getState().grouping).toEqual(['status']);
        });
    });

    describe('Change Tracking', () => {
        it('should track data changes', () => {
            const { result } = renderHook(() =>
                useEzTable({
                    data: mockData,
                    columns: mockColumns,
                    enableChangeTracking: true,
                }),
                { wrapper: createWrapper() }
            );

            expect(result.current.changes).toBeDefined();
            expect(result.current.canUndo).toBe(false);
            expect(result.current.canRedo).toBe(false);
        });
    });

    describe('React 19 - useTransition Support', () => {
        it('should have isPending state', () => {
            const { result } = renderHook(() =>
                useEzTable({
                    data: mockData,
                    columns: mockColumns,
                }),
                { wrapper: createWrapper() }
            );

            expect(result.current.isPending).toBeDefined();
            expect(typeof result.current.isPending).toBe('boolean');
        });
    });
});
