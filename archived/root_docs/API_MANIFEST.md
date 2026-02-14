# API Manifest & Audit Report

Generated on: 2/13/2026, 11:21:37 AM

## EzTable

**Description**: EzTable is a high-performance, enterprise-grade data grid engine. Built on TanStack Table v8, it combines lightweight core logic with powerful features like virtualization, advanced filtering, and modular editing.  ### Visual Preview ![EzTable](media/eztable.png)  ### Core Capabilities - **Superior Performance**: Row and column virtualization for smooth handling of 100k+ records. - **Smart Data Fetching**: Support for infinite scroll, server-side pagination, and caching via React Query. - **Flexible Editing**: Choose between `Normal` (inline), `Dialog` (form-based), or `Batch` editing modes. - **Advanced Interactivity**: Range selection, drag-and-drop column reordering, and context menus. - **Data Intelligence**: Built-in export (Excel/CSV/PDF), column pinning, and grouping.  ### Minimal Example ```tsx <EzTable   data={employees}   columns={[     { accessorKey: 'name', header: 'Name' },     { accessorKey: 'role', header: 'Role' }   ]}   pagination   enableFiltering /> ```  ### Advanced Config: Editing & Persistence ```tsx <EzTable   data={data}   columns={columns}   editSettings={{     allowEditing: true,     mode: 'Batch',     primaryKey: 'id'   }}   enablePersistence   persistenceKey="user-table-grid"   onBatchSave={(changes) => saveToDatabase(changes)} /> ```

**Group**: Core Components

### Props Interface: `EzTableProps`

#### Members

