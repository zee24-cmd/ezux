# EzLayout Imperative API Guide

## Overview

The `EzLayout` component now supports both **declarative** (props-based) and **imperative** (ref-based) API patterns, matching the design of `EzTable` and `EzScheduler`.

## Basic Usage

### Declarative Pattern (Props-based)

```tsx
import { EzLayout } from '@ezux/components';

function App() {
  return (
    <EzLayout
      components={{
        header: <MyHeader />,
        sidebar: <MySidebar />,
        footer: <MyFooter />
      }}
      onSidebarToggle={(isOpen) => console.log('Sidebar:', isOpen)}
      onModeChange={(mode) => console.log('Mode:', mode)}
    >
      <MainContent />
    </EzLayout>
  );
}
```

### Imperative Pattern (Ref-based)

```tsx
import { useRef } from 'react';
import { EzLayout, EzLayoutRef } from '@ezux/components';

function App() {
  const layoutRef = useRef<EzLayoutRef>(null);

  const handleLogin = () => {
    // Programmatically switch to dashboard mode
    layoutRef.current?.showDashboard();
    layoutRef.current?.openSidebar();
  };

  const handleLogout = () => {
    // Programmatically switch to auth mode
    layoutRef.current?.showAuth();
    layoutRef.current?.showSignIn();
  };

  return (
    <>
      <EzLayout ref={layoutRef} authConfig={{ /* ... */ }}>
        <MainContent />
      </EzLayout>
      
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
```

## Complete API Reference

### Sidebar Control Methods

```tsx
// Toggle sidebar (with optional explicit state)
layoutRef.current?.toggleSidebar();      // Toggle current state
layoutRef.current?.toggleSidebar(true);  // Force open
layoutRef.current?.toggleSidebar(false); // Force close

// Convenience methods
layoutRef.current?.openSidebar();        // Open sidebar
layoutRef.current?.closeSidebar();       // Close sidebar

// Check sidebar state
const isOpen = layoutRef.current?.isSidebarOpen(); // Returns boolean
```

### Mode Management Methods

```tsx
// Set mode explicitly
layoutRef.current?.setMode('dashboard');
layoutRef.current?.setMode('auth');
layoutRef.current?.setMode('minimal');

// Convenience methods
layoutRef.current?.showDashboard();  // Switch to dashboard mode
layoutRef.current?.showAuth();       // Switch to auth mode
layoutRef.current?.showMinimal();    // Switch to minimal mode (no header/sidebar)

// Get current mode
const mode = layoutRef.current?.getMode(); // Returns 'dashboard' | 'auth' | 'minimal'
```

### Auth Page Control Methods

```tsx
// Set auth page
layoutRef.current?.setAuthPage('signin');
layoutRef.current?.setAuthPage('signup');

// Convenience methods
layoutRef.current?.showSignIn();   // Switch to sign in page
layoutRef.current?.showSignUp();   // Switch to sign up page

// Get current auth page
const authPage = layoutRef.current?.getAuthPage(); // Returns 'signin' | 'signup'
```

### State Access Methods

```tsx
// Get complete layout state
const state = layoutRef.current?.getState();
// Returns: {
//   sidebarOpen: boolean;
//   mode: 'dashboard' | 'auth' | 'minimal';
//   headerHeight: number;
//   sidebarWidth: number;
//   viewportHeight: number;
//   isMobile: boolean;
//   authPage: 'signin' | 'signup';
// }

// Get viewport information
const viewport = layoutRef.current?.getViewport();
// Returns: { height: number; isMobile: boolean }

// Check if mobile
const isMobile = layoutRef.current?.isMobile(); // Returns boolean
```

### Layout Dimensions Methods

```tsx
// Get header height in pixels
const headerHeight = layoutRef.current?.getHeaderHeight(); // Returns number

// Get sidebar width in pixels
const sidebarWidth = layoutRef.current?.getSidebarWidth(); // Returns number

// Get computed main content style
const contentStyle = layoutRef.current?.getMainContentStyle();
// Returns: React.CSSProperties with height, marginLeft, transition
```

### Service Access Methods

```tsx
// Get the layout service instance (for advanced usage)
const layoutService = layoutRef.current?.getLayoutService();

// Get the service registry
const registry = layoutRef.current?.getServiceRegistry();

// Force refresh/re-render
layoutRef.current?.refresh();
```

## Real-World Examples

### Example 1: Responsive Sidebar Control

```tsx
function ResponsiveApp() {
  const layoutRef = useRef<EzLayoutRef>(null);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = layoutRef.current?.isMobile();
      if (isMobile) {
        layoutRef.current?.closeSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <EzLayout ref={layoutRef}>{/* ... */}</EzLayout>;
}
```

### Example 2: Authentication Flow

```tsx
function AuthenticatedApp() {
  const layoutRef = useRef<EzLayoutRef>(null);
  const [user, setUser] = useState(null);

  const handleLogin = async (credentials) => {
    const user = await loginAPI(credentials);
    setUser(user);
    layoutRef.current?.showDashboard();
    layoutRef.current?.openSidebar();
  };

  const handleLogout = () => {
    setUser(null);
    layoutRef.current?.showAuth();
    layoutRef.current?.showSignIn();
  };

  return (
    <EzLayout
      ref={layoutRef}
      authConfig={{
        signInSlot: <SignInForm onLogin={handleLogin} />,
        signUpSlot: <SignUpForm />
      }}
    >
      {user && <Dashboard user={user} onLogout={handleLogout} />}
    </EzLayout>
  );
}
```

