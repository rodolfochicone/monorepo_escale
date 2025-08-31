# Stack Tecnológico e Justificativas

Este documento detalha a stack tecnológica recomendada para o projeto, conforme especificado no prompt, com justificativas para cada escolha.

## Stack Principal

| Categoria          | Tecnologia          | Versão Recomendada | Justificativa                                                                                             |
| ------------------ | ------------------- | ------------------ | --------------------------------------------------------------------------------------------------------- |
| **Linguagem**      | TypeScript          | `5.x`              | Essencial para a robustez e escalabilidade do projeto, adicionando segurança de tipos ao JavaScript.      |
| **Monorepo**       | Turborepo           | `latest`           | Ferramenta de alta performance para gerenciar monorepos, otimizando builds, testes e compartilhamento de código. |
| **Backend**        | NestJS (ou Express) | `10.x`             | Framework Node.js robusto e opinativo que organiza o código em módulos, facilitando a manutenção.       |
| **Banco de Dados** | PostgreSQL          | `15`               | Banco de dados relacional poderoso, confiável e com suporte a tipos de dados avançados como JSONB.        |
| **ORM**            | Drizzle ORM         | `latest`           | ORM leve e "TypeScript-native" que oferece máxima segurança de tipos e performance próxima ao SQL puro.   |
| **Autenticação**   | Better Auth         | `latest`           | Solução moderna para implementar fluxos de autenticação de forma segura e simplificada.                   |
| **Frontend**       | React (com Next.js) | `18.x`             | Biblioteca líder para construção de interfaces, com um vasto ecossistema e excelente performance.         |
| **UI Framework**   | Shadcn/ui           | `latest`           | Coleção de componentes de UI reutilizáveis e acessíveis, construídos sobre Tailwind CSS e Radix UI.      |
| **CSS**            | Tailwind CSS        | `3.x`              | Framework CSS "utility-first" que permite a criação de designs customizados de forma rápida e eficiente.  |
| **State Mgmt**     | Zustand             | `4.x`              | Gerenciador de estado minimalista para React, oferecendo uma API simples e poderosa sem boilerplate.    |
| **Container**      | Docker              | `latest`           | Essencial para criar ambientes de desenvolvimento consistentes e portáveis, especialmente para o BD.       |

## Dependências Principais

### Backend (`apps/api`)

-   `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
-   `typescript`
-   `pg`, `drizzle-orm`, `drizzle-kit`
-   `better-auth`
-   `class-validator`, `class-transformer` (para DTOs)
-   `axios` (para chamadas à PokéAPI)

### Frontend (`apps/web`)

-   `react`, `react-dom`
-   `next` (se usado)
-   `tailwindcss`, `postcss`, `autoprefixer`
-   `shadcn-ui`, `lucide-react` (ícones)
-   `zustand`
-   `axios`
-   `react-hook-form` (para formulários)

Esta stack foi selecionada para garantir um desenvolvimento moderno, produtivo e escalável, alinhado com as melhores práticas do mercado e os requisitos do projeto.
