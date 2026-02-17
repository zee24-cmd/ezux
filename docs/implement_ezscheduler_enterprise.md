---
description: Implementation plan for EzScheduler Enterprise features
---
# EzScheduler Enterprise Implementation Workflow

This workflow outlines the step-by-step implementation of Enterprise Multi-Resource Orchestration features for EzScheduler.

## Phase 1: Visual Hierarchy & Grouping (Active)
- [x] **Resource Columns in Day/Week Views**: Implement `showResourcesInDayView` prop.
    - Status: Completed in `DayWeekView.tsx`.
- [ ] **Sticky Resource Headers**: Ensure resource headers remain visible during scroll in Timeline view.
- [ ] **Visual Dividers**: Add Zebra striping for resource rows/columns to improve readability.

## Phase 2: Enhanced Resource Management
- [ ] **Resource Availability Shading**:
    - Add `isAvailable` or `workingHours` check in `DayWeekView` and `TimelineView`.
    - visual indication (grayed out background) for non-working hours.
- [ ] **Resource Filtering**:
    - Update `EzResourceSidebar` to include a search input.
    - Implement filtering logic to hide unchecked resources from the view.

## Phase 3: Advanced UX & Interaction
- [ ] **Unassigned Lane**:
    - create a new droppable zone for "Unassigned" events (Global Inbox).
    - allow dragging events out of the scheduler grid into this lane.
- [ ] **Direct Drag-between-Resources**:
    - Verify and refine drag-and-drop logic for changing `resourceId`.
    - Ensure visual feedback highlights the target resource clearly.

## Phase 4: Performance
- [ ] **Bidirectional Virtualization**:
    - Investigate grid virtualization for Timeline view if resource count > 50.
    - Currently relying on `react-window` or `tanstack-virtual` for row virtualization.

## Execution Steps

### Step 1: Resource Availability Shading
1. Modify `EzScheduler.types.ts` to ensure `Resource` has `workingHours`.
2. Update `DayWeekView.tsx` to render unavailable slots with a specific background class.

### Step 2: Resource Search Sidebar
1. Edit `EzResourceSidebar`.
2. Add a search input field.
3. Filter the list of resources based on the search term.

### Step 3: Verify Drag & Drop
1. Manual verification or browser test to ensure dragging across resource columns updates the `resourceId` correctly.

