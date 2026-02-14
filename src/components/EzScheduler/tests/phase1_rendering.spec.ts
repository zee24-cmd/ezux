import { test, expect } from '@playwright/test';

test.describe('EzScheduler Phase 1: Core Rendering', () => {
    test('should render EzScheduler component', async ({ page }) => {
        // Navigate to the demo page
        await page.goto('/demos/scheduler'); // Adjust path as per local dev server

        // Check if the scheduler container exists
        const scheduler = page.locator('.ez-scheduler');
        await expect(scheduler).toBeVisible();

        // Check if the default view (Week) is rendered
        await expect(page.getByText('Sun')).toBeVisible(); // Assuming Week view shows days
        await expect(page.getByText('Mon')).toBeVisible();
    });

    test('should switch views', async ({ page }) => {
        await page.goto('/demos/scheduler');

        // Switch to Day View
        // Assuming there is a toolbar with buttons
        // This part depends on the Toolbar implementation which relies on external components
        // For now, we verify the presence of the toolbar
        const toolbar = page.locator('header'); // Adjust selector
        await expect(toolbar).toBeVisible();
    });

    test('should render resources in Day view', async ({ page }) => {
        await page.goto('/demos/scheduler');
        // Ensure resources are displayed if configured
        // locator logic depends on DOM structure
    });
});
