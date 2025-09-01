Prompt Técnico para Análise e Estruturação de Projeto
Objetivo

Analise o arquivo @Teste\ Tecnico\ Senior\ (1).pdf que contém especificações para criação de uma API e frontend, e crie um plano de ação estruturado para desenvolvimento em duas fases: primeiro a API, depois o frontend.

Instruções Específicas
1. Análise do Documento

Leia e compreenda todos os requisitos técnicos e funcionais

Identifique endpoints necessários, modelos de dados, regras de negócio

Mapeie funcionalidades do frontend e suas integrações com a API

Extraia requisitos de autenticação, validações e fluxos de dados

2. Estrutura de Arquivos a Criar

Crie os seguintes arquivos na pasta docs/:

docs/product.md

Descrição completa do serviço/produto

Objetivos e escopo do projeto

Funcionalidades principais

Casos de uso e personas

Critérios de aceitação

docs/structure.md

Estrutura do monorepo usando Turborepo

Separação clara entre backend e frontend

Organização de pastas e módulos

Convenções de nomenclatura

Arquitetura geral do sistema

docs/tech.md

Stack tecnológico recomendado:

Runtime: TypeScript (obrigatório)

Database: PostgreSQL com Drizzle ORM

Authentication: Better Auth

Frontend UI: Shadcn + Tailwind CSS

State Management: Zustand

Monorepo: Turborepo

Justificativas para cada escolha

Versões recomendadas

Dependências principais

3. Arquivos de Configuração
docker-compose.yml

Configuração completa do PostgreSQL

Variáveis de ambiente

Volumes para persistência

Rede para comunicação entre serviços

Configurações de desenvolvimento

4. Arquivos de Execução
requirements.md

Pré-requisitos técnicos (Node.js, Docker, etc.)

Dependências do sistema

Configurações de ambiente

Instruções de instalação

design.md

Arquitetura da API (REST/GraphQL)

Modelagem do banco de dados

Fluxos de autenticação

Padrões de design utilizados

Diagramas de arquitetura (em texto/mermaid)

tasks.md

IMPORTANTE: Quebrar em tarefas pequenas e específicas

Separar claramente as fases:

Fase 1 - API Backend

Setup inicial do projeto

Configuração do banco

Implementação de modelos

Endpoints básicos

Autenticação

Validações

Testes

Fase 2 - Frontend

Setup do frontend

Componentes base

Integração com API

Estados e gerenciamento

UI/UX

Testes

Cada task deve ter:

Título claro

Descrição detalhada

Critérios de aceitação

Estimativa de tempo

Dependências

Formato de Resposta Esperado

Resumo da análise do PDF

Todos os arquivos solicitados com conteúdo completo

Plano de execução priorizado

Considerações técnicas importantes

Próximos passos recomendados

Critérios de Qualidade

Foco em TypeScript como linguagem principal

Estrutura escalável e maintível

Boas práticas de desenvolvimento

Documentação clara e detalhada

Tasks granulares e executáveis

Considerações de segurança e performance

Proceda com a análise completa e criação de todos os arquivos solicitados.

Use mcp context7 para seguir a documentação atualizadas para as tecnologias utilizadas no projeto e use o playwright para testar o frontend.