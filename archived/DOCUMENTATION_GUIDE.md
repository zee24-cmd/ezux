# ezUX Component Documentation Standard

This guide outlines the standard for documenting components in the `ezUX` library. Following these conventions ensures that the API documentation (Properties, Events, Methods, Subcomponents) is automatically generated and consistent across the library.

## Overview

We use **TypeDoc** combined with a custom post-processing script (`scripts/enhance-docs.js`) to generate our API documentation. The system relies on specific naming conventions and JSDoc tags to correctly extract and group information.

## Naming Conventions

For a component named `EzComponent`, you must export the following types:

1.  **Component**: `EzComponent` (The React component itself)
2.  **Props Interface**: `EzComponentProps` (The interface defining the props)
3.  **Ref/Api Interface**: `EzComponentRef` (The interface defining the imperative API/methods)

> **Note:** If your component does not use `forwardRef`, you should still export a `EzComponentRef` type alias pointing to your API interface (e.g., `export type EzTreeViewRef = EzTreeViewApi;`).

## JSDoc Tags & Formatting

Use Standard JSDoc tags. We specifically use `@group` to categorize members in the generated documentation.

### 1. Properties (Props)

Document every prop in the `EzComponentProps` interface. Use the `@group Properties` tag.

```typescript
export interface EzComponentProps {
    /**
     * Description of the prop.
     * @group Properties
     * @default "defaultValue"
     */
    myProp: string;
}
```

### 2. Events (Callbacks)

Event handlers (callbacks) in the props should be grouped under `@group Events`.

```typescript
export interface EzComponentProps {
    /**
     * Callback fired when something happens.
     * @param value The value that changed.
     * @group Events
     */
    onSomethingChange?: (value: string) => void;
}
```

### 3. Methods (Imperative API)

Public methods exposed via `ref` should be defined in the `EzComponentRef` interface and grouped under `@group Methods`.

```typescript
export interface EzComponentRef {
    /**
     * minimal description of method.
     * @param id The id of the item.
     * @group Methods
     */
    focusItem: (id: string) => void;
}
```

### 4. Subcomponents (Slots)

If your component accepts custom subcomponents (usually via a `components` prop), document the interface for these components.
Use `@group Subcomponents` for the `components` prop itself.

```typescript
export interface EzComponentComponents {
    /**
     * Custom renderer for the list item.
     */
    Item?: React.ComponentType<ItemProps>;
}

export interface EzComponentProps {
    /**
     * Custom subcomponents to override default rendering.
     * @group Subcomponents
     */
    components?: EzComponentComponents;
}
```

### 5. Component Description

Add a detailed JSDoc comment block above the component export. This should include:

-   A high-level description.
-   **Visual Preview** (if available).
-   **Key Features** list.
-   **Minimal Example**.
-   `@group Core Components` (or appropriate category).

```typescript
/**
 * EzComponent is a ...
 *
 * ### Key Features
 * - Feature 1
 * - Feature 2
 *
 * ### Example
 * ```tsx
 * <EzComponent prop="value" />
 * ```
 *
 * @group Core Components
 */
export const EzComponent = ...
```

## Running Documentation Generation

To generate the documentation locally:

```bash
npm run docs
```

This will run TypeDoc and the `enhance-docs.js` script to inject the API sections into the individual component pages in `docs/api`.
