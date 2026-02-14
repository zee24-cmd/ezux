import { SharedBaseProps } from '../../shared/types/BaseProps';
import type { IService } from '../../shared/services/ServiceRegistry';

// --- Enums & Special Types ---
/**
 * Available view modes for the scheduler.
 */
export type View = 'Day' | 'Week' | 'WorkWeek' | 'Month' | 'TimelineDay' | 'TimelineWeek' | 'TimelineWorkWeek' | 'TimelineMonth' | 'Agenda' | 'MonthAgenda' | 'Year';

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
    dataSource: Object[] | any; // DataManager in future
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
    [key: string]: any;
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
    /** Whether the event is a holiday */
    isHoliday?: boolean;
    /** Whether the event slot is fully booked */
    isFullyBooked?: boolean;
    [key: string]: any;
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
    dataSource: Object[];
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
    /** Working hours configuration for this resource */
    workingHours?: {
        start: number; // 0-23
        end: number;   // 0-23
        days: number[]; // 0=Sun, 1=Mon...
    };
    [key: string]: any;
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
    template?: string | ((props: any) => React.ReactNode);
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
    content?: string | ((props: any) => React.ReactNode);
    /** 
     * Template for the footer area. 
     * @group Models
     */
    footer?: string | ((props: any) => React.ReactNode);
    /** 
     * Template for the header area. 
     * @group Models
     */
    header?: string | ((props: any) => React.ReactNode);
}

export type WeekRule = 'FirstDay' | 'FirstFourDayWeek' | 'FirstFullWeek';

/**
 * Component Injection (IoC)
 */
/**
 * Component Injection (IoC).
 */
