# Plano de Execução e Tarefas

O desenvolvimento será dividido em duas fases principais: **API Backend** e **Frontend**. As tarefas são granulares para permitir um desenvolvimento iterativo e focado.

---

## Fase 1 - API Backend

### Task 1.1: Setup do Projeto e Monorepo
-   **Título:** Configurar a estrutura inicial do monorepo com Turborepo.
-   **Descrição:** Inicializar o `pnpm`, configurar o `turbo.json` e criar os workspaces `apps/api` e `apps/web`.
-   **Critérios de Aceitação:** Estrutura de pastas criada; `pnpm install` funciona; Turborepo consegue executar tasks básicas.
-   **Estimativa:** 2 horas.
-   **Dependências:** N/A.

### Task 1.2: Configuração do Docker e Banco de Dados
-   **Título:** Criar e configurar o `docker-compose.yml` para o PostgreSQL.
-   **Descrição:** Definir o serviço do PostgreSQL, volumes para persistência e redes.
-   **Critérios de Aceitação:** `docker-compose up -d` inicia o container do banco de dados com sucesso.
-   **Estimativa:** 1 hora.
-   **Dependências:** N/A.

### Task 1.3: Integração com Drizzle ORM
-   **Título:** Configurar o Drizzle ORM e definir o schema do Pokémon.
-   **Descrição:** Instalar dependências do Drizzle, criar o arquivo de schema (`pokemon.entity.ts`) e configurar a conexão com o banco.
-   **Critérios de Aceitação:** O schema da tabela `pokemons` é criado; O comando `db:push` reflete o schema no banco de dados.
-   **Estimativa:** 3 horas.
-   **Dependências:** Task 1.2.

### Task 1.4: Implementar Endpoint `POST /pokemons`
-   **Título:** Criar o endpoint para cadastrar um novo Pokémon.
-   **Descrição:** Implementar a rota, o controller e o service. A lógica de serviço deve buscar dados na `PokéAPI` para enriquecer o registro antes de salvar.
-   **Critérios de Aceitação:** Endpoint `POST /pokemons` cadastra um Pokémon com dados validados da PokéAPI.
-   **Estimativa:** 4 horas.
-   **Dependências:** Task 1.3.

### Task 1.5: Implementar Endpoints `GET`
-   **Título:** Criar endpoints para listar e consultar Pokémons.
-   **Descrição:** Implementar `GET /pokemons` (listar todos) e `GET /pokemons/:id` (consultar por ID).
-   **Critérios de Aceitação:** Endpoints retornam os dados corretamente.
-   **Estimativa:** 2 horas.
-   **Dependências:** Task 1.4.

### Task 1.6: Implementar Endpoints `PUT/PATCH` e `DELETE`
-   **Título:** Criar endpoints para atualizar e remover Pokémons.
-   **Descrição:** Implementar `PUT /pokemons/:id` e `DELETE /pokemons/:id`.
-   **Critérios de Aceitação:** Endpoints modificam e removem os registros com sucesso.
-   **Estimativa:** 3 horas.
-   **Dependências:** Task 1.4.

### Task 1.7: Configurar Autenticação
-   **Título:** Adicionar autenticação aos endpoints com Better Auth.
-   **Descrição:** Implementar um fluxo de login básico e proteger as rotas de CRUD com um middleware de autenticação.
-   **Critérios de Aceitação:** Acesso aos endpoints de CRUD é bloqueado sem um token JWT válido.
-   **Estimativa:** 3 horas.
-   **Dependências:** Task 1.6.

### Task 1.8: Validações e Tratamento de Erros
-   **Título:** Implementar validações de entrada (DTOs) e tratamento de erros.
-   **Descrição:** Usar `class-validator` nos DTOs e criar um filtro de exceção global para retornar erros HTTP padronizados.
-   **Critérios de Aceitação:** A API retorna códigos de status e mensagens de erro apropriadas para entradas inválidas ou falhas.
-   **Estimativa:** 2 horas.
-   **Dependências:** Task 1.6.

---

## Fase 2 - Frontend

### Task 2.1: Setup do Frontend
-   **Título:** Configurar o projeto React com Tailwind CSS e Shadcn/ui.
-   **Descrição:** Inicializar a aplicação React (Next.js ou CRA), configurar o Tailwind e instalar os componentes base do Shadcn.
-   **Critérios de Aceitação:** Aplicação React renderiza com o estilo do Tailwind e um componente Shadcn de teste.
-   **Estimativa:** 3 horas.
-   **Dependências:** Task 1.1.

### Task 2.2: Configurar Zustand e Comunicação com API
-   **Título:** Configurar o Zustand para gerenciamento de estado e criar um service para a API.
-   **Descrição:** Criar um `store` Zustand para os Pokémons e um módulo (`api.ts`) com `axios` para as chamadas à API backend.
-   **Critérios de Aceitação:** O store é criado e o service consegue fazer uma chamada de teste para a API.
-   **Estimativa:** 2 horas.
-   **Dependências:** Task 2.1.

### Task 2.3: Componente de Listagem de Pokémons
-   **Título:** Criar a página principal que lista os Pokémons.
-   **Descrição:** Desenvolver um componente que busca os dados do endpoint `GET /pokemons` e os exibe em formato de cards ou lista.
-   **Critérios de Aceitação:** A página exibe todos os Pokémons cadastrados.
-   **Estimativa:** 3 horas.
-   **Dependências:** Task 1.5, Task 2.2.

### Task 2.4: Página de Detalhes e Formulário
-   **Título:** Criar a página de detalhes e o formulário de criação/edição.
-   **Descrição:** Criar uma rota dinâmica (`/pokemon/:id`) para detalhes. Desenvolver um formulário (usando `react-hook-form`) que sirva tanto para criar (`POST`) quanto para editar (`PUT`) um Pokémon.
-   **Critérios de Aceitação:** É possível ver os detalhes de um Pokémon. O formulário permite criar e atualizar um Pokémon.
-   **Estimativa:** 5 horas.
-   **Dependências:** Task 2.3.

### Task 2.5: Funcionalidade de Remoção
-   **Título:** Implementar a funcionalidade de remoção de Pokémon.
-   **Descrição:** Adicionar um botão "Remover" na página de detalhes ou na listagem, com um modal de confirmação.
-   **Critérios de Aceitação:** O usuário consegue remover um Pokémon da lista.
-   **Estimativa:** 2 horas.
-   **Dependências:** Task 2.4.

### Task 2.6: UI/UX e Responsividade
-   **Título:** Refinar a interface, adicionar feedback visual e garantir responsividade.
-   **Descrição:** Adicionar toasts/notificações para sucesso/erro, estados de loading e garantir que a aplicação funcione bem em dispositivos móveis.
-   **Critérios de Aceitação:** A aplicação é visualmente agradável e funcional em diferentes tamanhos de tela.
-   **Estimativa:** 3 horas.
-   **Dependências:** Task 2.5.

### Task 2.7: Testes (Opcional)
-   **Título:** Escrever testes unitários/integração para a API e/ou componentes React.
-   **Descrição:** Usar Playwright para testar os fluxos do frontend e Jest/Vitest para testar a lógica da API.
-   **Critérios de Aceitação:** Cobertura de teste mínima para as funcionalidades críticas.
-   **Estimativa:** 8 horas.
-   **Dependências:** Fase 1 e 2.
