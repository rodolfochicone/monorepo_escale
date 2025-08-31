# Requisitos e Instalação

Este documento descreve os pré-requisitos e os passos para configurar e executar o projeto.

## 1. Pré-requisitos Técnicos

Certifique-se de que os seguintes softwares estão instalados em sua máquina:

-   **Node.js**: Versão `20.x` ou superior.
-   **pnpm**: Gerenciador de pacotes. Recomendado para trabalhar com Turborepo.
    -   Instalação: `npm install -g pnpm`
-   **Docker**: Versão `20.x` ou superior.
-   **Docker Compose**: Geralmente vem com a instalação do Docker Desktop.

## 2. Dependências do Sistema

O projeto é autocontido dentro do monorepo e do container Docker. As dependências de Node.js serão gerenciadas pelo `pnpm`.

## 3. Configurações de Ambiente

Antes de iniciar a aplicação backend, é necessário configurar as variáveis de ambiente.

1.  Navegue até a pasta da API: `cd apps/api`
2.  Crie um arquivo chamado `.env` a partir do exemplo: `cp .env.example .env`
3.  Edite o arquivo `.env` com as credenciais do banco de dados. Elas devem corresponder ao que foi definido no `docker-compose.yml`.

    ```env
    # apps/api/.env

    # PostgreSQL
    DATABASE_URL="postgresql://user:password@localhost:5433/pokedex_db"

    # API
    API_PORT=3333
    ```

## 4. Instruções de Instalação e Execução

Siga os passos abaixo para rodar o projeto completo:

1.  **Clonar o Repositório**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_REPOSITORIO>
    ```

2.  **Instalar Dependências**
    Instale todas as dependências do monorepo usando `pnpm`.
    ```bash
    pnpm install
    ```

3.  **Iniciar o Banco de Dados**
    Inicie o container do PostgreSQL em modo "detached" (`-d`).
    ```bash
    docker-compose up -d
    ```

4.  **Executar as Migrations**
    Aplique o schema do Drizzle ORM no banco de dados.
    ```bash
    pnpm --filter api db:push
    ```

5.  **Iniciar as Aplicações**
    Inicie o backend e o frontend em modo de desenvolvimento com o Turborepo.
    ```bash
    pnpm dev
    ```

Após esses passos:
-   A **API backend** estará disponível em `http://localhost:3333`.
-   A **aplicação frontend** estará disponível em `http://localhost:3000`.
