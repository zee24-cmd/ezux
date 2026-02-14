1. Executive Summary
EzScheduler is a plug-and-play, enterprise-grade calendar and scheduling component designed to provide an MS Outlook-like experience. It enables users to manage events, appointments, and resources through highly interactive views (Day, Week, Month, Timeline, Agenda). It is designed to be fully customizable, multilingual, and ready for integration into complex business applications, with comprehensive support for collaboration, detailed event management, optimistic UI patterns, advanced timezone handling, collision logic, and high configurability to closely match Outlook's core functionalities.

2. Goals & Objectives
Primary Goals

Modern Scheduling: Replicate the core features and UX of Microsoft Outlook Calendar, including collaboration, reminders, multi-calendar support, optimistic interactions, and robust timezone & collision handling.
Plug and Play: Easy integration with a robust API, comprehensive props, and extensibility options like custom renderers and plugins.
High Performance: Smooth interaction and rendering with 10k+ events, including zero-latency visual feedback via optimistic updates.
Multilingual & RTL: Full support for internationalization and right-to-left languages.
Resource Management: Support for scheduling rooms, equipment, and personnel with advanced availability logic.

Success Criteria

Zero Latency Dragging: Sub-16ms (60fps) visual feedback during event movement with optimistic UI and rollback on failure.
Cross-Platform Consistency: Identical behavior across Chrome, Safari, and Firefox.
Accessibility: 100% WCAG 2.1 AA compliance for grid navigation, including roving tabindex and screen reader announcements.
i18n Coverage: 100+ locale-aware keys for full translation support.
Outlook Parity: Supports RRULE (Recurrence), Exception handling, attendees, reminders, attachments, privacy levels, overlays, search, automatic calendars, floating events, origin timezone display, and advanced collision/free-busy behaviors.

3. Functional Requirements
3.1 Views & Navigation

View Types:
Day: Detailed hour-by-hour view for a single day.
Work Week: Focused 5-day view (Mon-Fri).
Week: Standard 7-day view.
Month: Traditional grid view of the month.
Timeline: Horizontal resource-based scheduling view.
Agenda: List view of upcoming events.

Navigation Controls:
Previous/Next/Today controls.
Date picker / Mini-calendar for quick jumps.
View switcher (Day/Week/Month/etc.).

Custom Views: Support for user-defined views with filters (e.g., by category or attendee).

3.2 Key Features

Event Management:
Drag & Drop to move or resize events with optimistic "ghost" state.
Double-click/Click-and-drag to create new events.
Event categories with custom color coding.
All-day event support.
Read-only mode for shared/public calendars.
Attendees with invitation tracking (Accepted/Declined/Tentative).
Customizable reminders with snooze options.
Attachments for files, links, or notes.
Sensitivity levels (e.g., Private) to control visibility in shared views.
Locked events (visual lock icon, prevents interaction).

Recurring Events (RRULE):
Support for Daily, Weekly, Monthly, and Yearly patterns.
Exception handling (modifying one instance of a series).
End date/count limits.

Resource Scheduling:
- **Resource Column Subdivision**: Side-by-side columns for resources in Day and Week views.
- **Bidirectional Virtualization**: High-performance rendering for 500+ resources and 10k+ events (virtualizing both time rows and resource columns).
- **Grouped Resources**: Hierarchical grouping of resources (e.g., by Department) with expand/collapse capability.
- **Unassigned Lane**: A dedicated "Global Inbox" for events requiring resource allocation.
- **Resource Availability Shading**: Visual "off-hours" or "busy" shading per resource.

Advanced UX:
Current time indicator.
Timezone support (displaying multiple time zones).
Right-click context menu via `ContextMenuService` (configurable).
Keyboard shortcuts (Ctrl+C, Ctrl+V, Del).
Undo/Redo for recent actions.
Search and filtering by title, category, attendee, etc.
Calendar overlays for multiple calendars with togglable visibility.
Automatic calendars for holidays, birthdays, and weather overlays.
Optimistic UI: Immediate drag/resize feedback with "syncing" spinner; rollback on server rejection with toast.

Import/Export:
iCalendar (.ics) export/import.
JSON data synchronization.
Integration hooks for tasks and email linking.


