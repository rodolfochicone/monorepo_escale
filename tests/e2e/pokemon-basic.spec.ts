import { test, expect } from '@playwright/test';

test.describe('Testes de Smoke - Validação Básica', () => {
  const BASE_URL = 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('deve conseguir acessar a página inicial', async ({ page }) => {
    await expect(page).toHaveTitle(/Pokémon Management Platform/);
  });

  test('deve conseguir acessar a página de login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Verificar elementos essenciais da página de login
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button:has-text("Entrar")')).toBeVisible();

    // Verificar credenciais de teste na página (elementos separados)
    await expect(page.locator('text="Usuário:"')).toBeVisible();
    await expect(page.locator('text="admin"')).toBeVisible();
    await expect(page.locator('text="Senha:"')).toBeVisible();
    await expect(page.locator('text="password"')).toBeVisible();
  });

  test('deve conseguir navegar para uma página externa', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example Domain/);
  });
});
