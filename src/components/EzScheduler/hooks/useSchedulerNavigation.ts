import {
    addDays,
    addWeeks,
    addMonths,
    subDays,
    subWeeks,
    subMonths,
} from 'date-fns';
import { ViewType } from '../EzScheduler.types';

/**
 * Encapsulates navigation arithmetic for the scheduler
 */
export const useSchedulerNavigation = (
    currentDate: Date,
    setCurrentDate: (date: Date) => void,
    view: ViewType,
    onDateChange?: (date: Date) => void
) => {
    const handleDateChange = (newDate: Date) => {
        setCurrentDate(newDate);
        onDateChange?.(newDate);
    };

    const next = () => {
        let newDate = currentDate;
        if (view === 'day' || view === 'timeline-day') newDate = addDays(currentDate, 1);
        else if (view === 'week' || view === 'workweek' || view === 'timeline-week') newDate = addWeeks(currentDate, 1);
        else if (view === 'month' || view === 'timeline-month') newDate = addMonths(currentDate, 1);

        handleDateChange(newDate);
    };

    const prev = () => {
        let newDate = currentDate;
        if (view === 'day' || view === 'timeline-day') newDate = subDays(currentDate, 1);
        else if (view === 'week' || view === 'workweek' || view === 'timeline-week') newDate = subWeeks(currentDate, 1);
        else if (view === 'month' || view === 'timeline-month') newDate = subMonths(currentDate, 1);

        handleDateChange(newDate);
    };

    const today = () => {
        handleDateChange(new Date());
    };

    return { next, prev, today };
};