| Name | Description | Group | Status |
| :--- | :--- | :--- | :--- |
| `adaptiveSizing` | Enable adaptive sizing for dynamic item heights. | Properties | ✅ |
| `aggregates` | Configuration for column aggregates (e.g. Sum, Average). Displayed in the table footer. | Properties | ✅ |
| `allowKeyboard` | Enable keyboard navigation features. | Properties | ✅ |
| `className` | Custom class names for styling | Properties | ✅ |
| `classNames` | Custom class names for internal table elements. Use strict mode class names or functions for dynamic styling. | Properties | ✅ |
| `clipboardSettings` | - | Properties | ❌ Missing Description |
| `clipMode` | Text clipping mode for all columns. - `clip`: Text is clipped. - `ellipsis`: Text is truncated with an ellipsis. - `ellipsis-tooltip`: Text is truncated and a tooltip is shown on hover. | Properties | ✅ |
| `columns` | Configuration for the table columns. Defines headers, accessors, cell rendering, and other per-column options. | Properties | ✅ |
| `columnVirtualizationThreshold` | Number of columns after which virtualization kicks in. | Properties | ✅ |
| `data` | The data to display in the table.  Can be an array of objects or an empty array. | Properties | ✅ |
| `dataSource` | Alias for data. | Properties | ✅ |
| `dataTestId` | Data attribute for testing | Properties | ✅ |
| `debugVirtualization` | Enable debug logging for virtualization. | Properties | ✅ |
| `defaultGrouping` | - | Properties | ❌ Missing Description |
| `density` | - | Properties | ❌ Missing Description |
| `dir` | Direction of the text (ltr, rtl, auto) | Properties | ✅ |
| `editSettings` | Configuration for editing behavior (mode, new row position). | Properties | ✅ |
| `emptyRecordTemplate` | Custom template for when there are no records. | Subcomponents | ✅ |
| `enableAdvancedFiltering` | - | Properties | ❌ Missing Description |
| `enableAltRow` | Enable alternating row background colors (zebra striping). | Properties | ✅ |
| `enableChangeTracking` | - | Properties | ❌ Missing Description |
| `enableColumnFiltering` | - | Properties | ❌ Missing Description |
| `enableColumnPinning` | - | Properties | ❌ Missing Description |
| `enableColumnVirtualization` | Enable horizontal column virtualization. Recommended for tables with many columns (e.g. 50+). | Properties | ✅ |
| `enableContextMenu` | - | Properties | ❌ Missing Description |
| `enableEditing` | - | Properties | ❌ Missing Description |
| `enableExport` | - | Properties | ❌ Missing Description |
| `enableGroupFooters` | - | Properties | ❌ Missing Description |
| `enableGrouping` | - | Properties | ❌ Missing Description |
| `enableHover` | Enable row hover effect. | Properties | ✅ |
| `enableHtmlSanitizer` | Enable HTML sanitizer for cell content. | Properties | ✅ |
| `enableInfiniteScroll` | Enable Infinite Scrolling. If true, `onEndReached` will be called when the user scrolls to the bottom. | Properties | ✅ |
| `enablePersistence` | - | Properties | ❌ Missing Description |
| `enablePivoting` | - | Properties | ❌ Missing Description |
| `enableRangeSelection` | - | Properties | ❌ Missing Description |
| `enableRowPinning` | - | Properties | ❌ Missing Description |
| `enableRowReordering` | - | Properties | ❌ Missing Description |
| `enableRowSelection` | - | Properties | ❌ Missing Description |
| `enableSearchHighlighting` | - | Properties | ❌ Missing Description |
| `enableStickyHeader` | - | Properties | ❌ Missing Description |
| `enableStickyPagination` | - | Properties | ❌ Missing Description |
| `enableTreeData` | - | Properties | ❌ Missing Description |
| `estimatedRowHeight` | Estimated row height for virtualization. Increase this if your rows are taller than 48px to improve scroll performance. Default: 48 | Properties | ✅ |
| `filterSettings` | Configuration for filtering behavior (UI type, mode, etc). | Properties | ✅ |
| `getRowId` | Function to derive a unique ID for a row. Defaults to looking for `id` property. | Properties | ✅ |
| `getSubRows` | - | Properties | ❌ Missing Description |
| `gridLines` | Grid line configuration. | Properties | ✅ |
| `groupSettings` | - | Properties | ❌ Missing Description |
| `height` | Height of the table.  Accepts pixel number or CSS string (e.g. '500px'). | Properties | ✅ |
| `icons` | Custom icons for table elements (sort, filter, pagination, etc.). | Properties | ✅ |
| `id` | Unique identifier for the component instance | Properties | ✅ |
| `initialState` | Initial state object for the table. Use this to set the initial pagination, sorting, filtering, etc. | Properties | ✅ |
| `isCellEditable` | - | Properties | ❌ Missing Description |
| `isLoading` | - | Properties | ❌ Missing Description |
| `isRowEditable` | - | Properties | ❌ Missing Description |
| `loadingTemplate` | Custom template for the loading state. | Subcomponents | ✅ |
| `localization` | Localization strings for the table (e.g. pagination labels, no rows message). | Properties | ✅ |
| `manualFiltering` | - | Properties | ❌ Missing Description |
| `manualPagination` | - | - | ❌ Missing Description, Missing @group |
| `manualSorting` | - | Properties | ❌ Missing Description |
| `onBatchDiscard` | Callback when batch changes are discarded. | Events | ✅ |
| `onBatchSave` | Callback when batch changes are saved. | Events | ✅ |
| `onCellClick` | - | Events | ❌ Missing Description |
| `onCellDoubleClick` | - | Events | ❌ Missing Description |
| `onCellFocus` | Callback when a cell is focused. | Events | ✅ |
| `onCellSave` | - | Events | ❌ Missing Description |
| `onColumnFiltersChange` | - | Events | ❌ Missing Description |
| `onContextMenuItemClick` | - | Events | ❌ Missing Description |
| `onContextMenuOpen` | - | Events | ❌ Missing Description |
| `onDataChange` | - | Events | ❌ Missing Description |
| `onDataChangeCancel` | Callback when a data change operation is cancelled. | Events | ✅ |
| `onDataChangeComplete` | Callback when a data change operation completes. | Events | ✅ |
| `onDataChangeRequest` | Callback when a data change (add/edit/delete) is requested. | Events | ✅ |
| `onDataChangeStart` | Callback when a data change operation starts. | Events | ✅ |
| `onDataLoad` | Callback when data is loaded into the table. | Events | ✅ |
| `onDataRequest` | Callback to request data from the server. Triggered by paging, sorting, filtering, etc. | Events | ✅ |
| `onEndReached` | Callback when the table is scrolled to the bottom. Used for Infinite Scroll to load more data. | Events | ✅ |
| `onError` | Callback when an internal error occurs. | Events | ✅ |
| `onExportComplete` | - | Events | ❌ Missing Description |
| `onExportCSV` | - | Events | ❌ Missing Description |
| `onExportExcel` | - | Events | ❌ Missing Description |
| `onExportPDF` | - | Events | ❌ Missing Description |
| `onFetchData` | Alias for onDataRequest. Triggered when data needs to be fetched (e.g. pagination/sorting in server-side mode). | Events | ✅ |
| `onFilter` | Callback when filters change. | Events | ✅ |
| `onFormRender` | Callback when the edit form is rendered. | Events | ✅ |
| `onGlobalFilterChange` | - | Events | ❌ Missing Description |
| `onGridRenderComplete` | Callback when grid renders completes. | Events | ✅ |
| `onGridRenderStart` | Callback when grid renders starts. | Events | ✅ |
| `onGroupingChange` | - | Events | ❌ Missing Description |
| `onPageChange` | Callback when page changes. | Events | ✅ |
| `onPaginationChange` | - | Events | ❌ Missing Description |
| `onPaste` | - | Events | ❌ Missing Description |
| `onProcessRowUpdate` | Callback to process a row update before it is committed. Useful for validation or transformation. | Events | ✅ |
| `onRefresh` | Callback when the table is refreshed. | Events | ✅ |
| `onRowAddStart` | Callback before a new row is added. Return false to cancel. | Events | ✅ |
| `onRowClick` | Callback when a row is clicked. | Events | ✅ |
| `onRowDeselect` | Callback when a row is deselected. | Events | ✅ |
| `onRowDoubleClick` | Callback when a row is double-clicked. | Events | ✅ |
| `onRowEditStart` | Callback before a row is edited. Return false to cancel. | Events | ✅ |
| `onRowReorder` | - | Events | ❌ Missing Description |
| `onRowSelect` | Callback when a row is selected. | Events | ✅ |
| `onRowSelectionChange` | - | Events | ❌ Missing Description |
| `onSearch` | Callback when global search is performed. | Events | ✅ |
| `onSort` | Callback when sorting changes. | Events | ✅ |
| `onSortingChange` | - | Events | ❌ Missing Description |
| `onStateChange` | Callback fired when the table state changes. | Events | ✅ |
| `onToolbarItemClick` | Callback when a toolbar item is clicked. | Events | ✅ |
| `overscanCount` | Number of items to render outside the visible area. Higher values reduce blank space during fast scrolling but increase memory usage. | Properties | ✅ |
| `pageCount` | - | - | ❌ Missing Description, Missing @group |
| `pageSettings` | Configuration for pagination. Defines page size, available page sizes, and initial page. | Properties | ✅ |
| `pageSize` | Number of rows per page. | Properties | ✅ |
| `pagination` | Enable pagination. | Properties | ✅ |
| `persistenceKey` | - | Properties | ❌ Missing Description |
| `prefetchDistance` | Distance in items to prefetch during scrolling. | Properties | ✅ |
| `printMode` | - | Properties | ❌ Missing Description |
| `progressiveRendering` | Progressive rendering for large datasets. Renders rows in chunks to keep the UI responsive. | Properties | ✅ |
| `query` | Generic query parameters for server-side operations. Passed to `onDataRequest`. | Properties | ✅ |
| `renderDetailPanel` | - | Properties | ❌ Missing Description |
| `renderNoRowsOverlay` | - | Properties | ❌ Missing Description |
| `rowClass` | - | - | ❌ Missing Description, Missing @group |
| `rowCount` | Total expected rows if knowing beforehand. Crucial for server-side pagination to calculate total pages. | Properties | ✅ |
| `rowHeight` | Fixed row height for all rows. Required for efficient virtualization. | Properties | ✅ |
| `rowTemplate` | Custom template for rendering rows. | Subcomponents | ✅ |
| `scrollBehavior` | - | Properties | ❌ Missing Description |
| `scrollMargin` | Scroll margin (pixels) to apply to scroll container. | Properties | ✅ |
| `scrollPaddingEnd` | Scroll padding end (pixels) to offset sticky elements. | Properties | ✅ |
| `scrollPaddingStart` | Scroll padding start (pixels) to offset sticky elements or top padding. | Properties | ✅ |
| `searchSettings` | Configuration for global search behavior. | Properties | ✅ |
| `selectionSettings` | Configuration for row/cell selection behavior. | Properties | ✅ |
| `service` | - | - | ❌ Missing Description, Missing @group |
| `serviceName` | - | - | ❌ Missing Description, Missing @group |
| `serviceRegistry` | The shared service registry instance. This is required to access shared services like HierarchyService, FocusManagerService, etc. | Services | ✅ |
| `setPagerMessage` | - | Methods | ❌ Missing Description |
| `slotProps` | Props to pass to the custom slots. | Properties | ✅ |
| `slots` | Custom slots to override default internal components. | Properties | ✅ |
| `sortSettings` | Configuration for sorting behavior. | Properties | ✅ |
| `state` | Controlled state object for the table. Use this to control pagination, sorting, filtering, etc. from outside. | Properties | ✅ |
| `style` | Inline styles | Properties | ✅ |
| `textWrapSettings` | Configuration for text wrapping in cells and headers. | Properties | ✅ |
| `toolbar` | Toolbar items configuration. Accepts an array of item names (strings) or detailed item objects. | Properties | ✅ |
| `validateField` | Function to validate a field during editing. Return true if valid, or an error message string if invalid. | Properties | ✅ |
| `width` | Width of the table.  Accepts pixel number or CSS string (e.g. '100%'). | Properties | ✅ |