3.3 Drag & Drop Capabilities
Features:

Event Repositioning: Drag events between time slots or across different days.
Event Resizing: Interactive handles to extend or shrink event duration.
Cross-View Dragging: Drag an event from the Agenda view onto a specific day in the Month view.
Resource Reassignment: Drag events between resource columns (e.g., from Room A to Room B).
Collision Detection: Real-time visual feedback when dragging onto occupied slots (configurable via collisionPolicy).
Constraint Enforcement: Prevent dragging read-only or locked events or into restricted time ranges.
Ghosting / Preview: Visual "ghost" of the event showing exactly where it will land; optimistic state during drag.
Rollback on Failure: Snap back to original position with notification if server rejects update.

3.4 Internationalization (i18n)
Features:

Complete Multilingual Support: 100% translation of all UI labels, tooltips, and ARIA strings.
RTL Support: Native right-to-left layout for Arabic, Hebrew, etc. (flipped grid and day order).
Locale-Aware Formatting: Date and time formats (12h/24h) based on the user's locale.
Custom Locale Keys:
today, next, previous, day, week, month, agenda
allDay, moreEvents, noEvents
newEvent, editEvent, deleteEvent, save, cancel
recurring, repeatDaily, repeatWeekly, etc.
Additional keys for attendees, reminders, attachments, search, syncing, locked, etc.


3.5 Theming & Visual Excellence
Features:

Status-Based Coloring: Automatically color events based on status (e.g., Confirmed, Tentative, Busy).
Category Palettes: Predefined color sets for groups (Marketing, Engineering, Personal).
Grid Styling: Distinctive styling for "Work Hours" vs. "Off Hours"; dim/hide non-working hours per resource.
Dynamic Indicators:
Current Time Line: Animated red line showing the exact current time.
Selection Highlighting: Clear visual state for the selected time range or event.
Weather and holiday indicators as subtle overlays.
Syncing spinner on optimistic updates; lock icon for locked events.

Dark Mode Optimization: Hand-picked color scales for dark backgrounds to ensure high contrast and readability.

interface EzSchedulerProps {
  // ────────────────────────────────────────────────
  // Core Data & State
  // ────────────────────────────────────────────────
  events: SchedulerEvent[];
  resources?: Resource[];
  calendars?: Calendar[];               // For multi-calendar overlays / side-by-side comparison

  defaultView: 'day' | 'week' | 'workweek' | 'month' | 'timeline' | 'agenda';
  currentDate?: Date;
  displayTimeZone?: string;             // Primary timezone used for display (default = browser)

    // ────────────────────────────────────────────────
    // Core Data Types
    // ────────────────────────────────────────────────

    /**
    * A resource represents something that can be scheduled (room, person, equipment, vehicle, etc.)
    */
    interface Resource {
    id: string;
    name: string;
    type?: 'room' | 'person' | 'equipment' | 'project' | 'custom';
    color?: string;                    // default color for events in this resource
    avatarUrl?: string;                // optional photo/icon (person or room image)
    capacity?: number;                 // e.g. seats in a room
    workingHours?: {
        days: number[];                  // 0=Sun, 1=Mon, ..., 6=Sat
        startTime: string;               // "09:00"
        endTime: string;                 // "18:00"
    };
    metadata?: Record<string, any>;    // e.g. { floor: 5, building: "A" }
    isAvailable?: boolean;             // optional runtime status
    }

    /**
    * A calendar represents a separate calendar layer (personal, team, project, shared, holiday, etc.)
    * Used for multi-calendar overlays and toggling visibility.
    */
    interface Calendar {
    id: string;
    name: string;
    color: string;                     // base color for events in this calendar
    events: SchedulerEvent[];
    visible?: boolean;                 // default true
    readOnly?: boolean;
    source?: 'local' | 'google' | 'outlook' | 'custom';
    icon?: string;                     // emoji or icon name
    }

    /**
    * Represents a single time slot / cell in the grid (mostly used in custom renderers)
    */
    interface TimeSlot {
    start: Date;
    end: Date;
    resourceId?: string;
    isWorkHour: boolean;
    isPast: boolean;
    isToday: boolean;
    events: SchedulerEvent[];          // events that overlap this exact slot
    isSelected?: boolean;
    }

