export interface EzTableStatePersistence {
    sorting?: any[];
    columnFilters?: any[];
    columnVisibility?: Record<string, boolean>;
    columnOrder?: string[];
    columnPinning?: {
        left?: string[];
        right?: string[];
    };
    grouping?: string[];
    pagination?: {
        pageIndex: number;
        pageSize: number;
    };
}
export declare class PersistenceService {
    saveState(key: string, state: EzTableStatePersistence): void;
    loadState(key: string): EzTableStatePersistence | null;
    clearState(key: string): void;
}
export declare const globalPersistenceService: PersistenceService;
