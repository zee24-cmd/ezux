import { default as React } from 'react';
import { SchedulerEvent } from '../EzScheduler.types';
import { Virtualizer } from '@tanstack/react-virtual';
interface DayWeekViewProps {
    daysInView: Date[];
    visibleEvents: SchedulerEvent[];
    rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
    onSlotClick?: (date: Date, resourceId?: string) => void;
    onSlotDoubleClick?: (date: Date, resourceId?: string) => void;
    onEventClick?: (event: SchedulerEvent) => void;
    onEventDoubleClick?: (event: SchedulerEvent) => void;
    activeEventId?: string;
    scrollRef?: React.RefObject<HTMLDivElement | null>;
    onViewChange?: (view: any) => void;
    onDateChange?: (date: Date) => void;
    locale?: string;
}
export declare const DayWeekView: React.FC<DayWeekViewProps>;
export {};
