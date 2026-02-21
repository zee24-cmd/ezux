import { SharedBaseProps } from '../../shared/types/BaseProps';
import type { IService } from '../../shared/services/ServiceRegistry';

// --- Enums & Special Types ---
/**
 * Available view modes for the scheduler.
 */
export type View = 'Day' | 'Week' | 'WorkWeek' | 'Month' | 'TimelineDay' | 'TimelineWeek' | 'TimelineWorkWeek' | 'TimelineMonth' | 'Agenda' | 'MonthAgenda' | 'Year';

/**
 * Editor mode.
 */
export type EditorMode = 'create' | 'edit' | 'view';

/**
 * Action types for the scheduler editor.
 */
export type CurrentAction = 'Add' | 'Edit' | 'Delete';

// Compatibility for existing code
export type ViewType = 'day' | 'week' | 'workweek' | 'month' | 'agenda' | 'timeline-day' | 'timeline-week' | 'timeline-month';

// --- Event & Resource Models ---
/**
 * Configuration for event settings.
 */
export interface EventSettingsModel {
    /** 
     * The data source for events. 
     * @group Models
     */
    dataSource: Record<string, unknown>[] | unknown; // DataManager in future
    /** 
     * Custom field mapping. 
     * @group Models
     */
    fields?: FieldModel;
    /** 
     * Allow adding new events. 
     * @group Models
     */
    allowAdding?: boolean;
    /** 
     * Allow deleting events. 
     * @group Models
     */
    allowDeleting?: boolean;
    /** 
     * Allow editing events. 
     * @group Models
     */
    allowEditing?: boolean;
    /** 
     * Enable event tooltips. 
     * @group Models
     */
    enableTooltip?: boolean;
    /** 
     * Template for event content. 
     * @group Models
     */
    template?: string | ((data: EventData) => React.ReactNode);
}

/**
 * Event field mapping configuration.
 */
export interface FieldModel {
    /** 
     * ID field name. 
     * @group Models
     */
    id?: string;
    /** 
     * Subject/Title field name. 
     * @group Models
     */
    subject?: string;
    /** 
     * Start time field name. 
     * @group Models
     */
    startTime?: string;
    /** 
     * End time field name. 
     * @group Models
     */
    endTime?: string;
    /** 
     * Description field name. 
     * @group Models
     */
    description?: string;
    /** 
     * Location field name. 
     * @group Models
     */
    location?: string;
    /** 
     * Recurrence rule field name. 
     * @group Models
     */
    recurrenceRule?: string;
    /** 
     * Recurrence ID field name. 
     * @group Models
     */
    recurrenceID?: string;
    /** 
     * Recurrence exception field name. 
     * @group Models
     */
    recurrenceException?: string;
    /** 
     * Is all day field name. 
     * @group Models
     */
    isAllDay?: string;
}

export interface EventData {
    id: string | number;
    subject: string;
    startTime: Date;
    endTime: Date;
    isAllDay?: boolean;
    recurrenceRule?: string;
    resourceID?: string | number | (string | number)[];
    [key: string]: unknown;
}


/**
 * Attendee information for an event.
 */
export interface Attendee {
    /** 
     * Unique identifier for the attendee.
     * @group Models
     */
    id: string;
    /** 
     * Name of the attendee.
     * @group Models
     */
    name: string;
    /** 
     * Email address.
     * @group Models
     */
    email?: string;
    /** 
     * Avatar image URL.
     * @group Models
     */
    avatar?: string;
    /** 
     * RSVP status.
     * @group Models
     */
    status?: 'accepted' | 'declined' | 'tentative' | 'needs-action';
    /** 
     * Whether attendance is required.
     * @group Models
     */
    required?: boolean;
}

/**
 * Reminder configuration for an event.
 */
