---
name: tanstack-stack-authority
description: Provides directives for building with TypeScript 7, React 19.2, and the full TanStack ecosystem used by EzUX. Use this when scaffolding new modules or enforcing architectural standards.
---

# TanStack & React 19 Skill

Use this skill to ensure all code adheres to the "TanStack-First" architecture and React 19 patterns.

## When to Use This Skill
- When initializing a new project or module.
- When implementing data fetching, routing, or state management.
- When performing code reviews to ensure compliance with the defined tech stack.

## Core Architecture & Guidelines

### 🛠 Languages & Tooling
- **TypeScript 7**: Always use Strict Mode. Use modern type features such as `satisfies` and const type parameters. Keep generated declarations compatible with the supported TypeScript 6 consumer range.
- **Compiler API bridge**: Use `@typescript/typescript6` only for tools that still depend on the TypeScript 6 compiler API; it does not replace TypeScript 7 for EzUX source.
- **Vite**: Use for build tooling, HMR optimization, and Vitest integration.

### ⚛️ Frontend Framework (React 19.2)
- **Patterns**: Prioritize Server Components (RSC), Actions, the `use` hook, and Transitions.
- **Directives**: Explicitly label files with `'use client'` or `'use server'` where applicable.

### 🛣️ Routing & Forms (TanStack)
- **Framework**: TanStack Start (Full-stack SSR/Streaming).
- **Routing**: Use TanStack Router with type-safe routing and Zod for search param validation.
- **Forms**: Use TanStack Form with Zod/Valibot integration.

### 💾 Data Management
- **Server State**: TanStack Query (Optimistic updates, prefetching).
- **Global State**: TanStack Store (Fine-grained reactivity).
- **Local Persistence**: TanStack DB (Relational IndexedDB wrapper).

### 🧪 Quality Assurance
- **Testing**: Use **Vitest** for unit testing and **Playwright** for E2E flows. (Note: Avoid Jest unless specifically required for legacy isolation).
- **Components**: Use **Shadcn UI** components.
- **Icons**: Use **Lucide Icons**.
- **Typography**: Use the shared semantic typography tokens and system font stack from `theme-vars.css`; keep user-facing text at least `0.75rem`.

### 🔌 Inversion of Control (IoC)
- **Service Locator**: Use `EzServiceRegistry` (Shared Registry) to decouple business logic from UI components.
- **Dependency Injection**: Pass the registry via props (e.g., `EzLayout`) or use context to access services instead of hardcoding instances.
- **Service Contracts**: Define services using the `IService` interface to ensure a consistent lifecycle (registration, cleanup).

## Implementation Strategy Table

| Skill Area | Implementation Strategy |
| :--- | :--- |
| **Type Safety** | End-to-end safety from TanStack Router to Query hooks. |
| **Data Flow** | TanStack DB (Local-first) → TanStack Query (Server sync). |
| **Form Logic** | Headless TanStack Form logic + React 19 Actions. |
| **Testing** | Playwright for user flows; Vitest for logic. |
