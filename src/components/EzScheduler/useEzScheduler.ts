import { useMemo } from 'react';
import { EzSchedulerProps } from './EzScheduler.types';
import { useBaseComponent } from '../../shared/hooks/useBaseComponent';
import { useStore } from '@tanstack/react-store';
import { createSchedulerStore, createSchedulerActions } from './state/scheduler.store';
import { useSchedulerEvents } from './hooks/useSchedulerEvents';
import { useSchedulerVirtualization } from './hooks/useSchedulerVirtualization';
import { useSchedulerNavigation } from './hooks/useSchedulerNavigation';
import { useSchedulerImperative } from './hooks/useSchedulerImperative';
import { HistoryService } from './services/HistoryService';
import { SearchService } from './services/SearchService';
import { TimezoneService } from './services/TimezoneService';
import { AttendeeService } from './services/AttendeeService';
import { ReminderService } from './services/ReminderService';
import { getOrRegisterService } from '../../shared/utils/serviceUtils';
import { useEffect, useState } from 'react';
import { useKeyboardNavigation, useServiceState } from '../../shared/hooks';
import { I18nState } from '../../shared/services/I18nService';


/**
 * Orchestrator hook for EzScheduler.
 * Delegates responsibilities to specialized sub-hooks and provides a unified interface for managing scheduler state and operations.
 * 
 * @param props - Scheduler properties of type {@link EzSchedulerProps}
 * @returns An object containing the consolidated state and API methods for the scheduler
 * @group Hooks
 */
