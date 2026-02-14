# 🚨 URGENT FIXES - Action Plan

**Created**: January 24, 2026
**Status**: IN PROGRESS
**Priority**: P0 - CRITICAL

---

## 🎯 Top 3 Critical Issues

### **1. Functional Bug: Icons/Labels Not Toggling** 
**Severity**: CRITICAL - Feature completely broken
**File**: `apps/showcase/src/demos/layout/EzTableColumnTypesDemoWrapper.tsx`
**Root Cause**: The `showIcons` and `showLabels` state changes aren't propagating to the `BooleanCell` component because they're passed through column metadata which doesn't trigger re-render.

**Fix**: Pass these props differently or force column regeneration.

```typescript
// WRONG (current):
booleanOptions: {
    showIcon: showIcons,  // Captured at column creation time
    showLabel: showLabels  // Won't update when state changes
}

// RIGHT (fix):
// Option A: Read from context/state inside BooleanCell
// Option B: Force new column objects on state change
```

### **2. Visual Bug: Harsh Colors**
**Severity**: HIGH - Looks unprofessional
**File**: `packages/ezux/src/components/EzTable/renderers/BooleanRenderer/BooleanCell.tsx`
**Root Cause**: Using pure `emerald-50` and `rose-50` which are too bright.

**Fix**:
```typescript
// Change from:
isTrue && "bg-emerald-50 text-emerald-700"
isFalse && "bg-rose-50 text-rose-700"

// To:
isTrue && "bg-emerald-50/40 text-emerald-700 dark:bg-emerald-900/10"
isFalse && "bg-rose-50/40 text-rose-700 dark:bg-rose-900/10"
```

### **3. Layout Bug: Massive Header-to-Row Gap**
**Severity**: HIGH - Table unusable
**File**: Likely `packages/ezux/src/components/EzTable/index.tsx` or CSS
**Root Cause**: TBD - Need to inspect virtualization calculations

**Investigation Needed**: 
- Check `rowVirtualizer.getTotalSize()` value
- Check `virtualRow.start` calculations for first few rows
- Verify there's no extra padding/margin

---

## ✅ Immediate Action Items

**DO THESE FIRST** (in order):

1. ✅ Fix the boolean toggle bug (30 min)
2. ✅ Fix the harsh colors (10 min)
3. ✅ Test in browser to verify fixes work (10 min)
4. ✅ Investigate and fix header gap (30-60 min)
5. ✅ Fix header truncation (20 min)
6. ✅ Polish demo page layout (30 min)

**Total Est. Time**: 2.5-3 hours

Then reassess: Do we continue with visual polish or pivot to full column types implementation?

---

## 📝 Secondary Issues (Lower Priority)

- Filter popover styling
- Demo page title too large
- Control panel layout
- Feature list formatting
- Table cell padding
- Border visibility
- Icon spacing in headers

These can wait until core functionality and critical visual issues are resolved.

---

## 🚀 Next Steps After Fixes

Once all critical issues are resolved:

1. **User Decision Point**: 
   - Continue polishing existing Boolean demo?
   - OR start implementing remaining column types (text, number, date, etc.)?

2. **Column Types Implementation**:
   - Build type detector
   - Create remaining cell renderers
   - Integrate auto-detection into EzTable
   - Create comprehensive demo

---

## 📊 Progress Tracker

- [ ] Boolean toggle bug fixed
- [ ] Harsh colors softened
- [ ] Header gap resolved
- [ ] Header truncation fixed
- [ ] Demo layout polished
- [ ] All issues verified in browser
- [ ] User approval received
- [ ] Ready for next phase