### Ref Interface: `EzTableRef`

#### Methods

| Name | Description | Group | Status |
| :--- | :--- | :--- | :--- |
| `addRecord` | Adds a new record to the table. | Methods | ✅ |
| `autoFitColumns` | Automatically fits columns to content. | Methods | ✅ |
| `cancelDataChanges` | Cancels any pending data changes. | Methods | ✅ |
| `clearFilter` | Clears the filter for a specific column or all columns. | Methods | ✅ |
| `clearRowSelection` | Clears row selection (Alias for clearSelection). | Methods | ✅ |
| `clearSelection` | Clears the current selection. | Methods | ✅ |
| `clearSort` | Clears the current sort. | Methods | ✅ |
| `collapseAllGroups` | Collapses all groups. | Methods | ✅ |
| `copyToClipboard` | Copies table data to clipboard. | Methods | ✅ |
| `deleteRecord` | Deletes a record from the table. | Methods | ✅ |
| `deleteRecords` | Deletes multiple records. | Methods | ✅ |
| `editRecord` | Puts a record into edit mode. | Methods | ✅ |
| `expandAllGroups` | Expands all groups. | Methods | ✅ |
| `exportDataAsCsv` | Exports data as CSV. | Methods | ✅ |
| `filterByColumn` | Filters the table by a specific column. | Methods | ✅ |
| `forceUpdate` | Forces a re-render of the table. | Methods | ✅ |
| `getBatchChanges` | Returns batch changes (added, changed, deleted). | Methods | ✅ |
| `getChanges` | Returns changes (Alias for getBatchChanges). | Methods | ✅ |
| `getColumnByField` | Returns a column definition by its field name. | Methods | ✅ |
| `getColumns` | Returns all column definitions. | Methods | ✅ |
| `getData` | Returns the current data displayed in the table. | Methods | ✅ |
| `getDataModule` | Returns the underlying data module (internal use). | Methods | ✅ |
| `getHiddenColumns` | Returns the list of hidden columns. | Methods | ✅ |
| `getPrimaryKeyFieldNames` | Returns the field names used as primary keys. | Methods | ✅ |
| `getRowInfo` | Returns row information for a specific key. | Methods | ✅ |
| `getSelectedRecords` | Returns the currently selected records. | Methods | ✅ |
| `getSelectedRowIndexes` | Returns the indexes of currently selected rows. | Methods | ✅ |
| `getVisibleColumns` | Returns the list of visible columns. | Methods | ✅ |
| `goToPage` | Navigates to a specific page. | Methods | ✅ |
| `hideSpinner` | Hides the loading spinner. | Methods | ✅ |
| `isRemote` | Checks if the table is in remote data mode. | Methods | ✅ |
| `refresh` | Refreshes the table data. | Methods | ✅ |
| `removeSortColumn` | Removes a sort column. | Methods | ✅ |
| `saveDataChanges` | Saves any pending data changes (batch mode). | Methods | ✅ |
| `scrollToIndex` | Scrolls to a specific row index. | Methods | ✅ |
| `search` | Performs a global search. | Methods | ✅ |
| `selectAll` | Selects all rows in the table. | Methods | ✅ |
| `selectRow` | Selects a row by its index or ID. | Methods | ✅ |
| `selectRowByRange` | Selects a range of rows. | Methods | ✅ |
| `selectRows` | Selects multiple rows by their indices or IDs. | Methods | ✅ |
| `setCellValue` | Sets a value for a specific cell. | Methods | ✅ |
| `setColumnVisibility` | Sets column visibility programmatically. | Methods | ✅ |
| `setFilterModel` | Sets the filter model programmatically. | Methods | ✅ |
| `setPagerMessage` | Sets a message in the pager. | Methods | ✅ |
| `setRowData` | Updates the data for a specific row. | Methods | ✅ |
| `showSpinner` | Shows the loading spinner. | Methods | ✅ |
| `sortByColumn` | Sorts the table by a specific column. | Methods | ✅ |
| `updateRecord` | Updates an existing record. | Methods | ✅ |
| `validateEditForm` | Validates the current edit form. | Methods | ✅ |
| `validateField` | Validates a specific field. | Methods | ✅ |

---

## EzScheduler

**Description**: EzScheduler is a comprehensive event management and resource scheduling engine. It provides a fluid user experience for managing complex schedules across  various view modes with full drag-and-drop and resizing support.  ### Visual Preview ![EzScheduler](media/ezscheduler.png)  ### Key Features - **Multi-View System**: Switch between Day, Week, Work Week, Month, and various Timeline views. - **Resource Management**: Group events by resources (people, rooms, equipment) with dedicated lanes. - **Interactive Editing**: Intuitive drag-and-drop event movement, resizing, and double-click creation. - **Intelligent Overlap**: Customizable overlap detection and blocking for intervals like lunch breaks. - **Quick Info & Editor**: Built-in popovers for quick summaries and a full modal for detailed editing. - **Virtualization**: Efficient rendering of large resource lists and event densities.  ### Minimal Example ```tsx <EzScheduler   events={myEvents}   view="Week"   onEventChange={(event) => updateEvent(event)} /> ```  ### Resource Grouping Example ```tsx <EzScheduler   resources={[     { id: '1', name: 'Meeting Room A', color: '#e11d48' },     { id: '2', name: 'Meeting Room B', color: '#2563eb' }   ]}   events={events}   view="TimelineDay"   onEventCreate={(event) => createNewMeeting(event)} /> ```

**Group**: Core Components

### Props Interface: `EzSchedulerProps`

#### Members

