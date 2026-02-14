# EzLayout: Component-Based Architecture (Architectural Revision)
1. Modular Component Infrastructure
EzLayout is composed of five core functional blocks. Each is "Logic-Light" and "Prop-Heavy," deferring business logic to the consuming project while utilizing shared services for UI states.

🏛 The Layout Header
Role: Manages branding, global search, and utility actions.

Service Integration: Connects to the NotificationService and i18nService from the shared layer to update the badge count and language labels in real-time.

Configurability: Support for custom slots (Start, Center, End) for project-specific tools like environment switchers or help menus.

🗄 The Navigation Sidebar
Role: Hierarchical navigation with collapsible states.

Service Integration: Uses the HierarchyService (shared with EzTreeView) to manage recursive navigation states and parent-child active highlights.

Responsiveness: Uses Tailwind 4 Container Queries to automatically collapse into a mobile drawer based on its container's width.

📄 Main Content Area
Role: Primary viewport for application content.

Service Integration: Utilizes the SharedBaseService to handle internal scrolling and "Skip-to-Content" accessibility hooks.

Performance: Implements React 19 useTransition for zero-jank route transitions between content views.

🦶 Layout Footer
Role: Persistent metadata, legal links, and status indicators.

Configurability: Fully prop-driven slots for copyright text, social links, and system status pings (e.g., "All Systems Operational").

🔐 Auth Shells (Sign-In & Sign-Up)
Role: UI-only templates for authentication flows.

Logic Isolation: These are strictly Presenter Components. All form handling, validation logic, and API calls are provided by the consuming project via render props or slots.

Modern UX: Includes pre-built layouts for "Split Screen" (Image/Form) or "Centered Card" designs using Tailwind 4's optimized utilities.

hase 2: The Designer (UX & Physics)
Implement "ezUX" layout transitions using Tailwind 4 logical properties for seamless RTL mirroring.

Design responsive skeleton states for the content area during route changes.

Phase 3: The Coder (Execution)
Build the full-viewport grid using React 19 useId for accessible landmarks.

Implement the Command Palette as a standalone service to ensure high-speed search indexing.

Phase 4: The Tester (A11y & Performance)
Audit WAI-ARIA Landmark compliance (header, main, nav, aside).

Verify sub-16ms interaction times for sidebar toggling across mobile and desktop viewports.

### 🔌 Inversion of Control (IoC) - Service Registry
EzLayout uses an **Inversion of Control (IoC)** pattern via a centralized `ServiceRegistry`. This ensures that the layout component remains "dumb" regarding specific service implementations while still having access to global functionality.

| Shared Service | Pattern | Purpose in Layout Components |
| :--- | :--- | :--- |
| **FocusManagerService** | IoC / Injection | Manages focus traps for the Sign-In modal and Mobile Sidebar. |
| **SharedBaseService** | Observer | Provides the observer pattern for syncing theme changes across Header and Main Content. |
| **ServiceEventEmitter** | Pub/Sub | Bubbles up "Sign-In Clicked" or "Logout" events to the consuming project. |
| **LayoutService** | Shared State | Manages the 100vh viewport math and sidebar persistence. |
| **ThemeService** | Global Config | Manages themes (Light/Dark/System) and dynamic color injection. |
| **NotificationService** | Message Bus | Centralized message bus for application-wide toasts and alerts. |

export interface EzLayoutProps {
  // Sub-Component Injections
  components?: {
    header?: React.ReactNode;
    sidebar?: React.ReactNode;
    footer?: React.ReactNode;
  };
  
  // Auth Shell Configurations (UI Only)
  authConfig?: {
    signInSlot?: React.ReactNode; // Optional: Consuming project provides the form logic
    signUpSlot?: React.ReactNode;
    backgroundMedia?: React.ReactNode;
  };

  // Shared Library Integration
  serviceRegistry: ServiceRegistry; // Required to prevent redundant service instances
  
  // Global Viewport State
  config: {
    mode: 'dashboard' | 'auth' | 'minimal'; // Toggles component visibility
    theme: 'light' | 'dark' | 'system';
    rtl: boolean; // Managed via Logical Properties
  };
}

6. Multi-Persona Workflow for Implementation
The Architect: Extracts viewport-height logic from EzScheduler and EzTable into the SharedLayoutService to ensure all components share the same "Full Height" math.

The Designer: Implements "ezUX" motion for the Sidebar collapse and Auth Card entry using Tailwind 4's high-speed transitions.

The Coder: Develops the Auth Shells using React 19 useId to ensure the Sign-In/Sign-Up form labels are perfectly mapped for accessibility.

The Tester: Performs a "Tab-Order Audit" across the Header and Sidebar to verify that the FocusManagerService correctly handles the roving tabindex.

Phase 5: The Decorator (Themes & Notifications) - Completed
Build the Theme Engine:
- **ThemeChanger**: A component (`EzThemeSwitcher`) to toggle between Light, Dark, and System modes. Persists preference to `localStorage`.
- **ThemeColorChanger**: A palette picker that updates global `data-theme` attribute (Tailwind v4 CSS variables).

Enhance the Notification Engine:
- **EzToaster**: Stacked toasts with "ezUX" enter/exit animations subscribing to `NotificationService`.

---

## 8. Integrated Demo Ecosystem

To showcase enterprise capabilities, a suite of optimized demo wrappers is provided:

### 8.1. Premium Demo Wrappers
Each component includes a standalone demo featuring:
- **React 19 `useTransition`**: Smooth UI updates during heavy data loads or state changes.
- **Glassmorphism Sidebar**: Semi-transparent, backdrop-blurred configuration panels for a high-end aesthetic.
- **Dynamic Skeletons**: Tailored loading states that match the layout density.

### 8.2. Stress Testing
Demos are configured with production-grade data volumes:
- **EzTable**: 10,000+ virtualized rows with real-time grouping.
- **EzTreeView**: 20,000+ hierarchical nodes with $O(1)$ keyboard navigation.
- **EzScheduler**: 1,000+ resource-allocated events with optimistic drag-and-drop.

## 9. Recent Architectural Improvements

### 9.1. Zero Prop Pollution (Phase 6 - Completed)
To support fully custom layout components while maintaining high performance, `EzLayout` now implements a **Safe Injection Pattern**:
- **Dynamic detection**: Lifecycle props (`isMobile`, `sidebarOpen`, `toggleSidebar`) are only injected into functional React components.
- **DOM Protection**: Plain HTML elements (like `div`, `header`) used as layout slots are automatically skipped by the clone-injection logic, preventing invalid DOM prop warnings in the console.

### 9.2. Flexible Auth Configuration
The `authConfig` slots are now fully optional, allowing for "Login-Only" or "Landing-Page" configurations without requiring placeholder components for unused slots.
