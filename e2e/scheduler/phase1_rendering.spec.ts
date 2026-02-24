import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('EzScheduler Phase 1: Core Rendering', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/auth/signin');
        // The SignInForm in showcase has defaults. Click the submit button:
        await page.getByRole('button', { name: /Sign in/i }).click();
        await page.waitForURL('/');
    });

    test('should render EzScheduler component and take snapshot', async ({ page }) => {
        // Navigate to the demo page
        await page.goto('/scheduler/views');

        // Check if the scheduler container exists
        const scheduler = page.locator('.ez-scheduler');
        await expect(scheduler).toBeVisible();

        // Check if the default view (Week) is rendered
        await expect(page.getByText('Sun')).toBeVisible();
        await expect(page.getByText('Mon')).toBeVisible();

        // Wait a small moment for animations/render to settle
        await page.waitForTimeout(500);

        await percySnapshot(page, 'EzScheduler - Weekly View');
    });

    test('should switch views and snapshot', async ({ page }) => {
        await page.goto('/scheduler/views');

        const dayButton = page.getByRole('button', { name: 'Day', exact: true });
        if (await dayButton.isVisible()) {
            await dayButton.click();
            await page.waitForTimeout(500);
            await percySnapshot(page, 'EzScheduler - Day View');
        }
    });
});
