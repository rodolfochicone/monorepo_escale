# Estrutura do Monorepo e Arquitetura do Sistema

## 1. Estrutura do Monorepo com Turborepo

O projeto será organizado como um monorepo, gerenciado pela ferramenta **Turborepo**. Essa abordagem facilita o compartilhamento de código, a padronização de configurações e a otimização dos processos de build e teste.

A estrutura de pastas principal será a seguinte:

```
/monorepo-pokedex
├── apps/
│   ├── api/          # Aplicação Backend (API REST)
│   └── web/          # Aplicação Frontend (React)
├── packages/
│   ├── ui/           # Pacote de componentes UI compartilhados (Shadcn)
│   ├── eslint-config-custom/ # Configuração de ESLint compartilhada
│   └── tsconfig/     # Configurações TypeScript compartilhadas (tsconfig.json)
├── docker-compose.yml
├── package.json
└── turbo.json
```

## 2. Separação entre Backend e Frontend

-   **`apps/api`**: Conterá todo o código-fonte do backend. Sendo uma aplicação NestJS (ou Express), seguirá uma arquitetura em camadas para separar responsabilidades.
-   **`apps/web`**: Conterá todo o código-fonte do frontend, desenvolvido em React. A estrutura interna seguirá as convenções do Next.js ou Create React App.

## 3. Organização de Pastas e Módulos

### Backend (`apps/api`)

A API seguirá uma arquitetura em camadas (Layered Architecture) para garantir a separação de responsabilidades:

-   **`src/`**
    -   **`modules/`**: Agrupamento de funcionalidades por módulo.
        -   **`pokemon/`**
            -   `pokemon.controller.ts`: Define as rotas da API e lida com as requisições HTTP.
            -   `pokemon.service.ts`: Contém a lógica de negócio.
            -   `pokemon.repository.ts`: Abstrai o acesso ao banco de dados (Drizzle ORM).
            -   `pokemon.entity.ts`: Define o schema do banco de dados.
            -   `pokemon.dto.ts`: Define os Data Transfer Objects para validação.
    -   **`shared/`**: Módulos e serviços compartilhados (ex: configuração, logging).
    -   **`auth/`**: Módulo de autenticação (Better Auth).
    -   `main.ts`: Ponto de entrada da aplicação.

### Frontend (`apps/web`)

O frontend será estruturado com base em componentes:

-   **`src/`**
    -   **`components/`**: Componentes React reutilizáveis.
        -   `ui/`: Componentes base importados do pacote `packages/ui`.
        -   `pokemon/`: Componentes específicos da funcionalidade de Pokémon (ex: `PokemonCard`, `PokemonForm`).
    -   **`pages/`** ou **`routes/`**: Estrutura de roteamento da aplicação.
    -   **`lib/`**: Funções utilitárias e hooks.
    -   **`services/`**: Lógica de comunicação com a API (ex: `api.ts`).
    -   **`store/`**: Configuração e lógica do Zustand para gerenciamento de estado.
    -   `App.tsx`: Componente raiz.

## 4. Convenções de Nomenclatura

-   **Arquivos e Pastas:** `kebab-case` (ex: `pokemon-card.tsx`).
-   **Variáveis e Funções:** `camelCase` (ex: `getPokemonList`).
-   **Classes e Componentes React:** `PascalCase` (ex: `PokemonService`, `PokemonCard`).
-   **Tipos e Interfaces:** `PascalCase` com sufixo `Type` ou `Props` quando aplicável (ex: `PokemonType`, `PokemonCardProps`).

## 5. Arquitetura Geral do Sistema

A arquitetura geral é um sistema cliente-servidor desacoplado, contido em um monorepo.

1.  **Cliente (Frontend):** Uma Single Page Application (SPA) em React que consome a API REST.
2.  **Servidor (Backend):** Uma API REST que lida com a lógica de negócio e a persistência de dados.
3.  **Banco de Dados:** Uma instância PostgreSQL, gerenciada via Docker, para armazenar os dados da aplicação.
4.  **API Externa:** A `PokéAPI` é consultada pelo backend para enriquecer os dados.

Essa arquitetura permite que o frontend e o backend sejam desenvolvidos, testados e implantados de forma independente, enquanto o monorepo com Turborepo mantém a coesão e a eficiência do desenvolvimento.
