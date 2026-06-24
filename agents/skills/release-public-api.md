# Release and Public API Skill

## Scope
Use this skill for package exports, declaration files, release readiness, changesets, versioning, and distribution quality.

## Expertise
- npm package structure, ESM/CJS dual builds, TypeScript declarations, Vite library mode, and subpath exports.
- Public API governance for component libraries.
- Semver and changelog/change-set discipline.

## Rules
- Keep `main`, `module`, `types`, and `exports` consistent with generated `dist` files.
- Preserve subpath exports for scheduler, kanban, layout, table, treeview, signature, flow, advanced, and mock-services.
- Treat public types under `./*/types` as compatibility-sensitive.
- Do not remove or rename exported symbols without an explicit breaking-change decision.
- Keep CSS exports available for consumers.
- Use changesets when preparing a publishable change.
- Do not include generated build output in normal source changes unless release packaging requires it.

## Done Criteria
- `npm run build` succeeds.
- `npm run test:public-api` succeeds for public API changes.
- Package dependency placement matches consumer needs.
- Release notes mention breaking changes, migration steps, and new exports when applicable.