export interface EzSchedulerComponents {
    /** 
     * Custom event component. 
     * @group Subcomponents
     */
    event?: React.ComponentType<{ event: SchedulerEvent; isPlaceholder?: boolean }>;
    /** 
     * Custom toolbar component. 
     * @group Subcomponents
     */
    toolbar?: React.ComponentType<any>;
    /** 
     * Custom resource header component. 
     * @group Subcomponents
     */
    resourceHeader?: React.ComponentType<{ resource: Resource }>;
    /** 
     * Custom time slot component. 
     * @group Subcomponents
     */
    timeSlot?: React.ComponentType<{ date: Date; isWorkHour?: boolean }>;
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
    cellHeaderTemplate?: string | ((props: any) => React.ReactNode);
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
    dateHeader?: string | ((props: any) => React.ReactNode);
    /** 
     * Template for date range display.
     * @group Properties 
     */
    dateRangeTemplate?: string | ((props: any) => React.ReactNode);
    /** 
     * Template for day headers.
     * @group Properties 
     */
    dayHeaderTemplate?: string | ((props: any) => React.ReactNode);
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
    headerIndentTemplate?: string | ((props: any) => React.ReactNode);
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
    monthHeaderTemplate?: string | ((props: any) => React.ReactNode);
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
    /** 
     * Template for resource headers.
     * @group Properties 
     */
    resourceHeaderTemplate?: string | ((props: any) => React.ReactNode);
    /** 
     * Resources data.
     * @group Properties 
     */
    resources?: ResourceModel[] | Resource[];
    /** 
     * Auto-adjust row height based on content.
     * @group Properties 
     */
    rowAutoHeight?: boolean;
    /** 
     * The currently selected date.
     * @group Properties 
     */
    selectedDate?: Date;
    /** 
     * Show the header bar.
     * @group Properties 
     */
    showHeaderBar?: boolean;
    /** 
     * Show quick info popup on click.
     * @group Properties 
     */
    showQuickInfoPopup?: boolean;
    /** 
     * Show resource headers.
     * @group Properties 
     */
    showResourceHeaders?: boolean;
    /** 
     * Show current time indicator.
     * @group Properties 
     */
    showTimeIndicator?: boolean;
    /** 
     * Show current time indicator.
     * @group Properties 
     */
    currentTimeIndicator?: boolean;
    /** 
     * Start hour of the scheduler (e.g., '08:00').
     * @group Properties 
     */
    startHour?: string;
    /** 
     * Time scale configuration.
     * @group Properties 
     */
    timeScale?: TimeScaleModel;
    /** 
     * Timezone of the scheduler.
     * @group Properties 
     */
    timezone?: string;
    /** 
     * Timezone data source.
     * @group Properties 
     */
    timezoneDataSource?: TimezoneFields[];
    /** 
     * Toolbar items configuration.
     * @group Properties 
     */
    toolbarItems?: (string | ToolbarItemModel)[];
    /** 
     * Available views configuration.
     * @group Properties 
     */
    views?: (View | ViewsModel)[];
    /** 
     * Width of the scheduler.
     * @group Properties 
     */
    width?: string | number;
    /** 
     * Working days (0=Sun, 1=Mon, etc.).
     * @group Properties 
     */
    workDays?: number[];
    /** 
     * Working hours configuration.
     * @group Properties 
     */
    workHours?: WorkHoursModel;
    // Missing Props
    /** 
     * Template for cell content.
     * @group Templates 
     */
    cell?: string | ((props: any) => React.ReactNode);
    /** 
     * Template for editor footer.
     * @group Templates 
     */
    editorFooterTemplate?: string | ((props: any) => React.ReactNode);
    /** 
     * Template for editor header.
     * @group Templates 
     */
    editorHeaderTemplate?: string | ((props: any) => React.ReactNode);
    /** 
     * Template for editor content.
     * @group Templates 
     */
    editorTemplate?: string | ((props: any) => React.ReactNode);
    /** 
     * Enable HTML sanitizer for templates.
     * @group Properties 
     */
    enableHtmlSanitizer?: boolean;
    /** 
     * CSS class for event drag area.
     * @group Properties 
     */
    eventDragArea?: string;
    /** 
     * Number of months to display in year/month views.
     * @group Properties 
     */
    monthsCount?: number;
    /** 
     * Number of items to render outside visible area.
     * @group Properties 
     */
    overscanCount?: number;
    /** Progressive rendering for large datasets */
    /** 
     * Progressive rendering for large datasets.
     * @group Properties 
     */
    progressiveRendering?: boolean;
    /** 
     * Distance in items to prefetch.
     * @group Properties 
     */
    prefetchDistance?: number;
    /** 
     * Debugging for virtualization.
     * @group Properties 
     */
    debugVirtualization?: boolean;
    /** 
     * Templates for quick info popup.
     * @group Templates 
     */
    quickInfoTemplates?: QuickInfoTemplatesModel;
    /** 
     * Show week numbers.
     * @group Properties 
     */
    showWeekNumber?: boolean;
    /** 
     * Show weekends.
     * @group Properties 
     */
    showWeekend?: boolean;
    /** 
     * Time format (e.g., 'HH:mm').
     * @group Properties 
     */
    timeFormat?: string;
    /** 
     * Week start rule.
     * @group Properties 
     */
    weekRule?: WeekRule;
    /** 
     * Recurrence engine instance.
     * @group Properties 
     */
    recurrenceEngine?: any;
    /** 
     * Duration of a time slot in minutes.
     * @group Properties 
     */
    slotDuration?: number;
    /** 
     * Height of a time slot in pixels.
     * @group Properties 
     */
    slotHeight?: number;
    /** 
     * Whether the scheduler is loading data.
     * @group Properties 
     */
    isLoading?: boolean;
    /** 
     * Allow past events modification.
     * @group Properties 
     */
    allowPastEvents?: boolean;
    /** 
     * Use 24-hour format.
     * @group Properties 
     */
    is24Hour?: boolean;

    // Enterprise Events
    /** 
     * Callback when events overlap.
     * @group Events 
     */
    onEventOverlap?: (args: { event: SchedulerEvent; existingEvents: SchedulerEvent[]; cancel: boolean }) => void;
    /** 
     * Callback when a cell is right-clicked.
     * @group Events 
     */
    onCellContextMenu?: (args: { date: Date; x: number; y: number }) => void;