export interface Reminder {
    /** 
     * Unique identifier for the reminder.
     * @group Models
     */
    id: string;
    /** 
     * Type of reminder.
     * @group Models
     */
    type: 'email' | 'popup' | 'sms';
    /** 
     * Minutes before start to trigger.
     * @group Models
     */
    minutesBefore: number;
    /** 
     * Current status.
     * @group Models
     */
    status?: 'pending' | 'sent' | 'dismissed';
}

/** 
 * Timezone configuration for an event.
 */
export interface Timezone {
    start?: string;
    end?: string;
}

/** 
 * Recurrence configuration for an event.
 */
export interface Recurrence {
    frequency: 'Never' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
    interval?: number;
    unit?: string;
    end?: 'Never' | 'Until' | 'Count';
    endCount?: number;
    endUntil?: Date;
    days?: string[];
    repeatBy?: 'day' | 'ordinal';
}

// Old SchedulerEvent
/**
 * Represents a single event in the scheduler.
 */
export interface SchedulerEvent {
    /** Unique identifier for the event */
    id: string;
    /** Title of the event displayed in the scheduler */
    title: string;
    /** Start date and time of the event */
    start: Date;
    /** End date and time of the event */
    end: Date;
    /** Resource ID associated with the event (single resource) */
    resourceId?: string;
    /** Resource IDs associated with the event (multiple resources) */
    resourceIds?: string[];
    /** Background color of the event */
    color?: string;
    /** Whether the event lasts all day */
    allDay?: boolean;
    /** Detailed description of the event */
    description?: string;
    /** Recurrence rule string (RRULE) */
    rrule?: string;
    /** Legacy recurrence rule property */
    recurrenceRule?: string;
    /** Excluded dates for recurrence */
    exdate?: string[];
    /** Recurrence exception dates */
    recurrenceException?: string;
    /** ID of the parent recurrence event */
    recurrenceId?: string;
    /** Original start date of the recurrence instance */
    originalStart?: Date;
    /** Files attached to the event */
    attachedFiles?: File[];
    /** Whether the event blocks the time slot (e.g., lunch break) */
    isBlock?: boolean;
    /** Location of the event */
    location?: string;
    /** List of attendees */
    attendees?: Attendee[];
    /** List of reminders */
    reminders?: Reminder[];
    /** Timezone configuration */
    timezone?: Timezone;
    /** Recurrence configuration */
    recurrence?: Recurrence;
    /** Files attached to the event (alias for attachedFiles) */
    attachments?: any[];
    /** Whether the event is a holiday */
    isHoliday?: boolean;
    /** Whether the event slot is fully booked */
    isFullyBooked?: boolean;
    [key: string]: unknown;
}

// New ResourceModel (Metadata about resource collection)
/**
 * Metadata about resource collection.
 */
export interface ResourceModel {
    /** 
     * Name of the field in the event data. 
     * @group Models
     */
    field: string;
    /** 
     * Title of the resource. 
     * @group Models
     */
    title: string;
    /** 
     * Unique name index. 
     * @group Models
     */
    name: string;
    /** 
     * Resource data array. 
     * @group Models
     */
    dataSource: Record<string, unknown>[] | unknown;
    /** 
     * Field for resource text. 
     * @group Models
     */
    textField: string;
    /** 
     * Field for resource ID. 
     * @group Models
     */
    idField: string;
    /** 
     * Field for grouping. 
     * @group Models
     */
    groupIDField?: string;
    /** 
     * Field for resource color. 
     * @group Models
     */
    colorField?: string;
    /** 
     * Allow multiple resources. 
     * @group Models
     */
    allowMultiple?: boolean;
}

// Old Resource (The actual resource entity)
/**
 * Represents a resource (e.g., person, room, equipment) in the scheduler.
 */
