# Dependency Maintenance Skill

## Scope
Use this skill for dependency upgrades, audit work, lockfile changes, peer dependency policy, and library migration tasks.

## Expertise
- npm dependency resolution, lockfile review, peer/runtime/dev dependency placement.
- React, TypeScript, Vite, Vitest, Playwright, Tailwind, Radix, TanStack, XYFlow, Framer Motion, Lucide, DOMPurify, and date-fns upgrade notes.
- Semver risk assessment for published component libraries.

## Workflow
- Check current state with `npm outdated --json`.
- Upgrade with `npm install`, not manual lockfile edits.
- Keep runtime imports in `dependencies`; keep build/test/release-only packages in `devDependencies`.
- Align peer dependency ranges when peer-facing libraries are upgraded.
- Research release notes for major upgrades and any minor upgrade with migration notes.
- Implement only required migration changes.
- Run `npm run build` and `npm test`.
- Run `npm audit --json` and report remaining advisories without forcing breaking downgrades/upgrades unless requested.

## Upgrade Watchpoints
- TypeScript compiler option deprecations and stricter global type handling.
- Playwright removed APIs, browser binary changes, and config option changes.
- Vite and vite-plugin-dts declaration generation behavior.
- Tailwind candidate scanning, CSS output changes, and PostCSS integration.
- Radix accessibility or composition behavior changes.
- TanStack virtual/table API changes affecting large data surfaces.