    // Component Injection (IoC) - Legacy support or new extension
    /** 
     * Custom component injections (IoC).
     * @group Properties 
     */
    components?: EzSchedulerComponents;

    // Legacy Prop Support (to avoid breaking demo)
    /** 
     * Array of event data.
     * @group Properties 
     */
    events?: SchedulerEvent[];
    /** 
     * Default initial view.
     * @group Properties 
     */
    defaultView?: ViewType;
    /** 
     * Default initial selected date.
     * @group Properties 
     */
    defaultSelectedDate?: Date;
    /** 
     * Show resources in Day view.
     * @group Properties 
     */
    showResourcesInDayView?: boolean;
    /** 
     * Show unassigned lane in swimlane views.
     * @group Properties 
     */
    showUnassignedLane?: boolean;
    /** 
     * Callback when the view changes.
     * @group Events 
     */
    onViewChange?: (view: any) => void;
    /** 
     * Callback when the date changes.
     * @group Events 
     */
    onDateChange?: (date: Date) => void;
    /** 
     * Callback when the slot duration changes.
     * @group Events 
     */
    onSlotDurationChange?: (duration: number) => void;
    /** 
     * Callback when a cell is clicked.
     * @group Events 
     */
    onCellClick?: (date: Date, resourceId?: string) => void;
    /** 
     * Callback when a cell is double-clicked.
     * @group Events 
     */
    onCellDoubleClick?: (date: Date, resourceId?: string) => void;
    /** 
     * Callback when an event is clicked.
     * @group Events 
     */
    onEventClick?: (event: SchedulerEvent) => void;
    /** 
     * Callback when an event is double-clicked.
     * @group Events 
     */
    onEventDoubleClick?: (event: SchedulerEvent) => void;
    /** 
     * Callback when an event is created.
     * @group Events 
     */
    onEventCreate?: (event: Partial<SchedulerEvent>) => void | Promise<void>;
    /** 
     * Callback when an event is deleted.
     * @group Events 
     */
    onEventDelete?: (eventId: string) => void | Promise<void>;
    /** 
     * Callback when an event is changed.
     * @group Events 
     */
    onEventChange?: (event: SchedulerEvent) => void;

