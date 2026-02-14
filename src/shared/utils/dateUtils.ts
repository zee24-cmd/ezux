import { format, isValid } from 'date-fns';

export const dateUtils = {
    formatDate: (date: Date | string | number | null | undefined, formatStr: string = 'PP'): string => {
        if (!date) return '';
        const d = new Date(date);
        return isValid(d) ? format(d, formatStr) : '';
    },

    formatDateTime: (date: Date | string | number | null | undefined, formatStr: string = 'PP p'): string => {
        if (!date) return '';
        const d = new Date(date);
        return isValid(d) ? format(d, formatStr) : '';
    },

    isValidDate: (date: any): boolean => {
        const d = new Date(date);
        return isValid(d);
    }
};
