import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3003',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // SEM webServer - assumindo que servidores já estão rodando
  projects: [
    {
      name: 'chromium',
      use: {
        testIdAttribute: 'data-testid'
      },
    },
  ],

  timeout: 30 * 1000,
  expect: {
    timeout: 10000,
  },
  outputDir: 'test-results/playwright-output/',
});
