# ezUX

> A comprehensive, type-safe TanStack First component library designed for modern enterprise applications.
> 
> 🔗 **[View ezux-showcase on GitHub](https://github.com/zee24-cmd/ezux-showcase)** | 🌐 **[Live Showcase](https://ezux-showcase.vercel.app)**
![NPM Version](https://img.shields.io/npm/v/ezux?style=flat-square)
![License](https://img.shields.io/npm/l/ezux?style=flat-square)
![Build Status](https://img.shields.io/github/actions/workflow/status/zee24-cmd/ezux/main?style=flat-square)

## Features

- **TanStack First**: Built on top of TanStack Query, Table, and Virtual for maximum performance and flexibility.
- **Enterprise Ready**: Includes complex components like Scheduler, Kanban, Pivot Table, and Virtualized Trees out of the box.
- **Type Safe**: Written in TypeScript with full type definitions.
- **Themable**: CSS-variable based theming system with dark mode support.
- **Accessible**: Follows WAI-ARIA patterns for all interactive components.

## Components

- **EzTable**: High-performance data grid with grouping, filtering, and pivot capabilities.
- **EzScheduler**: Drag-and-drop timeline management with resource grouping.
- **EzKanban**: Trello-like board with swimlanes and timeline views.
- **EzTreeView**: Virtualized tree handling unlimited nesting.
- **EzLayout**: A fluid orchestration engine for complex interfaces.

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

## Documentation

Visit the [Live Showcase](https://ezux-showcase.vercel.app) for full documentation and interactive examples.

## License

MIT © [zee24-cmd](https://github.com/zee24-cmd)
