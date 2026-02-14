export type ColumnType = 'text' | 'longtext' | 'number' | 'boolean' | 'date' | 'datetime' | 'select' | 'multiselect' | 'chart';

/**
 * detectColumnType - Utility to infer column type from a sample of data
 */
export function detectColumnType(values: any[]): ColumnType {
    if (!values || values.length === 0) return 'text';

    // 0. Sample raw values FIRST to ensure O(1) performance
    const rawSample = values.slice(0, 100);
    const sample = rawSample.filter(v => v !== null && v !== undefined && v !== '');
    if (sample.length === 0) return 'text';

    // 1. Check for Boolean
    const isBoolean = sample.every(v => typeof v === 'boolean' || v === 'true' || v === 'false');
    if (isBoolean) return 'boolean';

    // 2. Check for Number
    const isNumber = sample.every(v => typeof v === 'number' || (!isNaN(parseFloat(v)) && isFinite(v)));
    if (isNumber) return 'number';

    // 3. Check for Date/DateTime
    const isDate = sample.every(v => {
        if (v instanceof Date) return true;
        if (typeof v === 'string') {
            const d = Date.parse(v);
            return !isNaN(d) && v.length > 5 && (v.includes('-') || v.includes('/') || v.includes(':'));
        }
        return false;
    });

    if (isDate) {
        // If many values have time component, suggest datetime
        const hasTime = sample.some(v => {
            const s = String(v);
            return s.includes(':') || (v instanceof Date && (v.getHours() !== 0 || v.getMinutes() !== 0));
        });
        return hasTime ? 'datetime' : 'date';
    }

    // 4. Check for Select (low cardinality strings)
    const uniqueValues = new Set(sample.map(v => String(v)));
    if (uniqueValues.size > 0 && uniqueValues.size <= Math.min(sample.length * 0.2, 10)) {
        return 'select';
    }

    // 5. Check for Long Text
    const isLongText = sample.some(v => typeof v === 'string' && v.length > 100);
    if (isLongText) return 'longtext';

    return 'text';
}
