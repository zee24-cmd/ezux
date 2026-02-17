import React, { useState, forwardRef, useCallback } from 'react';
import { addMinutes, areIntervalsOverlapping } from 'date-fns';
import { EzSchedulerProps, View, ViewType, SchedulerEvent, EzSchedulerRef } from './EzScheduler.types';
import { cn } from '../../lib/utils';
import { useEzScheduler } from './useEzScheduler';
import { useSchedulerImperative } from './hooks/useSchedulerImperative';
import { useSchedulerResources } from './hooks/useSchedulerResources';
import { useSchedulerEventHandlers } from './hooks/useSchedulerEventHandlers';
import { EzErrorBoundary } from '../shared/components/EzErrorBoundary';
import { EzSchedulerErrorFallback } from '../shared/components/EzSchedulerErrorFallback';
import { SchedulerLoadingSpinner } from './components/SchedulerLoadingSpinner';
import { DndContext, closestCenter } from '@dnd-kit/core';
const EzEventModal = React.lazy(() => import('./components/EzEventModal').then(m => ({ default: m.EzEventModal })));
const EzSchedulerQuickAdd = React.lazy(() => import('./components/EzSchedulerQuickAdd').then(m => ({ default: m.EzSchedulerQuickAdd })));
import { EzSchedulerContent } from './components/EzSchedulerContent';

// Modular: Lazy load default implementations
const EzSchedulerToolbar = React.lazy(() => import('./EzSchedulerToolbar').then(m => ({ default: m.EzSchedulerToolbar })));
import { Modal } from '../../shared/components/Modal';
import { Button } from '../../components/ui/button';
import { format } from 'date-fns';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInitCoreServices } from '../../shared/hooks';

const queryClient = new QueryClient();

/**
 * EzScheduler is a comprehensive event management and resource scheduling engine.
 * It provides a fluid user experience for managing complex schedules across 
 * various view modes with full drag-and-drop and resizing support.
 * 

 * ### Key Features
 * - **Multi-View System**: Switch between Day, Week, Work Week, Month, and various Timeline views.
 * - **Resource Management**: Group events by resources (people, rooms, equipment) with dedicated lanes.
 * - **Interactive Editing**: Intuitive drag-and-drop event movement, resizing, and double-click creation.
 * - **Intelligent Overlap**: Customizable overlap detection and blocking for intervals like lunch breaks.
 * - **Quick Info & Editor**: Built-in popovers for quick summaries and a full modal for detailed editing.
 * - **Virtualization**: Efficient rendering of large resource lists and event densities.
 * 
 * ### Minimal Example
 * ```tsx
 * <EzScheduler
 *   events={myEvents}
 *   view="Week"
 *   onEventChange={(event) => updateEvent(event)}
 * />
 * ```
 * 
 * ### Resource Grouping Example
 * ```tsx
 * <EzScheduler
 *   resources={[
 *     { id: '1', name: 'Meeting Room A', color: '#e11d48' },
 *     { id: '2', name: 'Meeting Room B', color: '#2563eb' }
 *   ]}
 *   events={events}
 *   view="TimelineDay"
 *   onEventCreate={(event) => createNewMeeting(event)}
 * />
 * ```
 * 
 * @group Core Components
 */
export const EzScheduler = forwardRef<EzSchedulerRef, EzSchedulerProps>((props, ref) => {
    // Initialize core services (I18n, Notifications, etc.)
    useInitCoreServices();

    return (
        <QueryClientProvider client={queryClient}>
            <EzSchedulerInner {...props} ref={ref} />
        </QueryClientProvider>
    );
});

EzScheduler.displayName = 'EzScheduler';

