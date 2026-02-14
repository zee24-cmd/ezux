import React, { createContext, useContext, useMemo } from 'react';
import { useStore } from '@tanstack/react-store';
import { TableStore, createTableStore } from './TableStore';
import { Table } from '@tanstack/react-table';

// Context Definitions
const TableStoreContext = createContext<TableStore<any> | null>(null);
export const TableInstanceContext = createContext<Table<any> | null>(null);

// Props
interface EzTableRootProps<TData> {
    data: TData[];
    children: React.ReactNode;
    // ... we will add more config props here later (sorting, etc)
}

export const EzTableRoot = <TData extends object>({ data, children }: EzTableRootProps<TData>) => {
    // 1. Initialize Store (Once)
    const store = useMemo(() => createTableStore(data), []);

    // 2. Sync Data Prop to Store (if it changes)
    React.useEffect(() => {
        store.setState(prev => ({ ...prev, data }));
    }, [data, store]);

    // We will initialize the TanStack Table instance here in the next steps 
    // effectively "lifting" the table creation out of the hook and into the context.

    return (
        <TableStoreContext.Provider value={store}>
            {children}
        </TableStoreContext.Provider>
    );
};

// Hook to consume store
export const useTableStore = <T,>(selector: (state: any) => T) => {
    const store = useContext(TableStoreContext);
    if (!store) throw new Error('EzTable components must be wrapped in <EzTable.Root>');
    return useStore(store, selector);
};
