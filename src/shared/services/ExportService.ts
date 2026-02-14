import { IService } from './ServiceRegistry';

import { saveAs } from 'file-saver';

/**
 * Options for configuring data exports.
 * @group Properties
 */
export interface ExportOptions {
    /** Target filename (without extension). @group Properties */
    fileName?: string;
    /** Internal sheet name (for Excel). @group Properties */
    sheetName?: string;
    /** List of field names to omit from the export. @group Data */
    excludeColumns?: string[];
}

/**
 * Service for client-side data exportation in various formats.
 * 
 * Provides efficient CSV and Excel generation using `file-saver` and `xlsx`.
 * 
 * @group Services
 */
export class ExportService implements IService {
    name = 'ExportService';

    /**
     * Exports an array of data to a CSV file.
     * @param data The row data to export.
     * @param columns Column definitions for mapping headers and accessors.
     * @param options Export configuration options.
     * @group Methods
     */
    exportToCSV<T>(data: T[], columns: { header: string; accessorKey?: string; id?: string }[], options?: ExportOptions) {
        const fileName = (options?.fileName || 'export') + '.csv';
        const headers = columns.map(c => c.header);

        // Simple CSV construction
        const csvContent = [
            headers.join(','),
            ...data.map(row => {
                return columns.map(col => {
                    const key = col.accessorKey || col.id;
                    const val = key ? (row as any)[key] : '';
                    // Handle commas and quotes in data
                    const stringVal = String(val ?? '');
                    if (stringVal.includes(',') || stringVal.includes('"')) {
                        return `"${stringVal.replace(/"/g, '""')}"`;
                    }
                    return stringVal;
                }).join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, fileName);
    }
}