const EzSchedulerInner = forwardRef<EzSchedulerRef, EzSchedulerProps>((props, ref) => {
    // 1. Hook Orchestrator
    const scheduler = useEzScheduler({
        ...props,
        defaultView: props.view?.toLowerCase() as ViewType || 'week',
        defaultSelectedDate: props.selectedDate ?? props.defaultSelectedDate
    });

    const {
        store, actions,
        view, setView, currentDate, setCurrentDate,
        visibleEvents, rowVirtualizer, parentRef,
        schedulerService, baseApi
    } = scheduler;

    // 2. Event Handlers & DND
    const checkOverlap = (event: Partial<SchedulerEvent>) => {
        if (!event.start || !event.end) return { hasBlockOverlap: false, hasRegularOverlap: false, overlappingEvents: [] };

        const overlappingEvents = visibleEvents.filter((ev: SchedulerEvent) => {
            if (ev.id === event.id) return false; // Skip self

            const resourceMatch =
                (ev.resourceId === event.resourceId) ||
                (ev.resourceIds?.some(id => event.resourceId === id)) ||
                (!ev.resourceId && !event.resourceId);

            if (!resourceMatch) return false;

            return areIntervalsOverlapping(
                { start: ev.start, end: ev.end },
                { start: event.start!, end: event.end! }
            );
        });

        return {
            hasBlockOverlap: overlappingEvents.some((ev: SchedulerEvent) => ev.isBlock),
            hasRegularOverlap: overlappingEvents.length > 0,
            overlappingEvents
        };
    };

    const triggerOverlapWarning = (type: 'block' | 'regular' | 'past' = 'regular') => {
        const notificationService = scheduler.serviceRegistry.get<any>('NotificationService');
        if (notificationService) {
            let message = '';
            let msgType: 'error' | 'warning' = 'warning';

            if (type === 'block') {
                message = 'Cannot place event here: This time is blocked (e.g. Lunch Break).';
                msgType = 'error';
            } else if (type === 'past') {
                message = 'Cannot move or create events in the past.';
                msgType = 'error';
            } else {
                message = 'Warning: This event overlaps with an existing event.';
                msgType = 'warning';
            }

            notificationService.add({
                type: msgType,
                message,
                duration: 5000
            });
        }
    };

    const { sensors, handleDragEnd } = useSchedulerEventHandlers({
        events: visibleEvents,
        slotDuration: scheduler.slotDuration,
        onEventChange: (updatedEvent) => {
            // Check for past date
            if (!props.allowPastEvents && updatedEvent.start < new Date()) {
                triggerOverlapWarning('past');
                return;
            }

            const { hasBlockOverlap, hasRegularOverlap, overlappingEvents } = checkOverlap(updatedEvent);

            if (hasBlockOverlap) {
                triggerOverlapWarning('block');
                return; // Strictly prevent movement/resize into blocked slots
            }

            if (hasRegularOverlap) {
                if (props.onEventOverlap) {
                    const args = { event: updatedEvent as SchedulerEvent, existingEvents: overlappingEvents, cancel: false };
                    props.onEventOverlap(args);
                    if (args.cancel) return;
                }
                triggerOverlapWarning('regular');
            }

            console.log('[EzScheduler] Calling scheduler.updateEvent', updatedEvent);
            scheduler.updateEvent(updatedEvent);

        }
    });

    // 3. Resource Management
    const { internalResources, setInternalResources } = useSchedulerResources({
        resources: props.resources
    });

    // 4. Local State
    const [editorState, setEditorState] = useState<{
        isOpen: boolean;
        mode: 'create' | 'edit' | 'view';
        event?: Partial<SchedulerEvent>
    }>({ isOpen: false, mode: 'create' });

    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [quickAddSelection, setQuickAddSelection] = useState<{ start: Date; end: Date; resourceId?: string } | null>(null);
    const [quickAddPosition, setQuickAddPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    // 3. Imperative API
    const api = React.useMemo(() => ({
        ...scheduler.baseApi,
        onExportExcel: props.onExportExcel,
        onExportCSV: props.onExportCSV,
        onExportICS: props.onExportICS,
        get currentView() { return view as View; },
        destroy: () => { if (props.destroyed) props.destroyed({}); }
    }), [scheduler.baseApi, view, props.destroyed, props.onExportExcel, props.onExportCSV, props.onExportICS]);


    useSchedulerImperative(
        view, currentDate,
        schedulerService, visibleEvents,
        {
            setEditorState,
            setResources: setInternalResources,
            scrollToIndex: (idx: number) => {
                if (parentRef.current) parentRef.current.scrollTop = idx * 64;
            },
            forceUpdate: () => { },
            showSpinner: baseApi.showSpinner,
            hideSpinner: baseApi.hideSpinner,
            closeQuickInfoPopup: () => setIsQuickAddOpen(false),
            changeView: (v: View) => setView(v.toLowerCase() as ViewType),
            next: scheduler.next,
            prev: scheduler.prev,
            today: scheduler.today
        },
        ref as any,
        api
    );

    // 4. Handlers
    const handleSlotDoubleClick = (date: Date, resourceId?: string) => {
        if (props.onCellDoubleClick) props.onCellDoubleClick(date, resourceId);
        else setEditorState({
            isOpen: true, mode: 'create',
            event: { start: date, end: addMinutes(date, 30), resourceId, resourceIds: resourceId ? [resourceId] : [] }
        });
    };

    const handleEventDoubleClick = (event: SchedulerEvent) => {
        if (props.onEventDoubleClick) props.onEventDoubleClick(event);
        else {
            const isPast = event.end < new Date();
            setEditorState({ isOpen: true, mode: isPast ? 'view' : 'edit', event });
        }
    };

    const handleSaveEvent = async (event: Partial<SchedulerEvent>) => {
        // Check for past date
        if (!props.allowPastEvents && event.start && event.start < new Date()) {
            triggerOverlapWarning('past');
            return;
        }

        // Check for overlapping events
        const { hasBlockOverlap, hasRegularOverlap } = checkOverlap(event);

        if (hasBlockOverlap) {
            triggerOverlapWarning('block');
            return; // reject save
        }

        if (hasRegularOverlap) {
            triggerOverlapWarning('regular');
        }

        if (editorState.mode === 'create') {
            await props.onEventCreate?.(event);
            scheduler.addEvent(event as SchedulerEvent);
        } else {
            await props.onEventChange?.(event as SchedulerEvent);
            scheduler.updateEvent(event as SchedulerEvent);
        }
        setEditorState(prev => ({ ...prev, isOpen: false }));
    };

    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        eventId?: string;
    }>({ isOpen: false });

    const handleDeleteEvent = async (id: string) => {
        setDeleteConfirmation({ isOpen: true, eventId: id });
    };

    const confirmDelete = async () => {
        const id = deleteConfirmation.eventId;
        if (!id) return;

        const event = visibleEvents.find((e: SchedulerEvent) => e.id === id);
        if (event) {
            await props.onEventDelete?.(id);
            scheduler.deleteEvent(id);

            // Send Notification
            const notificationService = scheduler.serviceRegistry.get<any>('NotificationService');
            if (notificationService) {
                const dateTimeStr = format(event.start, 'MMM d, yyyy h:mm a');
                notificationService.add({
                    type: 'success',
                    message: `Event "${event.title}" on ${dateTimeStr} has been cancelled.`,
                    duration: 5000
                });
            }
        }

        setDeleteConfirmation({ isOpen: false });
    };

    const handleQuickAddSave = (event: Partial<SchedulerEvent>) => {
        // Check for past date
        if (!props.allowPastEvents && event.start && event.start < new Date()) {
            triggerOverlapWarning('past');
            return;
        }

        scheduler.addEvent(event as SchedulerEvent);
        props.onEventCreate?.(event);
        setIsQuickAddOpen(false);
    };

    const handleRangeSelect = (start: Date, end: Date, resourceId?: string, position?: { x: number; y: number }) => {
        if (props.showQuickInfoPopup) {
            setQuickAddSelection({ start, end, resourceId });
            setQuickAddPosition({ x: position?.x || 0, y: position?.y || 0 });
            setIsQuickAddOpen(true);
        }
    };

    return (
        <EzErrorBoundary fallback={<EzSchedulerErrorFallback />}>
            <div
                className={cn("ez-scheduler flex flex-col w-full h-full bg-background select-none overflow-hidden", props.className)}
                dir={scheduler.dir}
            >
                {props.showHeaderBar !== false && (
                    <React.Suspense fallback={<div className="h-12 w-full animate-pulse bg-muted/20 rounded-md mb-4" />}>
                        {props.slots?.toolbar ? (
                            <props.slots.toolbar
                                view={view}
                                setView={setView}
                                currentDate={currentDate}
                                next={scheduler.next}
                                prev={scheduler.prev}
                                today={scheduler.today}
                                onAddClick={useCallback(() => setEditorState({ isOpen: true, mode: 'create', event: {} }), [])}
                                slotDuration={scheduler.slotDuration}
                                setSlotDuration={scheduler.setSlotDuration}
                                setCurrentDate={setCurrentDate}
                                onPrev={scheduler.prev}
                                onNext={scheduler.next}
                                onToday={scheduler.today}
                                currentView={view as View}
                                onViewChange={(v: string) => {
                                    const normalized = v.toLowerCase().replace(/[^a-z]/g, '');
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
                                    const targetView = mapping[normalized] || normalized as ViewType;
                                    setView(targetView);
                                }}
                                views={props.views || ['Day', 'Week', 'Month']}
                                onExportExcel={useCallback(() => props.onExportExcel?.(visibleEvents), [props.onExportExcel, visibleEvents])}
                                onExportCSV={useCallback(() => props.onExportCSV?.(visibleEvents), [props.onExportCSV, visibleEvents])}
                                onExportICS={useCallback(() => props.onExportICS?.(visibleEvents), [props.onExportICS, visibleEvents])}
                                dir={scheduler.dir}
                                {...props.slotProps?.toolbar}
                            />
                        ) : (
                            <EzSchedulerToolbar
                                view={view}
                                setView={setView}
                                currentDate={currentDate}
                                next={scheduler.next}
                                prev={scheduler.prev}
                                today={scheduler.today}
                                onAddClick={useCallback(() => setEditorState({ isOpen: true, mode: 'create', event: {} }), [])}
                                slotDuration={scheduler.slotDuration}
                                setSlotDuration={scheduler.setSlotDuration}
                                setCurrentDate={setCurrentDate}
                                onPrev={scheduler.prev}
                                onNext={scheduler.next}
                                onToday={scheduler.today}
                                currentView={view as View}
                                onViewChange={(v) => {
                                    const normalized = v.toLowerCase().replace(/[^a-z]/g, '');
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
                                    const targetView = mapping[normalized] || normalized as ViewType;
                                    setView(targetView);
                                }}
                                views={props.views || ['Day', 'Week', 'Month']}
                                onExportExcel={useCallback(() => props.onExportExcel?.(visibleEvents), [props.onExportExcel, visibleEvents])}
                                onExportCSV={useCallback(() => props.onExportCSV?.(visibleEvents), [props.onExportCSV, visibleEvents])}
                                onExportICS={useCallback(() => props.onExportICS?.(visibleEvents), [props.onExportICS, visibleEvents])}
                                dir={scheduler.dir}
                            />
                        )}
                    </React.Suspense>
                )}
                <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                    <div className="flex-1 overflow-hidden relative flex flex-col">
                        <EzSchedulerContent
                            store={store}
                            actions={actions}
                            view={view}
                            daysInView={scheduler.daysInView}
                            visibleEvents={visibleEvents}
                            rowVirtualizer={rowVirtualizer}
                            resources={internalResources}
                            handleSlotDoubleClick={handleSlotDoubleClick}
                            handleEventDoubleClick={handleEventDoubleClick}
                            handleEventDelete={handleDeleteEvent}
                            parentRef={parentRef as React.RefObject<HTMLDivElement | null>}
                            setView={setView}
                            setCurrentDate={setCurrentDate}
                            props={props}
                            handleRangeSelect={handleRangeSelect}
                            currentDate={currentDate}
                            showUnassignedLane={props.showUnassignedLane}
                            slotDuration={scheduler.slotDuration}
                            is24Hour={scheduler.is24Hour}
                            setIs24Hour={scheduler.setIs24Hour}
                            dir={scheduler.dir}
                        />

                        {props.isLoading && <SchedulerLoadingSpinner />}
                    </div>

                    {isQuickAddOpen && quickAddSelection && (
                        <React.Suspense fallback={null}>
                            {props.slots?.quickAdd ? (
                                <props.slots.quickAdd
                                    start={quickAddSelection.start}
                                    end={quickAddSelection.end}
                                    resourceId={quickAddSelection.resourceId}
                                    resources={internalResources}
                                    onSave={handleQuickAddSave}
                                    onCancel={() => setIsQuickAddOpen(false)}
                                    onMoreOptions={(data: any) => { // Removed explicit type to avoid import issues
                                        setIsQuickAddOpen(false);
                                        setEditorState({ isOpen: true, mode: 'create', event: data });
                                    }}
                                    position={quickAddPosition}
                                    {...props.slotProps?.quickAdd}
                                />
                            ) : (
                                <EzSchedulerQuickAdd
                                    start={quickAddSelection.start}
                                    end={quickAddSelection.end}
                                    resourceId={quickAddSelection.resourceId}
                                    resources={internalResources}
                                    onSave={handleQuickAddSave}
                                    onCancel={() => setIsQuickAddOpen(false)}
                                    onMoreOptions={(data) => {
                                        setIsQuickAddOpen(false);
                                        setEditorState({ isOpen: true, mode: 'create', event: data });
                                    }}
                                    position={quickAddPosition}
                                />
                            )}
                        </React.Suspense>
                    )}

                    <React.Suspense fallback={null}>
                        {props.slots?.eventModal ? (
                            <props.slots.eventModal
                                isOpen={editorState.isOpen}
                                onClose={() => setEditorState(prev => ({ ...prev, isOpen: false }))}
                                mode={editorState.mode}
                                event={editorState.event}
                                onSave={handleSaveEvent}
                                onDelete={handleDeleteEvent}
                                resources={internalResources}
                                locale={props.locale}
                                {...props.slotProps?.eventModal}
                            />
                        ) : (
                            <EzEventModal
                                isOpen={editorState.isOpen}
                                onClose={() => setEditorState(prev => ({ ...prev, isOpen: false }))}
                                mode={editorState.mode}
                                event={editorState.event}
                                onSave={handleSaveEvent}
                                onDelete={handleDeleteEvent}
                                resources={internalResources}
                                locale={props.locale}
                            />
                        )}
                    </React.Suspense>

                    <Modal
                        isOpen={deleteConfirmation.isOpen}
                        onClose={() => setDeleteConfirmation({ isOpen: false })}
                        title="Delete Event"
                        footer={(
                            <div className="flex gap-2">
                                <Button variant="ghost" onClick={() => setDeleteConfirmation({ isOpen: false })}>Cancel</Button>
                                <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                            </div>
                        )}
                    >
                        <p className="text-sm text-muted-foreground">Are you sure you want to delete this event? This action cannot be undone.</p>
                    </Modal>
                </DndContext>
            </div>
        </EzErrorBoundary>
    );
});

EzSchedulerInner.displayName = 'EzSchedulerInner';
