# EzUX Comparison Glossary

This glossary details the public properties, methods, and types for the core EzUX components: **EzLayout**, **EzTable**, **EzScheduler**, and **EzTreeView**.

---

## 1. EzLayout

### Properties (`EzLayoutProps`)

| Property | Type | Description |
|:---|:---|:---|
| `components` | `object` | Configures injected sub-components. |
| `components.header` | `ReactNode \| ComponentType<EzHeaderComponentProps>` | Custom header component or element. |
| `components.sidebar` | `ReactNode \| ComponentType<EzSidebarComponentProps>` | Custom sidebar component or element. |
| `components.footer` | `ReactNode \| ComponentType<any>` | Custom footer component or element. |
| `components.commandPalette` | `ReactNode \| ComponentType<any>` | Custom command palette component or element. |
| `authConfig` | `object` | Configuration for authentication pages. |
| `authConfig.signInSlot` | `ReactNode` | Content/Component for the Sign In page. |
| `authConfig.signUpSlot` | `ReactNode` | Content/Component for the Sign Up page. |
| `headerConfig` | `EzHeaderProps` | Configuration props for the default header. |
| `serviceRegistry` | `ServiceRegistry` | Optional custom service registry instance. |
| `className` | `string` | Additional CSS class for the root container. |
| `contentClassName` | `string` | Additional CSS class for the main content area. |
| `children` | `ReactNode` | Main application content. |

### Events

| Event | Callback Signature | Description |
|:---|:---|:---|
| `onModeChange` | `(mode: 'dashboard' \| 'auth' \| 'minimal') => void` | Triggered when the layout mode changes. |
| `onSidebarToggle` | `(isOpen: boolean) => void` | Triggered when the sidebar visibility toggles. |
| `onAuthPageChange` | `(page: 'signin' \| 'signup') => void` | Triggered when switching between auth pages. |
| `onViewportResize` | `(dimensions: { width, height, isMobile }) => void` | Triggered when the viewport dimensions change. |

### Imperative API (`EzLayoutRef`)

| Method | Signature | Description |
|:---|:---|:---|
| **Sidebar Control** | | |
| `toggleSidebar` | `(open?: boolean) => void` | Toggles the sidebar or sets specific state. |
| `openSidebar` | `() => void` | Opens the sidebar. |
| `closeSidebar` | `() => void` | Closes the sidebar. |
| `isSidebarOpen` | `() => boolean` | Returns true if the sidebar is open. |
| **Mode Management** | | |
| `setMode` | `(mode: 'dashboard' \| 'auth' \| 'minimal') => void` | Sets the current layout mode. |
| `getMode` | `() => 'dashboard' \| 'auth' \| 'minimal'` | Returns the current layout mode. |
| `showDashboard` | `() => void` | Switches to dashboard mode. |
| `showAuth` | `() => void` | Switches to auth mode. |
| `showMinimal` | `() => void` | Switches to minimal mode. |
| **Auth Control** | | |
| `setAuthPage` | `(page: 'signin' \| 'signup') => void` | Sets the active authentication page. |
| `getAuthPage` | `() => 'signin' \| 'signup'` | Returns the active authentication page. |
| `showSignIn` | `() => void` | Shows the sign-in page. |
| `showSignUp` | `() => void` | Shows the sign-up page. |
| **State Access** | | |
| `getState` | `() => LayoutState` | Returns the full internal state object. |
| `getViewport` | `() => { height: number; isMobile: boolean }` | Returns current viewport stats. |
| `isMobile` | `() => boolean` | Returns true if in mobile view. |
| `getHeaderHeight` | `() => number` | Returns the current header height. |
| `getSidebarWidth` | `() => number` | Returns the current sidebar width. |
| **Misc** | | |
| `refresh` | `() => void` | Forces a re-render of the layout. |

---

## 2. EzTable

### Properties (`EzTableProps<TData>`)

| Property | Type | Description |
|:---|:---|:---|
| `data` | `TData[]` | **Required.** The array of data objects to display. |
| `columns` | `ColumnDef<TData>[]` | **Required.** Column definitions. |
| `density` | `'compact' \| 'standard' \| 'comfortable'` | Sets the density of rows and cells. |
| `rowHeight` | `number` | Fixed height for rows (if not dynamic). |
| `estimatedRowHeight` | `number` | Estimated height for virtualization. |
| `width` / `height` | `string \| number` | Dimensions of the table container. |
| `state` | `Partial<TableState>` | Controlled table state object. |
| `initialState` | `Partial<TableState>` | Initial state for uncontrolled mode. |
| `pagination` | `boolean` | Enable pagination. |
| `pageSize` | `number` | Number of rows per page. |
| `pageSettings` | `object` | Advanced pagination config (sizes, count, etc.). |
| `enableStickyHeader` | `boolean` | Stick header to top of scroll area. |
| `enableStickyPagination`| `boolean` | Stick pagination to bottom. |
| `enableColumnVirtualization`| `boolean` | Enable horizontal virtualization. |
| `enableRowSelection` | `boolean` | Enable selection checkboxes/click. |
| `selectionSettings` | `SelectionSettings` | Config for selection mode and type. |
| `enableEditing` | `boolean` | Enable editing features. |
| `editSettings` | `EditSettings` | Config for edit mode, dialog, batch, etc. |
| `enableSorting` | `boolean` | Enable column sorting (manual or auto). |
| `sortSettings` | `SortSettings` | Config for sorting behavior. |
| `enableFiltering` | `boolean` | Enable column filtering. |
| `enableAdvancedFiltering`| `boolean` | Enable advanced filter menu. |
| `filterSettings` | `FilterSettings` | Config for filter UI type. |
| `enableGrouping` | `boolean` | Enable row grouping. |
| `enableExport` | `boolean` | Enable CSV/Excel/PDF export. |
| `toolbar` | `ToolbarItem[]` | Configuration for the top toolbar. |
| `slots` | `EzTableSlots` | Replaceable internal sub-components. |
| `localization` | `EzTableLocalization` | Object for overriding text labels. |

