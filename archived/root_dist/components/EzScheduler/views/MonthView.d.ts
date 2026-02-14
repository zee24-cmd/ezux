import { default as React } from 'react';
import { SchedulerEvent } from '../EzScheduler.types';
interface MonthViewProps {
    currentDate: Date;
    daysInView: Date[];
    visibleEvents: SchedulerEvent[];
    onSlotClick?: (date: Date) => void;
    onEventClick?: (event: SchedulerEvent) => void;
}
export declare const MonthView: React.FC<MonthViewProps>;
export {};