    /**
    * Header information passed to custom day/week/month header renderers
    */
    interface ViewHeader {
    date: Date;
    view: 'day' | 'week' | 'workweek' | 'month' | 'timeline' | 'agenda';
    isToday: boolean;
    isWeekend: boolean;
    weekNumber?: number;
    eventsCount?: number;              // number of events on this day (useful for month view dots)
    resourceId?: string;               // for timeline/resource headers
    }

    /**
    * Minimal structure for weather data overlay (optional)
    */
    interface WeatherData {
    date: Date;
    temperature: number;
    condition: string;                 // "sunny", "rain", "cloudy", etc.
    iconUrl?: string;
    location: string;
    }

    /**
    * Attendee (already partially defined earlier — completing it here)
    */
    interface Attendee {
    id?: string;                       // optional internal ID
    email: string;
    name?: string;
    response: 'accepted' | 'declined' | 'tentative' | 'none' | 'unknown';
    required: boolean;
    role?: 'organizer' | 'attendee' | 'resource';
    }

    /**
    * Reminder (completing earlier partial definition)
    */
    interface Reminder {
    timeBefore: number;
    unit: 'minutes' | 'hours' | 'days';
    method?: 'popup' | 'email' | 'notification' | 'custom';
    triggered?: boolean;
    }

    /**
    * Attachment (completing earlier partial definition)
    */
    interface Attachment {
    id?: string;
    name: string;
    url: string;
    type: 'file' | 'link' | 'image' | 'document';
    mimeType?: string;
    size?: number;                     // in bytes
    uploadedAt?: Date;
    }
  // ────────────────────────────────────────────────
  // View & Layout Configuration
  // ────────────────────────────────────────────────
  viewConfig?: {
    startHour?: number;                 // 0–23
    endHour?: number;                   // 0–23
    showWorkHoursOnly?: boolean;
    timeSlotDuration?: 5 | 10 | 15 | 30 | 60; // minutes
    hiddenViews?: Array<'day' | 'week' | 'workweek' | 'month' | 'timeline' | 'agenda'>;
    defaultFilters?: FilterConfig;
    slotLabelFormat?: string;           // date-fns compatible, e.g. 'ha'
    eventOverlapMode?: 'stack' | 'sideBySide' | 'compress';
    collisionPolicy?: 'overlap' | 'prevent' | 'push' | 'smart-fill';
    workingHours?: {
      days: number[];                   // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      startTime: string;                // "09:00"
      endTime: string;                  // "17:00"
    };
    showWeekends?: boolean;
    minuteHeight?: number;              // pixels per 60 minutes (controls vertical density)
  };

  // ────────────────────────────────────────────────
  // Appearance & Theming
  // ────────────────────────────────────────────────
  locale?: string;                      // BCP 47, e.g. 'en-US', 'ar-SA'
  rtl?: boolean;                        // Force RTL layout (overrides auto-detection)
  theme?: 'light' | 'dark' | 'system';
  className?: string;
  eventClassName?: (event: SchedulerEvent) => string | undefined;

  // ────────────────────────────────────────────────
  // Permissions & Interaction Flags
  // ────────────────────────────────────────────────
  allowDragAndDrop?: boolean;
  allowResizing?: boolean;
  allowCreate?: boolean;
  allowDelete?: boolean;
  allowEdit?: boolean;
  readOnly?: boolean;                   // Shorthand for disabling all mutations
  permissions?: {
    userRole: 'admin' | 'editor' | 'viewer' | 'guest';
    allowedActions: Array<'create' | 'update' | 'delete' | 'resize' | 'drag' | 'editDetails'>;
  };

  // ────────────────────────────────────────────────
  // Extensibility & Customization
  // ────────────────────────────────────────────────
  /**
   * Array of plugins to extend scheduler behavior
   */
  plugins?: Plugin[];

  /**
   * Default/active filters applied to all views
   * Can be overridden per-view via viewConfig
   */
  defaultFilters?: FilterConfig;

