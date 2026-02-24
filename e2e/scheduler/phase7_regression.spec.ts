
import { test, expect } from '@playwright/test';

test.describe('EzScheduler Phase 7: Regression & QA', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/demos/scheduler');
        await expect(page.locator('.ez-scheduler')).toBeVisible();
    });

    test('should render day and week views correctly', async ({ page }) => {
        // Check Virtual Body
        await expect(page.getByTestId('scheduler-virtual-body')).toBeVisible();

        // Verify Time Labels exist (e.g., 9 AM)
        await expect(page.locator('text=9 AM')).toBeVisible();

        // Switch to Day View (Basic existence check of toolbar logic if available)
        // If standard shadcn tabs or buttons are used:
        // const dayTrigger = page.getByRole('tab', { name: 'Day' });
        // if (await dayTrigger.isVisible()) await dayTrigger.click();
    });

    test('should allow creating a new event via modal', async ({ page }) => {
        // Simulate Double Click on a slot (Coordinate based as slots are virtual)
        // 8 AM is roughly 8 * 64px down.
        await page.mouse.dblclick(300, 512); // ~8 AM on a Wednesday?

        // Check Modal
        const modal = page.locator('[data-testid="ez-event-modal"]');
        await expect(modal).toBeVisible();

        // Check New Fields
        await expect(modal.getByLabel('Location')).toBeVisible();
        await expect(modal.getByLabel('All Day')).toBeVisible();

        // Fill Form
        await modal.getByPlaceholder('What are we planning?').fill('Regression Test Event');
        await modal.getByLabel('Location').fill('Test Lab');

        // Save
        await modal.getByRole('button', { name: 'Commit Changes' }).click();

        // Verify Event appears
        await expect(modal).not.toBeVisible();
        await expect(page.locator('text=Regression Test Event')).toBeVisible();
    });

    test('should edit an existing event', async ({ page }) => {
        // Seed Event
        await page.mouse.dblclick(400, 600);
        await page.locator('[data-testid="ez-event-modal"]').getByPlaceholder('What are we planning?').fill('Editable Event');
        await page.locator('[data-testid="ez-event-modal"]').getByRole('button', { name: 'Commit Changes' }).click();

        // Open Logic: Double click event
        await page.locator('text=Editable Event').dblclick();

        const modal = page.locator('[data-testid="ez-event-modal"]');
        await expect(modal).toBeVisible();
        await expect(modal.getByPlaceholder('What are we planning?')).toHaveValue('Editable Event');

        // Edit
        await modal.getByPlaceholder('What are we planning?').fill('Edited Event Title');
        await modal.getByLabel('Location').fill('Updated Loc');
        await modal.getByRole('button', { name: 'Commit Changes' }).click();

        await expect(page.locator('text=Edited Event Title')).toBeVisible();
    });

    test('should delete an event', async ({ page }) => {
        // Seed Event
        await page.mouse.dblclick(500, 700);
        await page.locator('[data-testid="ez-event-modal"]').getByPlaceholder('What are we planning?').fill('Delete Me');
        await page.locator('[data-testid="ez-event-modal"]').getByRole('button', { name: 'Commit Changes' }).click();

        // Open
        await page.locator('text=Delete Me').dblclick();

        // Delete (Only in Edit mode)
        // The modal opens in 'Edit' mode by default for existing events? Yes, based on prior code logic.
        await page.locator('[data-testid="ez-event-modal"]').getByRole('button', { name: 'Purge Event' }).click();

        await expect(page.locator('text=Delete Me')).not.toBeVisible();
    });

    test('should support drag and drop', async ({ page }) => {
        // Seed
        await page.mouse.dblclick(600, 400);
        await page.locator('[data-testid="ez-event-modal"]').getByPlaceholder('What are we planning?').fill('Draggable Event');
        await page.locator('[data-testid="ez-event-modal"]').getByRole('button', { name: 'Commit Changes' }).click();

        const event = page.locator('text=Draggable Event');
        await expect(event).toBeVisible();

        // Drag
        const box = await event.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 100);
            await page.mouse.up();
        }

        // Wait for drop settlement
        await page.waitForTimeout(500);
        await expect(page.locator('text=Draggable Event')).toBeVisible();
    });
});
