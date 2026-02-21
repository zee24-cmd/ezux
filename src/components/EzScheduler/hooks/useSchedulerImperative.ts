
import { useMemo } from 'react';
import {
    ViewType,
    View,
    SchedulerEvent,
    Resource,
    ResourceModel,
    EditorMode,
    EzSchedulerRef
} from '../EzScheduler.types';
import { useComponentImperativeAPI } from '../../../shared/hooks/useComponentImperativeAPI';
import {
    createCRUDMethods,
    createSpinnerMethods,
    createRefreshMethods,
    createNavigationMethods,
    createExportMethods
} from '../../../shared/utils/imperativeApiUtils';
import { SchedulerService } from '../services/SchedulerService';

export const useSchedulerImperative = (
    view: ViewType | View,
    currentDate: Date,
    schedulerService: SchedulerService,
    visibleEvents: SchedulerEvent[],
    methods: {
        setEditorState: (state: { isOpen: boolean; mode: EditorMode; event?: SchedulerEvent | Partial<SchedulerEvent> | undefined }) => void;
        setResources: (res: (Resource[] | ResourceModel[]) | ((prev: (Resource[] | ResourceModel[])) => (Resource[] | ResourceModel[]))) => void;
        scrollToIndex: (index: number) => void;
        forceUpdate: () => void;
        showSpinner: () => void;
        hideSpinner: () => void;
        closeQuickInfoPopup: () => void;
        // Navigation methods
        changeView: (view: View) => void;
        next: () => void;
        prev: () => void;
        today: () => void;
    },
    ref: React.Ref<EzSchedulerRef>,
    extraApi: Partial<EzSchedulerRef> = {}
) => {

    const api = useMemo(() => {
        // Prepare sub-objects
        const navigationMethods = createNavigationMethods(methods.scrollToIndex);
        const crudMethods = createCRUDMethods(
            () => schedulerService.getEvents(),
            (e) => schedulerService.addEvent(e),
            (e) => schedulerService.updateEvent(e),
            (id) => schedulerService.deleteEvent(id as string)
        );
        const spinnerMethods = createSpinnerMethods(methods.showSpinner, methods.hideSpinner);
        const refreshMethods = createRefreshMethods(() => { }, methods.forceUpdate);
        const exportMethods = createExportMethods(
            () => (extraApi as any).onExportExcel?.(visibleEvents),
            () => (extraApi as any).onExportICS?.(visibleEvents),
            () => {
                // PrintService can optionally be IoC'd too, but for now we'll keep it as it's lightweight or handle it later.
                // Actually, let's just use window.print similar to EzTable for now to remove pure dependency if possible,
                // OR checking if PrintService has heavy deps. It usually doesn't.
                // But specifically for consistency with Table:
                window.print();
            }
        );

        return {
            // Navigation
            changeView: methods.changeView,
            changeCurrentView: methods.changeView,
            next: methods.next,
            prev: methods.prev,
            today: methods.today,
            ...navigationMethods,
            scrollTo: (hour: string, minute: number = 0) => {
                const h = parseInt(hour.split(':')[0]);
                const totalMinutes = h * 60 + minute;
                const slotDuration = 30; // Assuming 30 for now, should get from config if possible
                const index = Math.floor(totalMinutes / slotDuration);
                methods.scrollToIndex(index);
            },
            scrollToTime: (hour: number, minute: number) => {
                const totalMinutes = hour * 60 + minute;
                const slotDuration = 30;
                const index = Math.floor(totalMinutes / slotDuration);
                methods.scrollToIndex(index);
            },

            // DataOperations
            ...crudMethods,
            getEvents: async () => schedulerService.getEvents(),
            getEventsInDateRange: async (start: Date, end: Date) => schedulerService.getEvents(start, end),
            addEvent: async (e: SchedulerEvent | Record<string, unknown>) => { await schedulerService.addEvent(e as Partial<SchedulerEvent>); },
            saveEvent: async (e: SchedulerEvent | Record<string, unknown>) => { await schedulerService.updateEvent(e as SchedulerEvent); },
            deleteEvent: async (id: string | number) => { await schedulerService.deleteEvent(id); },
            getCurrentViewEvents: () => visibleEvents,
            addResource: async (r: Resource | Record<string, unknown>) => {
                methods.setResources(prev => [...(prev as Resource[]), r as Resource]);
            },
            removeResource: async (id: string | number) => {
                methods.setResources(prev => (prev as Resource[]).filter(r => r.id !== id));
            },

            // Editor
            openEditor: (data: SchedulerEvent, action: string = 'Add') => {
                methods.setEditorState({
                    isOpen: true,
                    mode: action === 'Edit' ? 'edit' : (action === 'view' ? 'view' : 'create'),
                    event: data
                });
            },
            closeEditor: () => methods.setEditorState({ isOpen: false, mode: 'create', event: undefined }),
            closeQuickInfoPopup: methods.closeQuickInfoPopup,

            // Spinner
            ...spinnerMethods,

            // Core
            ...refreshMethods,

            // Exporting
            ...exportMethods,

            // View State
            currentView: view as View,

            // Extra
            ...extraApi
        } as EzSchedulerRef;
    }, [view, currentDate, visibleEvents, methods, schedulerService, extraApi]);

    useComponentImperativeAPI(ref, api);
};
