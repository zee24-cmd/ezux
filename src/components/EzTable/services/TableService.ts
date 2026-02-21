import { RowData } from '@tanstack/react-table';
import { ITableService, TableParams } from '../EzTable.types';

/**
 * Static Mock Database (Simulating a Backend)
 */
const MOCK_DB = new Map<string, Record<string, unknown>[]>();

/**
 * TableService implementation following the ServiceRegistry pattern.
 * Provides mock server-side operations like sorting, filtering, and pagination.
 */
export class TableService<T extends RowData = Record<string, unknown>> implements ITableService<T> {
    name = 'TableService';

    async init(): Promise<void> {
        console.log('[TableService] Initialized');
    }

    async cleanup(): Promise<void> {
        // MOCK_DB.delete('default');
    }

    /**
     * Seeds the mock database with initial data.
     */
    initializeWithData(data: T[]) {
        MOCK_DB.set('default', JSON.parse(JSON.stringify(data)));
    }

    /**
     * Simulates fetching data from a server with support for sorting, filtering, and pagination.
     */
    async getData(params: TableParams): Promise<{ data: T[]; totalCount: number }> {
        await this.simulateLatency();
        let data = MOCK_DB.get('default') || [];

        // Apply filters
        if (params.filters && params.filters.length > 0) {
            params.filters.forEach(filter => {
                data = data.filter((row) => {
                    const value = (row as Record<string, unknown>)[filter.id];
                    if (value === undefined || value === null) return false;
                    return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
                });
            });
        }

        // Apply global filter
        if (params.globalFilter) {
            const search = params.globalFilter.toLowerCase();
            data = data.filter((row) => {
                return Object.values(row as Record<string, unknown>).some(val =>
                    val !== null && val !== undefined && String(val).toLowerCase().includes(search)
                );
            });
        }

        // Apply sorting
        if (params.sorting && params.sorting.length > 0) {
            const sort = params.sorting[0];
            data = [...data].sort((a, b) => {
                const aVal = (a as Record<string, unknown>)[sort.id];
                const bVal = (b as Record<string, unknown>)[sort.id];

                if (aVal === bVal) return 0;
                if (aVal === null || aVal === undefined) return 1;
                if (bVal === null || bVal === undefined) return -1;

                const result = aVal < bVal ? -1 : 1;
                return sort.desc ? -result : result;
            });
        }

        const totalCount = data.length;

        // Apply pagination
        if (params.page !== undefined && params.pageSize !== undefined) {
            const start = params.page * params.pageSize;
            data = data.slice(start, start + params.pageSize);
        }

        return {
            data: JSON.parse(JSON.stringify(data)),
            totalCount
        };
    }

    async createRow(row: Partial<T>): Promise<T> {
        await this.simulateLatency();
        const data = MOCK_DB.get('default') || [];
        const newRow = {
            id: (row as Record<string, unknown>).id || Math.random().toString(36).substring(2, 9),
            ...row
        } as T;
        data.push(newRow as Record<string, unknown>);
        MOCK_DB.set('default', data);
        return newRow;
    }

    async updateRow(id: string | number, updates: Partial<T>): Promise<T> {
        await this.simulateLatency();
        const data = MOCK_DB.get('default') || [];
        const index = data.findIndex((r) => String((r as Record<string, unknown>).id) === String(id));
        if (index !== -1) {
            data[index] = { ...data[index], ...updates } as Record<string, unknown>;
            MOCK_DB.set('default', data);
            return data[index] as T;
        }
        throw new Error(`Row with ID ${id} not found`);
    }

    async deleteRow(id: string | number): Promise<void> {
        await this.simulateLatency();
        const data = MOCK_DB.get('default') || [];
        const filtered = data.filter((r) => String((r as Record<string, unknown>).id) !== String(id));
        MOCK_DB.set('default', filtered);
    }

    private simulateLatency(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 300));
    }
}