export interface Resource {
    /** Unique identifier for the resource */
    id: string;
    /** Display name of the resource */
    name: string;
    /** Color associated with the resource */
    color?: string;
    /** URL to the resource's avatar image */
    avatar?: string;
    /** Type or designation of the resource */
    type?: string;
    /** Working hours configuration for this resource */
    workingHours?: {
        start: number; // 0-23
        end: number;   // 0-23
        days: number[]; // 0=Sun, 1=Mon...
    };
    [key: string]: unknown;
}

/**
 * Configuration for grouping resources.
 */
export interface GroupModel {
    /** 
     * Group by date first. 
     * @group Models
     */
    byDate?: boolean;
    /** 
     * Group by group ID. 
     * @group Models
     */
    byGroupID?: boolean;
    /** 
     * List of resource names to group by. 
     * @group Models
     */
    resources?: string[];
    /** 
     * Enable compact view for groups. 
     * @group Models
     */
    enableCompactView?: boolean;
}

// --- View Models ---
/**
 * View configuration.
 */
export interface ViewsModel {
    /** 
     * View mode. 
     * @group Models
     */
    option: View;
    /** 
     * Allow virtual scrolling in this view. 
     * @group Models
     */
    allowVirtualScrolling?: boolean;
    /** 
     * Display name for the view. 
     * @group Models
     */
    displayName?: string;
    /** 
     * Start hour for the view. 
     * @group Models
     */
    startHour?: string;
    /** 
     * End hour for the view. 
     * @group Models
     */
    endHour?: string;
    /** 
     * Time interval in minutes. 
     * @group Models
     */
    interval?: number;
    /** 
     * Show weekend. 
     * @group Models
     */
    showWeekend?: boolean;
    /** 
     * Is this view selected. 
     * @group Models
     */
    isSelected?: boolean;
}

/**
 * Working hours configuration.
 */
export interface WorkHoursModel {
    /** 
     * Highlight working hours. 
     * @group Models
     */
    highlight?: boolean;
    /** 
     * Start hour. 
     * @group Models
     */
    start?: string;
    /** 
     * End hour. 
     * @group Models
     */
    end?: string;
}

/**
 * Time scale configuration.
 */
export interface TimeScaleModel {
    /** 
     * Enable time scale. 
     * @group Models
     */
    enable: boolean;
    /** 
     * Time interval in minutes. 
     * @group Models
     */
    interval: number;
    /** 
     * Number of slots per interval. 
     * @group Models
     */
    slotCount: number;
    /** 
     * Template for major time slots. 
     * @group Models
     */
    majorSlotTemplate?: string | ((props: SlotTemplateProps) => React.ReactNode);
    /** 
     * Template for minor time slots. 
     * @group Models
     */
    minorSlotTemplate?: string | ((props: SlotTemplateProps) => React.ReactNode);
}

/**
 * Props for the slot template.
 */
export interface SlotTemplateProps {
    /** 
     * The date of the slot. 
     * @group Models
     */
    date: Date;
    /** 
     * Whether the slot is a working day. 
     * @group Models
     */
    isWorkingDay: boolean;
    /** 
     * The group index. 
     * @group Models
     */
    groupIndex: number;
}

/**
 * Header row configuration.
 */
export interface HeaderRowModel {
    /** 
     * The header row option. 
     * @group Models
     */
    option: 'Year' | 'Month' | 'Week' | 'Date' | 'Hour';
    /** 
     * Template for the header row. 
     * @group Models
     */
    template?: string | ((props: Record<string, unknown>) => React.ReactNode);
}

/**
 * Toolbar item configuration.
 */
export interface ToolbarItemModel {
    /** 
     * Text to display. 
     * @group Models
     */
    text: string;
    /** 
     * CSS class for the item. 
     * @group Models
     */
    cssClass?: string;
    /** 
     * CSS class for the icon. 
     * @group Models
     */
    iconCss?: string;
    /** 
     * Alignment of the item. 
     * @group Models
     */
    align?: 'Left' | 'Center' | 'Right';
}

/**
 * Timezone field configuration.
 */
