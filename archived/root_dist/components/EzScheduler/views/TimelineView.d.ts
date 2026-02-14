import { default as React } from 'react';
import { SchedulerEvent, Resource, ViewType } from '../EzScheduler.types';
interface TimelineViewProps {
    view: ViewType;
    currentDate: Date;
    daysInView: Date[];
    visibleEvents: SchedulerEvent[];
    resources?: Resource[];
    onSlotClick?: (date: Date, resourceId?: string) => void;
    onEventClick?: (event: SchedulerEvent) => void;
}
export declare const TimelineView: React.FC<TimelineViewProps>;
export {};
