import { test, expect } from '@playwright/test';

test.describe('Testes E2E Essenciais - Sistema Pokémon', () => {
  const BASE_URL = 'http://localhost:3000';
  const testCredentials = {
    username: 'admin',
    password: 'password'
  };

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });


  test('deve fazer login com credenciais válidas', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('#username', testCredentials.username);
    await page.fill('#password', testCredentials.password);
    await page.click('button[type="submit"]:has-text("Entrar")');

    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('deve rejeitar credenciais inválidas', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('#username', 'invalid');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]:has-text("Entrar")');

    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(BASE_URL + '/login');
  });

  test('deve proteger rotas que requerem autenticação', async ({ page }) => {
    await page.goto(`${BASE_URL}/pokemons/new`);
    await expect(page).toHaveURL(BASE_URL + '/login');
  });

  test('deve fazer logout corretamente', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('#username', testCredentials.username);
    await page.fill('#password', testCredentials.password);
    await page.click('button[type="submit"]:has-text("Entrar")');
    await expect(page).toHaveURL(BASE_URL + '/');

    // Logout
    const logoutButton = page.locator('button:has-text("Sair")').first();
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();
    await expect(page).toHaveURL(BASE_URL + '/login');
  });

  test('deve carregar página inicial após login', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('#username', testCredentials.username);
    await page.fill('#password', testCredentials.password);
    await page.click('button[type="submit"]:has-text("Entrar")');
    await expect(page).toHaveURL(BASE_URL + '/');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const pokemonGrid = page.locator('[data-testid="pokemon-grid"]');
    const emptyMessage = page.locator('text="Comece adicionando seu primeiro Pokémon à sua coleção!"');

    const hasGrid = await pokemonGrid.count() > 0;
    const hasEmptyMessage = await emptyMessage.count() > 0;

    expect(hasGrid || hasEmptyMessage).toBe(true);
  });

  test('deve mostrar funcionalidade "Carregar mais" quando aplicável', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('#username', testCredentials.username);
    await page.fill('#password', testCredentials.password);
    await page.click('button[type="submit"]:has-text("Entrar")');
    await expect(page).toHaveURL(BASE_URL + '/');

    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const pokemonCards = page.locator('[data-testid="pokemon-card"]');
    const cardCount = await pokemonCards.count();

    if (cardCount > 0) {
      const loadMoreButton = page.locator('button:has-text("Carregar mais")');
      const completeMessage = page.locator('text="🎉 Todos os"');

      const hasLoadMore = await loadMoreButton.count() > 0;
      const hasCompleteMessage = await completeMessage.count() > 0;

      expect(hasLoadMore || hasCompleteMessage || cardCount < 6).toBe(true);
    }
  });
});
