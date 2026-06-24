# EzUX Agent Guide

EzUX is a TypeScript React component library for enterprise dashboards. Keep changes minimal, typed, accessible, and compatible with the package exports in `package.json`.

## Defaults
- Use `npm` and keep `package-lock.json` synchronized.
- Prefer existing patterns in `src/components`, `src/shared`, and `src/lib`.
- Treat `react`, `react-dom`, TanStack packages, and `rrule` as peer-facing API constraints.
- Keep runtime dependencies in `dependencies`; keep build, test, and release tools in `devDependencies`.
- Do not edit generated `dist` unless explicitly preparing a release artifact.

## Required Verification
- Run `npm run build` for component, config, export, type, or dependency changes.
- Run `npm test` for behavior, hook, utility, service, workflow, scheduler, table, or state changes.
- Run `npm run test:public-api` when changing exports, public types, entrypoints, or declarations.
- Run `npm run test:e2e` or `npm run test:visual` only when UI interaction or visual regression risk warrants it.

## Project Skills
- Component Architecture: `agents/skills/component-architecture.md`
- Dependency Maintenance: `agents/skills/dependency-maintenance.md`
- Testing and Quality: `agents/skills/testing-quality.md`
- Release and Public API: `agents/skills/release-public-api.md`
- Documentation and Examples: `agents/skills/documentation-examples.md`

