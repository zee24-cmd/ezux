# Quick Test Guide - Phase 2

## 🧪 Testing the Async DataGenerator Implementation

### **Quick Verification (2 minutes)**

```bash
# 1. Start dev server
npm run dev

# 2. Open browser
# Navigate to: http://localhost:5173

# 3. Test sequence:
# - Page should load FAST (< 1 second)
# - Click "Data Tables" in sidebar
# - Should see brief loading state
# - Table should populate with 10,000 rows
# - Click reload button
# - Should see spinner animation
# - Data should refresh
```

---

## ✅ Expected Behavior

### **Initial Page Load**
- ✅ Fast initial load (~400-600ms)
- ✅ No faker.js in Network tab (main bundle)
- ✅ Main bundle ~260KB

### **First Demo Load**
- ✅ Brief loading state (~200ms)
- ✅ Faker.js loaded in background (check Network tab)
- ✅ ~1.5MB faker chunk downloaded
- ✅ Table renders with data

### **Subsequent Demo Usage**
- ✅ Instant loads (faker cached)
- ✅ Reload button works
- ✅ Smooth transitions

---

## 🐛 Troubleshooting

### **Issue**: Page shows empty table
**Solution**: Check browser console for errors. Data loading is async.

### **Issue**: "Cannot read property of undefined"
**Solution**: Ensure async/await is used correctly in demos.

### **Issue**: Build fails
**Solution**: Check TypeScript errors. All DataGenerator calls must be awaited.

---

## 📊 Performance Metrics to Check

### **Chrome DevTools**

**1. Network Tab**:
- Main bundle: ~260KB ✅
- Faker chunk: ~1.5MB (lazy loaded) ✅
- Total initial: ~260KB ✅

**2. Performance Tab**:
- FCP: < 1s ✅
- TTI: < 1.5s ✅
- LCP: < 2s ✅

**3. Lighthouse Audit**:
```bash
npx lighthouse http://localhost:5173 --view
```
- Performance: > 85 ✅
- Bundle size warnings: Should be gone ✅

---

## 🔍 Browser Console Tests

### **Test 1: Verify Faker is Cached**
```javascript
// Run in browser console after first demo load
console.log('Faker cache test');

// This should be instant (cached)
const start = performance.now();
await DataGenerator.generateTableData(100);
const end = performance.now();

console.log(`Generation time: ${end - start}ms`);
// Should be < 10ms (cached faker)
```

### **Test 2: Check for Memory Leaks**
```javascript
// 1. Open Chrome DevTools -> Memory tab
// 2. Take heap snapshot
// 3. Navigate between demos
// 4. Take another snapshot
// 5. Compare - should not show significant growth
```

---

## ✅ Success Criteria

- [ ] Page loads in < 1 second
- [ ] Main bundle < 500KB (achieved: ~260KB)
- [ ] Table demo works correctly
- [ ] Reload button works
- [ ] No console errors
- [ ] Faker loaded lazily (check Network tab)
- [ ] Smooth user experience

---

## 🚀 Next Actions

Once verified:
1. Update remaining 5 demos
2. Run full test suite (when added)
3. Deploy to staging
4. Monitor performance metrics

---

**Happy Testing!** 🎉