| Name | Description | Group | Status |
| :--- | :--- | :--- | :--- |
| `actionBegin` | Callback when an action begins (Syncfusion compat). | Events | ✅ |
| `actionComplete` | Callback when an action completes (Syncfusion compat). | Events | ✅ |
| `actionFailure` | Callback when an action fails (Syncfusion compat). | Events | ✅ |
| `agendaDaysCount` | - | Properties | ❌ Missing Description |
| `allowClipboard` | - | Properties | ❌ Missing Description |
| `allowInline` | - | Properties | ❌ Missing Description |
| `allowMultiCellSelection` | Allow selecting multiple cells. | Properties | ✅ |
| `allowMultiDrag` | Allow dragging multiple events. | Properties | ✅ |
| `allowMultiRowSelection` | Allow selecting multiple rows. | Properties | ✅ |
| `allowPastEvents` | Allow past events modification. | Properties | ✅ |
| `allowSwiping` | Allow touch swiping to navigate views. | Properties | ✅ |
| `beforePaste` | Callback before pasting. | Events | ✅ |
| `beforePrint` | Callback before printing. | Events | ✅ |
| `calendarMode` | - | Properties | ❌ Missing Description |
| `cell` | Template for cell content. | Templates | ✅ |
| `cellClick` | Callback when a cell is clicked (Syncfusion compat). | Events | ✅ |
| `cellDoubleClick` | Callback when a cell is double-clicked (Syncfusion compat). | Events | ✅ |
| `cellHeaderTemplate` | - | Properties | ❌ Missing Description |
| `className` | Custom class names for styling | Properties | ✅ |
| `components` | - | - | ❌ Missing Description, Missing @group |
| `created` | Callback when component is created. | Events | ✅ |
| `cssClass` | - | Properties | ❌ Missing Description |
| `currentTimeIndicator` | Show current time indicator. | Properties | ✅ |
| `dataBinding` | Callback during data binding. | Events | ✅ |
| `dataBound` | Callback when data is bound. | Events | ✅ |
| `dataTestId` | Data attribute for testing | Properties | ✅ |
| `dateFormat` | Date format for headers and tooltips. | Properties | ✅ |
| `dateHeader` | - | Properties | ❌ Missing Description |
| `dateRangeTemplate` | - | Properties | ❌ Missing Description |
| `dayHeaderTemplate` | - | Properties | ❌ Missing Description |
| `debugVirtualization` | Debugging for virtualization. | Properties | ✅ |
| `defaultSelectedDate` | - | - | ❌ Missing Description, Missing @group |
| `defaultView` | - | - | ❌ Missing Description, Missing @group |
| `destroyed` | Callback when component is destroyed. | Events | ✅ |
| `dir` | Direction of the text (ltr, rtl, auto) | Properties | ✅ |
| `drag` | Callback during dragging. | Events | ✅ |
| `dragStart` | Callback when dragging starts. | Events | ✅ |
| `dragStop` | Callback when dragging stops. | Events | ✅ |
| `editorFooterTemplate` | Template for editor footer. | Templates | ✅ |
| `editorHeaderTemplate` | Template for editor header. | Templates | ✅ |
| `editorTemplate` | Template for editor content. | Templates | ✅ |
| `enableAdaptiveUI` | Enable adaptive UI for mobile devices. | Properties | ✅ |
| `enableAllDayScroll` | Enable scrolling for the All Day row. | Properties | ✅ |
| `enableHtmlSanitizer` | Enable HTML sanitizer for templates. | Properties | ✅ |
| `enablePersistence` | - | Properties | ❌ Missing Description |
| `enableRecurrenceValidation` | - | Properties | ❌ Missing Description |
| `enableRtl` | Enable RTL (Right-to-Left) text direction. | Properties | ✅ |
| `endHour` | - | Properties | ❌ Missing Description |
| `eventClick` | Callback when an event is clicked (Syncfusion compat). | Events | ✅ |
| `eventDoubleClick` | Callback when an event is double-clicked (Syncfusion compat). | Events | ✅ |
| `eventDrag` | Allow event dragging. | Properties | ✅ |
| `eventDragArea` | CSS class for event drag area. | Properties | ✅ |
| `eventOverlap` | Allow overlapping events to be displayed. | Properties | ✅ |
| `eventRendered` | Callback when event is rendered. | Events | ✅ |
| `eventResize` | Allow event resizing. | Properties | ✅ |
| `events` | - | - | ❌ Missing Description, Missing @group |
| `eventSettings` | - | Properties | ❌ Missing Description |
| `excelExport` | Callback during excel export. | Events | ✅ |
| `firstDayOfWeek` | - | Properties | ❌ Missing Description |
| `firstMonthOfYear` | - | Properties | ❌ Missing Description |
| `group` | Configuration for grouping resources. | Properties | ✅ |
| `headerIndentTemplate` | Template for header indentation. | Properties | ✅ |
| `headerRows` | Custom header rows configuration. | Properties | ✅ |
| `height` | Height of the scheduler. | Properties | ✅ |
| `hideEmptyAgendaDays` | Hide days with no events in Agenda view. | Properties | ✅ |
| `hover` | Callback on hover. | Events | ✅ |
| `id` | Unique identifier for the component instance | Properties | ✅ |
| `is24Hour` | Use 24-hour format. | Properties | ✅ |
| `isAllDay` | Whether the current view is All Day. | Properties | ✅ |
| `isLoading` | Whether the scheduler is loading data. | Properties | ✅ |
| `keyboardNavigation` | Allow keyboard navigation. | Properties | ✅ |
| `locale` | Locale for the scheduler. | Properties | ✅ |
| `maxDate` | Maximum date navigable. | Properties | ✅ |
| `minDate` | Minimum date navigable. | Properties | ✅ |
| `monthHeaderTemplate` | Template for month view headers. | Properties | ✅ |
| `monthsCount` | Number of months to display in year/month views. | Properties | ✅ |
| `moreEventsClick` | Callback when "more events" is clicked. | Events | ✅ |
| `navigating` | Callback during navigation. | Events | ✅ |
| `onCellClick` | Callback when a cell is clicked. | Events | ✅ |
| `onCellContextMenu` | Callback when a cell is right-clicked. | Events | ✅ |
| `onCellDoubleClick` | Callback when a cell is double-clicked. | Events | ✅ |
| `onDateChange` | Callback when the date changes. | Events | ✅ |
| `onEventChange` | Callback when an event is changed. | Events | ✅ |
| `onEventClick` | Callback when an event is clicked. | Events | ✅ |
| `onEventCreate` | Callback when an event is created. | Events | ✅ |
| `onEventDelete` | Callback when an event is deleted. | Events | ✅ |
| `onEventDoubleClick` | Callback when an event is double-clicked. | Events | ✅ |
| `onEventOverlap` | Callback when events overlap. | Events | ✅ |
| `onExportCSV` | Export to CSV callback. | Events | ✅ |
| `onExportExcel` | Export to Excel callback. | Events | ✅ |
| `onExportICS` | Export to ICS callback. | Events | ✅ |
| `onSlotDurationChange` | Callback when the slot duration changes. | Events | ✅ |
| `onViewChange` | Callback when the view changes. | Events | ✅ |
| `overscanCount` | Number of items to render outside visible area. | Properties | ✅ |
| `popupClose` | Callback when a popup closes. | Events | ✅ |
| `popupOpen` | Callback when a popup opens. | Events | ✅ |
| `prefetchDistance` | Distance in items to prefetch. | Properties | ✅ |
| `progressiveRendering` | Progressive rendering for large datasets. | Properties | ✅ |
| `quickInfoOnSelectionEnd` | Show quick info popup on selection end. | Properties | ✅ |
| `quickInfoTemplates` | Templates for quick info popup. | Templates | ✅ |
| `readOnly` | Enable read-only mode. | Properties | ✅ |
| `recurrenceEngine` | Recurrence engine instance. | Properties | ✅ |
| `renderCell` | Callback when a cell is rendered. | Events | ✅ |
| `resizeStart` | Callback when resizing starts. | Events | ✅ |
| `resizeStop` | Callback when resizing stops. | Events | ✅ |
| `resizing` | Callback during resizing. | Events | ✅ |
| `resourceHeaderTemplate` | Template for resource headers. | Properties | ✅ |
| `resources` | Resources data. | Properties | ✅ |
| `rowAutoHeight` | Auto-adjust row height based on content. | Properties | ✅ |
| `select` | Callback when selection changes. | Events | ✅ |
| `selectedDate` | The currently selected date. | Properties | ✅ |
| `serviceRegistry` | The shared service registry instance. This is required to access shared services like HierarchyService, FocusManagerService, etc. | Services | ✅ |
| `showHeaderBar` | Show the header bar. | Properties | ✅ |
| `showQuickInfoPopup` | Show quick info popup on click. | Properties | ✅ |
| `showResourceHeaders` | Show resource headers. | Properties | ✅ |
| `showResourcesInDayView` | - | - | ❌ Missing Description, Missing @group |
| `showTimeIndicator` | Show current time indicator. | Properties | ✅ |
| `showUnassignedLane` | - | - | ❌ Missing Description, Missing @group |
| `showWeekend` | Show weekends. | Properties | ✅ |
| `showWeekNumber` | Show week numbers. | Properties | ✅ |
| `slotDuration` | Duration of a time slot in minutes. | Properties | ✅ |
| `slotHeight` | Height of a time slot in pixels. | Properties | ✅ |
| `startHour` | Start hour of the scheduler (e.g., '08:00'). | Properties | ✅ |
| `style` | Inline styles | Properties | ✅ |
| `timeFormat` | Time format (e.g., 'HH:mm'). | Properties | ✅ |
| `timeScale` | Time scale configuration. | Properties | ✅ |
| `timezone` | Timezone of the scheduler. | Properties | ✅ |
| `timezoneDataSource` | Timezone data source. | Properties | ✅ |
| `toolbarItems` | Toolbar items configuration. | Properties | ✅ |
| `tooltipOpen` | Callback when tooltip opens. | Events | ✅ |
| `view` | The initial view to display. | Properties | ✅ |
| `views` | Available views configuration. | Properties | ✅ |
| `virtualScrollStart` | Callback when virtual scroll starts. | Events | ✅ |
| `virtualScrollStop` | Callback when virtual scroll stops. | Events | ✅ |
| `weekRule` | Week start rule. | Properties | ✅ |
| `width` | Width of the scheduler. | Properties | ✅ |
| `workDays` | Working days (0=Sun, 1=Mon, etc.). | Properties | ✅ |
| `workHours` | Working hours configuration. | Properties | ✅ |

