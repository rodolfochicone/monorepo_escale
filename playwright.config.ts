import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para Task 2.7: Testes
 * @see https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
  testDir: './tests/e2e',

  /* Executar testes em paralelo */
  fullyParallel: true,

  /* Falhar build se houver testes com only */
  forbidOnly: !!process.env.CI,

  /* Retry em caso de falha no CI */
  retries: process.env.CI ? 2 : 0,

  /* Paralelismo otimizado */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter para os resultados */
  reporter: [
    ['html', { outputFolder: 'test-results/playwright-report' }],
    ['json', { outputFile: 'test-results/playwright-results.json' }],
    ['list']
  ],

  /* Configurações globais dos testes */
  use: {
    /* URL base para navegação */
    baseURL: 'http://localhost:3000',

    /* Trace apenas em caso de falha */
    trace: 'on-first-retry',

    /* Screenshots em caso de falha */
    screenshot: 'only-on-failure',

    /* Vídeo em caso de falha */
    video: 'retain-on-failure',

    /* Timeout para ações */
    actionTimeout: 10000,

    /* Timeout para navegação */
    navigationTimeout: 30000,
  },

  /* Configurar apenas Chrome para testes essenciais */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        testIdAttribute: 'data-testid'
      },
    },
  ],

  /* Configurações do servidor local para desenvolvimento */
  webServer: [
    {
      command: 'cd apps/web && pnpm dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 180 * 1000,
    },
    {
      command: 'cd apps/api && pnpm dev',
      url: 'http://localhost:3333/pokemons/health',
      reuseExistingServer: !process.env.CI,
      timeout: 180 * 1000,
      stderr: 'pipe',
      stdout: 'pipe',
    }
  ],

  /* Timeout global dos testes */
  timeout: 60 * 1000,

  /* Expectativas globais */
  expect: {
    /* Timeout para assertions */
    timeout: 10000,

    /* Screenshots em comparações visuais */
    toHaveScreenshot: {
      mode: 'css',
      animations: 'disabled',
    },
  },

  /* Configurações de output */
  outputDir: 'test-results/playwright-output/',
});
