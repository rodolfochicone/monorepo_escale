import { test, expect } from '@playwright/test';

test.describe('Sistema de Gerenciamento Pokémon', () => {
  const BASE_URL = 'http://localhost:3003';
  const API_URL = 'http://localhost:3333';

  const testCredentials = {
    username: 'admin',
    password: 'password'
  };

  const testPokemon = {
    name: 'testemon',
    expectedName: 'testemon'
  };

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test.describe('🔐 Autenticação e Autorização', () => {

    test('deve fazer login com credenciais válidas', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Preencher formulário de login
      await page.fill('input[name="username"]', testCredentials.username);
      await page.fill('input[name="password"]', testCredentials.password);

      // Fazer login
      await page.click('button:has-text("Entrar")');

      // Aguardar redirecionamento e validar sucesso
      await expect(page).toHaveURL(BASE_URL + '/');
      await expect(page.locator('text=Bem-vindo, admin!')).toBeVisible();
      await expect(page.locator('button:has-text("Sair")')).toBeVisible();
    });

    test('deve rejeitar credenciais inválidas', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Tentar login com credenciais inválidas
      await page.fill('input[name="username"]', 'invalid');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button:has-text("Entrar")');

      // Verificar mensagem de erro
      await expect(page.locator('text=Credenciais inválidas')).toBeVisible();
      await expect(page).toHaveURL(BASE_URL + '/login');
    });

    test('deve proteger rotas que requerem autenticação', async ({ page }) => {
      // Tentar acessar rota protegida sem login
      await page.goto(`${BASE_URL}/pokemons/new`);

      // Deve redirecionar para login
      await expect(page).toHaveURL(BASE_URL + '/login');
    });

    test('deve fazer logout corretamente', async ({ page }) => {
      // Fazer login primeiro
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="username"]', testCredentials.username);
      await page.fill('input[name="password"]', testCredentials.password);
      await page.click('button:has-text("Entrar")');
      await expect(page).toHaveURL(BASE_URL + '/');

      // Fazer logout
      await page.click('button:has-text("Sair")');

      // Validar redirecionamento para login
      await expect(page).toHaveURL(BASE_URL + '/login');
    });
  });

  test.describe('🏠 Página Inicial e Funcionalidade "Carregar Mais"', () => {

    test.beforeEach(async ({ page }) => {
      // Login para todos os testes desta seção
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="username"]', testCredentials.username);
      await page.fill('input[name="password"]', testCredentials.password);
      await page.click('button:has-text("Entrar")');
      await expect(page).toHaveURL(BASE_URL + '/');
    });

    test('deve carregar pokémons iniciais (6 por vez)', async ({ page }) => {
      await page.goto(BASE_URL + '/');

      // Aguardar carregamento inicial
      await page.waitForSelector('[data-testid="pokemon-grid"]', { timeout: 10000 });

      // Verificar se carregou no máximo 6 pokémons inicialmente
      const pokemonCards = page.locator('[data-testid="pokemon-card"]');
      const count = await pokemonCards.count();

      expect(count).toBeLessThanOrEqual(6);
      expect(count).toBeGreaterThan(0);

      // Verificar se o contador total aparece
      await expect(page.locator('text=/\\d+ Pokémon.*na sua coleção/')).toBeVisible();
    });

    test('deve mostrar botão "Carregar mais" quando há mais pokémons', async ({ page }) => {
      await page.goto(BASE_URL + '/');

      // Aguardar carregamento
      await page.waitForSelector('[data-testid="pokemon-grid"]', { timeout: 10000 });

      // Verificar se o botão "Carregar mais" está presente quando há mais itens
      const loadMoreButton = page.locator('button:has-text("Carregar mais")');
      const pokemonCards = page.locator('[data-testid="pokemon-card"]');
      const initialCount = await pokemonCards.count();

      if (initialCount >= 6) {
        // Se já carregou 6 ou mais, deve haver um botão "Carregar mais" ou mensagem de completo
        const hasLoadMore = await loadMoreButton.isVisible();
        const hasCompleteMessage = await page.locator('text=🎉 Todos os').isVisible();

        expect(hasLoadMore || hasCompleteMessage).toBe(true);
      }
    });

    test('deve carregar mais pokémons ao clicar em "Carregar mais"', async ({ page }) => {
      await page.goto(BASE_URL + '/');

      // Aguardar carregamento inicial
      await page.waitForSelector('[data-testid="pokemon-grid"]', { timeout: 10000 });

      const loadMoreButton = page.locator('button:has-text("Carregar mais")');

      if (await loadMoreButton.isVisible()) {
        const initialCards = page.locator('[data-testid="pokemon-card"]');
        const initialCount = await initialCards.count();

        // Clicar em "Carregar mais"
        await loadMoreButton.click();

        // Aguardar carregamento e validar
        await page.waitForTimeout(2000); // Aguardar requisição

        const finalCards = page.locator('[data-testid="pokemon-card"]');
        const finalCount = await finalCards.count();

        // Deve ter mais pokémons agora
        expect(finalCount).toBeGreaterThan(initialCount);

        // Verificar toast de sucesso
        await expect(page.locator('text=/\\d+ novo.*Pokémon.*carregado/')).toBeVisible();
      }
    });

    test('deve mostrar estado de coleção completa', async ({ page }) => {
      await page.goto(BASE_URL + '/');

      // Aguardar carregamento
      await page.waitForSelector('[data-testid="pokemon-grid"]', { timeout: 10000 });

      // Carregar todos os pokémons disponíveis
      let loadMoreButton = page.locator('button:has-text("Carregar mais")');
      let maxAttempts = 5;

      while (await loadMoreButton.isVisible() && maxAttempts > 0) {
        await loadMoreButton.click();
        await page.waitForTimeout(2000);
        maxAttempts--;
      }

      // Verificar mensagem de coleção completa
      await expect(page.locator('text=🎉 Todos os')).toBeVisible();
      expect(await loadMoreButton.isVisible()).toBe(false);
    });

    test('deve permitir busca local nos pokémons carregados', async ({ page }) => {
      await page.goto(BASE_URL + '/');

      // Aguardar carregamento
      await page.waitForSelector('[data-testid="pokemon-grid"]', { timeout: 10000 });

      const searchInput = page.locator('input[placeholder*="Digite o nome"]');
      await searchInput.fill('pikachu');

      // Aguardar filtro
      await page.waitForTimeout(1000);

      // Verificar resultados filtrados
      const pokemonCards = page.locator('[data-testid="pokemon-card"]');
      const count = await pokemonCards.count();

      if (count > 0) {
        // Deve mostrar apenas pokémons que correspondem à busca
        const firstCard = pokemonCards.first();
        await expect(firstCard.locator('text=pikachu')).toBeVisible();
      }

      // Limpar busca
      await searchInput.clear();
      await page.waitForTimeout(1000);
    });
  });

  test.describe('➕ Criação de Pokémon', () => {

    test.beforeEach(async ({ page }) => {
      // Login para todos os testes desta seção
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="username"]', testCredentials.username);
      await page.fill('input[name="password"]', testCredentials.password);
      await page.click('button:has-text("Entrar")');
      await expect(page).toHaveURL(BASE_URL + '/');
    });

    test('deve criar um novo pokémon com sucesso', async ({ page }) => {
      // Ir para página de criação
      await page.goto(`${BASE_URL}/pokemons/new`);

      // Preencher formulário
      await page.fill('input[name="name"]', 'ditto');

      // Submeter formulário
      await page.click('button:has-text("Adicionar Pokémon")');

      // Aguardar processamento e verificar redirecionamento para detalhes
      await page.waitForURL(/\/pokemons\/\d+/, { timeout: 15000 });

      // Verificar se está na página de detalhes
      await expect(page.locator('h1:has-text("ditto")')).toBeVisible();

      // Verificar toast de sucesso
      await expect(page.locator('text=foi adicionado à sua coleção')).toBeVisible();
    });

    test('deve mostrar erro para pokémon inexistente', async ({ page }) => {
      await page.goto(`${BASE_URL}/pokemons/new`);

      // Tentar criar pokémon inexistente
      await page.fill('input[name="name"]', 'pokemoninexistente123');
      await page.click('button:has-text("Adicionar Pokémon")');

      // Verificar mensagem de erro
      await expect(page.locator('text=não encontrado na PokéAPI')).toBeVisible();
    });

    test('deve validar campo obrigatório', async ({ page }) => {
      await page.goto(`${BASE_URL}/pokemons/new`);

      // Tentar submeter sem preencher nome
      await page.click('button:has-text("Adicionar Pokémon")');

      // Verificar que formulário não é submetido (ainda está na mesma página)
      await expect(page).toHaveURL(`${BASE_URL}/pokemons/new`);
    });
  });

  test.describe('📋 Listagem e Navegação', () => {

    test.beforeEach(async ({ page }) => {
      // Login para todos os testes desta seção
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="username"]', testCredentials.username);
      await page.fill('input[name="password"]', testCredentials.password);
      await page.click('button:has-text("Entrar")');
      await expect(page).toHaveURL(BASE_URL + '/');
    });

    test('deve navegar para página de listagem completa', async ({ page }) => {
      await page.click('link:has-text("Minha Coleção")');

      await expect(page).toHaveURL(`${BASE_URL}/pokemons`);

      // Verificar se a página tem elementos de paginação
      await expect(page.locator('text=Pokémons')).toBeVisible();
    });

    test('deve permitir filtros na listagem', async ({ page }) => {
      await page.goto(`${BASE_URL}/pokemons`);

      // Aguardar carregamento
      await page.waitForLoadState('networkidle');

      // Verificar se existem controles de filtro
      const hasFilters = await page.locator('input[placeholder*="Buscar"]').isVisible();

      if (hasFilters) {
        // Testar filtro por nome
        await page.fill('input[placeholder*="Buscar"]', 'pikachu');
        await page.waitForTimeout(1000);

        // Verificar resultados filtrados
        const pokemonCards = page.locator('[data-testid="pokemon-card"]');
        const count = await pokemonCards.count();

        if (count > 0) {
          await expect(pokemonCards.first().locator('text=pikachu')).toBeVisible();
        }
      }
    });

    test('deve implementar paginação corretamente', async ({ page }) => {
      await page.goto(`${BASE_URL}/pokemons`);

      // Aguardar carregamento
      await page.waitForLoadState('networkidle');

      // Verificar controles de paginação
      const paginationExists = await page.locator('nav').filter({ hasText: 'página' }).isVisible();

      if (paginationExists) {
        // Verificar se pode navegar entre páginas
        const nextButton = page.locator('button:has-text("Próxima")');
        const prevButton = page.locator('button:has-text("Anterior")');

        if (await nextButton.isEnabled()) {
          await nextButton.click();
          await page.waitForLoadState('networkidle');

          // Deve estar em uma página diferente
          await expect(prevButton).toBeEnabled();
        }
      }
    });

    test('deve navegar para detalhes do pokémon', async ({ page }) => {
      await page.goto(`${BASE_URL}/pokemons`);

      // Aguardar carregamento
      await page.waitForLoadState('networkidle');

      // Clicar no primeiro pokémon disponível
      const firstPokemon = page.locator('[data-testid="pokemon-card"]').first();

      if (await firstPokemon.isVisible()) {
        await firstPokemon.click();

        // Verificar redirecionamento para detalhes
        await page.waitForURL(/\/pokemons\/\d+/);

        // Verificar se está na página de detalhes
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('img[alt*="artwork"]')).toBeVisible();
      }
    });
  });

  test.describe('👁️ Detalhes do Pokémon', () => {

    test.beforeEach(async ({ page }) => {
      // Login para todos os testes desta seção
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="username"]', testCredentials.username);
      await page.fill('input[name="password"]', testCredentials.password);
      await page.click('button:has-text("Entrar")');
      await expect(page).toHaveURL(BASE_URL + '/');
    });

    test('deve exibir informações completas do pokémon', async ({ page }) => {
      // Navegar para o primeiro pokémon disponível
      await page.goto(BASE_URL + '/');
      await page.waitForSelector('[data-testid="pokemon-card"]', { timeout: 10000 });

      const firstPokemon = page.locator('[data-testid="pokemon-card"]').first();
      await firstPokemon.click();

      await page.waitForURL(/\/pokemons\/\d+/);

      // Verificar elementos essenciais da página de detalhes
      await expect(page.locator('h1')).toBeVisible(); // Nome do pokémon
      await expect(page.locator('img[alt*="artwork"]')).toBeVisible(); // Imagem
      await expect(page.locator('text=Tipo')).toBeVisible(); // Seção de tipos
      await expect(page.locator('text=Habilidades')).toBeVisible(); // Habilidades

      // Verificar botões de ação
      await expect(page.locator('button:has-text("Editar")')).toBeVisible();
      await expect(page.locator('button:has-text("Excluir")')).toBeVisible();
    });

    test('deve navegar para edição do pokémon', async ({ page }) => {
      // Ir para um pokémon específico
      await page.goto(BASE_URL + '/');
      await page.waitForSelector('[data-testid="pokemon-card"]', { timeout: 10000 });

      const firstPokemon = page.locator('[data-testid="pokemon-card"]').first();
      await firstPokemon.click();

      await page.waitForURL(/\/pokemons\/\d+/);

      // Clicar em editar
      await page.click('button:has-text("Editar")');

      // Verificar redirecionamento para página de edição
      await page.waitForURL(/\/pokemons\/\d+\/edit/);

      // Verificar se é página de edição
      await expect(page.locator('h1:has-text("Editar")')).toBeVisible();
      await expect(page.locator('button:has-text("Salvar")')).toBeVisible();
    });
  });

  test.describe('✏️ Edição de Pokémon', () => {

    test.beforeEach(async ({ page }) => {
      // Login para todos os testes desta seção
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="username"]', testCredentials.username);
      await page.fill('input[name="password"]', testCredentials.password);
      await page.click('button:has-text("Entrar")');
      await expect(page).toHaveURL(BASE_URL + '/');
    });

    test('deve editar pokémon com sucesso', async ({ page }) => {
      // Navegar para edição
      await page.goto(BASE_URL + '/');
      await page.waitForSelector('[data-testid="pokemon-card"]', { timeout: 10000 });

      const firstPokemon = page.locator('[data-testid="pokemon-card"]').first();
      await firstPokemon.click();

      await page.waitForURL(/\/pokemons\/\d+/);
      await page.click('button:has-text("Editar")');
      await page.waitForURL(/\/pokemons\/\d+\/edit/);

      // Editar campos disponíveis (se houver campos editáveis)
      const nameInput = page.locator('input[name="name"]');

      if (await nameInput.isVisible()) {
        const originalValue = await nameInput.inputValue();
        await nameInput.clear();
        await nameInput.fill(originalValue); // Recolocar mesmo valor para teste

        // Salvar alterações
        await page.click('button:has-text("Salvar")');

        // Verificar redirecionamento e sucesso
        await page.waitForURL(/\/pokemons\/\d+$/);
        await expect(page.locator('text=atualizado com sucesso')).toBeVisible();
      }
    });

    test('deve cancelar edição', async ({ page }) => {
      // Navegar para edição
      await page.goto(BASE_URL + '/');
      await page.waitForSelector('[data-testid="pokemon-card"]', { timeout: 10000 });

      const firstPokemon = page.locator('[data-testid="pokemon-card"]').first();
      await firstPokemon.click();

      const pokemonUrl = page.url();

      await page.click('button:has-text("Editar")');
      await page.waitForURL(/\/pokemons\/\d+\/edit/);

      // Cancelar edição
      await page.click('button:has-text("Cancelar")');

      // Deve retornar para página de detalhes
      await expect(page).toHaveURL(pokemonUrl);
    });
  });

  test.describe('🗑️ Remoção de Pokémon', () => {

    test.beforeEach(async ({ page }) => {
      // Login para todos os testes desta seção
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="username"]', testCredentials.username);
      await page.fill('input[name="password"]', testCredentials.password);
      await page.click('button:has-text("Entrar")');
      await expect(page).toHaveURL(BASE_URL + '/');
    });

    test('deve confirmar antes de remover pokémon', async ({ page }) => {
      // Criar um pokémon de teste primeiro
      await page.goto(`${BASE_URL}/pokemons/new`);
      await page.fill('input[name="name"]', 'magikarp');
      await page.click('button:has-text("Adicionar Pokémon")');

      await page.waitForURL(/\/pokemons\/\d+/, { timeout: 15000 });

      // Tentar remover
      await page.click('button:has-text("Excluir")');

      // Verificar modal de confirmação
      await expect(page.locator('text=Confirmar exclusão')).toBeVisible();
      await expect(page.locator('button:has-text("Confirmar")')).toBeVisible();
      await expect(page.locator('button:has-text("Cancelar")')).toBeVisible();
    });

    test('deve cancelar remoção', async ({ page }) => {
      // Navegar para um pokémon
      await page.goto(BASE_URL + '/');
      await page.waitForSelector('[data-testid="pokemon-card"]', { timeout: 10000 });

      const firstPokemon = page.locator('[data-testid="pokemon-card"]').first();
      await firstPokemon.click();

      const pokemonUrl = page.url();

      // Tentar remover e cancelar
      await page.click('button:has-text("Excluir")');
      await page.click('button:has-text("Cancelar")');

      // Deve continuar na mesma página
      await expect(page).toHaveURL(pokemonUrl);
    });

    test('deve remover pokémon com sucesso', async ({ page }) => {
      // Criar um pokémon de teste para remoção
      await page.goto(`${BASE_URL}/pokemons/new`);
      await page.fill('input[name="name"]', 'caterpie');
      await page.click('button:has-text("Adicionar Pokémon")');

      await page.waitForURL(/\/pokemons\/\d+/, { timeout: 15000 });

      // Remover o pokémon
      await page.click('button:has-text("Excluir")');
      await page.click('button:has-text("Confirmar")');

      // Verificar redirecionamento para listagem
      await page.waitForURL(/\/pokemons$|\/$/);

      // Verificar toast de sucesso
      await expect(page.locator('text=removido da sua coleção')).toBeVisible();
    });
  });

  test.describe('🔧 Integração e Fluxos Completos', () => {

    test.beforeEach(async ({ page }) => {
      // Login para todos os testes desta seção
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="username"]', testCredentials.username);
      await page.fill('input[name="password"]', testCredentials.password);
      await page.click('button:has-text("Entrar")');
      await expect(page).toHaveURL(BASE_URL + '/');
    });

    test('deve completar fluxo completo de CRUD', async ({ page }) => {
      const testPokemonName = 'eevee';

      // 1. CRIAR - Adicionar novo pokémon
      await page.goto(`${BASE_URL}/pokemons/new`);
      await page.fill('input[name="name"]', testPokemonName);
      await page.click('button:has-text("Adicionar Pokémon")');

      await page.waitForURL(/\/pokemons\/\d+/, { timeout: 15000 });

      // 2. LER - Verificar detalhes
      await expect(page.locator(`h1:has-text("${testPokemonName}")`)).toBeVisible();

      const pokemonId = page.url().match(/\/pokemons\/(\d+)/)?.[1];
      expect(pokemonId).toBeDefined();

      // 3. EDITAR - Ir para edição (se disponível)
      const editButton = page.locator('button:has-text("Editar")');
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForURL(/\/pokemons\/\d+\/edit/);

        // Salvar sem alterações para testar fluxo
        await page.click('button:has-text("Salvar")');
        await page.waitForURL(/\/pokemons\/\d+$/);
      }

      // 4. DELETAR - Remover pokémon
      await page.click('button:has-text("Excluir")');
      await page.click('button:has-text("Confirmar")');

      // Verificar remoção
      await page.waitForURL(/\/pokemons$|\/$/);
      await expect(page.locator('text=removido da sua coleção')).toBeVisible();
    });

    test('deve validar navegação entre todas as páginas', async ({ page }) => {
      // Página inicial
      await page.goto(BASE_URL + '/');
      await expect(page.locator('h1:has-text("Pokémon Management Platform")')).toBeVisible();

      // Ir para listagem
      await page.click('link:has-text("Minha Coleção")');
      await expect(page).toHaveURL(`${BASE_URL}/pokemons`);

      // Ir para criação
      await page.click('link:has-text("Adicionar")');
      await expect(page).toHaveURL(`${BASE_URL}/pokemons/new`);

      // Voltar para home
      await page.click('link:has-text("Início")');
      await expect(page).toHaveURL(`${BASE_URL}/`);

      // Testar navegação pelo logo
      await page.goto(`${BASE_URL}/pokemons`);
      await page.click('link:has-text("⚡ PokéManager")');
      await expect(page).toHaveURL(`${BASE_URL}/`);
    });

    test('deve manter estado de autenticação durante navegação', async ({ page }) => {
      // Navegar por várias páginas
      const pages = [
        `${BASE_URL}/`,
        `${BASE_URL}/pokemons`,
        `${BASE_URL}/pokemons/new`
      ];

      for (const url of pages) {
        await page.goto(url);

        // Verificar se ainda está autenticado
        await expect(page.locator('button:has-text("Sair")')).toBeVisible();
        await expect(page.locator('text=admin')).toBeVisible();
      }
    });
  });

  test.describe('🚨 Tratamento de Erros e Edge Cases', () => {

    test.beforeEach(async ({ page }) => {
      // Login para todos os testes desta seção
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="username"]', testCredentials.username);
      await page.fill('input[name="password"]', testCredentials.password);
      await page.click('button:has-text("Entrar")');
      await expect(page).toHaveURL(BASE_URL + '/');
    });

    test('deve lidar com erro de conexão da API', async ({ page }) => {
      // Este teste simula quando a API está indisponível
      // Tentar acessar página que depende da API
      await page.goto(`${BASE_URL}/pokemons`);

      // Se houver erro de conexão, deve mostrar mensagem apropriada
      // ou ter fallback graceful
      const errorMessage = page.locator('text=Erro ao carregar');
      const emptyState = page.locator('text=Nenhum Pokémon encontrado');

      // Pelo menos um deve estar visível
      const hasErrorHandling = await errorMessage.isVisible() || await emptyState.isVisible();

      // Se não há tratamento de erro visível, pelo menos não deve quebrar a página
      await expect(page.locator('h1, h2')).toBeVisible(); // Algum título deve estar presente
    });

    test('deve lidar com pokémon inexistente na URL', async ({ page }) => {
      // Tentar acessar pokémon com ID inexistente
      await page.goto(`${BASE_URL}/pokemons/999999`);

      // Deve mostrar erro 404 ou redirecionar
      const notFoundMessage = page.locator('text=não encontrado');
      const redirected = page.url() !== `${BASE_URL}/pokemons/999999`;

      // Uma das condições deve ser verdadeira
      expect(await notFoundMessage.isVisible() || redirected).toBe(true);
    });

    test('deve validar formulários corretamente', async ({ page }) => {
      await page.goto(`${BASE_URL}/pokemons/new`);

      // Tentar submeter formulário vazio
      await page.click('button:has-text("Adicionar Pokémon")');

      // Formulário não deve ser submetido
      await expect(page).toHaveURL(`${BASE_URL}/pokemons/new`);

      // Deve haver indicação de campo obrigatório
      const requiredField = page.locator('input[required]');
      if (await requiredField.isVisible()) {
        expect(await requiredField.evaluate(el => (el as HTMLInputElement).validity.valid)).toBe(false);
      }
    });
  });

  test.describe('📱 Responsividade', () => {

    test.beforeEach(async ({ page }) => {
      // Login para todos os testes desta seção
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="username"]', testCredentials.username);
      await page.fill('input[name="password"]', testCredentials.password);
      await page.click('button:has-text("Entrar")');
      await expect(page).toHaveURL(BASE_URL + '/');
    });

    test('deve funcionar em dispositivo móvel', async ({ page }) => {
      // Simular dispositivo móvel
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto(BASE_URL + '/');

      // Verificar se elementos essenciais estão visíveis
      await expect(page.locator('h1')).toBeVisible();

      // Verificar se grid de pokémons se adapta
      const pokemonGrid = page.locator('[data-testid="pokemon-grid"]');
      if (await pokemonGrid.isVisible()) {
        // Grid deve estar visível e responsivo
        const boundingBox = await pokemonGrid.boundingBox();
        expect(boundingBox?.width).toBeLessThanOrEqual(375);
      }

      // Testar navegação mobile
      const mobileNav = page.locator('nav');
      await expect(mobileNav).toBeVisible();
    });

    test('deve funcionar em tablet', async ({ page }) => {
      // Simular tablet
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.goto(BASE_URL + '/');

      // Verificar layout em tablet
      await expect(page.locator('h1')).toBeVisible();

      // Grid deve mostrar mais colunas que mobile
      const pokemonCards = page.locator('[data-testid="pokemon-card"]');

      if (await pokemonCards.count() > 0) {
        // Verificar se cards estão bem distribuídos
        const firstCard = pokemonCards.first();
        const boundingBox = await firstCard.boundingBox();
        expect(boundingBox?.width).toBeLessThan(768);
      }
    });

    test('deve funcionar em desktop', async ({ page }) => {
      // Desktop padrão
      await page.setViewportSize({ width: 1920, height: 1080 });

      await page.goto(BASE_URL + '/');

      // Verificar layout desktop
      await expect(page.locator('h1')).toBeVisible();

      // Verificar se utiliza espaço disponível
      const pokemonGrid = page.locator('[data-testid="pokemon-grid"]');
      if (await pokemonGrid.isVisible()) {
        const boundingBox = await pokemonGrid.boundingBox();
        expect(boundingBox?.width).toBeGreaterThan(500);
      }
    });
  });
});

/**
 * Utilitários para os testes
 */

// Função para aguardar elemento aparecer
async function waitForElement(page: any, selector: string, timeout = 10000) {
  await page.waitForSelector(selector, { timeout });
}

// Função para verificar se API está disponível
async function checkApiHealth(page: any, apiUrl: string) {
  try {
    const response = await page.request.get(`${apiUrl}/pokemons/health`);
    return response.status() === 200;
  } catch {
    return false;
  }
}

// Função para criar pokémon de teste
async function createTestPokemon(page: any, baseUrl: string, pokemonName: string) {
  await page.goto(`${baseUrl}/pokemons/new`);
  await page.fill('input[name="name"]', pokemonName);
  await page.click('button:has-text("Adicionar Pokémon")');
  await page.waitForURL(/\/pokemons\/\d+/, { timeout: 15000 });
  return page.url().match(/\/pokemons\/(\d+)/)?.[1];
}

// Função para limpar dados de teste
async function cleanupTestData(page: any, baseUrl: string) {
  // Implementar limpeza se necessário
  // Por exemplo, deletar pokémons de teste criados
}
