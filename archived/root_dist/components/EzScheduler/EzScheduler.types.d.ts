import { SharedBaseProps } from '../../shared/types/BaseProps';
export interface SchedulerEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resourceId?: string;
    resourceIds?: string[];
    color?: string;
    allDay?: boolean;
    description?: string;
    rrule?: string;
    exdate?: string[];
    recurrenceId?: string;
    originalStart?: Date;
    attachedFiles?: File[];
}
export interface Resource {
    id: string;
    name: string;
    color?: string;
    avatar?: string;
}
export type ViewType = 'day' | 'week' | 'workweek' | 'month' | 'agenda' | 'timeline-day' | 'timeline-week' | 'timeline-month';
export interface EzSchedulerProps extends SharedBaseProps {
    events: SchedulerEvent[];
    resources?: Resource[];
    defaultView?: ViewType;
    defaultDate?: Date;
    locale?: string;
    startHour?: number;
    endHour?: number;
    /**
     * Callback when an event is clicked.
     */
    onEventClick?: (event: SchedulerEvent) => void;
    /**
     * Callback when an event is double-clicked.
     */
    onEventDoubleClick?: (event: SchedulerEvent) => void;
    /**
     * Callback when a time slot is clicked (for creation).
     */
    onSlotClick?: (date: Date, resourceId?: string) => void;
    /**
     * Callback when view changes
     */
    onViewChange?: (view: ViewType) => void;
    /**
     * Callback when date changes
     */
    onDateChange?: (date: Date) => void;
    /**
     * Callback when an event is modified (dragged/resized)
     */
    onEventChange?: (event: SchedulerEvent) => void;
    /**
     * Callback when a new event happens
     */
    onEventCreate?: (event: Partial<SchedulerEvent>) => void | Promise<void>;
}
