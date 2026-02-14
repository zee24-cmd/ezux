/**
 * Utility to convert an array of objects to a CSV string.
 */
export function convertToCSV(data: any[], columns: { id: string; header: string }[]): string {
    const headers = columns.map(c => c.header).join(',');
    const rows = data.map(row => {
        return columns.map(col => {
            const cellValue = row[col.id];
            // Handle null/undefined
            if (cellValue === null || cellValue === undefined) return '';
            // Escape quotes and wrap in quotes if contains comma/newline/quote
            const stringValue = String(cellValue);
            if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        }).join(',');
    });

    return [headers, ...rows].join('\n');
}