  customRenderers?: {
    event?: (event: SchedulerEvent, defaultContent: JSX.Element) => JSX.Element;
    eventContent?: (event: SchedulerEvent) => JSX.Element;
    timeSlot?: (slotInfo: { start: Date; end: Date; resourceId?: string }) => JSX.Element;
    dayHeader?: (date: Date) => JSX.Element;
    allDaySlot?: (events: SchedulerEvent[]) => JSX.Element;
  };

  // ────────────────────────────────────────────────
  // Data Loading & Async Behavior
  // ────────────────────────────────────────────────
  eventLoader?: (range: { start: Date; end: Date }) => Promise<SchedulerEvent[]>;
  lazyLoading?: boolean;                // Only load visible range + buffer
  loadingStates?: {
    isFetching?: boolean;
    isUpdating?: boolean;
    isSaving?: boolean;
  };

  // ────────────────────────────────────────────────
  // UI Feedback & State
  // ────────────────────────────────────────────────
  showCurrentTime?: boolean;
  showWeekNumbers?: boolean;
  showMultiTimeZone?: boolean;          // Display secondary time zone column(s)
  secondaryTimeZones?: string[];        // e.g. ["America/New_York", "Asia/Tokyo"]

  // ────────────────────────────────────────────────
  // Events & Callbacks
  // ────────────────────────────────────────────────
  onEventCreate?: (draft: Partial<SchedulerEvent>) => void | Promise<void>;
  onEventUpdate?: (
    event: SchedulerEvent,
    changeType: 'move' | 'resize' | 'edit' | 'drop'
  ) => Promise<void> | void;
  onEventDelete?: (eventId: string) => void | Promise<void>;
  onEventClick?: (event: SchedulerEvent) => void;
  onRangeSelect?: (selection: { start: Date; end: Date; resourceId?: string }) => void;
  onViewChange?: (view: string) => void;
  onDateChange?: (date: Date) => void;

  onInviteSend?: (event: SchedulerEvent, attendees: Attendee[]) => void;
  onResponseUpdate?: (eventId: string, attendee: Attendee) => void;
  onReminderTrigger?: (event: SchedulerEvent) => void;

  /**
   * Callback when active filters change (useful for saving user preferences)
   */
  onFiltersChange?: (filters: FilterConfig) => void;

  onUndo?: () => void;
  onRedo?: () => void;

  // ────────────────────────────────────────────────
  // Performance & Accessibility
  // ────────────────────────────────────────────────
  virtualizationThreshold?: number;     // Enable virtualization above this event count
  ariaConfig?: Record<string, string>;  // Custom ARIA labels / descriptions
  keyboardNavigation?: boolean;         // Enable full arrow-key + enter navigation
}

interface SchedulerEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resourceId?: string;
  description?: string;
  color?: string;           // Custom override
  categoryId?: string;      // Links to palette
  status?: 'confirmed' | 'tentative' | 'busy' | 'outOfOffice';
  recurrenceRule?: string;  // RRULE string
  exceptionDates?: Date[];
  parentId?: string;        // For recurrence instances
  readonly?: boolean;
  attendees?: Attendee[];   // e.g., [{ email: string, response: 'accepted' | 'declined' | 'tentative' | 'none', required: boolean }]
  reminders?: Reminder[];   // e.g., [{ timeBefore: number, unit: 'minutes' | 'hours' | 'days' }]
  attachments?: Attachment[]; // e.g., [{ name: string, url: string, type: 'file' | 'link' }]
  sensitivity?: 'normal' | 'personal' | 'private' | 'confidential';
  isGhost?: boolean;        // For optimistic UI rendering during drag
  isLocked?: boolean;       // Visual lock icon, prevents any interaction
  originTimeZone?: string;  // Original timezone the event was created in (for tooltip display)
  location?: {
    name: string;
    address?: string;
    coordinates?: { lat: number; lng: number };
  };
}

interface Attendee {
  email: string;
  response: 'accepted' | 'declined' | 'tentative' | 'none';
  required: boolean;
}

interface Reminder {
  timeBefore: number;
  unit: 'minutes' | 'hours' | 'days';
}

interface Attachment {
  name: string;
  url: string;
  type: 'file' | 'link';
}

interface Calendar {
  id: string;
  name: string;
  color: string;
  events: SchedulerEvent[];
  visible?: boolean;
}

