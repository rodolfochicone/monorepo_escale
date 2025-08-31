# Design da API e Modelagem de Dados

## 1. Arquitetura da API

A API será construída seguindo o padrão **REST (Representational State Transfer)**. Ela fornecerá endpoints baseados em recursos para interagir com os dados de Pokémons. A comunicação será feita via JSON sobre HTTP.

A arquitetura interna da API seguirá o padrão **Layered Architecture**, com uma clara separação entre:
-   **Controller Layer**: Responsável por receber as requisições HTTP, validar os dados de entrada (usando DTOs) e orquestrar a resposta.
-   **Service Layer**: Contém a lógica de negócio principal, incluindo a integração com a `PokéAPI`.
-   **Repository/Data Access Layer**: Abstrai a comunicação com o banco de dados, utilizando o Drizzle ORM para construir e executar as queries.

## 2. Modelagem do Banco de Dados

Utilizaremos uma única tabela principal para armazenar os Pokémons cadastrados. O uso do tipo `JSONB` no PostgreSQL oferece flexibilidade para armazenar dados semi-estruturados como tipos e habilidades.

### Tabela: `pokemons`

| Coluna         | Tipo                  | Descrição                                           |
| -------------- | --------------------- | --------------------------------------------------- |
| `id`           | `SERIAL`              | Identificador único (Chave Primária).               |
| `name`         | `VARCHAR(255)`        | Nome do Pokémon. Deve ser único.                    |
| `pokedex_id`   | `INTEGER`             | ID do Pokémon na Pokédex oficial.                   |
| `image_url`    | `TEXT`                | URL da imagem do Pokémon.                           |
| `types`        | `JSONB`               | Array de strings com os tipos (ex: `["fire", "flying"]`). |
| `abilities`    | `JSONB`               | Array de strings com as habilidades.                |
| `created_at`   | `TIMESTAMP WITH TIME ZONE` | Data de criação do registro. Default: `NOW()`.    |
| `updated_at`   | `TIMESTAMP WITH TIME ZONE` | Data da última atualização do registro.             |

### Diagrama de Arquitetura (Mermaid)

```mermaid
graph TD
    subgraph Frontend (React)
        A[UI Components] --> B{State (Zustand)};
        B --> C[API Service];
    end

    subgraph Backend (API)
        D[Controller] --> E[Service];
        E --> F[Repository];
        E --> G[PokéAPI];
    end

    subgraph Database
        H[(PostgreSQL)];
    end

    C -- HTTP Request --> D;
    F -- SQL Query --> H;
    G -- HTTP Request --> I[pokeapi.co];

    style Frontend fill:#cde4f7,stroke:#333,stroke-width:2px
    style Backend fill:#d5e8d4,stroke:#333,stroke-width:2px
    style Database fill:#f8cecc,stroke:#333,stroke-width:2px
```

## 3. Fluxos de Autenticação

A autenticação será gerenciada pela biblioteca **Better Auth**.

1.  **Login:** O usuário envia credenciais (não especificado no desafio, pode ser um usuário fixo ou um sistema simples de registro) para um endpoint `/auth/login`.
2.  **Geração de Token:** Se as credenciais forem válidas, a API gera um **JWT (JSON Web Token)** e o retorna ao cliente.
3.  **Requisições Autenticadas:** O frontend armazena o JWT (em memória ou `localStorage`) e o anexa ao cabeçalho `Authorization` (`Bearer <token>`) em todas as requisições subsequentes para endpoints protegidos.
4.  **Validação na API:** Um middleware na API intercepta cada requisição, valida o JWT e, se for válido, permite o acesso ao recurso solicitado.

Os endpoints de CRUD de Pokémon serão protegidos, exigindo um token válido.

## 4. Padrões de Design Utilizados

-   **Monorepo:** Centraliza o código do projeto para facilitar o gerenciamento.
-   **Layered Architecture (Backend):** Separa as responsabilidades em camadas (Controller, Service, Repository), promovendo baixo acoplamento e alta coesão.
-   **Component-Based Architecture (Frontend):** Estrutura a UI em componentes reutilizáveis e independentes.
-   **Repository Pattern:** Isola a camada de acesso a dados, facilitando a troca de ORM ou banco de dados no futuro.
-   **DTO (Data Transfer Object):** Utilizado para transferir dados entre as camadas e para validar os payloads das requisições.
-   **Dependency Injection:** Utilizado pelo NestJS para gerenciar as dependências entre as classes (services, repositories).