### Example 3: Programmatic Navigation

```tsx
function NavigationController() {
  const layoutRef = useRef<EzLayoutRef>(null);

  const handleNavigation = (route: string) => {
    switch (route) {
      case '/dashboard':
        layoutRef.current?.showDashboard();
        layoutRef.current?.openSidebar();
        break;
      case '/login':
        layoutRef.current?.showAuth();
        layoutRef.current?.showSignIn();
        break;
      case '/register':
        layoutRef.current?.showAuth();
        layoutRef.current?.showSignUp();
        break;
      case '/fullscreen':
        layoutRef.current?.showMinimal();
        layoutRef.current?.closeSidebar();
        break;
    }
  };

  return (
    <EzLayout ref={layoutRef}>
      <Router onNavigate={handleNavigation} />
    </EzLayout>
  );
}
```

### Example 4: State Synchronization

```tsx
function StateSyncedApp() {
  const layoutRef = useRef<EzLayoutRef>(null);
  const [layoutState, setLayoutState] = useState(null);

  // Sync layout state to local state
  const syncState = () => {
    const state = layoutRef.current?.getState();
    setLayoutState(state);
  };

  useEffect(() => {
    // Initial sync
    syncState();
    
    // Sync on interval (or use events)
    const interval = setInterval(syncState, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <EzLayout ref={layoutRef} onSidebarToggle={syncState} onModeChange={syncState}>
        {/* ... */}
      </EzLayout>
      
      {/* Display state in UI */}
      <div>
        Mode: {layoutState?.mode}
        Sidebar: {layoutState?.sidebarOpen ? 'Open' : 'Closed'}
        Mobile: {layoutState?.isMobile ? 'Yes' : 'No'}
      </div>
    </div>
  );
}
```

## Event Callbacks

The component also supports event callbacks for reactive programming:

```tsx
<EzLayout
  onModeChange={(mode) => {
    console.log('Mode changed to:', mode);
  }}
  onSidebarToggle={(isOpen) => {
    console.log('Sidebar is now:', isOpen ? 'open' : 'closed');
  }}
  onAuthPageChange={(page) => {
    console.log('Auth page changed to:', page);
  }}
  onViewportResize={(dimensions) => {
    // Future: will be called on viewport resize
    console.log('Viewport:', dimensions);
  }}
>
  {/* ... */}
</EzLayout>
```

## Comparison with EzTable and EzScheduler

All three components now follow the same imperative API pattern:

| Feature | EzTable | EzScheduler | EzLayout |
|---------|---------|-------------|----------|
| Ref-based API | ✅ | ✅ | ✅ |
| Type-safe Ref | `EzTableRef` | Inline types | `EzLayoutRef` |
| `forwardRef` | ✅ | ✅ | ✅ |
| `useImperativeHandle` | ✅ | ✅ | ✅ |
| Event callbacks | ✅ | ✅ | ✅ |
| Service access | ✅ | ✅ | ✅ |

## TypeScript Support

Full TypeScript support with type inference:

```tsx
import { useRef } from 'react';
import type { EzLayoutRef } from '@ezux/components';

const layoutRef = useRef<EzLayoutRef>(null);

// All methods are fully typed
layoutRef.current?.toggleSidebar(true);  // ✅ Type-safe
layoutRef.current?.setMode('dashboard'); // ✅ Type-safe
layoutRef.current?.invalidMethod();      // ❌ TypeScript error
```

## Migration Guide

### Before (Declarative only)

```tsx
function App() {
  const [mode, setMode] = useState('dashboard');
  
  return (
    <EzLayout>
      <button onClick={() => setMode('auth')}>
        Switch to Auth
      </button>
    </EzLayout>
  );
}
```

### After (With Imperative API)

```tsx
function App() {
  const layoutRef = useRef<EzLayoutRef>(null);
  
  return (
    <EzLayout ref={layoutRef}>
      <button onClick={() => layoutRef.current?.showAuth()}>
        Switch to Auth
      </button>
    </EzLayout>
  );
}
```

## Best Practices

1. **Use refs for programmatic control**: When you need to control layout from outside the component
2. **Use props for initial configuration**: Set initial state via props
3. **Use event callbacks for reactive updates**: Listen to changes via callbacks
4. **Combine both patterns**: Use declarative props + imperative methods for maximum flexibility

```tsx
function BestPracticeExample() {
  const layoutRef = useRef<EzLayoutRef>(null);
  
  return (
    <EzLayout
      ref={layoutRef}
      // Declarative: Initial configuration
      components={{ sidebar: <MySidebar /> }}
      // Reactive: Event callbacks
      onSidebarToggle={(isOpen) => {
        analytics.track('sidebar_toggle', { isOpen });
      }}
    >
      {/* Imperative: Programmatic control */}
      <button onClick={() => layoutRef.current?.toggleSidebar()}>
        Toggle Sidebar
      </button>
    </EzLayout>
  );
}
```