### Events

| Event | Callback Signature | Description |
|:---|:---|:---|
| `onRowClick` | `(args: { row, data, ... }) => void` | Triggered when a row is clicked. |
| `onRowDoubleClick` | `(args: { row, data, ... }) => void` | Triggered when a row is double-clicked. |
| `onCellFocus` | `(args: { cell, row }) => void` | Triggered when a cell receives focus. |
| `onDataChange` | `(data: TData[]) => void` | Triggered when data is modified. |
| `onStateChange` | `(updater: Updater<TableState>) => void` | Triggered when internal state updates. |
| `onFetchData` | `(params: any) => void` | Callback for server-side data fetching. |
| `onRowSelect` | `(args: { row, ... }) => void` | Triggered when a row is selected. |
| `onRowAddStart` | `(args: { data }) => void` | Triggered before adding a new row. |
| `onRowEditStart` | `(args: { row, data }) => void` | Triggered before editing a row. |
| `onExport` | `(type: string) => void` | Triggered when an export is requested. |

### Imperative API (`EzTableRef`)

| Method | Signature | Description |
|:---|:---|:---|
| **Data** | | |
| `refresh` | `() => void` | Refreshes the table (re-fetches if remote). |
| `getData` | `() => TData[]` | Returns the current data set. |
| `addRecord` | `(data?: Partial<TData>) => void` | Adds a new record. |
| `updateRecord` | `(key: string\|number, data) => void` | Updates an existing record. |
| `deleteRecord` | `(key: string\|number) => void` | Deletes a record by key. |
| `saveDataChanges` | `() => void` | Commits pending batch changes. |
| `cancelDataChanges` | `() => void` | Discards pending batch changes. |
| `getBatchChanges` | `() => { added, changed, deleted }` | Returns tracked batch changes. |
| **Selection** | | |
| `selectRow` | `(index: number \| string) => void` | Selects a specific row. |
| `selectRows` | `(indices: (number\|string)[]) => void` | Selects multiple rows. |
| `selectAll` | `() => void` | Selects all available rows. |
| `clearSelection` | `() => void` | Clears all selection. |
| `getSelectedRecords` | `() => TData[]` | Returns array of selected data. |
| **Navigation & View** | | |
| `goToPage` | `(page: number) => void` | Navigates to a specific page index. |
| `scrollToIndex` | `(index: number) => void` | Scrolls the view to a row index. |
| `search` | `(key: string) => void` | Performs a global text search. |
| `filterByColumn` | `(field, operator, value) => void` | Applies a filter to a column. |
| `sortByColumn` | `(field, direction) => void` | Sorts by a column. |
| `showSpinner` / `hideSpinner`| `() => void` | Controls the loading overlay. |

---

## 3. EzScheduler

### Properties (`EzSchedulerProps`)

| Property | Type | Description |
|:---|:---|:---|
| `views` | `View[] \| ViewsModel[]` | **Required.** Array of configured views (Day, Week, Month, etc.). |
| `currentView` | `View` | controlled current view. |
| `selectedDate` | `Date` | controlled selected date. |
| `events` / `dataSource` | `SchedulerEvent[]` | Array of event objects. |
| `eventSettings` | `EventSettingsModel` | Config for event fields and mapping. |
| `resources` | `ResourceModel[]` | Configuration for resources. |
| `group` | `GroupModel` | Configuration for grouping logic. |
| `allowDragAndDrop` | `boolean` | Enable drag-and-drop interactions. |
| `allowResizing` | `boolean` | Enable event resizing. |
| `showWeekend` | `boolean` | Toggle visibility of weekends. |
| `workHours` | `WorkHoursModel` | Define working hours highlighting. |
| `timeScale` | `TimeScaleModel` | Config for time slots (interval, slot count). |
| `startHour` / `endHour` | `string` | Visible day time range (e.g., "08:00"). |
| `firstDayOfWeek` | `number` | 0 (Sunday) to 6 (Saturday). |
| `enablePersistence` | `boolean` | Persist state to local/session storage. |
| `enableAdaptiveUI` | `boolean` | Optimize layout for mobile devices. |
| `editorTemplate` | `(props) => ReactNode` | Custom template for event editor. |

