import { IService } from '../../../shared/services/ServiceRegistry';

export class TimezoneService implements IService {
    name = 'TimezoneService';

    constructor() { }

    /**
     * Converts a date to a specific timezone
     * @param date Date object
     * @param timeZone Target time zone (e.g., 'America/New_York')
     */
    toTimezone(date: Date | string | number, timeZone: string): Date {
        if (!timeZone || timeZone === 'UTC' || timeZone === 'Local') {
            return new Date(date);
        }

        try {
            // Using Intl to adjust the date for the target timezone
            const d = new Date(date);
            const targetDateStr = d.toLocaleString('en-US', { timeZone });
            return new Date(targetDateStr);
        } catch (e) {
            console.warn(`TimezoneService: Invalid timezone ${timeZone}`, e);
            return new Date(date);
        }
    }

    /**
     * Formats a date in a specific timezone
     */
    formatInTimezone(date: Date | string | number, timeZone: string, options?: Intl.DateTimeFormatOptions): string {
        try {
            return new Intl.DateTimeFormat('en-US', {
                ...options,
                timeZone
            }).format(new Date(date));
        } catch (e) {
            console.error('TimezoneService formatting error:', e);
            return '';
        }
    }

    /**
     * Get local browser timezone name
     */
    getLocalTimezone(): string {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    cleanup() { }
}
