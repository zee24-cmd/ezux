import { useMemo, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { EzSchedulerProps, ViewType, SchedulerEvent } from '../EzScheduler.types';
import { globalServiceRegistry } from '../../../shared/services/ServiceRegistry';
import { SchedulerService } from '../services/SchedulerService';
import { RecurrenceEngine } from '../services/RecurrenceEngine';
import {
    startOfDay,
    endOfDay,
    addDays,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isWithinInterval
} from 'date-fns';

import { getOrRegisterService } from '../../../shared/utils/serviceUtils';

/**
 * Handles event management, recurrence expansion, and view filtering
 * Uses SchedulerService (Singleton/MockDB) and TanStack Query with Standardized Optimistic Updates
 */
export const useSchedulerEvents = (
    props: EzSchedulerProps,
    view: ViewType,
    currentDate: Date
) => {
    const {
        events,
        serviceRegistry = globalServiceRegistry,
        showWeekend = true,
        recurrenceEngine: propsRecurrenceEngine,
        onEventCreate,
        onEventChange,
        onEventDelete
    } = props;

    const queryClient = useQueryClient();

    // --- Service Initialization ---
    // We get the singleton service or register a new one if missing
    const schedulerService = getOrRegisterService(
        serviceRegistry,
        'SchedulerService',
        () => new SchedulerService(events || [])
    ) as SchedulerService;

    const recurrenceEngine = propsRecurrenceEngine || getOrRegisterService(
        serviceRegistry,
        'RecurrenceEngine',
        () => new RecurrenceEngine()
    );

    // --- Sync Props to Service (Controlled Mode Support) ---
    // If props.events is provided, we ensure the service knows about them.
    useEffect(() => {
        if (events && events.length > 0) {
            schedulerService.initializeWithData(events);
            // Invalidate query to reflect new prop data immediately
            queryClient.invalidateQueries({ queryKey: ['scheduler-events'] });
        }
    }, [events, schedulerService, queryClient]);

    // --- Date Calculation Logic ---
    const daysInView = useMemo(() => {
        let start: Date, end: Date;

        if (view === 'day' || view === 'timeline-day') {
            start = startOfDay(currentDate);
            end = endOfDay(currentDate);
        } else if (view === 'month' || view === 'timeline-month') {
            start = view === 'month' ? startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 }) : startOfMonth(currentDate);
            end = view === 'month' ? endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 }) : endOfMonth(currentDate);
        } else if (view === 'week' || view === 'workweek' || view === 'timeline-week') {
            const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
            start = view === 'workweek' ? addDays(weekStart, 1) : weekStart;
            end = view === 'workweek' ? addDays(weekStart, 5) : endOfWeek(currentDate, { weekStartsOn: 0 });
        } else {
            // Default to day
            start = startOfDay(currentDate);
            end = endOfDay(currentDate);
        }

        try {
            const days = eachDayOfInterval({ start, end });
            if (!showWeekend) {
                return days.filter(day => {
                    const dayOfWeek = day.getDay();
                    return dayOfWeek !== 0 && dayOfWeek !== 6;
                });
            }
            return days;
        } catch (e) {
            return [currentDate];
        }
    }, [view, currentDate, showWeekend]);

    // --- Data Fetching ---
    const viewStart = daysInView.length > 0 ? startOfDay(daysInView[0]) : new Date();
    const viewEnd = daysInView.length > 0 ? endOfDay(daysInView[daysInView.length - 1]) : new Date();

    const { data: fetchedEvents = [] } = useQuery({
        queryKey: ['scheduler-events', viewStart.toISOString(), viewEnd.toISOString()],
        queryFn: () => schedulerService.getEvents(viewStart, viewEnd),
        // If props.events are provided, we can use them as placeholder, 
        // but typically the service.initializeWithData handles the seed.
        placeholderData: events || []
        // staleTime: 5000 // Optional: Cache for 5s
    });

    // --- Expansion Logic ---
    const expandedEvents = useMemo(() => {
        if (daysInView.length === 0) return [];
        return recurrenceEngine.expandEvents(fetchedEvents, viewStart, viewEnd);
    }, [fetchedEvents, daysInView, recurrenceEngine, viewStart, viewEnd]);

    // --- Filtering Logic ---
    const visibleEvents = useMemo(() => {
        if (!daysInView.length) return [];

        return expandedEvents.filter((event: any) =>
            isWithinInterval(event.start, { start: viewStart, end: viewEnd }) ||
            isWithinInterval(event.end, { start: viewStart, end: viewEnd }) ||
            (event.start < viewStart && event.end > viewEnd)
        );
    }, [expandedEvents, daysInView, viewStart, viewEnd]);

    // --- Mutations with Standardized Optimistic Pattern ---

    const addEventMutation = useMutation({
        mutationFn: async (event: Partial<SchedulerEvent>) => {
            // 1. Update internal service
            const result = await schedulerService.addEvent(event);
            // 2. Notify parent
            if (onEventCreate) await onEventCreate(result);
            return result;
        },
        onMutate: async (newEvent) => {
            const queryKey = ['scheduler-events', viewStart.toISOString(), viewEnd.toISOString()];
            await queryClient.cancelQueries({ queryKey });
            const previousEvents = queryClient.getQueryData(queryKey);

            // Optimistic Update
            queryClient.setQueryData(queryKey, (old: SchedulerEvent[] = []) => {
                const tempEvent = {
                    ...newEvent,
                    id: newEvent.id || Date.now().toString(),
                    start: newEvent.start || new Date(),
                    end: newEvent.end || new Date()
                } as SchedulerEvent;
                return [...old, tempEvent];
            });

            return { previousEvents, queryKey };
        },
        onError: (_err, _newEvent, context) => {
            if (context?.previousEvents) {
                queryClient.setQueryData(context.queryKey, context.previousEvents);
            }
        },
        onSettled: () => {
            // Invalidate all views to ensure consistency
            queryClient.invalidateQueries({ queryKey: ['scheduler-events'] });
        }
    });

    const updateEventMutation = useMutation({
        mutationFn: async (event: SchedulerEvent) => {
            // 1. Update internal service
            const result = await schedulerService.updateEvent(event);
            // 2. Notify parent
            if (onEventChange) await onEventChange(result);
            return result;
        },
        onMutate: async (updatedEvent) => {
            const queryKey = ['scheduler-events', viewStart.toISOString(), viewEnd.toISOString()];
            await queryClient.cancelQueries({ queryKey });
            const previousEvents = queryClient.getQueryData(queryKey);

            // Optimistic Update
            queryClient.setQueryData(queryKey, (old: SchedulerEvent[] = []) => {
                return old.map(event => event.id === updatedEvent.id ? updatedEvent : event);
            });

            return { previousEvents, queryKey };
        },
        onError: (_err, _newEvent, context) => {
            if (context?.previousEvents) {
                queryClient.setQueryData(context.queryKey, context.previousEvents);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['scheduler-events'] });
        }
    });

    const deleteEventMutation = useMutation({
        mutationFn: async (id: string | number) => {
            // 1. Update internal service
            await schedulerService.deleteEvent(id);
            // 2. Notify parent
            if (onEventDelete) await onEventDelete(id.toString());
            return id;
        },
        onMutate: async (deletedId) => {
            const queryKey = ['scheduler-events', viewStart.toISOString(), viewEnd.toISOString()];
            await queryClient.cancelQueries({ queryKey });
            const previousEvents = queryClient.getQueryData(queryKey);

            // Optimistic Update
            queryClient.setQueryData(queryKey, (old: SchedulerEvent[] = []) => {
                return old.filter(event => event.id !== deletedId);
            });

            return { previousEvents, queryKey };
        },
        onError: (_err, _newEvent, context) => {
            if (context?.previousEvents) {
                queryClient.setQueryData(context.queryKey, context.previousEvents);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['scheduler-events'] });
        }
    });

    return {
        schedulerService,
        recurrenceEngine,
        daysInView,
        visibleEvents,
        allEvents: fetchedEvents,
        addEvent: addEventMutation.mutateAsync,
        updateEvent: updateEventMutation.mutateAsync,
        deleteEvent: deleteEventMutation.mutateAsync,
        isUpdating: addEventMutation.isPending || updateEventMutation.isPending || deleteEventMutation.isPending
    };
};
