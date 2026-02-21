import { Store } from '@tanstack/store';
import type { SchedulerEvent, Resource, ViewType, ResourceModel, View } from '../EzScheduler.types';

export interface SchedulerState {
    events: SchedulerEvent[];
    resources: (Resource | ResourceModel)[];
    view: ViewType | View;
    currentDate: Date;
    selectedDate: Date;
    selectedEventId: string | null;
    slotDuration: number;
    is24Hour: boolean;
}

export const createSchedulerStore = (initialState: Partial<SchedulerState>) => {
    return new Store<SchedulerState>({
        events: [],
        resources: [],
        view: 'week',
        currentDate: new Date(),
        selectedDate: new Date(),
        selectedEventId: null,
        slotDuration: 30,
        is24Hour: true,
        ...initialState,
    });
};

export const createSchedulerActions = (store: Store<SchedulerState>) => ({
    setEvents: (events: SchedulerEvent[]) => {
        store.setState((state) => ({ ...state, events }));
    },
    addEvent: (event: SchedulerEvent) => {
        store.setState((state) => ({ ...state, events: [...state.events, event] }));
    },
    updateEvent: (updatedEvent: SchedulerEvent) => {
        store.setState((state) => ({
            ...state,
            events: state.events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
        }));
    },
    deleteEvent: (id: string | number) => {
        store.setState((state) => ({
            ...state,
            events: state.events.filter((e) => e.id !== id),
        }));
    },
    setResources: (resources: (Resource | ResourceModel)[]) => {
        store.setState((state) => ({ ...state, resources }));
    },
    setView: (view: ViewType) => {
        store.setState((state) => ({ ...state, view }));
    },
    setCurrentDate: (date: Date) => {
        store.setState((state) => ({ ...state, currentDate: date }));
    },
    setSelectedDate: (date: Date) => {
        store.setState((state) => ({ ...state, selectedDate: date }));
    },
    setSelectedEventId: (id: string | null) => {
        store.setState((state) => ({ ...state, selectedEventId: id }));
    },
    setSlotDuration: (duration: number) => {
        store.setState((state) => ({ ...state, slotDuration: duration }));
    },
    setIs24Hour: (is24: boolean) => {
        store.setState((state) => ({ ...state, is24Hour: is24 }));
    },
});

export type SchedulerActions = ReturnType<typeof createSchedulerActions>;
