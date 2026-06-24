# Testing and Quality Skill

## Scope
Use this skill for Vitest, Testing Library, Playwright, Percy, test reliability, accessibility checks, and performance helper validation.

## Expertise
- Vitest 4, happy-dom, React Testing Library, user-event, Playwright E2E, and Percy visual testing.
- Component library tests: public behavior, edge cases, accessibility contracts, and emitted type/API checks.
- Performance-sensitive workflows for tables, virtualized lists, schedulers, and workflow graphs.

## Rules
- Prefer user-visible behavior assertions over implementation details.
- Keep tests deterministic; avoid wall-clock assumptions unless the domain requires them.
- Use explicit timeouts only for known performance fixtures.
- Add focused regression tests for bug fixes.
- Avoid broad snapshot churn unless visual/API surface is intentionally changing.
- For accessibility-sensitive changes, cover keyboard navigation, focus movement, labels, roles, and disabled states.

## Commands
- `npm test`: default unit/integration verification.
- `npm run test:coverage`: coverage-sensitive changes.
- `npm run test:public-api`: export, declaration, or package contract changes.
- `npm run test:e2e`: cross-component workflow or browser interaction changes.
- `npm run test:visual`: visual surface changes that may affect Percy baselines.