### Events

| Event | Callback Signature | Description |
|:---|:---|:---|
| `onViewChange` | `(view: View) => void` | Triggered when the view changes. |
| `onDateChange` | `(date: Date) => void` | Triggered when the selected date changes. |
| `onEventClick` | `(event: SchedulerEvent) => void` | Triggered when an event is clicked. |
| `onEventDoubleClick`| `(event: SchedulerEvent) => void` | Triggered when an event is double-clicked. |
| `onSlotClick` | `(date: Date, resourceId?) => void` | Triggered when a time slot is clicked. |
| `onEventCreate` | `(event) => void` | Triggered when a new event is created. |
| `onEventChange` | `(event) => void` | Triggered when an event is modified. |
| `onEventDelete` | `(eventId) => void` | Triggered when an event is deleted. |
| `dragStop` | `(args: DragEventArgs) => void` | Triggered when a drag operation finishes. |
| `resizeStop` | `(args: ResizeEventArgs) => void` | Triggered when a resize operation finishes. |

### Imperative API (`EzSchedulerRef`)

| Method | Signature | Description |
|:---|:---|:---|
| **View** | | |
| `changeView` | `(view: View) => void` | Changes the current view. |
| `scrollTo` | `(hour: string) => void` | Scrolls to a specific time. |
| `scrollToIndex` | `(index: number) => void` | Scrolls to a resource index (timeline/group). |
| **Data Ops** | | |
| `refresh` | `() => void` | Refreshes the scheduler. |
| `addEvent` | `(event) => void` | Adds a new event programmatically. |
| `saveEvent` | `(event) => void` | Updates an existing event. |
| `deleteEvent` | `(id) => void` | Deletes an event. |
| `getEvents` | `() => SchedulerEvent[]` | Returns all events. |
| **UI** | | |
| `openEditor` | `(event, action) => void` | Opens the event editor modal. |
| `closeEditor` | `() => void` | Closes the event editor modal. |
| `showSpinner`/`hideSpinner` | `() => void` | Controls loading state. |

---

## 4. EzTreeView

### Properties (`EzTreeViewProps`)

| Property | Type | Description |
|:---|:---|:---|
| `data` | `TreeNode[]` | **Required.** The hierarchical data array. |
| `selectionMode` | `'single' \| 'multiple'` | Selection behavior. |
| `showCheckboxes` | `boolean` | Enable tri-state checkboxes. |
| `allowEditing` | `boolean` | Enable inline node renaming. |
| `allowDragAndDrop` | `boolean` | Enable drag-and-drop reordering. |
| `allowMultiSelection`| `boolean` | Allow selecting multiple nodes. |
| `searchTerm` | `string` | Filter nodes by text. |
| `expandAll` | `boolean` | (Initial) Expand all nodes. |
| `fields` | `object` | Mapping for data field names. |
| `sortOrder` | `'None' \| 'Ascending' \| 'Descending'` | Sort order for nodes. |
| `checkedNodes` | `string[]` | Controlled array of checked IDs. |
| `expandedNodes` | `string[]` | Controlled array of expanded IDs. |
| `selectedNodes` | `string[]` | Controlled array of selected IDs. |

### Events

| Event | Callback Signature | Description |
|:---|:---|:---|
| `onSelectionChange` | `(ids: string[]) => void` | Triggered when selection changes. |
| `onCheckedChange` | `(ids: string[]) => void` | Triggered when checked state changes. |
| `onNodeExpand` | `(id: string, expanded: boolean) => void`| Triggered when a node is expanded/collapsed. |
| `onNodeDrop` | `(dragged, target, pos) => void` | Triggered on drop. |
| `onNodeRename` | `(id: string, label: string) => void` | Triggered after editing a label. |
| `onNodeClicked` | `(id: string) => void` | Triggered on node click. |
| `onNodeDoubleClicked` | `(id: string) => void` | Triggered on node double-click. |

### Imperative API (`EzTreeViewApi`)

| Method | Signature | Description |
|:---|:---|:---|
| `expandAll` | `() => void` | Expands all nodes. |
| `collapseAll` | `() => void` | Collapses all nodes. |
| `checkAll` | `() => void` | Checks all nodes. |
| `uncheckAll` | `() => void` | Unchecks all nodes. |
| `selectNode` | `(id: string) => void` | Selects a specific node. |
| `expandNode` | `(id: string, expand?: boolean) => void` | Expands/collapses a node. |
| `checkNode` | `(id: string, check?: boolean) => void` | Checks/unchecks a node. |
| `ensureVisible` | `(id: string) => void` | Scrolls the node into view (expanding parents if needed). |
| `addNodes` | `(nodes, target?, index?) => void` | Adds nodes programmatically. |
| `removeNodes` | `(ids: string[]) => void` | Removes nodes programmatically. |
| `updateNode` | `(id, updates) => void` | Updates node data. |
| `moveNodes` | `(ids, target, index?) => void` | Moves nodes to a new parent/index. |
| `beginEdit` | `(id: string) => void` | Starts edit mode for a node. |
| `getTreeData` | `() => TreeNode[]` | Returns the current tree data structure. |
