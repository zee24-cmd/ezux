# Performance & Migration Action Plan

**Context**: Migration to Monorepo (`ezux` + `showcase`)
**Goal**: Optimize performance while enforcing `SKILL.md` architecture.

## 🗓️ Phase 1: The Great Separation (Week 1)
**Objective**: Establish the physical `pnpm` workspace and decouple Demos from Library.

### Step 1.1: Workspace Init (P0) 🚨
- Create `pnpm-workspace.yaml`.
- Move `src` (excluding demos) -> `packages/ezux/src`.
- Move `src/components/demos` -> `apps/showcase/src`.
- **Validation**: Ensure `packages/ezux` builds without errors and has *zero* references to Faker.

### Step 1.2: Showcase App Setup (P0)
- Initialize `apps/showcase` as a Vite React 19 app.
- Install `packages/ezux` as a workspace dependency: `"ezux": "workspace:*`.
- Install `@tanstack/react-router` for navigation.
- **Outcome**: A running app where you can click "Table" or "Scheduler" and see the components rendered from the library.

### Step 1.3: Clean Dependencies (P1)
- **`packages/ezux`**: Remove `lucide-react` (move to PeerDeps if possible, or keep minimal). Remove `faker`.
- **`apps/showcase`**: Install `faker`, `lucide-react`, `tailwindcss`.

---

## 🗓️ Phase 2: Performance & Compliance (Week 1-2)
**Objective**: Optimize the code now that it is structurally sound.

### Step 2.1: Data Layer Modernization (SKILL.md)
- **Action**: In `apps/showcase`, replace `useEffect` data generation with **TanStack Query**.
- **Worker**: Create `apps/showcase/src/workers/faker.worker.ts`.
- **Code**:
  ```ts
  // apps/showcase/hooks/useDemoData.ts
  const { data } = useQuery({
    queryKey: ['demo-data', size],
    queryFn: () => dataWorker.generate(size)
  });
  ```

### Step 2.2: Render Optimization
- **Action**: In `packages/ezux`, audit `EzTable`.
- **Fix**: Wrap internal state updates (filtering, sorting) in `startTransition` (React 19).
- **Fix**: Memoize `EzTable.Cell` renderers to prevent style object thrashing.

### Step 2.3: Bundle Analysis
- Run `vite-bundle-visualizer` on `packages/ezux`.
- **Target**: Ensure no tree-shaking failures.

---

## 🗓️ Phase 3: Quality Assurance (Week 2)
**Objective**: Lock in the quality.

### Step 3.1: Unit Testing (Vitest)
- Set up `vitest` in `packages/ezux`.
- Write tests for `useEzTable` reducers/state logic.

### Step 3.2: E2E Testing (Playwright)
- Set up `playwright` in `apps/showcase`.
- Test critical flows: "Load 10k rows", "Filter by Name", "Edit Cell".

---

## 📝 Immediate Checklist for User

1. [ ] **Approuve Migration**: Create the `pnpm` workspace structure.
2. [ ] **Approve Move**: Move files to `packages/` and `apps/`.
3. [ ] **Verify**: Run `pnpm install` and `pnpm dev --filter showcase`.