    // Event Callbacks (keeping some existing ones if needed, but adding the new exhaustive ones)
    /** 
     * Callback when an action begins.
     * @group Events 
     */
    actionBegin?: (args: ActionEventArgs) => void;
    /** 
     * Callback when an action completes.
     * @group Events 
     */
    actionComplete?: (args: ActionEventArgs) => void;
    /** 
     * Callback when an action fails.
     * @group Events 
     */
    actionFailure?: (args: ActionFailureArgs) => void;
    /** 
     * Callback when a cell is clicked.
     * @group Events 
     */
    cellClick?: (args: CellClickEventArgs) => void;
    /** 
     * Callback when a cell is double-clicked.
     * @group Events 
     */
    cellDoubleClick?: (args: CellClickEventArgs) => void;
    /** 
     * Callback when an event is clicked.
     * @group Events 
     */
    eventClick?: (args: EventClickArgs) => void;
    /** 
     * Callback when an event is double-clicked.
     * @group Events 
     */
    eventDoubleClick?: (args: EventClickArgs) => void;
    /** 
     * Callback during navigation.
     * @group Events 
     */
    navigating?: (args: NavigatingEventArgs) => void;
    /** 
     * Callback when a popup closes.
     * @group Events 
     */
    popupClose?: (args: PopupCloseEventArgs) => void;
    /** 
     * Callback when a popup opens.
     * @group Events 
     */
    popupOpen?: (args: PopupOpenEventArgs) => void;
    /** 
     * Callback when a cell is rendered.
     * @group Events 
     */
    renderCell?: (args: RenderCellEventArgs) => void;
    /** 
     * Callback when resizing starts.
     * @group Events 
     */
    resizeStart?: (args: ResizeEventArgs) => void;
    /** 
     * Callback when resizing stops.
     * @group Events 
     */
    resizeStop?: (args: ResizeEventArgs) => void;
    /** 
     * Callback when dragging starts.
     * @group Events 
     */
    dragStart?: (args: DragEventArgs) => void;
    /** 
     * Callback during dragging.
     * @group Events 
     */
    drag?: (args: DragEventArgs) => void;
    /** 
     * Callback when dragging stops.
     * @group Events 
     */
    dragStop?: (args: DragEventArgs) => void;
    /** 
     * Callback when selection changes.
     * @group Events 
     */
    select?: (args: SelectEventArgs) => void;
    // Missing Events
    /** 
     * Callback before pasting.
     * @group Events 
     */
    beforePaste?: (args: any) => void;
    /** 
     * Callback before printing.
     * @group Events 
     */
    beforePrint?: (args: any) => void;
    /** 
     * Callback when component is created.
     * @group Events 
     */
    created?: (args: any) => void;
    /** 
     * Callback during data binding.
     * @group Events 
     */
    dataBinding?: (args: any) => void;
    /** 
     * Callback when data is bound.
     * @group Events 
     */
    dataBound?: (args: any) => void;
    /** 
     * Callback when component is destroyed.
     * @group Events 
     */
    destroyed?: (args: any) => void;
    /** 
     * Callback when event is rendered.
     * @group Events 
     */
    eventRendered?: (args: any) => void;
    /** 
     * Callback during excel export.
     * @group Events 
     */
    excelExport?: (args: any) => void;
    /** 
     * Callback on hover.
     * @group Events 
     */
    hover?: (args: any) => void;
    /** 
     * Callback when "more events" is clicked.
     * @group Events 
     */
    moreEventsClick?: (args: any) => void;
    /** 
     * Callback during resizing.
     * @group Events 
     */
    resizing?: (args: ResizeEventArgs) => void;
    /** 
     * Callback when tooltip opens.
     * @group Events 
     */
    tooltipOpen?: (args: any) => void;
    /** 
     * Callback when virtual scroll starts.
     * @group Events 
     */
    virtualScrollStart?: (args: any) => void;
    /** 
     * Callback when virtual scroll stops.
     * @group Events 
     */
    virtualScrollStop?: (args: any) => void;

    // Export Callbacks (IoC)
    /** 
     * Export to Excel callback.
     * @group Events 
     */
    onExportExcel?: (events: SchedulerEvent[]) => void;
    /** 
     * Export to CSV callback.
     * @group Events 
     */
    onExportCSV?: (events: SchedulerEvent[]) => void;
    /** 
     * Export to ICS callback.
     * @group Events 
     */
    onExportICS?: (events: SchedulerEvent[]) => void;
}

// --- Event Argument Interfaces ---
/**
 * Arguments for action events.
 */
export interface ActionEventArgs {
    /** 
     * The type of request being performed.
     * @group Models
     */
    requestType: string;
    /** 
     * Whether the action should be cancelled.
     * @group Models
     */
    cancel: boolean;
    /** 
     * Associated data for the action.
     * @group Models
     */
    data?: Object;
    [key: string]: any;
}

/**
 * Arguments for action failure events.
 */
export interface ActionFailureArgs {
    /** 
     * The type of request that failed.
     * @group Models
     */
    requestType: string;
    /** 
     * The error that occurred.
     * @group Models
     */
    error: Error;
    [key: string]: any;
}

/**
 * Arguments for cell click events.
 */
export interface CellClickEventArgs {
    /** 
     * Start time of the clicked cell.
     * @group Models
     */
    startTime: Date;
    /** 
     * End time of the clicked cell.
     * @group Models
     */
    endTime: Date;
    /** 
     * The HTML element that was clicked.
     * @group Models
     */
    element?: HTMLElement;
    /** 
     * Whether the cell is in the all-day row.
     * @group Models
     */
    isAllDay: boolean;
    /** 
     * The resource group index.
     * @group Models
     */
    groupIndex?: number;
}

