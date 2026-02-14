# ezAdvScheduler – API File 2: Models, Interfaces, Types

This file contains **all nested models, interfaces, enums, types, and event argument structures** for ezAdvScheduler, fully expanded as per Scheduler API.

---

## 1. Event Settings & Field Models

```ts
interface EventSettingsModel {
  dataSource: Object[] | DataManager;
  fields: FieldModel;
  allowAdding: boolean;
  allowDeleting: boolean;
  allowEditing: boolean;
  enableTooltip: boolean;
  template?: string | ((data: EventData) => JSX.Element);
}

interface FieldModel {
  id: string;
  subject: string;
  startTime: string;
  endTime: string;
  description?: string;
  location?: string;
  recurrenceRule?: string;
  recurrenceID?: string;
  recurrenceException?: string;
  isAllDay?: boolean;
}

interface EventData {
  id: string | number;
  subject: string;
  startTime: Date;
  endTime: Date;
  isAllDay?: boolean;
  recurrenceRule?: string;
  resourceID?: string | number | (string | number)[];
  [key: string]: any;
}
```

---

## 2. Views & Time Models

```ts
interface ViewsModel {
  option: View;
  allowVirtualScrolling: boolean;
  displayName: string;
  startHour?: string;
  endHour?: string;
  interval?: number;
  owWeekend?: boolean;
  isSelected?: boolean;
}

interface DayViewModel extends ViewsModel {
  owWeekNumber?: boolean;
  firstDayOfWeek?: number;
}

interface WeekViewModel extends ViewsModel {
  owWeekNumber?: boolean;
  workDays?: number[];
}

interface WorkWeekViewModel extends ViewsModel {
  workDays?: number[];
  owWeekend?: boolean;
}

interface MonthViewModel extends ViewsModel {
  owAgenda?: boolean;
  numberOfWeeks?: number;
}

interface TimelineViewModel extends ViewsModel {
  timeScale: TimeScaleModel;
  resourceGroupLayout: 'Vertical' | 'Horizontal';
}

interface AgendaViewModel extends ViewsModel {
  daysCount?: number;
  hideEmptyAgendaDays?: boolean;
}

interface WorkHoursModel {
  highlight: boolean;
  start: string;
  end: string;
}

interface TimeScaleModel {
  enable: boolean;
  interval: number;
  slotCount: number;
  majorSlotTemplate?: string | ((props: SlotTemplateProps) => JSX.Element);
  minorSlotTemplate?: string | ((props: SlotTemplateProps) => JSX.Element);
}

interface SlotTemplateProps {
  date: Date;
  isWorkingDay: boolean;
  groupIndex: number;
}
```

---

## 3. Resource & Group Models

```ts
interface ResourceModel {
  field: string;
  title: string;
  name: string;
  dataSource: Object[];
  textField: string;
  idField: string;
  groupIDField?: string;
  colorField?: string;
  allowMultiple?: boolean;
}

interface GroupModel {
  byDate?: boolean;
  byGroupID?: boolean;
  resources?: string[];
  enableCompactView?: boolean;
}

interface HeaderRowModel {
  option: 'Year' | 'Month' | 'Week' | 'Date' | 'Hour';
  template?: string | ((props: any) => JSX.Element);
}

interface ToolbarItemModel {
  text: string;
  cssClass?: string;
  iconCss?: string;
  align?: 'Left' | 'Center' | 'Right';
}

interface TimezoneFields {
  label: string;
  value: string;
}
```

---

## 4. Event Argument Interfaces

```ts
interface ActionEventArgs {
  requestType: string;
  cancel: boolean;
  data?: Object;
  [key: string]: any;
}

interface ActionFailureArgs {
  requestType: string;
  error: Error;
  [key: string]: any;
}

interface ClipboardEventArgs {
  type: 'Cut' | 'Copy' | 'Paste';
  data?: Object;
}

interface PrintEventArgs {
  element: HTMLElement;
  cancel: boolean;
}

interface CellClickEventArgs {
  startTime: Date;
  endTime: Date;
  element: HTMLElement;
  isAllDay: boolean;
  groupIndex: number;
}

interface DragEventArgs {
  data: EventData;
  target: HTMLElement;
  cancel: boolean;
  [key: string]: any;
}

interface EventClickArgs {
  data: EventData;
  element: HTMLElement;
  event: MouseEvent;
}

interface NavigatingEventArgs {
  previousDate: Date;
  currentDate: Date;
  previousView: View;
  currentView: View;
  cancel?: boolean;
}

interface PopupOpenEventArgs {
  type: 'Editor' | 'QuickInfo';
  data?: EventData;
  element: HTMLElement;
  cancel: boolean;
}

interface PopupCloseEventArgs {
  type: 'Editor' | 'QuickInfo';
  data?: EventData;
  element: HTMLElement;
}

interface ResizeEventArgs {
  data: EventData;
  element: HTMLElement;
  cancel: boolean;
}

interface RenderCellEventArgs {
  date: Date;
  element: HTMLElement;
  view: View;
  groupIndex: number;
}

interface SelectEventArgs {
  element: HTMLElement[];
  startTime: Date;
  endTime: Date;
}

interface TooltipEventArgs {
  data: EventData;
  element: HTMLElement;
  cancel: boolean;
}
```

---

## 5. Enums & Special Types

```ts
type View = 'Day' | 'Week' | 'WorkWeek' | 'Month' | 'TimelineDay' | 'TimelineWeek' | 'TimelineWorkWeek' | 'TimelineMonth' | 'Agenda' | 'MonthAgenda' | 'Year';

type CurrentAction = 'Add' | 'Edit' | 'Delete';
```

---

**End of File 2 – Models, Interfaces, Types**
