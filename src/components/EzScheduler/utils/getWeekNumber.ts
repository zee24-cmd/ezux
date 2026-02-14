import { getWeek, getISOWeek } from 'date-fns';
import { WeekRule } from '../EzScheduler.types';

/**
 * Calculate week number based on the specified week rule
 * @param date - The date to calculate week number for
 * @param weekRule - The week numbering rule to use
 * @returns Week number
 */
export function getWeekNumber(
    date: Date,
    weekRule: WeekRule = 'FirstDay'
): number {
    switch (weekRule) {
        case 'FirstDay':
            // First day of year is always in week 1
            return getWeek(date, { weekStartsOn: 0 });

        case 'FirstFourDayWeek':
            // ISO 8601: Week with first Thursday of year
            return getISOWeek(date);

        case 'FirstFullWeek':
            // First full week (all 7 days in the year)
            return getWeek(date, {
                weekStartsOn: 0,
                firstWeekContainsDate: 1
            });

        default:
            return getWeek(date);
    }
}