/**
 * Plugin interface for extending EzScheduler behavior without modifying core code.
 * Plugins can hook into lifecycle events, modify data, or add side effects.
 */
interface Plugin {
  /**
   * Name used for debugging and plugin identification
   */
  name?: string;

  /**
   * Called before an event is rendered in any view.
   * Allows mutation of event data (color, title, custom fields, visibility, etc.)
   * Return a new event object or mutate the input (both patterns supported).
   */
  onBeforeEventRender?: (event: Readonly<SchedulerEvent>) => SchedulerEvent | void;

  /**
   * Called after an event has finished rendering in the current view.
   * Useful for attaching DOM event listeners, measuring positions, analytics, etc.
   */
  onAfterEventRender?: (event: SchedulerEvent, element: HTMLElement) => void;

  /**
   * Called after a successful drag-and-drop operation completes (mouse/touch release).
   * Receives the final event state after optimistic update.
   * Useful for analytics, auto-save triggers, or post-move validation.
   */
  onAfterDragEnd?: (event: SchedulerEvent, type: 'move' | 'resize') => void;

  /**
   * Called when the user starts dragging an event (mousedown/touchstart).
   * Can be used to prepare state, add visual cues, or cancel drag conditionally.
   * Return `false` to prevent the drag from starting.
   */
  onBeforeDragStart?: (event: SchedulerEvent) => boolean | void;

  /**
   * Called during drag, before the optimistic update is applied.
   * Allows real-time validation or modification of the proposed drop target.
   * Return a modified drop target or `false` to block.
   */
  onDuringDrag?: (
    event: SchedulerEvent,
    proposed: { start: Date; end: Date; resourceId?: string }
    ) => { start: Date; end: Date; resourceId?: string } | false | void;

  /**
   * Called right before an optimistic update is applied to the UI.
   * Can be used to enrich the ghost event with temporary UI-only data.
   */
  onBeforeOptimisticUpdate?: (event: SchedulerEvent) => Partial<SchedulerEvent> | void;

  /**
   * Called when a server update fails and rollback occurs.
   * Useful for custom error handling, logging, or user notifications beyond default toast.
   */
  onUpdateRollback?: (originalEvent: SchedulerEvent, error?: Error) => void;

  /**
   * Called when the user selects a time range (click + drag to create).
   * Can be used to pre-fill event data or cancel creation.
   */
  onBeforeRangeCreate?: (range: { start: Date; end: Date; resourceId?: string }) => boolean | void;

  /**
   * Hook fired when the view or date changes.
   * Useful for prefetching data, analytics, or view-specific plugin logic.
   */
  onViewChange?: (newView: string, newDate: Date) => void;

  /**
   * Optional cleanup when the scheduler unmounts or plugin is removed.
   */
  cleanup?: () => void;
}

/**
 * Configuration object for built-in and custom filtering of events.
 * Used in viewConfig.defaultFilters and potentially in search/filter UI.
 */
interface FilterConfig {
  /**
   * Only show events belonging to these categories
   */
  category?: string[];

  /**
   * Only show events that include at least one of these attendees (by email or ID)
   */
  attendee?: string[];

  /**
   * Only show events with these status values
   */
  status?: Array<'confirmed' | 'tentative' | 'busy' | 'outOfOffice'>;

  /**
   * Only show events that match this search term in title or description
   */
  searchTerm?: string;

  /**
   * Only show events that have at least one attachment
   */
  hasAttachments?: boolean;

  /**
   * Only show events that are private/sensitive
   */
  isPrivate?: boolean;

  /**
   * Only show events belonging to these resources
   */
  resourceIds?: string[];

  /**
   * Custom filter function for advanced use cases
   * Receives the full event and should return true to keep it
   */
  custom?: (event: SchedulerEvent) => boolean;

  /**
   * Whether filters are combined with AND (default) or OR logic
   */
  logic?: 'AND' | 'OR';
}

// ────────────────────────────────────────────────
// Recurrence & Exception Handling
// ────────────────────────────────────────────────

/**
 * Represents a single exception to a recurring series
 * (Outlook-style: this instance was modified, deleted, or moved)
 */
interface RecurrenceException {
  /** Original recurring event id (the series master) */
  parentId: string;

