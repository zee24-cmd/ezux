import React, { createContext, useContext, useMemo } from 'react';
import {
    PrimitiveCell,
    PrimitiveEditor,
    BooleanCell,
    BooleanEditor,
    SelectCell,
    SelectEditor,
    ProgressCell,
    SparklineCell
} from '../renderers';

export interface TableRendererConfig {
    Cell: React.ComponentType<any>;
    Editor?: React.ComponentType<any>;
}

export interface TableConfig {
    renderers: Record<string, TableRendererConfig>;
}

const DEFAULT_CONFIG: TableConfig = {
    renderers: {
        text: { Cell: PrimitiveCell, Editor: PrimitiveEditor },
        number: { Cell: PrimitiveCell, Editor: PrimitiveEditor },
        date: { Cell: PrimitiveCell, Editor: PrimitiveEditor },
        datetime: { Cell: PrimitiveCell, Editor: PrimitiveEditor },
        longtext: { Cell: PrimitiveCell, Editor: PrimitiveEditor },
        boolean: { Cell: BooleanCell, Editor: BooleanEditor },
        select: { Cell: SelectCell, Editor: SelectEditor },
        multiselect: { Cell: SelectCell, Editor: SelectEditor },
        progress: { Cell: ProgressCell },
        sparkline: { Cell: SparklineCell },
        chart: {
            Cell: (props: any) => {
                const val = props.value;
                if (Array.isArray(val)) return React.createElement(SparklineCell, { values: val, ...props });
                return React.createElement(ProgressCell, { value: val, ...props });
            }
        }
    }
};

const TableConfigContext = createContext<TableConfig>(DEFAULT_CONFIG);

export const TableConfigProvider: React.FC<{ value?: Partial<TableConfig>; children: React.ReactNode }> = ({ value, children }) => {
    const mergedConfig = useMemo(() => ({
        ...DEFAULT_CONFIG,
        ...value,
        renderers: {
            ...DEFAULT_CONFIG.renderers,
            ...value?.renderers
        }
    }), [value]);

    return (
        <TableConfigContext.Provider value={mergedConfig}>
            {children}
        </TableConfigContext.Provider>
    );
};

export const useTableConfig = () => useContext(TableConfigContext);
