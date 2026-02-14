# ezScheduler – Glossary & Domain Dictionary

This file provides authoritative definitions for **key domain concepts, terms, and structures** in ezScheduler.

---

## 1. Events

**Definition:** A scheduled activity or appointment within the calendar.

* **Properties:** id, subject, startTime, endTime, isAllDay, recurrenceRule, resourceID
* **Types:** Single, Recurring, Blocked, Shared
* **Lifecycle:** Draft → Validated → Persisted → Rendered → Edited → Archived

## 2. Slots

**Definition:** The smallest unit of time in a view where events can be scheduled.

* **Properties:** startTime, endTime, isWorkingDay, groupIndex
* **Validation:** Slots can be checked for availability before scheduling
* **Views:** Day, Week, WorkWeek, Month, Timeline

## 3. Resources

**Definition:** Physical or logical entities associated with events (e.g., rooms, staff, equipment).

* **Properties:** id, name, title, allowMultiple, colorField, groupIDField
* **Grouping:** Resources can be grouped horizontally, vertically, or by date

## 4. Views

**Definition:** Different visual representations of scheduled data.

* **Types:** Day, Week, WorkWeek, Month, Year, Agenda, TimelineDay, TimelineWeek, TimelineWorkWeek, TimelineMonth, MonthAgenda
* **Customization:** Start/end hours, intervals, timescales, templates

## 5. Groups

**Definition:** Logical collections used for grouping events and resources.

* **Types:** Resource grouping, Date-wise grouping, Hierarchical grouping, Adaptive grouping
* **Properties:** byDate, byGroupID, enableCompactView, resources

## 6. Recurrence

**Definition:** Rules to repeat events over time.

* **Engine:** RecurrenceEngine generates occurrences based on RRULE
* **Properties:** recurrenceRule, recurrenceID, recurrenceException
* **UI Support:** RecurrenceEditor for creating/editing patterns

## 7. Federation / Multi-Scheduler

**Definition:** Ability to connect multiple scheduler instances or tenants.

* **Capabilities:** Cross-scheduler drag, federated resource pools, global availability
* **Tenant Isolation:** All events and resources are scoped by TenantId

## 8. Templates

**Definition:** Custom rendering contracts for various UI elements.

* **Types:** Cell, Date Header, Month Header, Resource Header, Event, Tooltip, QuickInfo, Editor
* **Models:** CellTemplateProps, DateHeaderTemplateProps, EditorTemplateProps, TooltipTemplateProps

## 9. Services & IoC

**Definition:** Injected singleton services providing data, interaction, validation, and export functionality.

* **Examples:** SchedulerService, DragAndDrop, Resize, RecurrenceEngine, ExcelExport, Print
* **Registry:** EzServiceRegistry

## 10. Time & Work Hours

**Definition:** Configurable working time windows and granularity.

* **Properties:** startHour, endHour, workDays, workHours, timeScale, dayHourLimit
* **Constraints:** Slots outside work hours can be blocked

## 11. Miscellaneous Terms

* **QuickInfo:** Popover showing event summary
* **Popup:** Editor modal or quick info modal
* **Slot Availability:** Validation to ensure no conflicts
* **Block Events:** Non-editable or reserved times
* **Virtual Scrolling:** Optimization for large number of events/resources
* **Header Rows:** Customizable row templates in day/month views

---

**End of Glossary & Domain Dictionary**
