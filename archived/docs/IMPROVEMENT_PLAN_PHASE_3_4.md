# Ezux Improvement Plan (Phase 3 & 4)

**Objective**: Complete Headless Architecture, Enhance Theming, and Automate CI/CD.

## 🏗️ 1. Headless Components (Phase 3)
Refactor `EzTable` into composable exportable sub-components that consume the `TableStore`.

### 1.1 Components to Extract
- [ ] `EzTable.Header`: Virtualized/Standard header row with Sort/Group logic.
- [ ] `EzTable.Body`: Virtualized body that subscribes to `tableStore.data`.
- [ ] `EzTable.Toolbar`: Search, Faceted Filters, and View Options.
- [ ] `EzTable.Pagination`: Canonical pagination controls.

### 1.2 "As Child" Pattern (Phase 3.5)
- [ ] Implement `@radix-ui/react-slot` for `EzButton` to allow polymorphism.
- [ ] Ensure all "Root" components accept `asChild` prop.

---

## 🎨 2. Theming & Design System (Phase 4)
Leverage Tailwind 4 to create a themeable, token-based system.

### 2.1 CSS Variables API (Theming)
- [ ] Define `:root` variables in `packages/ezux/src/index.css`.
- [ ] Ensure `tailwind.config.ts` refers to these variables (already done by Shadcn, verify).
- [ ] Create `ThemeService` export that allows runtime updates of these variables.

---

## 🚀 3. CI/CD Pipeline (Assignments)
Automate the verification process.

### 3.1 GitHub Actions Workflow
- [ ] Create `.github/workflows/ci.yml`.
- [ ] Job: **Quality** (Lint, Typecheck).
- [ ] Job: **Build** (Build Lib, Build App).
- [ ] Job: **Publish** (Dry-run npm publish).

---

## 📝 Execution Order
1.  **Extract Headless Components** (High dependency).
2.  **Implement "As Child"**.
3.  **Setup CI/CD** (Independent).