export interface TimezoneFields {
    /** 
     * Display label. 
     * @group Models
     */
    label: string;
    /** 
     * Timezone value. 
     * @group Models
     */
    value: string;
}

/**
 * Quick info templates configuration.
 */
export interface QuickInfoTemplatesModel {
    /** 
     * Template for the content area. 
     * @group Models
     */
    content?: string | ((props: Record<string, unknown>) => React.ReactNode);
    /** 
     * Template for the footer area. 
     * @group Models
     */
    footer?: string | ((props: Record<string, unknown>) => React.ReactNode);
    /** 
     * Template for the header area. 
     * @group Models
     */
    header?: string | ((props: Record<string, unknown>) => React.ReactNode);
}

export type WeekRule = 'FirstDay' | 'FirstFourDayWeek' | 'FirstFullWeek';

/**
 * Configuration for component slots and their props.
 * @group Extensibility
 */
export interface SchedulerSlotConfig {
    slots?: {
        toolbar?: React.ComponentType<unknown>;
        eventModal?: React.ComponentType<unknown>;
        quickAdd?: React.ComponentType<unknown>;
        resourceSidebar?: React.ComponentType<unknown>;
        [key: string]: React.ComponentType<unknown> | undefined;
    };
    slotProps?: {
        toolbar?: Record<string, unknown>;
        eventModal?: Record<string, unknown>;
        quickAdd?: Record<string, unknown>;
        resourceSidebar?: Record<string, unknown>;
        [key: string]: Record<string, unknown> | undefined;
    };
}

/**
 * Custom component slots for override.
 * @group Models
 * @deprecated Use SchedulerSlotConfig
 */
export interface EzSchedulerSlots {
    toolbar?: React.ComponentType<unknown>;
    eventModal?: React.ComponentType<unknown>;
    quickAdd?: React.ComponentType<unknown>;
    resourceSidebar?: React.ComponentType<unknown>;
}


// --- Main Props Interface ---
/**
 * Props for the EzScheduler component.
 * 
 * @example
 * ```tsx
 * import { EzScheduler } from 'ezux';
 * 
 * const events = [
 *   { id: 1, title: 'Meeting', start: new Date(), end: new Date() }
 * ];
 * 
 * return <EzScheduler events={events} />;
 * ```
 */
export interface EzSchedulerProps extends SharedBaseProps {
    /** 
     * Slots for modular composition.
     * @group Extensibility
     */
    slots?: SchedulerSlotConfig['slots'];

    /** 
     * Props to pass to the custom slots.
     * @group Properties 
     */
    slotProps?: SchedulerSlotConfig['slotProps'];

