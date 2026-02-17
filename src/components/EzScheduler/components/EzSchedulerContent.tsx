import React from 'react';
import { Store } from '@tanstack/store';
import { SchedulerState, SchedulerActions } from '../state/scheduler.store';
import { ViewType, SchedulerEvent, Resource, EzSchedulerProps } from '../EzScheduler.types';
import { DayWeekView } from '../views/DayWeekView';
import { MonthView } from '../views/MonthView';
import { TimelineView } from '../views/TimelineView';
import { AgendaView } from '../views/AgendaView';
import { useMediaQuery } from '../../../shared/hooks';

/**
 * Props for the EzSchedulerContent component.
 */
interface EzSchedulerContentProps {
    /** 
     * The scheduler state store.
     * @group Properties 
     */
    store: Store<SchedulerState>;
    /** 
     * Actions for state mutation.
     * @group Methods 
     */
    actions: SchedulerActions;
    /** 
     * The currently active view type.
     * @group Properties 
     */
    view: ViewType | string;
    /** 
     * List of days to display in the current view.
     * @group Properties 
     */
    daysInView: Date[];
    /** 
     * List of events to display.
     * @group Properties 
     */
    visibleEvents: SchedulerEvent[];
    /** 
     * Virtualizer for row rendering.
     * @group Properties 
     */
    rowVirtualizer: any;
    /** 
     * List of resources to display.
     * @group Properties 
     */
    resources: Resource[];
    /** 
     * Callback for slot double-click.
     * @group Events 
     */
    handleSlotDoubleClick: (date: Date, resourceId?: string) => void;
    /** 
     * Callback for event double-click.
     * @group Events 
     */
    handleEventDoubleClick: (event: SchedulerEvent) => void;
    /** 
     * Callback for event deletion.
     * @group Events 
     */
    handleEventDelete: (eventId: string) => void;
    /** 
     * Reference to the scroll container.
     * @group Properties 
     */
    parentRef: React.RefObject<HTMLDivElement | null>;
    /** 
     * Callback to change the view.
     * @group Methods 
     */
    setView: (view: ViewType) => void;
    /** 
     * Callback to change the current date.
     * @group Methods 
     */
    setCurrentDate: (date: Date) => void;
    /** 
     * The original props passed to EzScheduler.
     * @group Properties 
     */
    props: EzSchedulerProps;
    /** 
     * Callback for range selection.
     * @group Events 
     */
    handleRangeSelect: (start: Date, end: Date, resourceId?: string, position?: { x: number; y: number }) => void;
    /** 
     * The currently displayed date.
     * @group Properties 
     */
    currentDate: Date;
    /** 
     * Whether to show an unassigned lane.
     * @group Properties 
     */
    showUnassignedLane?: boolean;
    /** 
     * Duration of a time slot in minutes.
     * @group Properties 
     */
    slotDuration: number;
    /** 
     * Whether to use 24-hour time format.
     * @group Properties 
     */
    is24Hour: boolean;
    /** 
     * Callback to toggle 24-hour format.
     * @group Methods 
     */
    setIs24Hour: (is24: boolean) => void;
    /** 
     * Text direction.
     * @group Appearance 
     */
    dir?: 'ltr' | 'rtl' | 'auto';
}

/**
 * Layout manager that switches between different scheduler views based on the active view type.
 * @group Subcomponents
 */
export function EzSchedulerContent({
    view,
    daysInView,
    visibleEvents,
    rowVirtualizer,
    resources,
    handleSlotDoubleClick,
    handleEventDoubleClick,
    handleEventDelete,
    parentRef,
    setView,
    setCurrentDate,
    props,
    handleRangeSelect,
    currentDate,
    showUnassignedLane,
    slotDuration,
    is24Hour,
    setIs24Hour,
    dir
}: EzSchedulerContentProps) {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const cellFn = typeof props.cell === 'function' ? props.cell : undefined;

    const actualView = (isMobile && (view === 'week' || view === 'workweek')) ? 'agenda' : view;

    switch (actualView) {
        case 'day':
        case 'week':
        case 'workweek':
            return (
                <DayWeekView
                    daysInView={daysInView}
                    visibleEvents={visibleEvents}
                    rowVirtualizer={rowVirtualizer}
                    resources={resources}
                    onSlotDoubleClick={handleSlotDoubleClick}
                    onEventDoubleClick={handleEventDoubleClick}
                    onEventDelete={handleEventDelete}
                    scrollRef={parentRef as React.RefObject<HTMLDivElement>}
                    onViewChange={setView}
                    onDateChange={setCurrentDate}
                    onRangeSelect={handleRangeSelect}
                    onSlotClick={(date: Date, resId?: string) => props.onCellClick?.(date, resId)}
                    onEventClick={(event: SchedulerEvent) => props.onEventClick?.(event)}
                    showResourcesInDayView={props.showResourcesInDayView}
                    showWeekNumber={props.showWeekNumber}
                    weekRule={props.weekRule}
                    cellTemplate={cellFn}
                    enableHtmlSanitizer={props.enableHtmlSanitizer}
                    showUnassignedLane={showUnassignedLane}
                    startHour={props.startHour}
                    endHour={props.endHour}
                    slotDuration={slotDuration}
                    is24Hour={is24Hour}
                    setIs24Hour={setIs24Hour}
                    group={props.group}
                    onCellContextMenu={props.onCellContextMenu}
                    dir={dir}
                />
            );
        case 'month':
            return (
                <MonthView
                    currentDate={currentDate}
                    daysInView={daysInView}
                    visibleEvents={visibleEvents}
                    onSlotClick={(date: Date) => props.onCellClick?.(date)}
                    onSlotDoubleClick={(date: Date) => handleSlotDoubleClick(date)}
                    onEventClick={(event: SchedulerEvent) => props.onEventClick?.(event) || handleEventDoubleClick(event)}

                    monthsCount={props.monthsCount}
                    dir={dir}
                />
            );
        case 'timeline':
        case 'timeline-day':
        case 'timelineday':
        case 'timeline-week':
        case 'timelineweek':
        case 'timeline-month':
        case 'timelinemonth':
            return (
                <TimelineView
                    view={view as ViewType}
                    currentDate={currentDate}
                    daysInView={daysInView}
                    visibleEvents={visibleEvents}
                    resources={resources}
                    onSlotClick={(date: Date, resId?: string) => props.onCellClick?.(date, resId)}
                    onSlotDoubleClick={handleSlotDoubleClick}
                    onEventClick={(event: SchedulerEvent) => props.onEventClick?.(event) || handleEventDoubleClick(event)}
                    onEventDelete={handleEventDelete}
                    onRangeSelect={handleRangeSelect}
                    currentTimeIndicator={props.currentTimeIndicator}
                    showResourceHeaders={props.showResourceHeaders}
                    group={props.group}
                    showUnassignedLane={props.showUnassignedLane}
                    startHour={props.startHour}
                    endHour={props.endHour}
                    slotDuration={slotDuration}
                    is24Hour={is24Hour}
                    scrollRef={parentRef as React.RefObject<HTMLDivElement>}
                    dir={dir}
                />
            );
        case 'agenda':
            return (
                <AgendaView
                    daysInView={daysInView}
                    visibleEvents={visibleEvents}
                    onEventClick={(event: SchedulerEvent) => props.onEventClick?.(event) || handleEventDoubleClick(event)}
                />
            );
        default:
            return <div>View {view} not implemented</div>;
    }
}
