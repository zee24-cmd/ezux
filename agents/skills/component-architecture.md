# Component Architecture Skill

## Scope
Use this skill for EzTable, EzScheduler, EzKanban, EzFlow, EzLayout, EzTreeView, EzSignature, shared UI primitives, hooks, services, and theme-facing behavior.

## Expertise
- React 19 component design, controlled/uncontrolled state, refs, memoization, context, and composition.
- TypeScript public props, discriminated unions, generics, callback contracts, and declaration emit stability.
- Enterprise UX: dense data surfaces, keyboard access, predictable focus, responsive layouts, and non-disruptive loading/error states.
- Library internals: side-effect-safe modules, tree-shakable exports, CSS side effects, and peer dependency boundaries.

## Rules
- Preserve public component names, prop names, event signatures, and export paths unless explicitly performing a breaking change.
- Keep visual and behavior changes local to the affected component family.
- Reuse shared hooks, services, utilities, and `src/components/ui` primitives before adding new abstractions.
- Use Radix primitives for accessible menus, labels, switches, tooltips, scroll areas, slots, and radio groups.
- Use TanStack Table/Virtual APIs for data grids and virtualization instead of hand-rolled equivalents.
- Use `@xyflow/react` for workflow graph behavior and `@dnd-kit` for drag/drop behavior.
- Keep sanitization via DOMPurify wherever user-provided HTML may render.

## Done Criteria
- Types compile with `npm run build`.
- Behavior is covered by focused tests when logic changes.
- Public exports and package entrypoints remain stable.

