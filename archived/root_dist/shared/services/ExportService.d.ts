import { IService } from './ServiceRegistry';
export interface ExportOptions {
    fileName?: string;
    sheetName?: string;
    excludeColumns?: string[];
}
export declare class ExportService implements IService {
    name: string;
    /**
     * Export data to CSV
     */
    exportToCSV<T>(data: T[], columns: {
        header: string;
        accessorKey?: string;
        id?: string;
    }[], options?: ExportOptions): void;
    /**
     * Export data to Excel (.xlsx) using SheetJS
     */
    exportToExcel<T>(data: T[], columns: {
        header: string;
        accessorKey?: string;
        id?: string;
    }[], options?: ExportOptions): void;
}