  /** Date of the occurrence that is being excepted */
  originalStart: Date;

  /** If deleted → no eventId, if modified → new eventId */
  eventId?: string;

  /** Was this occurrence deleted (true) or just modified (false) */
  isDeleted: boolean;

  /** If modified, the new start time (if changed) */
  newStart?: Date;

  /** If modified, the new end time (if changed) */
  newEnd?: Date;

  /** Timestamp when the exception was created */
  createdAt: Date;
}

/**
 * Extended recurrence info — often stored on the master event
 */
interface RecurrenceInfo {
  rrule: string;                    // iCalendar RRULE string
  masterEventId: string;
  exceptions: RecurrenceException[];
  /** Cache of expanded occurrences (optional - can be computed on demand) */
  expandedOccurrences?: Array<{ start: Date; end: Date; eventId?: string }>;
  /** Last time expansion was performed (for cache invalidation) */
  lastExpanded?: Date;
}

// ────────────────────────────────────────────────
// Drag & Drop / Interaction State
// ────────────────────────────────────────────────

/**
 * Transient state during an active drag operation
 */
interface DragPreviewState {
  /** The event being dragged/resized */
  event: SchedulerEvent;

  /** Original position before drag started (for rollback) */
  original: {
    start: Date;
    end: Date;
    resourceId?: string;
  };

  /** Current proposed position (updated live during drag) */
  current: {
    start: Date;
    end: Date;
    resourceId?: string;
  };

  /** Type of drag action */
  action: 'move' | 'resize-start' | 'resize-end' | 'resize-both';

  /** Is the current drop target valid? (no collision, allowed by policy, etc.) */
  isValid: boolean;

  /** Collision/conflict information if any */
  conflict?: {
    withEvents: SchedulerEvent[];
    message?: string;
  };

  /** Whether we're in optimistic mode (UI already moved, waiting for server) */
  isOptimistic: boolean;

  /** Pointer / touch coordinates (useful for positioning ghost) */
  pointer?: { x: number; y: number };
}

/**
 * State of a selection (when user clicks + drags to select a time range)
 */
interface RangeSelectionState {
  isSelecting: boolean;
  start: Date | null;
  end: Date | null;
  resourceId?: string | null;
  /** Whether selection is valid (within allowed hours, no hard constraints violated) */
  isValid: boolean;
}

// ────────────────────────────────────────────────
// Context / Provider Value
// ────────────────────────────────────────────────

/**
 * Value shape of EzSchedulerContext (what deeply nested components can consume)
 */
interface SchedulerContextValue {
  // Current view & date state
  view: 'day' | 'week' | 'workweek' | 'month' | 'timeline' | 'agenda';
  currentDate: Date;
  displayTimeZone: string;
  secondaryTimeZones: string[];

  // Configuration slices
  config: {
    viewConfig: EzSchedulerProps['viewConfig'];
    permissions: EzSchedulerProps['permissions'];
    collisionPolicy: NonNullable<EzSchedulerProps['viewConfig']>['collisionPolicy'];
  };

  // Data
  events: SchedulerEvent[];
  filteredEvents: SchedulerEvent[];     // after applying filters
  resources: Resource[];
  calendars: Calendar[];

  // Interaction state
  selectedEventId: string | null;
  selectedRange: RangeSelectionState;
  activeDrag: DragPreviewState | null;

  // UI flags
  isDragging: boolean;
  isResizing: boolean;
  isCreating: boolean;
  isUpdating: boolean;                  // optimistic update in flight
  readOnly: boolean;

  // Time utilities
  getEventsInRange: (start: Date, end: Date, resourceId?: string) => SchedulerEvent[];
  isWithinWorkingHours: (date: Date, resourceId?: string) => boolean;

  // Actions
  setView: (view: SchedulerContextValue['view']) => void;
  setCurrentDate: (date: Date | ((prev: Date) => Date)) => void;
  selectEvent: (eventId: string | null) => void;
  startRangeSelection: (start: Date, resourceId?: string) => void;
  updateRangeSelection: (end: Date) => void;
  commitRangeSelection: () => void;