### Ref Interface: `EzSchedulerRef`

#### Methods

| Name | Description | Group | Status |
| :--- | :--- | :--- | :--- |
| `addEvent` | Add a new event. | Methods | ✅ |
| `addResource` | Add a new resource. | Methods | ✅ |
| `changeView` | Change the current view. | Methods | ✅ |
| `closeEditor` | Close the event editor. | Methods | ✅ |
| `closeQuickInfoPopup` | Close the quick info popup. | Methods | ✅ |
| `currentView` | The current view mode. | Properties | ✅ |
| `deleteEvent` | Delete an event by ID. | Methods | ✅ |
| `destroy` | Destroy the component instance. | Methods | ✅ |
| `exportToCsv` | Export to CSV. | Methods | ✅ |
| `exportToExcel` | Export to Excel. | Methods | ✅ |
| `getData` | Get all events. | Methods | ✅ |
| `getEvents` | Get all events. | Methods | ✅ |
| `getEventsInDateRange` | Get events in a specific date range. | Methods | ✅ |
| `hideSpinner` | Hide the loading spinner. | Methods | ✅ |
| `next` | Navigate to the next date range. | Methods | ✅ |
| `openEditor` | Open the event editor. | Methods | ✅ |
| `prev` | Navigate to the previous date range. | Methods | ✅ |
| `print` | Print the scheduler. | Methods | ✅ |
| `refresh` | Refresh the scheduler layout. | Methods | ✅ |
| `removeResource` | Remove a resource by ID. | Methods | ✅ |
| `saveEvent` | Save an existing or new event. | Methods | ✅ |
| `scrollTo` | Scroll to a specific time. | Methods | ✅ |
| `scrollToIndex` | Scroll to a specific row index. | Methods | ✅ |
| `scrollToTime` | Scroll to a specific time (legacy). | Methods | ✅ |
| `showSpinner` | Show the loading spinner. | Methods | ✅ |
| `today` | Navigate to today. | Methods | ✅ |

---

## EzKanban

