import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
    testDir: './e2e',
    timeout: 60 * 1000,
    expect: {
        timeout: 10000
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        actionTimeout: 0,
        trace: 'on-first-retry',
        baseURL: 'http://localhost:5173',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        // Add other browsers if needed later
    ],
    webServer: {
        command: 'cd ../ezux-showcase && npm run dev',
        port: 5173,
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
