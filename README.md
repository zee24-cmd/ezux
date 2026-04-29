# ezUX | Premium React UI Kit for Enterprise Dashboards

> **High-performance React components** for building modern enterprise applications. Powered by **TanStack** (Table, Query, Virtual) and built with **TypeScript**.
>
> 🔗 **[View ezux-showcase on GitHub](https://github.com/zee24-cmd/ezux-showcase)** | 🌐 **[Live Showcase](https://ezux-showcase.vercel.app)**

![NPM Version](https://img.shields.io/npm/v/ezux?style=flat-square)
![License](https://img.shields.io/npm/l/ezux?style=flat-square)
![Build Status](https://img.shields.io/github/actions/workflow/status/ezux-org/ezux/main?style=flat-square)

## Why ezUX?

ezUX is a comprehensive **component library** designed for developers who need to build complex **enterprise dashboards** quickly. It focuses on performance, type-safety, and flexibility by being **TanStack-first**.

## Key Features

- **TanStack First Architecture**: Leverage the power of **TanStack Table**, **TanStack Query**, and **TanStack Virtual** for maximum performance and flexible data handling.
- **Enterprise-Grade Components**: Specialized components for complex UI needs: **Scheduler**, **Kanban Board**, **Pivot Table**, and **Virtualized Tree View**.
- **Full TypeScript Support**: 100% type-safe components with exported types for a seamless developer experience.
- **High-Performance Data Grid**: Handle 100k+ rows with ease using integrated row and column virtualization.
- **Modern Styling**: Styled with **Tailwind CSS v4** and CSS variables for easy theming and dark mode support.
- **Accessibility (A11Y)**: Built with WAI-ARIA patterns to ensure your **dashboard** is accessible to everyone.

## Core Components

- **EzTable**: High-performance **React Data Grid** with grouping, filtering, and pivot capabilities.
- **EzScheduler**: Interactive **Timeline Scheduler** with drag-and-drop and resource grouping.
- **EzKanban**: Advanced **Kanban Board** with swimlanes and timeline integration.
- **EzTreeView**: Efficient **Virtualized Tree** for handling deep nesting and large datasets.
- **EzSignature**: Type-safe electronic signature component with smooth canvas rendering and validation.
- **EzLayout**: Responsive orchestration engine for complex **enterprise UI** layouts.


## Prerequisites

`ezux` is styled using **Tailwind CSS v4**. The library deliberately does **not** bundle Tailwind to avoid bloating your application or causing version conflicts. 

You must have [Tailwind CSS v4](https://tailwindcss.com/docs/installation) installed and configured in your consumer application to use `ezux` components.

## Installation

```bash
npm install ezux
```

## Quick Start

```tsx
import { EzLayout, EzTable, useEzTable } from 'ezux';

function App() {
  const tableRes = useEzTable({
    data: myData,
    columns: myColumns
  });

  return (
    <EzLayout>
       <EzTable {...tableRes} />
    </EzLayout>
  );
}
```

### Advanced Table Features

`EzTable` supports powerful features like grouping, filtering, and batch editing out of the box.

```tsx
import { EzTable, useEzTable } from 'ezux';

function UserDashboard() {
  const table = useEzTable({
    data: users,
    columns: [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'role', header: 'Role', enableGrouping: true },
      { accessorKey: 'status', header: 'Status', enableColumnFilter: true },
    ],
    enableGrouping: true,
    enableFiltering: true,
    editSettings: {
      allowEditing: true,
      mode: 'Batch',
      primaryKey: 'id'
    }
  });

  return <EzTable {...table} onBatchSave={(changes) => console.log(changes)} />;
}
```


## Documentation

Visit the [Live Showcase](https://ezux-showcase.vercel.app) for full documentation and interactive examples.

## License

MIT © [Zeeshan Sayed](https://github.com/ezux)

---

### Tags & Keywords
`react`, `components`, `table`, `scheduler`, `kanban`, `dashboard`, `enterprise`, `ui-kit`, `tanstack`, `typescript`, `react-components`, `data-grid`, `workflow-builder`, `scheduler-component`, `kanban-board`