/**
 * Arguments for event click events.
 */
export interface EventClickArgs {
    /** 
     * The data of the clicked event.
     * @group Models
     */
    data: EventData;
    /** 
     * The HTML element of the event.
     * @group Models
     */
    element?: HTMLElement;
    /** 
     * The raw mouse event.
     * @group Models
     */
    event?: React.MouseEvent;
}

/**
 * Arguments for navigation events.
 */
export interface NavigatingEventArgs {
    /** 
     * The date before navigation.
     * @group Models
     */
    previousDate: Date;
    /** 
     * The new active date.
     * @group Models
     */
    currentDate: Date;
    /** 
     * The view mode before navigation.
     * @group Models
     */
    previousView: View;
    /** 
     * The new active view mode.
     * @group Models
     */
    currentView: View;
    /** 
     * Whether navigation should be cancelled.
     * @group Models
     */
    cancel?: boolean;
}

/**
 * Arguments for popup opening events.
 */
export interface PopupOpenEventArgs {
    /** 
     * The type of popup being opened.
     * @group Models
     */
    type: 'Editor' | 'QuickInfo';
    /** 
     * The data associated with the popup.
     * @group Models
     */
    data?: EventData;
    /** 
     * The popup HTML element.
     * @group Models
     */
    element?: HTMLElement;
    /** 
     * Whether to cancel the opening.
     * @group Models
     */
    cancel: boolean;
}

/**
 * Arguments for popup closing events.
 */
export interface PopupCloseEventArgs {
    /** 
     * The type of popup being closed.
     * @group Models
     */
    type: 'Editor' | 'QuickInfo';
    /** 
     * The data associated with the popup.
     * @group Models
     */
    data?: EventData;
    /** 
     * The popup HTML element.
     * @group Models
     */
    element?: HTMLElement;
}

/**
 * Arguments for resize events.
 */
export interface ResizeEventArgs {
    /** 
     * The event data being resized.
     * @group Models
     */
    data: EventData;
    /** 
     * The HTML element being resized.
     * @group Models
     */
    element?: HTMLElement;
    /** 
     * Whether to cancel resizing.
     * @group Models
     */
    cancel: boolean;
}

/**
 * Arguments for drag events.
 */
export interface DragEventArgs {
    /** 
     * The event data being dragged.
     * @group Models
     */
    data: EventData;
    /** 
     * The HTML element being dragged.
     * @group Models
     */
    element?: HTMLElement;
    /** 
     * Whether to cancel dragging.
     * @group Models
     */
    cancel: boolean;
    /** 
     * The drag target element.
     * @group Models
     */
    target?: HTMLElement;
}

/**
 * Arguments for cell rendering events.
 */
export interface RenderCellEventArgs {
    /** 
     * The date of the cell.
     * @group Models
     */
    date: Date;
    /** 
     * The cell HTML element.
     * @group Models
     */
    element: HTMLElement;
    /** 
     * The current view mode.
     * @group Models
     */
    view: View;
    /** 
     * The resource group index.
     * @group Models
     */
    groupIndex?: number;
}

/**
 * Arguments for selection events.
 */
export interface SelectEventArgs {
    /** 
     * The selected HTML elements.
     * @group Models
     */
    element?: HTMLElement[];
    /** 
     * Start time of the selection.
     * @group Models
     */
    startTime: Date;
    /** 
     * End time of the selection.
     * @group Models
     */
    endTime: Date;
}


// ...

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
    addEvent: (event: SchedulerEvent | Record<string, any>) => Promise<void>;
    /** 
     * Save an existing or new event.
     * @group Methods 
     */
    saveEvent: (event: SchedulerEvent | Record<string, any>) => Promise<void>;
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
    addResource: (resource: Resource | Record<string, any>) => Promise<void>;
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