  // Event mutations (usually optimistic + server sync)
  createEvent: (draft: Partial<SchedulerEvent>) => Promise<SchedulerEvent | null>;
  updateEvent: (
    eventId: string,
    updates: Partial<SchedulerEvent>,
    changeType: 'move' | 'resize' | 'edit'
  ) => Promise<boolean>;
  deleteEvent: (eventId: string) => Promise<boolean>;

  // Filter management
  filters: FilterConfig;
  setFilters: (filters: FilterConfig | ((prev: FilterConfig) => FilterConfig)) => void;

  // Accessibility / announcements
  announce: (message: string) => void;   // pushes to live region
}

// ────────────────────────────────────────────────
// Other frequently used compound types
// ────────────────────────────────────────────────

/**
 * Result shape when expanding a recurring event series for a date range
 */
type ExpandedOccurrence = {
  event: SchedulerEvent;
  isException: boolean;
  originalStart?: Date;
  isMaster: boolean;
};

/**
 * Shape of a virtualized event render item
 */
type VirtualizedEventItem = {
  event: SchedulerEvent;
  top: number;          // pixels from top of container
  height: number;
  left: number;
  width: number;
  column?: number;      // for overlap stacking
  isGhost?: boolean;
  isBeingDragged?: boolean;
};

/**
 * Common callback signature for async operations with rollback support
 */
type OptimisticMutation<T> = (
  optimisticValue: T,
  rollback: () => void
) => Promise<T> | T;

4. Architectural Considerations

Internal Workers: Use Web Workers for recurring event expansion and heavy coordinate calculations to keep the UI thread responsive.
Context API: Deeply nested components (slots, views) share state via EzSchedulerContext.
Zustand/Atomic State: Efficient state updates for drag-and-drop operations, including optimistic updates, undo/redo stack, and rollback.
Accessibility: Full ARIA compliance for grid navigation and event interactions, with customizable labels; roving tabindex for arrow-key navigation; live region announcer for drag completion and other changes.
Plugin Architecture: Modular extensions via hooks for easy customization without core modifications.
Data Loading: Support for async providers to handle large or external datasets efficiently.
Headless Core: Separate pure logic (coordinate calculator, collision engine, RRULE expansion) from React components for testability and performance.

Phase 0-4: Completed
- [x] Headless Core & Logic Engine
- [x] Foundation & MVP (Day/Week/Month)
- [x] Drag-and-Drop + Optimistic UI
- [x] Resource & Timeline Management
- [x] Virtualization & Performance

Phase 5: Enterprise Extensions (Completed)
- [x] Multi-timezone sidebar support
- [x] Premium Resource Sidebar
- [x] Basic Timeline View

Phase 6: Enterprise Multi-Resource Orchestration (Active)
- [x] **Resource-Centric Day/Week Views**: Subdivision of day columns by resource.
- [x] **Resource Availability Shading**: Visual "off-hours" shading per resource.
- [ ] **Bidirectional Virtualization**: O(1) performance for large resource counts.
- [ ] **Advanced D&D**: Optmistic Drag & Drop with Ghost previews.
- [ ] **Resource Hierarchy**: Support for nested resource groups.
## 3.6 Mobile & Responsive Design (The Pivot)
To ensure optimal usability across devices, EzScheduler implements a responsive "Pivot" strategy:

### Desktop & Tablet
- **Day/Week Views**: Standard grid layout with X-Axis for Days/Resources and Y-Axis for Time.
- **Timeline View**: X-Axis for Time, Y-Axis for Resources.
- **Headers**: Sticky headers for both axes ensuring context is never lost during scrolling.

### Mobile (Phone)
- **Day View (Resource Pivot)**: 
  - Transforms into a horizontal swipeable container when multiple resources are present.
  - Displays one resource column at a full width (100vw) at a time.
  - Users swipe horizontally to switch between resources while keeping the vertical time axis synchronized.
- **Week & Month Views (Agenda Conversion)**:
  - Automatically converts to an **Agenda View** (Vertical List).
  - Groups events by date to maximize vertical screen real estate.
  - Eliminates horizontal scrolling for standard calendar views.
- **Timeline View**:
  - Retains resource rows on Y-Axis.
  - Enables horizontal scrolling for the Time Axis.
