// Test script to verify theme functionality
// Run this in the browser console

console.log('=== Theme Test ===');

// 1. Check if ThemeService exists
const themeService = window.globalServiceRegistry?.get('ThemeService');
console.log('ThemeService exists:', !!themeService);

// 2. Check current theme state
if (themeService) {
    const state = themeService.getState();
    console.log('Current theme state:', state);
}

// 3. Check CSS variables on root
const root = document.documentElement;
const vars = {
    background: root.style.getPropertyValue('--background'),
    foreground: root.style.getPropertyValue('--foreground'),
    primary: root.style.getPropertyValue('--primary'),
    radius: root.style.getPropertyValue('--radius'),
};
console.log('CSS variables on root:', vars);

// 4. Check computed styles
const computed = getComputedStyle(root);
const computedVars = {
    background: computed.getPropertyValue('--background'),
    foreground: computed.getPropertyValue('--foreground'),
    primary: computed.getPropertyValue('--primary'),
};
console.log('Computed CSS variables:', computedVars);

// 5. Check dark class
console.log('Has dark class:', root.classList.contains('dark'));
console.log('data-theme attribute:', root.getAttribute('data-theme'));

console.log('=== End Theme Test ===');
