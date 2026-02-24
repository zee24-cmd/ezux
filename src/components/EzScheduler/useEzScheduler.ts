import { useMemo } from 'react';
import { EzSchedulerProps, ViewType } from './EzScheduler.types';
import { useBaseComponent } from '../../shared/hooks/useBaseComponent';
import { useStore } from '@tanstack/react-store';
import { createSchedulerStore, createSchedulerActions } from './state/scheduler.store';
import { useSchedulerEvents } from './hooks/useSchedulerEvents';
import { useSchedulerVirtualization } from './hooks/useSchedulerVirtualization';
import { useSchedulerNavigation } from './hooks/useSchedulerNavigation';

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
        view: (props.view ? (props.view.toLowerCase() as ViewType) : 'week'),
        currentDate: props.selectedDate || new Date(),
        selectedDate: props.selectedDate || new Date(),
        slotDuration: props.slotDuration || 30,
        is24Hour: props.is24Hour ?? true,
    }), []);

    const actions = useMemo(() => createSchedulerActions(store), [store]);
    const state = useStore(store, (state) => state);

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
            const mapping: Record<string, ViewType> = {
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
            actions.setView(mapping[normalized] || (normalized as ViewType));
        }
    }, [props.view, actions]);

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

    // 3. Events Logic
    // We consolidate the useSchedulerEvents call to avoid duplicate subscriptions and state
    const {
        schedulerService,
        recurrenceEngine,
        daysInView,
        visibleEvents,
        allEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        isUpdating
    } = useSchedulerEvents({ ...props, events }, view as ViewType, currentDate);

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
        view as ViewType,
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
        /** 
         * Namespaced state properties
         * @group State
         */
        state: {
            currentView: state.view,
            selectedDate: state.selectedDate,
            currentDate,
            events: state.events,
            resources: state.resources,
            viewEvents: visibleEvents,
            daysInView,
            allEvents,
            slotDuration: state.slotDuration,
            is24Hour: state.is24Hour,
            isUpdating,
            selectedIndex,
            highlightedEventId
        },

        /** 
         * Namespaced action methods
         * @group Actions
         */
        actions: {
            nextPeriod: next,
            prevPeriod: prev,
            today,
            setView: actions.setView,
            setDate: actions.setSelectedDate,
            setCurrentDate: actions.setCurrentDate,
            addEvent,
            updateEvent,
            deleteEvent,
            setSlotDuration: actions.setSlotDuration,
            setIs24Hour: actions.setIs24Hour,
            setSelectedIndex,
            setHighlightedEventId
        },

        /** 
         * Namespaced core services
         * @group Services
         */
        services: {
            schedulerService,
            recurrenceEngine,
            historyService,
            searchService,
            timezoneService,
            attendeeService,
            reminderService,
            serviceRegistry
        },

        /** 
         * Scheduler configuration properties
         * @group Config
         */
        config: schedulerConfig,

        /** 
         * DOM and component references
         * @group Refs
         */
        refs: {
            parentRef,
            rowVirtualizer,
            columnVirtualizer
        },

        // --- Base API ---
        baseState,
        baseApi,
        dir
    };
};