**Description**: EzKanban is a powerful, flexible board management system designed for  agile workflows and task visualization. It features a robust drag-and-drop  engine and supports multiple viewing modes.  ### Visual Preview ![EzKanban](media/ezkanban.png)  ### Key Features - **Modular Architecture**: Built on `@dnd-kit` for performant and accessible drag-and-drop. - **Multi-View Engine**: Switch between `standard` (basic columns), `swimlane` (grouped by team/priority), and `timeline` views. - **Dynamic Columns**: Support for collapsible columns, WIP limits, and custom header rendering. - **Enterprise Editing**: Integrated card editor modal with support for custom field extensions. - **Change Tracking**: Built-in undo/redo stack for all board operations. - **Extensibility**: Inversion of Control (IoC) via custom renderers for cards, headers, and editors.  ### Minimal Example ```tsx import { EzKanban } from 'ezux';  function TaskBoard() {   return (     <EzKanban       board={initialBoardData}       onBoardChange={(newBoard) => saveBoard(newBoard)}     />   ); } ```  ### Advanced Config: Swimlanes & Timeline ```tsx <EzKanban   board={engineeringBoard}   view="swimlane"   swimlaneSettings={{ collapsible: true }}   onCardDoubleClick={(card) => openDetails(card)} /> ```

**Group**: Core Components

### Props Interface: `EzKanbanProps`

#### Members

| Name | Description | Group | Status |
| :--- | :--- | :--- | :--- |
| `allowDragAndDrop` | Allow drag and drop. | Properties | ✅ |
| `allowMultiSelect` | Allow selecting multiple cards. | Properties | ✅ |
| `ariaConfig` | Accessibility configuration. | Accessibility | ✅ |
| `board` | The board data object. | Properties | ✅ |
| `cardClassName` | Function to determine card class names. | Properties | ✅ |
| `className` | Custom class names. | Properties | ✅ |
| `columnSettings` | Configuration for columns. | Enterprise | ✅ |
| `confirmOnDelete` | Confirm before deleting items. | Properties | ✅ |
| `customRenderers` | Custom renderers for various board elements. | Extensibility | ✅ |
| `dialogSettings` | Configuration for dialogs (editor, confirmation). | Enterprise | ✅ |
| `dragSettings` | Configuration for drag and drop behavior. | Enterprise | ✅ |
| `enableTooltip` | Enable tooltips for cards. | Properties | ✅ |
| `keyboardNavigation` | Enable keyboard navigation. | Accessibility | ✅ |
| `locale` | Locale for the board. | Properties | ✅ |
| `onBeforeCardRender` | Callback before card render. | Events | ✅ |
| `onBoardChange` | Callback when the board state changes. | Events | ✅ |
| `onCardClick` | Callback when a card is clicked. | Events | ✅ |
| `onCardCreate` | Callback when a new card is being created. | Events | ✅ |
| `onCardDelete` | Callback when a card is deleted. | Events | ✅ |
| `onCardDoubleClick` | Callback when a card is double-clicked. | Events | ✅ |
| `onCardDragEnter` | Callback when card enters a column. | Events | ✅ |
| `onCardDragLeave` | Callback when card leaves a column. | Events | ✅ |
| `onCardDragStart` | Callback when card drag starts. | Events | ✅ |
| `onCardDragStop` | Callback when card drag stops. | Events | ✅ |
| `onCardSelect` | Callback when cards are selected. | Events | ✅ |
| `onCardUpdate` | Callback when a card is updated. | Events | ✅ |
| `onColumnCreate` | Callback when a column is created. | Events | ✅ |
| `onColumnDelete` | Callback when a column is deleted. | Events | ✅ |
| `onColumnUpdate` | Callback when a column is updated. | Events | ✅ |
| `onSwimlaneCreate` | Callback when a swimlane is created. | Events | ✅ |
| `onSwimlaneDelete` | Callback when a swimlane is deleted. | Events | ✅ |
| `onSwimlaneToggle` | Callback when swimlane toggle. | Events | ✅ |
| `onSwimlaneUpdate` | Callback when a swimlane is updated. | Events | ✅ |
| `permissions` | User permissions config. | Properties | ✅ |
| `plugins` | List of plugins to enhance functionality. | Extensibility | ✅ |
| `readOnly` | Enable read-only mode. | Properties | ✅ |
| `rtl` | Enable RTL layout. | Properties | ✅ |
| `serviceRegistry` | The shared service registry instance. | Services | ✅ |
| `swimlaneSettings` | Configuration for swimlanes. | Enterprise | ✅ |
| `theme` | Color theme. | Properties | ✅ |
| `tooltipTemplate` | Template for card tooltips. | Templates | ✅ |
| `view` | The current view mode. | Properties | ✅ |
| `virtualizationThreshold` | Threshold for virtualization. | Performance | ✅ |
| `wipStrict` | Enforce strict WIP limits. | Properties | ✅ |

### Ref Interface: `EzKanbanRef`

#### Methods

| Name | Description | Group | Status |
| :--- | :--- | :--- | :--- |
| `addCard` | - | - | ❌ Missing Description, Missing @group |
| `addColumn` | - | - | ❌ Missing Description, Missing @group |
| `addSwimlane` | - | - | ❌ Missing Description, Missing @group |
| `archiveCard` | - | - | ❌ Missing Description, Missing @group |
| `clearFilters` | - | - | ❌ Missing Description, Missing @group |
| `collapseColumn` | - | - | ❌ Missing Description, Missing @group |
| `collapseSwimlane` | - | - | ❌ Missing Description, Missing @group |
| `deleteCard` | - | - | ❌ Missing Description, Missing @group |
| `deleteColumn` | - | - | ❌ Missing Description, Missing @group |
| `deleteSwimlane` | - | - | ❌ Missing Description, Missing @group |
| `deselectAllCards` | - | - | ❌ Missing Description, Missing @group |
| `deselectCard` | - | - | ❌ Missing Description, Missing @group |
| `duplicateCard` | - | - | ❌ Missing Description, Missing @group |
| `expandColumn` | - | - | ❌ Missing Description, Missing @group |
| `expandSwimlane` | - | - | ❌ Missing Description, Missing @group |
| `focusCard` | - | - | ❌ Missing Description, Missing @group |
| `forceUpdate` | - | - | ❌ Missing Description, Missing @group |
| `getActiveFilters` | - | - | ❌ Missing Description, Missing @group |
| `getBoard` | - | - | ❌ Missing Description, Missing @group |
| `getCard` | - | - | ❌ Missing Description, Missing @group |
| `getCards` | - | - | ❌ Missing Description, Missing @group |
| `getCardsInColumn` | - | - | ❌ Missing Description, Missing @group |
| `getColumn` | - | - | ❌ Missing Description, Missing @group |
| `getColumns` | - | - | ❌ Missing Description, Missing @group |
| `getFilteredCards` | - | - | ❌ Missing Description, Missing @group |
| `getOrderedCards` | - | - | ❌ Missing Description, Missing @group |
| `getSearchQuery` | - | - | ❌ Missing Description, Missing @group |
| `getSelectedCards` | - | - | ❌ Missing Description, Missing @group |
| `getStatistics` | - | - | ❌ Missing Description, Missing @group |
| `getSwimlane` | - | - | ❌ Missing Description, Missing @group |
| `getSwimlanes` | - | - | ❌ Missing Description, Missing @group |
| `getView` | - | - | ❌ Missing Description, Missing @group |
| `hideSpinner` | - | - | ❌ Missing Description, Missing @group |
| `highlightCard` | - | - | ❌ Missing Description, Missing @group |
| `moveCard` | - | - | ❌ Missing Description, Missing @group |
| `refresh` | - | - | ❌ Missing Description, Missing @group |
| `reorderColumns` | - | - | ❌ Missing Description, Missing @group |
| `reorderSwimlanes` | - | - | ❌ Missing Description, Missing @group |
| `reset` | - | - | ❌ Missing Description, Missing @group |
| `restoreCard` | - | - | ❌ Missing Description, Missing @group |
| `scrollToCard` | - | - | ❌ Missing Description, Missing @group |
| `scrollToColumn` | - | - | ❌ Missing Description, Missing @group |
| `selectCard` | - | - | ❌ Missing Description, Missing @group |
| `selectCards` | - | - | ❌ Missing Description, Missing @group |
| `setActiveFilters` | - | - | ❌ Missing Description, Missing @group |
| `setBoard` | - | - | ❌ Missing Description, Missing @group |
| `setSearchQuery` | - | - | ❌ Missing Description, Missing @group |
| `setView` | - | - | ❌ Missing Description, Missing @group |
| `showSpinner` | - | - | ❌ Missing Description, Missing @group |
| `updateCard` | - | - | ❌ Missing Description, Missing @group |
| `updateColumn` | - | - | ❌ Missing Description, Missing @group |
| `updateSwimlane` | - | - | ❌ Missing Description, Missing @group |
| `validate` | - | - | ❌ Missing Description, Missing @group |