    /** 
     * Allow event dragging. 
     * @group Properties 
     */
    eventDrag?: boolean;
    /** 
     * Allow keyboard navigation.
     * @group Properties 
     */
    keyboardNavigation?: boolean;
    /** 
     * Allow selecting multiple cells.
     * @group Properties 
     */
    allowMultiCellSelection?: boolean;
    /** 
     * Allow event resizing.
     * @group Properties 
     */
    eventResize?: boolean;
    /** 
     * Allow copying/pasting events via clipboard.
     * @group Properties 
     */
    allowClipboard?: boolean;
    /** 
     * Allow inline editing of events.
     * @group Properties 
     */
    allowInline?: boolean;
    /** 
     * Allow dragging multiple events.
     * @group Properties 
     */
    allowMultiDrag?: boolean;
    /** 
     * Allow selecting multiple rows.
     * @group Properties 
     */
    allowMultiRowSelection?: boolean;
    /** 
     * Allow overlapping events to be displayed.
     * @group Properties 
     */
    eventOverlap?: boolean;
    /** 
     * Allow touch swiping to navigate views.
     * @group Properties 
     */
    allowSwiping?: boolean;
    /** 
     * Number of days to show in Agenda view.
     * @group Properties 
     */
    agendaDaysCount?: number;
    /** 
     * Calendar system to use.
     * @group Properties 
     */
    calendarMode?: 'Gregorian' | 'Islamic';
    /** 
     * Template for cell headers.
     * @group Properties 
     */
    cellHeaderTemplate?: string | ((props: Record<string, unknown>) => React.ReactNode);
    /** 
     * Custom CSS class for the scheduler container.
     * @group Properties 
     */
    cssClass?: string;
    /** 
     * The initial view to display.
     * @group Properties 
     */
    view?: View;
    /** 
     * Date format for headers and tooltips.
     * @group Properties 
     */
    dateFormat?: string;
    /** 
     * Template for date headers.
     * @group Properties 
     */
    dateHeader?: string | ((props: Record<string, unknown>) => React.ReactNode);
    /** 
     * Template for date range display.
     * @group Properties 
     */
    dateRangeTemplate?: string | ((props: Record<string, unknown>) => React.ReactNode);
    /** 
     * Template for day headers.
     * @group Properties 
     */
    dayHeaderTemplate?: string | ((props: Record<string, unknown>) => React.ReactNode);
    /** 
     * Enable adaptive UI for mobile devices.
     * @group Properties 
     */
    enableAdaptiveUI?: boolean;
    /** 
     * Enable scrolling for the All Day row.
     * @group Properties 
     */
    enableAllDayScroll?: boolean;
    /** 
     * Enable state persistence (save settings to local storage).
     * @group Properties 
     */
    enablePersistence?: boolean;
    /** 
     * Validation for recurrence rules.
     * @group Properties 
     */
    enableRecurrenceValidation?: boolean;
    /** 
     * Enable RTL (Right-to-Left) text direction.
     * @group Properties 
     */
    enableRtl?: boolean;
    /** 
     * End hour of the scheduler (e.g., '18:00').
     * @group Properties 
     */
    endHour?: string;
    /** 
     * Configuration for event fields and settings.
     * @group Properties 
     */
    eventSettings?: EventSettingsModel;
    /** 
     * First day of the week (0=Sunday, 1=Monday, etc.).
     * @group Properties 
     */
    firstDayOfWeek?: number;
    /** 
     * First month of the year (0=January, etc.).
     * @group Properties 
     */
    firstMonthOfYear?: number;
    /** 
     * Configuration for grouping resources.
     * @group Properties 
     */
    group?: GroupModel;
    /** 
     * Template for header indentation.
     * @group Properties 
     */
    headerIndentTemplate?: string | ((props: Record<string, unknown>) => React.ReactNode);
    /** 
     * Custom header rows configuration.
     * @group Properties 
     */
    headerRows?: HeaderRowModel[];
    /** 
     * Height of the scheduler.
     * @group Properties 
     */
    height?: string | number;
    /** 
     * Hide days with no events in Agenda view.
     * @group Properties 
     */
    hideEmptyAgendaDays?: boolean;
    /** 
     * Whether the current view is All Day.
     * @group Properties 
     */
    isAllDay?: boolean;
    /** 
     * Locale for the scheduler.
     * @group Properties 
     */
    locale?: string;
    /** 
     * Maximum date navigable.
     * @group Properties 
     */
    maxDate?: Date;
    /** 
     * Minimum date navigable.
     * @group Properties 
     */
    minDate?: Date;
    /** 
     * Template for month view headers.
     * @group Properties 
     */
    monthHeaderTemplate?: string | ((props: Record<string, unknown>) => React.ReactNode);
    /** 
     * Show quick info popup on selection end.
     * @group Properties 
     */
    quickInfoOnSelectionEnd?: boolean;
    /** 
     * Enable read-only mode.
     * @group Properties 
     */
    readOnly?: boolean;
    resourceHeaderTemplate?: string | ((props: Record<string, unknown>) => React.ReactNode);
    resources?: ResourceModel[] | Resource[];
    rowAutoHeight?: boolean;
    selectedDate?: Date;
    showHeaderBar?: boolean;
    showQuickInfoPopup?: boolean;
    showResourceHeaders?: boolean;
    showTimeIndicator?: boolean;
    currentTimeIndicator?: boolean;
    startHour?: string;
    timeScale?: TimeScaleModel;
    timezone?: string;
    timezoneDataSource?: TimezoneFields[];
    toolbarItems?: (string | ToolbarItemModel)[];
    views?: (View | ViewsModel)[];
    width?: string | number;
    workDays?: number[];
    workHours?: WorkHoursModel;
    cell?: string | ((date: Date, resourceId?: string) => React.ReactNode);
    cellTemplate?: string | ((props: Record<string, unknown>) => React.ReactNode);
    editorFooterTemplate?: string | ((props: Record<string, unknown>) => React.ReactNode);
    editorHeaderTemplate?: string | ((props: Record<string, unknown>) => React.ReactNode);
    editorTemplate?: string | ((props: Record<string, unknown>) => React.ReactNode);
    enableHtmlSanitizer?: boolean;
    eventDragArea?: string;
    monthsCount?: number;
    overscanCount?: number;
    progressiveRendering?: boolean;
    prefetchDistance?: number;
    debugVirtualization?: boolean;
    quickInfoTemplates?: QuickInfoTemplatesModel;
    showWeekNumber?: boolean;
    showWeekend?: boolean;
    timeFormat?: string;
    weekRule?: WeekRule;
    recurrenceEngine?: unknown;
    slotDuration?: number;
    slotHeight?: number;
    isLoading?: boolean;
    allowPastEvents?: boolean;
    is24Hour?: boolean;