export const useEzScheduler = (props: EzSchedulerProps) => {
    // 1. Base component functionality
    const base = useBaseComponent(props);
    const { serviceRegistry, state: baseState, api: baseApi } = base;

    const i18nState = useServiceState<I18nState>('I18nService');
    const globalDir = i18nState?.dir || 'ltr';
    const effectiveDir = (props.dir === 'auto' || !props.dir) ? globalDir : props.dir;

    const dir = effectiveDir;

    // 2. Initialize Store
    const store = useMemo(() => createSchedulerStore({
        events: props.events || [],
        resources: props.resources || [],
        view: (props.view?.toLowerCase() as any) || 'week',
        currentDate: props.selectedDate || new Date(),
        selectedDate: props.selectedDate || new Date(),
        slotDuration: props.slotDuration || 30,
        is24Hour: props.is24Hour ?? true,
    }), []);

    const actions = useMemo(() => createSchedulerActions(store), [store]);
    const state = useStore(store);

    // Sync props to store
    useEffect(() => {
        if (props.events) actions.setEvents(props.events);
    }, [props.events]);

    useEffect(() => {
        if (props.resources) actions.setResources(props.resources);
    }, [props.resources]);

    useEffect(() => {
        if (props.view) {
            const normalized = props.view.toLowerCase().replace(/[^a-z]/g, '');
            const mapping: Record<string, any> = {
                'day': 'day',
                'week': 'week',
                'workweek': 'workweek',
                'month': 'month',
                'timelineday': 'timeline-day',
                'timelineweek': 'timeline-week',
                'timelineworkweek': 'timeline-week',
                'timelinemonth': 'timeline-month',
                'agenda': 'agenda',
                'timeline': 'timeline-day'
            };
            actions.setView(mapping[normalized] || normalized);
        }
    }, [props.view]);

    useEffect(() => {
        if (props.selectedDate) {
            actions.setCurrentDate(props.selectedDate);
            actions.setSelectedDate(props.selectedDate);
        }
    }, [props.selectedDate]);

    useEffect(() => {
        if (props.slotDuration !== undefined) {
            actions.setSlotDuration(props.slotDuration);
        }
    }, [props.slotDuration]);

    useEffect(() => {
        if (props.is24Hour !== undefined) {
            actions.setIs24Hour(props.is24Hour);
        }
    }, [props.is24Hour]);

    // Derived State from Store
    const { view, currentDate, events } = state;

    // 3. Events Logic (Simplified wrapper around store events for now, or keep useSchedulerEvents if it handles complex logic)
    // For now, we will keep useSchedulerEvents but pass store values to it if needed, 
    // OR ideally move useSchedulerEvents logic INTO the store actions or a derived store.
    // To minimize breakage, we'll keep useSchedulerEvents but feed it state from store.
    const {
        schedulerService,
        recurrenceEngine,
        daysInView,
        visibleEvents,
        allEvents
    } = useSchedulerEvents({ ...props, events }, view, currentDate);

    const {
        addEvent,
        updateEvent,
        deleteEvent,
        isUpdating
    } = useSchedulerEvents({ ...props, events }, view, currentDate);

    // 4. Virtualization
    const {
        parentRef,
        rowVirtualizer,
        columnVirtualizer
    } = useSchedulerVirtualization(props);

    // 5. Navigation Utilities
    const { next, prev, today } = useSchedulerNavigation(
        currentDate,
        actions.setCurrentDate,
        view,
        props.onDateChange
    );

    // 5.5. Keyboard Navigation
    const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
    const { selectedIndex, setSelectedIndex } = useKeyboardNavigation({
        totalItems: visibleEvents.length,
        enabled: true,
        onSelect: (index) => {
            const event = visibleEvents[index];
            if (event) {
                setHighlightedEventId(event.id);
                // Scroll into view
                const element = document.getElementById(`event-${event.id}`) || document.querySelector(`[data-event-id="${event.id}"]`);
                element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        },
        onAction: (index) => {
            const event = visibleEvents[index];
            if (event && props.onEventClick) {
                props.onEventClick(event);
            }
        }
    });


    // 6. Config
    const schedulerConfig = useMemo(() => ({
        showWeekend: props.showWeekend ?? true,
        timeFormat: props.timeFormat,
        weekRule: props.weekRule || 'FirstDay',
        monthsCount: props.monthsCount || 1,
        eventDragArea: props.eventDragArea,
        dir: dir || 'ltr'
    }), [props.showWeekend, props.timeFormat, props.weekRule, props.monthsCount, props.eventDragArea, dir]);

    // 7. New Services (Phase 1-3)
    const historyService = getOrRegisterService(serviceRegistry, 'HistoryService', () => new HistoryService());
    const searchService = getOrRegisterService(serviceRegistry, 'SearchService', () => new SearchService());
    const timezoneService = getOrRegisterService(serviceRegistry, 'TimezoneService', () => new TimezoneService());
    const attendeeService = getOrRegisterService(serviceRegistry, 'AttendeeService', () => new AttendeeService());
    const reminderService = getOrRegisterService(serviceRegistry, 'ReminderService', () => new ReminderService());

    return {
        // --- State ---
        /** 
         * Current view mode. 
         * @group State
         */
        currentView: state.view,
        /** 
         * Selected date. 
         * @group State
         */
        selectedDate: state.selectedDate,
        /** 
         * List of events. 
         * @group State
         */
        events: state.events,
        /** 
         * List of resources. 
         * @group State
         */
        resources: state.resources,
        /** 
         * View-specific events. 
         * @group State
         */
        viewEvents: visibleEvents,

        // --- Actions ---
        /** 
         * Navigates to the next period. 
         * @group Methods
         */
        nextPeriod: next,
        /** 
         * Navigates to the previous period. 
         * @group Methods
         */
        prevPeriod: prev,
        /** 
         * Sets the current view. 
         * @group Methods
         */
        setView: actions.setView,
        /** 
         * Sets the selected date. 
         * @group Methods
         */
        setDate: actions.setSelectedDate,
        /** 
         * Adds a new event. 
         * @group Methods
         */
        addEvent,
        /** 
         * Updates an existing event. 
         * @group Methods
         */
        updateEvent,
        /** 
         * Deletes an event. 
         * @group Methods
         */
        deleteEvent,

        // --- Other Hooks/State ---
        isUpdating,
        selectedIndex,
        setSelectedIndex,
        highlightedEventId,
        setHighlightedEventId,

        // --- Base API ---
        baseState,
        baseApi,

        // --- Config ---
        ...schedulerConfig,

        // --- Imperative API ---
        useSchedulerImperative,

        // --- Original Returns (Legacy/Internal) ---
        store,
        actions,
        view,
        visibleEvents,
        currentDate,
        setCurrentDate: actions.setCurrentDate,
        next,
        prev,
        daysInView,
        allEvents,
        slotDuration: state.slotDuration,
        setSlotDuration: actions.setSlotDuration,
        is24Hour: state.is24Hour,
        setIs24Hour: actions.setIs24Hour,
        today,
        parentRef,
        rowVirtualizer,
        columnVirtualizer,

        // --- Services ---
        schedulerService,
        recurrenceEngine,
        historyService,
        searchService,
        timezoneService,
        attendeeService,
        reminderService,
        serviceRegistry,
    };
};
