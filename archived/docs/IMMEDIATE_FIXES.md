# IMMEDIATE BUILD FIXES

**Status**: 🚨 **CRITICAL - BUILD CURRENTLY FAILING**  
**Timeline**: Execute within next 30 minutes  
**Goal**: Enable `npm run build` in `packages/ezux`

---

## Issue #1: Remove Incomplete Headless Components

### Current Error:
```
src/components/EzTable/headless/example.tsx(3,1): error TS6133: 'React' is declared but its value is never read.
src/components/EzTable/headless/example.tsx(11,18): error TS2339: Property 'Root' does not exist on type...
src/components/EzTable/headless/EzTableHeader.tsx(6,20): error TS2307: Cannot find module '../../../../lib/utils'
```

### Fix:
```bash
# Remove the incomplete headless directory
cd /Users/zed/Documents/ezux
rm -rf packages/ezux/src/components/EzTable/headless/
```

**Rationale**: This directory contains experimental code that:
- Is NOT exported in the public API
- Has broken imports after monorepo migration
- References unimplemented compound component pattern
- Blocks production build

**Alternative**: Move to feature branch instead:
```bash
git checkout -b feature/headless-table
git checkout main packages/ezux/src/components/EzTable/headless/
git commit -m "WIP: Headless table architecture (incomplete)"
git checkout main
rm -rf packages/ezux/src/components/EzTable/headless/
```

---

## Issue #2: Fix Duplicate PasswordInput Export

### Current Error:
```
src/index.ts(17,1): error TS2308: Module './components/EzLayout' has already exported a member named 'PasswordInput'.
```

### Root Cause:
```typescript
// packages/ezux/src/index.ts

export * from './components/EzLayout';  // Exports PasswordInput
export * from './components/ui';         // Also exports PasswordInput → CONFLICT
```

### Fix Option A: Explicit Exports (RECOMMENDED)
Replace wildcard export from `EzLayout` with explicit list:

```typescript
// packages/ezux/src/index.ts

// Export Shared Components
export { 
  EzLayout,
  EzHeader,
  EzSidebar,
  EzThemeSwitcher,
  EzUserProfile,
  EzLanguageSwitcher,
  EzThemeColorChanger,
  SignInForm,
  SignUpForm,
  AuthSlider,
  // Deliberately exclude InputPassword/PasswordInput - exported via ui/
} from './components/EzLayout';

export { EzTable } from './components/EzTable';
export { EzScheduler } from './components/EzScheduler';
export { EzTreeView } from './components/EzTreeView';

// Export Shared Types
export * from './shared/types/BaseProps';

// Export Services
export { globalServiceRegistry } from './shared/services/ServiceRegistry';
export { LayoutService } from './shared/services/LayoutService';
export { I18nService } from './shared/services/I18nService';
export { ThemeService } from './shared/services/ThemeService';

// Export UI Components (includes PasswordInput)
export * from './components/ui';

// Export Utils
export { cn } from './lib/utils';
export * from './shared/utils/formatters';

// Export Hooks
export { useI18n } from './shared/hooks/useI18n';

// Export Shared Components
export { StatusBadge } from './shared/components/StatusBadge';
```

### Fix Option B: Rename in EzLayout (Alternative)
```typescript
// packages/ezux/src/components/EzLayout/index.tsx

// At the end:
export { InputPassword as AuthPasswordInput } from './Authentication/InputPassword';
// Instead of: export { InputPassword as PasswordInput }
```

---

## Issue #3: Verify No Other Build Errors

After applying fixes #1 and #2, run:

```bash
cd /Users/zed/Documents/ezux/packages/ezux
npm run build
```

**Expected Output** (success):
```
> ezux@0.0.1 build
> tsc && vite build

vite v7.3.1 building for production...
✓ 89 modules transformed.
dist/ezux.es.js      234.56 kB │ gzip: 78.23 kB
dist/ezux.umd.js     189.34 kB │ gzip: 65.12 kB
dist/index.d.ts      generated
✓ built in 2.34s
```

**If still failing**: Review additional TypeScript errors and address sequentially.

---

## Post-Fix Verification Checklist

```bash
# 1. Build library
cd /Users/zed/Documents/ezux/packages/ezux
npm run build

# 2. Verify showcase still works with library
cd /Users/zed/Documents/ezux/apps/showcase
npm install  # Re-links to built library
npm run dev

# 3. Check browser at http://localhost:5173
# - Navigate to table demo
# - Verify no console errors
# - Test filtering/sorting
```

---

## Git Commit Message (After Fixes)

```
fix(build): remove incomplete headless components and resolve duplicate exports

- Remove packages/ezux/src/components/EzTable/headless/ (WIP code blocking build)
- Replace wildcard export in index.ts with explicit exports to avoid PasswordInput conflict
- Verified build passes: npm run build successful in packages/ezux

Closes: Build errors preventing production bundle generation
Ref: MONOREPO_COMPLIANCE_REVIEW.md Phase 1
```

---

## Timeline

| Step | Action | Duration | Who |
|------|--------|----------|-----|
| 1 | Remove headless directory | 1 min | Developer |
| 2 | Update index.ts exports | 3 min | Developer |
| 3 | Run build verification | 2 min | Developer |
| 4 | Test showcase integration | 5 min | Developer |
| 5 | Commit and push | 2 min | Developer |

**Total**: ~15 minutes

---

## Risk Assessment

**Risk Level**: 🟢 **LOW**

- Removing `headless/` is safe because:
  - Not exported in public API
  - Not used by any demos
  - No external dependents

- Explicit exports are safer than wildcards:
  - Prevents future conflicts
  - Makes API surface explicit
  - Better for tree-shaking

**Rollback Plan**: Git revert if unexpected issues arise.

---

**Status After Completion**: Monorepo build UNBLOCKED → Can proceed to Performance Phase 2
