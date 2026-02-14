import { format } from 'date-fns';

/**
 * Common formatting utilities for table data
 */

export const formatNumber = (
    value: number | null | undefined,
    options: {
        format?: 'integer' | 'float' | 'currency' | 'percentage';
        decimals?: number;
        locale?: string;
        currency?: string;
    } = {}
): string => {
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
        return value.toFixed(decimalPlaces);
    }
};

export const formatDate = (
    value: Date | string | null | undefined,
    options: {
        format?: 'short' | 'long' | 'relative' | 'iso';
        locale?: string;
    } = {}
): string => {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const { format: fmt = 'short' } = options;

    switch (fmt) {
        case 'long':
            return format(date, 'MMMM d, yyyy');
        case 'iso':
            return date.toISOString().split('T')[0];
        case 'relative':
            return formatRelativeDate(date);
        case 'short':
        default:
            return format(date, 'MMM d, yyyy');
    }
};

function formatRelativeDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    const isPast = diffMs > 0;
    const abs = Math.abs;

    if (abs(diffDay) >= 365) return `${isPast ? '' : 'in '}${Math.floor(abs(diffDay) / 365)}y${isPast ? ' ago' : ''}`;
    if (abs(diffDay) >= 30) return `${isPast ? '' : 'in '}${Math.floor(abs(diffDay) / 30)}mo${isPast ? ' ago' : ''}`;
    if (abs(diffDay) >= 7) return `${isPast ? '' : 'in '}${Math.floor(abs(diffDay) / 7)}w${isPast ? ' ago' : ''}`;
    if (abs(diffDay) >= 1) return `${isPast ? '' : 'in '}${abs(diffDay)}d${isPast ? ' ago' : ''}`;
    if (abs(diffHour) >= 1) return `${isPast ? '' : 'in '}${abs(diffHour)}h${isPast ? ' ago' : ''}`;
    if (abs(diffMin) >= 1) return `${isPast ? '' : 'in '}${abs(diffMin)}m${isPast ? ' ago' : ''}`;
    return 'just now';
}
