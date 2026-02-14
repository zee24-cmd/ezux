# ezScheduler – API File 3: Templates, Template Models, Template Args & Services

This file contains **all templates, template argument models, and service mappings** for ezScheduler.

---

## 1. Cell & Header Templates

```ts
interface CellTemplateProps {
  date: Date;
  isWorkingDay: boolean;
  groupIndex: number;
}

interface DateHeaderTemplateProps {
  date: Date;
  type: 'Month' | 'Week' | 'Day';
  text: string;
  groupIndex: number;
}

interface MonthHeaderProps {
  date: Date;
  text: string;
}

interface HeaderIndentProps {
  level: number;
  text: string;
}

interface ResourceHeaderProps {
  resource: ResourceModel;
}

interface QuickInfoTemplateProps {
  event: EventData;
  element: HTMLElement;
}

interface EditorTemplateProps {
  event: EventData;
  saveEvent: (data: EventData) => void;
  closeEditor: () => void;
}

interface TooltipTemplateProps {
  event: EventData;
  element: HTMLElement;
}
```

---

## 2. Injected Services (IoC / EzServiceRegistry)

| Service Name      | Description                           |
| ----------------- | ------------------------------------- |
| Day               | Handles day view rendering and logic  |
| Week              | Handles week view rendering           |
| WorkWeek          | Handles workweek view rendering       |
| Month             | Handles month view rendering          |
| Year              | Handles year view rendering           |
| Agenda            | Handles agenda view rendering         |
| TimelineViews     | Handles timeline views                |
| TimelineMonth     | Timeline month specific logic         |
| DragAndDrop       | Drag-drop interactions                |
| Resize            | Resize event logic                    |
| ExcelExport       | Export events to Excel                |
| PdfExport         | Export events to PDF                  |
| Print             | Print scheduler view                  |
| ICalendarExport   | Export to ICS format                  |
| ICalendarImport   | Import from ICS format                |
| RecurrenceEditor  | UI editor for recurring events        |
| ValidationService | Slot and conflict validation          |
| SchedulerService  | Core CRUD + lifecycle management      |
| RecurrenceEngine  | Generates recurring event occurrences |
| SecurityService   | RBAC, tenant isolation, and permissions|
| AuditService      | Logs scheduler actions for compliance |

**Service Registration Example:**

```ts
<EzServiceRegistry>
  <SchedulerService />
  <DragAndDrop />
  <Resize />
  <RecurrenceEngine />
</EzServiceRegistry>
```

---

## 3. Template Mapping Table

| Template        | Model                   | Service          | Notes                           |
| --------------- | ----------------------- | ---------------- | ------------------------------- |
| Cell            | CellTemplateProps       | Day/Week/Month   | Custom cell rendering           |
| Date Header     | DateHeaderTemplateProps | Day/Week/Month   | Header row rendering            |
| Month Header    | MonthHeaderProps        | Month            | Top month header                |
| Resource Header | ResourceHeaderProps     | ResourceService  | Resource grouping header        |
| Event           | EventData               | SchedulerService | Event rendering customization   |
| Tooltip         | TooltipTemplateProps    | SchedulerService | Tooltip content                 |
| QuickInfo       | QuickInfoTemplateProps  | SchedulerService | Quick popover for event details |
| Editor          | EditorTemplateProps     | SchedulerService | Modal event editor              |

```

---

## 4. Notes

- All templates are **fully type-safe** and IoC compliant.  
- All injected services are **singleton via EzServiceRegistry**.  
- Templates delegate data handling to services; UI rendering only occurs within React components.

---

**End of File 3 – Templates, Template Models, Template Args & Services**

```
