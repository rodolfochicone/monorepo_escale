# 🐾 Pokémon Management Platform

Sistema completo de gerenciamento de coleção de Pokémons com integração à PokéAPI.

![Pokemon Management](https://img.shields.io/badge/Pokemon-Management-red?style=for-the-badge&logo=pokemon&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)

---

## ✨ **Funcionalidades**

### 🎯 **Sistema Completo:**
- ✅ **CRUD Completo** de Pokémons
- ✅ **Autenticação JWT** com proteção de rotas
- ✅ **Integração PokéAPI** para dados reais
- ✅ **Paginação Avançada** com filtros e busca
- ✅ **Interface Responsiva** (Mobile, Tablet, Desktop)
- ✅ **Carregamento Incremental** ("Carregar mais")
- ✅ **Estados de Loading** e feedback visual
- ✅ **Tratamento de Erros** robusto

### 🎨 **Frontend (React + Next.js):**
- ✅ **Next.js 15** com Turbopack
- ✅ **Tailwind CSS** + **Shadcn/ui**
- ✅ **Zustand** para estado global
- ✅ **React Hook Form** + **Zod** para validação
- ✅ **Axios** para comunicação com API
- ✅ **Sonner** para notificações toast

### ⚙️ **Backend (NestJS + PostgreSQL):**
- ✅ **NestJS 10** com TypeScript
- ✅ **PostgreSQL** + **Drizzle ORM**
- ✅ **Better Auth** para autenticação JWT
- ✅ **class-validator** para validação de DTOs
- ✅ **Axios** para integração com PokéAPI
- ✅ **CORS** configurado para frontend

---

## 📚 **Documentação Completa**

### 🌐 **API - Swagger/OpenAPI**
- **URL Interativa**: `http://localhost:3333/api/docs`
- **Formato**: OpenAPI 3.0.3
- **Recursos**: Try it out, autenticação JWT, exemplos ricos

### 📖 **Documentação Escrita**
- **[📋 API Guide](docs/API.md)** - Documentação completa da API (1.800+ linhas)
- **[🧩 Components](docs/COMPONENTS.md)** - Documentação dos componentes React (2.500+ linhas)
- **[📝 Tasks](docs/tasks.md)** - Cronograma de desenvolvimento

### ✅ **Cobertura de Documentação:**
- **API Endpoints**: 100% (8/8 endpoints)
- **DTOs/Schemas**: 100% (7/7 DTOs)
- **Componentes React**: 100% (15+ componentes)
- **Páginas**: 100% (6/6 páginas)
- **Hooks Customizados**: 100% (2/2 hooks)

---

## 🚀 **Quick Start**

### 📋 **Pré-requisitos**
```bash
Node.js 18+
pnpm 8+
Docker & Docker Compose
PostgreSQL (via Docker)
```

### 1️⃣ **Clone e Setup**
```bash
# Clone o repositório
git clone git@github.com:rodolfochicone/monorepo_escale.git
cd monorepo_escale

# Instalar dependências
pnpm install
```

### 2️⃣ **Configure Banco de Dados**
```bash
# Iniciar PostgreSQL via Docker
docker-compose up -d

# Aplicar schema do banco
cd apps/api
pnpm db:push
```

### 3️⃣ **Variáveis de Ambiente**
```bash
# apps/api/.env
DATABASE_URL="postgresql://postgres:password@localhost:5432/pokemon_db"
JWT_SECRET="your-super-secret-jwt-key"
API_PORT=3333
```

### 4️⃣ **Iniciar Aplicação**
```bash
# Terminal 1: Backend API
cd apps/api
pnpm dev
# 🚀 API: http://localhost:3333
# 📚 Docs: http://localhost:3333/api/docs

# Terminal 2: Frontend React
cd apps/web  
pnpm dev
# 🌐 App: http://localhost:3000
```

---

## 🧪 **Testes**

### ✅ **Suite Completa Implementada**
- **37 testes unitários** (API) ✅
- **48+ cenários E2E** (Frontend) ✅
- **100% funcionalidades críticas** cobertas ✅

### 🧪 **Executar Testes**
```bash
# Testes Unitários da API
cd apps/api && pnpm test

# Testes E2E com Playwright
pnpm test:e2e

# Todos os testes
pnpm test:all

# Cobertura de código
cd apps/api && pnpm test:coverage
```

---

## 🏗️ **Arquitetura**

### 📱 **Frontend (apps/web)**
```
src/
├── app/                    # Pages (App Router)
│   ├── page.tsx           # 🏠 Home + Carregar Mais
│   ├── login/             # 🔐 Autenticação
│   └── pokemons/          # 📋 CRUD Pokémons
├── components/            # 🧩 Componentes reutilizáveis
│   ├── ui/               # shadcn/ui components
│   └── pokemon/          # Componentes específicos
├── hooks/                # 🎣 Hooks customizados
├── store/               # 🏪 Zustand store
├── services/            # 🌐 API clients
└── types/               # 📝 TypeScript interfaces
```

### ⚙️ **Backend (apps/api)**
```
src/
├── main.ts              # 🚀 Bootstrap + Swagger config
├── app.module.ts        # 📦 Main module
├── auth/                # 🔐 Autenticação JWT
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── dto/
├── pokemon/             # 📋 Pokémon CRUD
│   ├── pokemon.controller.ts
│   ├── pokemon.service.ts
│   ├── pokemon.repository.ts
│   └── dto/
└── drizzle/            # 🗄️ Database config
```

---

## 🎯 **Endpoints da API**

### 🔐 **Autenticação**
```http
POST /auth/login          # Login (JWT)
```

### 📋 **Pokémons**
```http
GET  /pokemons           # Listar (paginado + filtros)
GET  /pokemons/:id       # Buscar por ID
POST /pokemons    🔒     # Criar (requer JWT)
PATCH /pokemons/:id 🔒   # Atualizar (requer JWT) 
DELETE /pokemons/:id 🔒  # Remover (requer JWT)
```

### 🏥 **Health Check**
```http
GET /pokemons/health     # Status da API
```

### **Credenciais Padrão:**
```json
{
  "username": "admin",
  "password": "password"
}
```

---

## 🎨 **Tecnologias e Stack**

### **Frontend:**
- **Framework**: Next.js 15.5.2 (App Router)
- **Linguagem**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **Components**: Shadcn/ui
- **Estado**: Zustand 5.x
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios
- **Notifications**: Sonner

### **Backend:**
- **Framework**: NestJS 10.x
- **Linguagem**: TypeScript 5.x
- **Database**: PostgreSQL 15
- **ORM**: Drizzle ORM 0.33
- **Auth**: JWT + Better Auth
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI 3.0

### **DevOps & Tools:**
- **Monorepo**: Turborepo
- **Package Manager**: pnpm 8.x
- **Database**: Docker + docker-compose
- **Testing**: Jest + Playwright
- **Linting**: ESLint + Prettier

---

## 📊 **Integração com PokéAPI**

### 🌐 **Recursos Utilizados:**
- **Endpoint**: `https://pokeapi.co/api/v2/pokemon/{name}`
- **Dados Extraídos**:
  - ID da Pokédex Nacional
  - Nome oficial
  - Tipos (fire, water, electric, etc.)
  - Habilidades (abilities)
  - Sprite/imagem oficial

### ⚡ **Fluxo de Criação:**
1. **Input**: Nome do pokémon (ex: "pikachu")
2. **Validação**: Nome obrigatório (1-50 chars)
3. **PokéAPI**: Busca dados completos
4. **Enriquecimento**: Extração de tipos, habilidades, imagem
5. **Persistência**: Salvar no banco PostgreSQL
6. **Response**: Pokémon completo com dados enriquecidos

---

## 🎭 **Funcionalidades Especiais**

### 🏠 **Página Inicial - "Carregar Mais"**
- ✅ Carregamento incremental de **6 pokémons por vez**
- ✅ Botão dinâmico com contador de restantes
- ✅ Estados de loading diferenciados
- ✅ Busca local nos pokémons já carregados
- ✅ Toasts informativos de progresso
- ✅ Indicador quando todos foram carregados

### 📄 **Paginação Avançada**
- ✅ **Metadados completos**: total, páginas, hasNext, hasPrev
- ✅ **Filtros múltiplos**: nome, tipo, ordenação
- ✅ **Controle de itens**: 5, 10, 20, 50 por página
- ✅ **Navegação intuitiva**: Primeira, Anterior, Próxima, Última
- ✅ **URLs amigáveis**: Query params preservados

### 🔐 **Autenticação JWT**
- ✅ **Proteção de rotas** frontend e backend
- ✅ **Token persistente** com localStorage
- ✅ **Refresh automático** antes da expiração
- ✅ **Logout seguro** com limpeza completa
- ✅ **Guards NestJS** para endpoints protegidos

---

## 🚦 **Status do Projeto**

### ✅ **Fases Concluídas:**
- ✅ **Fase 1**: API Backend (100%)
- ✅ **Fase 2**: Frontend React (100%)  
- ✅ **Task 2.7**: Testes (100%)
- ✅ **Documentação**: Swagger + Markdown (100%)

### 📊 **Métricas:**
- **Endpoints**: 8/8 ✅
- **Páginas**: 6/6 ✅
- **Componentes**: 15+ ✅
- **Testes**: 37 unitários + 48+ E2E ✅
- **Documentação**: 4.800+ linhas ✅
- **Cobertura**: 100% funcionalidades críticas ✅

---

## 🤝 **Contribuição**

### 📋 **Como Contribuir:**
1. **Fork** o repositório
2. **Branch**: `git checkout -b feature/nova-funcionalidade`
3. **Commit**: `git commit -m 'feat: adiciona nova funcionalidade'`
4. **Push**: `git push origin feature/nova-funcionalidade`
5. **Pull Request**: Descreva as mudanças

### 🧪 **Antes de Contribuir:**
```bash
# Executar todos os testes
pnpm test:all

# Verificar linting
pnpm lint

# Verificar build
pnpm build
```

---

## 📞 **Suporte e Links**

### 🔗 **Links Úteis:**
- **[📚 Swagger UI](http://localhost:3333/api/docs)** - Documentação interativa
- **[📋 API Guide](docs/API.md)** - Guia completo da API
- **[🧩 Components](docs/COMPONENTS.md)** - Documentação dos componentes
- **[🌐 PokéAPI](https://pokeapi.co/docs/v2)** - API externa utilizada

### 💬 **Suporte:**
- **Issues**: GitHub Issues para bugs e sugestões
- **Discussions**: GitHub Discussions para perguntas
- **Email**: suporte@pokemon-manager.com

---

## 📄 **Licença**

Este projeto está licenciado sob a **MIT License**.

```
MIT License - Copyright (c) 2025 Pokémon Management Platform
```

---

## 🙏 **Agradecimentos**

### 🎉 **Tecnologias e Comunidades:**
- **[PokéAPI](https://pokeapi.co)** pelos dados públicos de Pokémons
- **[NestJS](https://nestjs.com)** pela arquitetura robusta
- **[Next.js](https://nextjs.org)** pelo framework React otimizado
- **[Shadcn/ui](https://ui.shadcn.com)** pelos componentes elegantes
- **Comunidade Open Source** pelas ferramentas incríveis

---

**🎯 Sistema Pokémon Management Platform - Desenvolvido com ❤️ e as melhores práticas da indústria!**

> 🚀 **Explore a documentação interativa em:** `http://localhost:3333/api/docs`