    // Enterprise Events
    onEventOverlap?: (args: { event: SchedulerEvent; existingEvents: SchedulerEvent[]; cancel: boolean }) => void;
    onCellContextMenu?: (args: { date: Date; x: number; y: number }) => void;

    // Legacy Prop Support (to avoid breaking demo)
    events?: SchedulerEvent[];
    defaultView?: ViewType;
    defaultSelectedDate?: Date;
    showResourcesInDayView?: boolean;
    showUnassignedLane?: boolean;
    onViewChange?: (view: View) => void;
    onDateChange?: (date: Date) => void;
    onSlotDurationChange?: (duration: number) => void;
    onCellClick?: (date: Date, resourceId?: string) => void;
    onCellDoubleClick?: (date: Date, resourceId?: string) => void;
    onEventClick?: (event: SchedulerEvent) => void;
    onEventDoubleClick?: (event: SchedulerEvent) => void;
    onEventCreate?: (event: Partial<SchedulerEvent>) => void | Promise<void>;
    onEventDelete?: (eventId: string) => void | Promise<void>;
    onEventChange?: (event: SchedulerEvent) => void | Promise<void>;

    // Event Callbacks (exhaustive)
    actionBegin?: (args: ActionEventArgs) => void;
    actionComplete?: (args: ActionEventArgs) => void;
    actionFailure?: (args: ActionFailureArgs) => void;
    cellClick?: (args: CellClickEventArgs) => void;
    cellDoubleClick?: (args: CellClickEventArgs) => void;
    eventClick?: (args: EventClickEventArgs) => void;
    eventDoubleClick?: (args: EventClickEventArgs) => void;
    navigating?: (args: NavigatingEventArgs) => void;
    popupClose?: (args: PopupCloseEventArgs) => void;
    popupOpen?: (args: PopupOpenEventArgs) => void;
    renderCell?: (args: RenderCellEventArgs) => void;
    resizeStart?: (args: ResizeEventArgs) => void;
    resizeStop?: (args: ResizeEventArgs) => void;
    dragStart?: (args: DragEventArgs) => void;
    drag?: (args: DragEventArgs) => void;
    dragStop?: (args: DragEventArgs) => void;
    select?: (args: SelectEventArgs) => void;
    beforePaste?: (args: Record<string, unknown>) => void;
    beforePrint?: (args: Record<string, unknown>) => void;
    created?: (args: Record<string, unknown>) => void;
    dataBinding?: (args: Record<string, unknown>) => void;
    dataBound?: (args: Record<string, unknown>) => void;
    destroyed?: (args: Record<string, unknown>) => void;
    eventRendered?: (args: Record<string, unknown>) => void;
    excelExport?: (args: Record<string, unknown>) => void;
    hover?: (args: Record<string, unknown>) => void;
    moreEventsClick?: (args: Record<string, unknown>) => void;
    resizing?: (args: ResizeEventArgs) => void;
    tooltipOpen?: (args: Record<string, unknown>) => void;
    virtualScrollStart?: (args: Record<string, unknown>) => void;
    virtualScrollStop?: (args: Record<string, unknown>) => void;

