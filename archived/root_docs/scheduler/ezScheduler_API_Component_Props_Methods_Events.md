# ezScheduler – API File 1: Component, Props, Methods, Events

This file documents **ScheduleComponent** exhaustively, including every property, method, event, and their full nested contracts as documented by React Schedule API.

---

## 1. Component

```ts
class ScheduleComponent extends React.Component<ScheduleProps> {}
```

**Responsibilities:**

* Rendering host only
* Delegates data, validation, persistence, interaction, and templates to services
* Fully IoC-compliant via EzServiceRegistry

---

## 2. Props (Exhaustive)

```ts
interface ScheduleProps {
  allowDragAndDrop?: boolean;
  allowKeyboardInteraction?: boolean;
  allowMultiCellSelection?: boolean;
  allowResizing?: boolean;
  allowClipboard?: boolean;
  allowInline?: boolean;
  allowMultiDrag?: boolean;
  allowMultiRowSelection?: boolean;
  allowOverlap?: boolean;
  allowSwiping?: boolean;
  agendaDaysCount?: number;
  calendarMode?: 'Gregorian' | 'Islamic';
  cellHeaderTemplate?: string | ((props: CellTemplateProps) => JSX.Element);
  cssClass?: string;
  currentView?: View;
  currentTimeIndicator?: boolean;
  dateFormat?: string;
  dateHeaderTemplate?: string | ((props: DateHeaderTemplateProps) => JSX.Element);
  dateRangeTemplate?: string | ((props: DateRangeTemplateProps) => JSX.Element);
  dayHeaderTemplate?: string | ((props: DayHeaderTemplateProps) => JSX.Element);
  enableAdaptiveUI?: boolean;
  enableAllDayScroll?: boolean;
  enablePersistence?: boolean;
  enableRecurrenceValidation?: boolean;
  enableRtl?: boolean;
  endHour?: string;
  eventSettings?: EventSettingsModel;
  firstDayOfWeek?: number;
  firstMonthOfYear?: number;
  group?: GroupModel;
  headerIndentTemplate?: string | ((props: HeaderIndentProps) => JSX.Element);
  headerRows?: HeaderRowModel[];
  height?: string | number;
  hideEmptyAgendaDays?: boolean;
  isAllDay?: boolean;
  locale?: string;
  maxDate?: Date;
  minDate?: Date;
  monthHeaderTemplate?: string | ((props: MonthHeaderProps) => JSX.Element);
  quickInfoOnSelectionEnd?: boolean;
  readonly?: boolean;
  resourceHeaderTemplate?: string | ((props: ResourceHeaderProps) => JSX.Element);
  resources?: ResourceModel[];
  rowAutoHeight?: boolean;
  selectedDate?: Date;
  showHeaderBar?: boolean;
  showQuickInfo?: boolean;
  showTimeIndicator?: boolean;
  startHour?: string;
  timeScale?: TimeScaleModel;
  timezone?: string;
  timezoneDataSource?: TimezoneFields[];
  toolbarItems?: (string | ToolbarItemModel)[];
  views?: (View | ViewsModel)[];
  width?: string | number;
  workDays?: number[];
  workHours?: WorkHoursModel;
}
```

> All nested types (EventSettingsModel, ResourceModel, ViewsModel, TimeScaleModel, ToolbarItemModel, etc.) are **fully expanded** in File 2.

---

## 3. Methods (Exhaustive)

```ts
addEvent(data: Object | Object[]): void;
addResource(resources: Object[], name: string, index?: number): void;
changeCurrentView(viewName: View, viewIndex?: number): void;
changeView(view: View, index?: number): void;
closeEditor(): void;
deleteEvent(id: string | number | Object, action?: CurrentAction): void;
exportToExcel(fileName?: string, customData?: Object[]): void;
exportToICalendar(fileName?: string, customData?: Object[]): void;
getBlockEvents(start?: Date, end?: Date, includeOccurrences?: boolean): Object[];
getCurrentViewEvents(): Object[];
getDeletedOccurrences(): Object[];
getEditorElements(): HTMLElement[];
getEventDetails(target: Element): Object;
getEvents(start?: Date, end?: Date, includeOccurrences?: boolean): Object[];
getOccurrencesByID(id: string | number): Object[];
getResourceCollections(): Object[];
getResourcesByIndex(index: number): Object[];
getSelectedElements(): Element[];
getWorkCellElements(): HTMLElement[];
isSlotAvailable(start: Date, end: Date, groupIndex?: number): boolean;
openEditor(data: Object, action: CurrentAction, isEventData?: boolean): void;
print(): void;
refresh(): void;
refreshEvents(): void;
removeResource(index: number, name: string): void;
resetWorkHours(dates?: Date[], start?: string, end?: string, groupIndex?: number): void;
saveEvent(data: Object, action?: CurrentAction): void;
scrollTo(hour: string, date?: Date): void;
selectCell(cells: HTMLElement | HTMLElement[]): void;
showSpinner(): void;
hideSpinner(): void;
```

---

## 4. Events (Exhaustive)

```ts
actionBegin: (args: ActionEventArgs) => void;
actionComplete: (args: ActionEventArgs) => void;
actionFailure: (args: ActionFailureArgs) => void;
beforePaste: (args: ClipboardEventArgs) => void;
beforePrint: (args: PrintEventArgs) => void;
cellClick: (args: CellClickEventArgs) => void;
cellDoubleClick: (args: CellClickEventArgs) => void;
destroyed: () => void;
drag: (args: DragEventArgs) => void;
dragStart: (args: DragEventArgs) => void;
dragStop: (args: DragEventArgs) => void;
eventClick: (args: EventClickArgs) => void;
eventDoubleClick: (args: EventClickArgs) => void;
navigating: (args: NavigatingEventArgs) => void;
popupClose: (args: PopupCloseEventArgs) => void;
popupOpen: (args: PopupOpenEventArgs) => void;
renderCell: (args: RenderCellEventArgs) => void;
resizeStart: (args: ResizeEventArgs) => void;
resizeStop: (args: ResizeEventArgs) => void;
select: (args: SelectEventArgs) => void;
tooltipOpen: (args: TooltipEventArgs) => void;
```

> All event argument interfaces (`ActionEventArgs`, `DragEventArgs`, etc.) are **fully expanded** in File 2.

---

## 5. Notes

* All props, methods, and events are fully aligned 1:1 with **React Scheduler API**.
* File 2 will contain **all nested models, interfaces, enums, types, and event argument structures**.
* File 3 will contain **templates, template models, template arguments, and service mappings**.

---

**End of File 1**
