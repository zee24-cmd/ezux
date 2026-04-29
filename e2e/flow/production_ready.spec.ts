import { expect, test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('EzFlow production readiness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signin');
    const signIn = page.getByRole('button', { name: /sign in/i });
    if (await signIn.isVisible()) {
      await signIn.click();
      await page.waitForURL('/');
    }
    await page.goto('/flow');
  });

  test('supports toolbox add, inspector edit, validation navigation, save, and publish', async ({ page }) => {
    await expect(page.locator('.ez-workflow')).toBeVisible();

    await page.locator('[data-ezflow-node-type="actionNode"]').first().press('Enter');
    await expect(page.getByLabel(/drag action node/i)).toBeVisible();

    const actionNode = page.getByText('Action').first();
    await actionNode.click();
    await page.getByLabel('Workflow inspector').getByLabel('Label').fill('Production action');
    await page.getByRole('button', { name: /validate/i }).click();

    const issue = page.getByRole('button', { name: /go to validation issue/i }).first();
    if (await issue.isVisible()) await issue.click();

    await page.getByRole('button', { name: /save workflow/i }).click();
    await page.getByRole('button', { name: /publish workflow/i }).click();
  });

  test('imports, exports, and renders dense desktop and mobile workflows', async ({ page, isMobile }) => {
    await expect(page.locator('.ez-workflow')).toBeVisible();
    await page.getByRole('button', { name: /export/i }).click();

    await page.setViewportSize(isMobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
    await expect(page.locator('.ez-workflow')).toBeVisible();
    await percySnapshot(page, isMobile ? 'EzFlow - Mobile Workflow' : 'EzFlow - Desktop Dense Workflow');
  });
});