---

## EzLayout

**Description**: EzLayout is the foundational layout engine for ezUX applications. It provides a highly configurable and responsive shell that handles authentication, headers, sidebars, and enterprise-grade multi-panel layouts.  ### Visual Preview ![EzLayout](media/ezlayout.png)

**Group**: Core Components

⚠️ **Props Interface `EzLayoutProps` not found or empty.**

---

## EzTreeView

**Description**: EzTreeView is a high-performance hierarchical data explorer. It uses a virtualized engine to efficiently render trees with thousands of  nodes while providing rich interactive features like drag-and-drop and  multi-level selection.  ### Visual Preview ![EzTreeView](media/eztreeview.png)  ### Key Features - **Superior Virtualization**: Flat-list virtualization for smooth scrolling even with deep, expanded trees. - **Flexible Selection**: Supports `single`, `multiple`, and `checkbox` selection modes with indeterminate state support. - **Drag & Drop**: Native `@dnd-kit` integration for reordering nodes and changing parent-child relationships. - **Inline Editing**: Double-click to rename nodes with built-in validation. - **Search & Filter**: Real-time filtering with automatic expansion of matching parent nodes. - **Custom Rendering**: Fully customizable node templates and icons via the `components` prop.  ### Minimal Example ```tsx <EzTreeView   data={myTreeData}   showCheckboxes   onNodeClicked={(node) => console.log('Clicked:', node.text)} /> ```  ### Advanced Config: Virtualization & DND ```tsx <EzTreeView   data={largeTreeData}   allowDragAndDrop   allowEditing   onNodeDrop={(dragged, target, position) => handleMove(dragged, target, position)}   className="h-[400px] border rounded-md" /> ```

**Group**: Core Components

### Props Interface: `EzTreeViewProps`

#### Members

| Name | Description | Group | Status |
| :--- | :--- | :--- | :--- |
| `allowDragAndDrop` | Allow drag and drop. | Properties | ✅ |
| `allowEditing` | Enable inline editing. | Properties | ✅ |
| `allowMultiSelection` | Allow selecting multiple nodes. | Properties | ✅ |
| `allowTextWrap` | Allow text wrapping. | Properties | ✅ |
| `animation` | Animation configuration. | Properties | ✅ |
| `apiRef` | Ref for imperative API. | Properties | ✅ |
| `autoCheck` | Auto check children when parent is checked. | Properties | ✅ |
| `checkDisabledChildren` | Allow checking disabled children. | Properties | ✅ |
| `checkedNodes` | Controlled checked nodes. | Properties | ✅ |
| `checkOnClick` | Check checkbox on node click. | Properties | ✅ |
| `className` | Custom class names for styling | Properties | ✅ |
| `components` | Custom subcomponents (Slots) to override default rendering.  Allows fully custom rendering of nodes, icons, and checkboxes. | Subcomponents | ✅ |
| `config` | Advanced configuration options. | Properties | ✅ |
| `data` | The tree data. | Properties | ✅ |
| `dataTestId` | Data attribute for testing | Properties | ✅ |
| `dir` | Direction of the text (ltr, rtl, auto) | Properties | ✅ |
| `expandedNodes` | Controlled expanded nodes. | Properties | ✅ |
| `fields` | Custom field mapping. | Properties | ✅ |
| `fullRowNavigable` | Enable full row navigation. | Properties | ✅ |
| `fullRowSelect` | Enable full row selection. | Properties | ✅ |
| `id` | Unique identifier for the component instance | Properties | ✅ |
| `onActionFailure` | Callback on action failure. | Events | ✅ |
| `onCheckedChange` | Callback on node check state change. | Events | ✅ |
| `onCreated` | Callback on component creation. | Events | ✅ |
| `onDataBound` | Callback on data binding. | Events | ✅ |
| `onDataSourceChanged` | Callback on data source change. | Events | ✅ |
| `onDestroyed` | Callback on component destruction. | Events | ✅ |
| `onDrawNode` | Callback before rendering a node. | Events | ✅ |
| `onKeyPress` | Callback on key press. | Events | ✅ |
| `onLoadChildren` | Callback when children need to be loaded. | Events | ✅ |
| `onNodeChecked` | Callback when a node is checked. | Events | ✅ |
| `onNodeChecking` | Callback when checking a node (cancellable). | Events | ✅ |
| `onNodeClicked` | Callback when a node is clicked. | Events | ✅ |
| `onNodeCollapsed` | Callback when a node is collapsed. | Events | ✅ |
| `onNodeCollapsing` | Callback when collapsing a node (cancellable). | Events | ✅ |
| `onNodeDragging` | Callback while dragging a node. | Events | ✅ |
| `onNodeDragStart` | Callback when dragging of a node starts (cancellable). | Events | ✅ |
| `onNodeDragStop` | Callback when dragging of a node stops. | Events | ✅ |
| `onNodeDrop` | Callback when a node is dropped. | Events | ✅ |
| `onNodeEditing` | Callback when starting to edit a node (cancellable). | Events | ✅ |
| `onNodeExpand` | Callback on node expansion. | Events | ✅ |
| `onNodeExpanded` | Callback when a node has been extended. | Events | ✅ |
| `onNodeExpanding` | Callback when extending a node (cancellable). | Events | ✅ |
| `onNodeRename` | Callback when a node label is edited. | Events | ✅ |
| `onNodeSelected` | Callback when a node is selected. | Events | ✅ |
| `onNodeSelecting` | Callback when selecting a node (cancellable). | Events | ✅ |
| `onSelectionChange` | Callback on node selection. | Events | ✅ |
| `searchTerm` | Search term for filtering. | Properties | ✅ |
| `selectedNodes` | Controlled selected nodes. | Properties | ✅ |
| `selectionMode` | Selection mode. | Properties | ✅ |
| `service` | Data service instance. | Services | ✅ |
| `serviceName` | Name of the service to look up. | Services | ✅ |
| `serviceRegistry` | The shared service registry instance. This is required to access shared services like HierarchyService, FocusManagerService, etc. | Services | ✅ |
| `showCheckboxes` | Show checkboxes for tri-state selection. | Properties | ✅ |
| `sortOrder` | Sorting order. | Properties | ✅ |
| `style` | Inline styles | Properties | ✅ |

