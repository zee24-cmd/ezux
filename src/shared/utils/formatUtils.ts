
/**
 * Standard formatters with fallback to en-US.
 * These are static - use the functional versions for dynamic locale support.
 */
export const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

export const numberFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

export const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
});

export function formatNumber(
    value: number | null | undefined,
    options: {
        format?: 'integer' | 'float' | 'currency' | 'percentage';
        decimals?: number;
        locale?: string;
        currency?: string;
    } = {}
): string {
    if (value === null || value === undefined) return '';

    const {
        format = 'float',
        decimals,
        locale = 'en-US',
        currency = 'USD'
    } = options;

    const decimalPlaces = decimals !== undefined
        ? decimals
        : format === 'integer' ? 0 : format === 'percentage' ? 1 : 2;

    try {
        switch (format) {
            case 'currency':
                return new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency,
                    minimumFractionDigits: decimalPlaces,
                    maximumFractionDigits: decimalPlaces,
                }).format(value);

            case 'percentage':
                return new Intl.NumberFormat(locale, {
                    style: 'percent',
                    minimumFractionDigits: decimalPlaces,
                    maximumFractionDigits: decimalPlaces,
                }).format(value / 100);

            case 'integer':
                return new Intl.NumberFormat(locale, {
                    style: 'decimal',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(Math.round(value));

            case 'float':
            default:
                return new Intl.NumberFormat(locale, {
                    style: 'decimal',
                    minimumFractionDigits: decimalPlaces,
                    maximumFractionDigits: decimalPlaces,
                }).format(value);
        }
    } catch (error) {
        return typeof value === 'number' ? value.toFixed(decimalPlaces) : String(value);
    }
}

export function formatDate(
    value: Date | string | null | undefined,
    options: {
        format?: 'short' | 'long' | 'relative' | 'iso';
        locale?: string;
    } = {}
): string {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const { format: fmt = 'short', locale = 'en-US' } = options;

    switch (fmt) {
        case 'long':
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        case 'iso':
            return date.toISOString().split('T')[0];
        case 'relative':
            return formatRelativeDate(date, locale);
        case 'short':
        default:
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(date);
    }
}

function formatRelativeDate(date: Date, locale: string = 'en-US'): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    const absDiffDay = Math.abs(diffDay);
    const absDiffHour = Math.abs(diffHour);
    const absDiffMin = Math.abs(diffMin);

    try {
        // Use Intl.RelativeTimeFormat if available
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

        if (absDiffDay >= 365) return rtf.format(-Math.floor(diffDay / 365), 'year');
        if (absDiffDay >= 30) return rtf.format(-Math.floor(diffDay / 30), 'month');
        if (absDiffDay >= 7) return rtf.format(-Math.floor(diffDay / 7), 'week');
        if (absDiffDay >= 1) return rtf.format(-diffDay, 'day');
        if (absDiffHour >= 1) return rtf.format(-diffHour, 'hour');
        if (absDiffMin >= 1) return rtf.format(-diffMin, 'minute');
        return 'just now'; // Fallback for very recent
    } catch (e) {
        // Fallback for older browsers or environments
        if (absDiffDay >= 1) return `${diffDay}d ago`;
        return 'just now';
    }
}

export const formatCurrency = (value: number, locale: string = 'en-US', currency: string = 'USD'): string =>
    formatNumber(value, { format: 'currency', locale, currency });

export const formatPercent = (value: number, locale: string = 'en-US'): string =>
    formatNumber(value, { format: 'percentage', locale });

export const formatDateTime = (date: Date | string, locale: string = 'en-US'): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(d);
};