    // Export Callbacks
    onExportExcel?: (events: SchedulerEvent[]) => void;
    onExportCSV?: (events: SchedulerEvent[]) => void;
    onExportICS?: (events: SchedulerEvent[]) => void;
}

// --- Event Argument Interfaces ---

/**
 * Arguments for action events.
 */
export interface ActionEventArgs {
    requestType: string;
    cancel: boolean;
    data?: Record<string, unknown>;
    [key: string]: unknown;
}

/**
 * Arguments for action failure events.
 */
export interface ActionFailureArgs {
    requestType: string;
    error: Error;
    [key: string]: unknown;
}

/**
 * Arguments for cell click events.
 */
export interface CellClickEventArgs {
    startTime: Date;
    endTime: Date;
    element?: HTMLElement;
    isAllDay: boolean;
    groupIndex?: number;
}

/**
 * Arguments for event click events.
 */
export interface EventClickEventArgs {
    event: SchedulerEvent;
    element?: HTMLElement;
    cancel: boolean;
}

/**
 * Arguments for navigation events.
 */
export interface NavigatingEventArgs {
    previousDate: Date;
    currentDate: Date;
    previousView: View | ViewType;
    currentView: View | ViewType;
    cancel?: boolean;
}

/**
 * Arguments for popup events.
 */
export interface PopupOpenEventArgs {
    type: 'Editor' | 'QuickInfo' | string;
    data?: EventData | Record<string, unknown>;
    element?: HTMLElement;
    cancel: boolean;
}

/**
 * Arguments for popup close events.
 */
export interface PopupCloseEventArgs {
    type: 'Editor' | 'QuickInfo' | string;
    data?: EventData | Record<string, unknown>;
    element?: HTMLElement;
    cancel: boolean;
}

/**
 * Arguments for cell rendering events.
 */
export interface RenderCellEventArgs {
    date: Date;
    element: HTMLElement;
    view: View;
    groupIndex?: number;
}

/**
 * Arguments for resize events.
 */
export interface ResizeEventArgs {
    data: EventData;
    element?: HTMLElement;
    cancel: boolean;
}

/**
 * Arguments for drag events.
 */
export interface DragEventArgs {
    data: EventData;
    element?: HTMLElement;
    cancel: boolean;
    target?: HTMLElement;
}

/**
 * Arguments for selection events.
 */
export interface SelectEventArgs {
    element?: HTMLElement[];
    startTime: Date;
    endTime: Date;
}

/**
 * Imperative API Reference
 */
export interface EzSchedulerRef {
    // View
    /** 
     * Change the current view.
     * @group Methods 
     */
    changeView: (view: View) => void;
    /** 
     * The current view mode.
     * @group Properties 
     */
    currentView: View;