---

## EzSignature

**Description**: EzSignature is a high-fidelity digital ink and signature capture engine. It provides a smooth, pressure-sensitive drawing experience using SVG  and perfect-freehand algorithms, suitable for legal and formal validations.  ### Visual Preview ![EzSignature](media/ezsignature.png)  ### Key Features - **Natural Ink Flow**: Advanced smoothing and streamlining for professional-looking signatures. - **Pressure Sensitivity**: Dynamically adjusts stroke width based on pointer pressure. - **Multi-Format Export**: Save signatures as high-resolution `PNG`, `JPEG`, or vector `SVG`. - **Vector Persistence**: Stores signatures as geometric point data for lossless scaling and reproduction. - **Undo/Redo Stack**: Full transactional history for correcting mistakes during capture. - **Theme Aware**: Automatically adjusts stroke colors based on active theme or custom palettes.  ### Minimal Example ```tsx <EzSignature   width={400}   height={200}   onSave={(dataUrl) => submitSignature(dataUrl)} /> ```  ### Imperative Control ```tsx const sigRef = useRef<EzSignatureRef>(null);  return (   <>     <EzSignature ref={sigRef} />     <button onClick={() => sigRef.current?.clear()}>Clear</button>     <button onClick={() => sigRef.current?.save('png')}>Download</button>   </> ); ```

**Group**: Core Components

### Props Interface: `EzSignatureProps`

#### Members

| Name | Description | Group | Status |
| :--- | :--- | :--- | :--- |
| `backgroundColor` | Background color of the signature pad. | Properties | ✅ |
| `disabled` | Disabled mode. | Properties | ✅ |
| `height` | Height of the signature canvas. | Properties | ✅ |
| `maxStrokeWidth` | Maximum stroke width. | Properties | ✅ |
| `minStrokeWidth` | Minimum stroke width. | Properties | ✅ |
| `onChange` | Callback when signature changes (after each stroke). | Events | ✅ |
| `onCreated` | Callback when component is created. | Events | ✅ |
| `onDataChange` | Callback when data changes. | Events | ✅ |
| `onDataChangeCancel` | Callback when data change is cancelled. | Events | ✅ |
| `onDataChangeComplete` | Callback when data change completes. | Events | ✅ |
| `onDataChangeRequest` | Callback when data change is requested. | Events | ✅ |
| `onDataChangeStart` | Callback when data change starts. | Events | ✅ |
| `onDataLoad` | Callback when data loads. | Events | ✅ |
| `onDataRequest` | Callback when data is requested. | Events | ✅ |
| `onDestroyed` | Callback when component is destroyed. | Events | ✅ |
| `onEnd` | Callback when signature stroke ends. | Events | ✅ |
| `onError` | Callback on error. | Events | ✅ |
| `onGridRenderComplete` | Callback when grid/component render completes. | Events | ✅ |
| `onGridRenderStart` | Callback when grid/component render starts. | Events | ✅ |
| `onRefresh` | Callback on refresh. | Events | ✅ |
| `onSave` | Callback when signature is saved. | Events | ✅ |
| `readOnly` | Read only mode. | Properties | ✅ |
| `serviceRegistry` | The shared service registry instance. | Services | ✅ |
| `smoothing` | Factor to smooth the stroke. | Properties | ✅ |
| `strokeColor` | Stroke color of the signature. | Properties | ✅ |
| `thinning` | Effect of pressure on the stroke's size. | Properties | ✅ |
| `width` | Width of the signature canvas. | Properties | ✅ |

### Ref Interface: `EzSignatureRef`

#### Methods

| Name | Description | Group | Status |
| :--- | :--- | :--- | :--- |
| `canRedo` | Checks if redo is possible. | Methods | ✅ |
| `canUndo` | Checks if undo is possible. | Methods | ✅ |
| `clear` | Clears the signature pad. | Methods | ✅ |
| `getSignature` | Returns the geometric data of the signature. | Methods | ✅ |
| `isEmpty` | Checks if signature is empty. | Methods | ✅ |
| `load` | Loads a signature from a JSON string of points or Base64 (if supported). Currently supports loading array of Point arrays. | Methods | ✅ |
| `redo` | Redoes the last undone stroke. | Methods | ✅ |
| `save` | Saves the signature to a Base64 string. | Methods | ✅ |
| `undo` | Undoes the last stroke. | Methods | ✅ |

---

## AnimatedText

**Description**: ❌ Missing

**Group**: Core Components

### Props Interface: `AnimatedTextProps`

#### Members

| Name | Description | Group | Status |
| :--- | :--- | :--- | :--- |
| `className` | Custom class names for styling. | Properties | ✅ |
| `defaultColor` | Default text color. | Properties | ✅ |
| `delay` | Animation delay. | Properties | ✅ |
| `highlight` | Text to highlight (will use primary color and wobble effect). | Properties | ✅ |
| `text` | The text content to animate. | Properties | ✅ |

---