    /** 
     * Scroll to a specific row index.
     * @group Methods 
     */
    scrollToIndex: (index: number) => void;
    /** 
     * Scroll to a specific time.
     * @group Methods 
     */
    scrollTo: (hour: string, minute?: number) => void;
    /** 
     * Navigate to the next date range.
     * @group Methods 
     */
    next: () => void;
    /** 
     * Navigate to the previous date range.
     * @group Methods 
     */
    prev: () => void;
    /** 
     * Navigate to today.
     * @group Methods 
     */
    today: () => void;
    /** 
     * Scroll to a specific time (legacy).
     * @group Methods 
     */
    scrollToTime: (hour: number, minute: number) => void;

    /** 
     * Refresh the scheduler layout.
     * @group Methods 
     */
    refresh: () => void;
    /** 
     * Get all events.
     * @group Methods 
     */
    getData: () => Promise<SchedulerEvent[]>;
    /** 
     * Add a new event.
     * @group Methods 
     */
    addEvent: (event: SchedulerEvent | Record<string, unknown>) => Promise<void>;
    /** 
     * Save an existing or new event.
     * @group Methods 
     */
    saveEvent: (event: SchedulerEvent | Record<string, unknown>) => Promise<void>;
    /** 
     * Delete an event by ID.
     * @group Methods 
     */
    deleteEvent: (id: string | number) => Promise<void>;
    /** 
     * Get all events.
     * @group Methods 
     */
    getEvents: () => Promise<SchedulerEvent[]>;
    /** 
     * Get events in a specific date range.
     * @group Methods 
     */
    getEventsInDateRange: (start: Date, end: Date) => Promise<SchedulerEvent[]>;

    /** 
     * Add a new resource.
     * @group Methods 
     */
    addResource: (resource: Resource | Record<string, unknown>) => Promise<void>;
    /** 
     * Remove a resource by ID.
     * @group Methods 
     */
    removeResource: (resourceId: string | number) => Promise<void>;

    /** 
     * Open the event editor.
     * @group Methods 
     */
    openEditor: (event: SchedulerEvent, action: CurrentAction) => void;
    /** 
     * Close the event editor.
     * @group Methods 
     */
    closeEditor: () => void;
    /** 
     * Close the quick info popup.
     * @group Methods 
     */
    closeQuickInfoPopup: () => void;

    /** 
     * Show the loading spinner.
     * @group Methods 
     */
    showSpinner: () => void;
    /** 
     * Hide the loading spinner.
     * @group Methods 
     */
    hideSpinner: () => void;

    /** 
     * Export to Excel.
     * @group Methods 
     */
    exportToExcel: () => void;
    /** 
     * Export to CSV.
     * @group Methods 
     */
    exportToCsv: () => void;
    /** 
     * Print the scheduler.
     * @group Methods 
     */
    print: () => void;

    /** 
     * Destroy the component instance.
     * @group Methods 
     */
    destroy: () => void;
}

// --- Service Interface ---

/**
 * Interface defined for the Scheduler service.
 */
export interface ISchedulerService extends IService {
    /** 
     * Retrieves events within a date range.
     * @group Services 
     */
    getEvents(start: Date, end: Date): Promise<SchedulerEvent[]>;
    /** 
     * Adds a new event.
     * @group Services 
     */
    addEvent(event: Partial<SchedulerEvent>): Promise<SchedulerEvent>;
    /** 
     * Updates an existing event.
     * @group Services 
     */
    updateEvent(event: SchedulerEvent): Promise<SchedulerEvent>;
    /** 
     * Deletes an event by ID.
     * @group Services 
     */
    deleteEvent(id: string | number): Promise<void>;

    /** 
     * Retrieves all resources.
     * @group Services 
     */
    getResources?(): Promise<Resource[]>;
    /** 
     * Adds a new resource.
     * @group Services 
     */
    addResource?(resource: Resource): Promise<Resource>;

    /** 
     * Initializes the service with data.
     * @group Services 
     */
    initializeWithData?(events: SchedulerEvent[], resources?: Resource[]): void;
}
