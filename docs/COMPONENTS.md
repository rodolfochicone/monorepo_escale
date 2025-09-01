# 📦 Documentação dos Componentes Frontend

## 📋 Índice

- [🏠 Páginas](#-páginas)
- [🧩 Componentes Reutilizáveis](#-componentes-reutilizáveis)
- [🎣 Hooks Customizados](#-hooks-customizados)
- [🏪 Store/Estado Global](#-storeestado-global)
- [🌐 Serviços](#-serviços)
- [📝 Tipos TypeScript](#-tipos-typescript)
- [🎨 Estilos e UI](#-estilos-e-ui)

---

## 🏠 Páginas

### `app/page.tsx` - Página Inicial
**Localização:** `apps/web/src/app/page.tsx`

Página principal da aplicação que apresenta o sistema e implementa a funcionalidade "carregar mais".

#### **Funcionalidades:**
- ✅ Apresentação do sistema
- ✅ Cards de navegação rápida
- ✅ Coleção de pokémons com carregamento incremental (6 em 6)
- ✅ Botão "Carregar mais" dinâmico
- ✅ Busca local nos pokémons carregados
- ✅ Estados de carregamento e feedback visual
- ✅ Responsividade completa

#### **Hooks Utilizados:**
- `useHomePokemons()` - Hook customizado para carregamento incremental
- `useState()` - Controle de busca local e filtros

#### **Componentes Utilizados:**
- `Card`, `CardContent` - Interface de cards
- `Input` - Campo de busca
- `Button` - Botões de ação
- `Loader2` - Indicador de carregamento

#### **Estados:**
```typescript
const {
  pokemons,           // Pokémons carregados incrementalmente
  loading,            // Loading geral do store
  loadingMore,        // Loading específico do "carregar mais"
  error,              // Erros de carregamento
  hasMore,            // Indica se há mais pokémons
  totalItems,         // Total de pokémons na coleção
  pokemonCount,       // Quantidade carregada atualmente
  loadMorePokemons,   // Função para carregar mais
  searchPokemons,     // Função de busca local
  clearError,         // Limpar erros
  isInitialLoading,   // Loading da primeira carga
  hasPokemons         // Indica se há pokémons na coleção
} = useHomePokemons();

const [searchQuery, setSearchQuery] = useState("");
const [filteredPokemons, setFilteredPokemons] = useState(pokemons);
```

#### **Responsividade:**
- **Mobile:** Grid de 1-2 colunas, navegação otimizada
- **Tablet:** Grid de 3-4 colunas, melhor aproveitamento
- **Desktop:** Grid de até 6 colunas para máxima densidade

---

### `app/login/page.tsx` - Página de Login
**Localização:** `apps/web/src/app/login/page.tsx`

Página de autenticação com formulário de login e redirecionamento automático.

#### **Funcionalidades:**
- ✅ Formulário de login com validação
- ✅ Integração com API de autenticação
- ✅ Redirecionamento pós-login
- ✅ Estados de carregamento
- ✅ Tratamento de erros
- ✅ Interface responsiva

#### **Hooks Utilizados:**
- `useForm()` from `react-hook-form` - Gerenciamento do formulário
- `useRouter()` from `next/navigation` - Navegação programática
- `useAuthStore()` - Estado global de autenticação

#### **Validações:**
```typescript
const schema = z.object({
  username: z.string().min(1, "Username é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});
```

---

### `app/pokemons/page.tsx` - Lista de Pokémons
**Localização:** `apps/web/src/app/pokemons/page.tsx`

Página de listagem completa com paginação e filtros avançados.

#### **Funcionalidades:**
- ✅ Listagem paginada de pokémons
- ✅ Filtros por nome e tipo
- ✅ Ordenação múltipla
- ✅ Navegação de páginas
- ✅ Controle de itens por página
- ✅ Estados vazios e de erro

#### **Componentes Utilizados:**
- `PokemonList` - Lista principal de pokémons
- `PokemonFilters` - Filtros e controles
- `Pagination` - Navegação entre páginas

---

### `app/pokemons/[id]/page.tsx` - Detalhes do Pokémon
**Localização:** `apps/web/src/app/pokemons/[id]/page.tsx`

Página de visualização detalhada de um pokémon específico.

#### **Funcionalidades:**
- ✅ Exibição completa dos dados do pokémon
- ✅ Imagem em alta resolução (artwork)
- ✅ Informações detalhadas (tipos, habilidades)
- ✅ Botões de ação (editar, excluir)
- ✅ Breadcrumb e navegação
- ✅ Design visual atraente

#### **Parametros:**
```typescript
// Next.js 15 - params como Promise
const params = React.use(props.params);
const id = params.id;
```

---

### `app/pokemons/[id]/edit/page.tsx` - Edição de Pokémon
**Localização:** `apps/web/src/app/pokemons/[id]/edit/page.tsx`

Página de edição de pokémons existentes.

#### **Funcionalidades:**
- ✅ Formulário pré-preenchido
- ✅ Validação em tempo real
- ✅ Preview das alterações
- ✅ Cancelamento com confirmação
- ✅ Integração com PokéAPI

---

### `app/pokemons/new/page.tsx` - Criar Pokémon
**Localização:** `apps/web/src/app/pokemons/new/page.tsx`

Página de criação de novos pokémons.

#### **Funcionalidades:**
- ✅ Formulário de criação
- ✅ Busca automática na PokéAPI
- ✅ Preview dos dados encontrados
- ✅ Validação de nome
- ✅ Estados de carregamento

---

## 🧩 Componentes Reutilizáveis

### `PokemonCard` - Card de Pokémon
**Localização:** `apps/web/src/components/pokemon/pokemon-card.tsx`

Componente reutilizável para exibir um pokémon em formato de card.

#### **Props:**
```typescript
interface PokemonCardProps {
  pokemon: Pokemon;                    // Dados do pokémon
  onClick?: (pokemon: Pokemon) => void; // Callback de clique
  variant?: "default" | "compact";     // Variação visual
  "data-testid"?: string;              // ID para testes
}
```

#### **Variantes:**
- **`default`**: Card completo com todas as informações
- **`compact`**: Versão reduzida para listas densas

#### **Funcionalidades:**
- ✅ Imagem do pokémon com fallback
- ✅ Nome capitalizado
- ✅ ID da pokédex
- ✅ Badges de tipos com cores
- ✅ Animações de hover
- ✅ Responsividade automática
- ✅ Suporte a testes automatizados

#### **Exemplo de Uso:**
```tsx
<PokemonCard
  pokemon={pokemon}
  onClick={(p) => router.push(`/pokemons/${p.id}`)}
  variant="default"
  data-testid="pokemon-card"
/>
```

#### **Estados Visuais:**
- **Loading**: Shimmer placeholder
- **Error**: Card com ícone de erro
- **Empty**: Estado vazio customizável
- **Hover**: Elevação e transformações

---

### `PokemonList` - Lista de Pokémons
**Localização:** `apps/web/src/components/pokemon/pokemon-list.tsx`

Componente para exibir uma lista completa de pokémons com filtros.

#### **Props:**
```typescript
interface PokemonListProps {
  pokemons: Pokemon[];                 // Lista de pokémons
  loading?: boolean;                   // Estado de carregamento
  variant?: "default" | "compact";     // Variação visual
  showFilters?: boolean;               // Exibir filtros
  onPokemonClick?: (pokemon: Pokemon) => void; // Callback de clique
}
```

#### **Funcionalidades:**
- ✅ Grid responsivo de pokémons
- ✅ Filtros integrados (nome, tipo, ordenação)
- ✅ Estados de carregamento
- ✅ Estado vazio personalizado
- ✅ Limpeza de filtros
- ✅ Indicadores visuais

#### **Filtros Disponíveis:**
- **Busca por nome**: Filtro em tempo real
- **Filtro por tipo**: Dropdown com todos os tipos
- **Ordenação**: Pokédex, nome, mais recente, mais antigo

---

### `PokemonFilters` - Filtros de Pokémon
**Localização:** `apps/web/src/components/pokemon/pokemon-filters.tsx`

Componente dedicado para filtros e controles de listagem.

#### **Props:**
```typescript
interface PokemonFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: string;
  onTypeChange: (type: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  availableTypes: string[];
  resultsCount: number;
  totalCount: number;
  onClearFilters: () => void;
}
```

#### **Funcionalidades:**
- ✅ Campo de busca com debounce
- ✅ Dropdown de tipos com "Todos"
- ✅ Seletor de ordenação
- ✅ Contador de resultados
- ✅ Botão "Limpar filtros"
- ✅ Estados visuais dos filtros ativos

---

## 🎣 Hooks Customizados

### `useHomePokemons` - Hook para Página Inicial
**Localização:** `apps/web/src/hooks/use-home-pokemons.ts`

Hook especializado para gerenciar o carregamento incremental na página inicial.

#### **Retorno:**
```typescript
interface UseHomePokemonsReturn {
  pokemons: Pokemon[];          // Pokémons carregados incrementalmente
  loading: boolean;             // Loading geral do store
  loadingMore: boolean;         // Loading específico do "carregar mais"
  error: string | null;         // Erros de carregamento
  hasMore: boolean;             // Indica se há mais pokémons
  totalItems: number;           // Total de pokémons na coleção
  pokemonCount: number;         // Quantidade carregada atualmente
  loadMorePokemons: () => void; // Função para carregar mais
  searchPokemons: (query: string) => Pokemon[]; // Busca local
  clearError: () => void;       // Limpar erros
  isInitialLoading: boolean;    // Loading da primeira carga
  hasPokemons: boolean;         // Indica se há pokémons na coleção
}
```

#### **Funcionalidades:**
- ✅ Carregamento incremental de 6 em 6 pokémons
- ✅ Acumulação de pokémons em estado local
- ✅ Busca local nos pokémons já carregados
- ✅ Estados de loading diferenciados
- ✅ Controle de paginação automático
- ✅ Remoção de duplicatas
- ✅ Toasts informativos

#### **Exemplo de Uso:**
```tsx
const {
  pokemons,
  loadingMore,
  hasMore,
  loadMorePokemons,
} = useHomePokemons();

return (
  <>
    <PokemonGrid pokemons={pokemons} />
    {hasMore && (
      <Button onClick={loadMorePokemons} disabled={loadingMore}>
        {loadingMore ? "Carregando..." : "Carregar mais"}
      </Button>
    )}
  </>
);
```

---

## 🏪 Store/Estado Global

### `usePokemonStore` - Store Principal
**Localização:** `apps/web/src/store/pokemon-store.ts`

Store Zustand para gerenciamento global do estado dos pokémons.

#### **Estado:**
```typescript
interface PokemonStore {
  // Estado básico
  pokemons: Pokemon[];                // Lista atual de pokémons
  selectedPokemon: Pokemon | null;    // Pokémon selecionado
  loading: boolean;                   // Estado de carregamento
  error: string | null;               // Erros da aplicação

  // Estado da paginação
  paginationData: PaginatedResponse<Pokemon> | null; // Dados paginados
  currentPage: number;                // Página atual
  pageSize: number;                   // Itens por página
  searchQuery: string;                // Query de busca
  typeFilter: string;                 // Filtro de tipo

  // Ações CRUD
  fetchPokemons: () => Promise<void>;
  fetchPokemonById: (id: number) => Promise<void>;
  createPokemon: (data: CreatePokemonDto) => Promise<Pokemon | null>;
  updatePokemon: (id: number, data: UpdatePokemonDto) => Promise<Pokemon | null>;
  deletePokemon: (id: number) => Promise<boolean>;
  
  // Ações de controle
  clearError: () => void;
  clearSelectedPokemon: () => void;
  setLoading: (loading: boolean) => void; // Controle externo de loading

  // Ações de paginação
  fetchPaginatedPokemons: (params?: PaginationParams) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: string) => void;
  resetFilters: () => void;
}
```

#### **Funcionalidades:**
- ✅ Operações CRUD completas
- ✅ Paginação avançada com metadados
- ✅ Filtros e busca
- ✅ Cache inteligente
- ✅ Estados de loading otimizados
- ✅ Tratamento de erros
- ✅ Toasts automáticos
- ✅ DevTools integrado

---

## 🌐 Serviços

### `pokemonApi` - Cliente da API
**Localização:** `apps/web/src/services/api.ts`

Cliente HTTP configurado para comunicação com a API backend.

#### **Métodos:**
```typescript
interface PokemonApi {
  // CRUD operations
  getAllPokemons(): Promise<Pokemon[]>;
  getPaginatedPokemons(params: PaginationParams): Promise<PaginatedResponse<Pokemon>>;
  getPokemonById(id: number): Promise<Pokemon>;
  createPokemon(data: CreatePokemonDto): Promise<Pokemon>;
  updatePokemon(id: number, data: UpdatePokemonDto): Promise<Pokemon>;
  deletePokemon(id: number): Promise<void>;

  // Auth operations
  login(credentials: LoginDto): Promise<LoginResponse>;
  logout(): Promise<void>;
}
```

#### **Configurações:**
- ✅ Base URL configurável
- ✅ Interceptors para autenticação
- ✅ Tratamento de erros padronizado
- ✅ Timeouts apropriados
- ✅ Retry logic para falhas temporárias
- ✅ Cache de requisições GET

---

## 📝 Tipos TypeScript

### `Pokemon` - Tipo Principal
**Localização:** `apps/web/src/types/pokemon.ts`

```typescript
interface Pokemon {
  id: number;                    // ID único no banco
  name: string;                  // Nome do pokémon
  pokedexId: number;             // ID da pokédex nacional
  imageUrl: string | null;       // URL da imagem
  types: string[];               // Tipos (fire, water, etc.)
  abilities: string[];           // Habilidades
  createdAt: Date;               // Data de criação
  updatedAt: Date;               // Data de atualização
}
```

### `PaginationParams` - Parâmetros de Paginação
```typescript
interface PaginationParams {
  page?: number;                 // Página desejada
  limit?: number;                // Itens por página
  search?: string;               // Termo de busca
  type?: string;                 // Filtro por tipo
}
```

### `PaginatedResponse<T>` - Resposta Paginada
```typescript
interface PaginatedResponse<T> {
  data: T[];                     // Dados da página
  meta: {
    page: number;                // Página atual
    limit: number;               // Itens por página
    total: number;               // Total de itens
    totalPages: number;          // Total de páginas
    hasNext: boolean;            // Há próxima página
    hasPrev: boolean;            // Há página anterior
  };
}
```

---

## 🎨 Estilos e UI

### Design System
O projeto utiliza um design system consistente baseado em:

#### **Cores:**
- **Primary**: Sistema de cores principal
- **Secondary**: Cores secundárias
- **Muted**: Cores neutras
- **Destructive**: Cores para ações perigosas
- **Success**: Cores para feedback positivo

#### **Componentes UI (shadcn/ui):**
- `Button` - Botões com variantes
- `Card` - Cards estruturados
- `Input` - Campos de entrada
- `Select` - Dropdowns
- `Badge` - Badges informativos
- `Dialog` - Modais e dialogs
- `Toast` - Notificações
- `Pagination` - Navegação de páginas
- `Skeleton` - Loading placeholders

#### **Responsividade:**
- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- **Grid System**: CSS Grid responsivo
- **Flexbox**: Layout flexível

#### **Animações:**
- **Hover Effects**: Elevação e transformações
- **Loading States**: Shimmer e spinners
- **Transitions**: Transições suaves
- **Micro-interactions**: Feedback visual

---

## 🧪 Testabilidade

### Data Test IDs
Todos os componentes incluem `data-testid` para testes automatizados:

```typescript
// Exemplos de test IDs utilizados
"pokemon-card"          // Cards individuais de pokémon
"pokemon-grid"          // Grid de pokémons
"search-input"          // Campo de busca
"filter-type"           // Filtro por tipo
"load-more-button"      // Botão carregar mais
"pagination-controls"   // Controles de paginação
```

### Hooks de Teste
Hooks customizados são testáveis isoladamente:

```typescript
// Exemplo de teste do useHomePokemons
const { result } = renderHook(() => useHomePokemons());
expect(result.current.pokemons).toEqual([]);
expect(result.current.loading).toBe(true);
```

---

## 🚀 Performance

### Otimizações Implementadas:
- ✅ **Lazy Loading**: Carregamento sob demanda
- ✅ **Memoização**: React.memo nos componentes
- ✅ **Debounce**: Busca com delay
- ✅ **Cache**: Reutilização de dados
- ✅ **Code Splitting**: Divisão do bundle
- ✅ **Image Optimization**: Next.js Image
- ✅ **Virtual Scrolling**: Para listas grandes

### Métricas de Performance:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Cumulative Layout Shift**: < 0.1

---

## 📚 Documentação Adicional

### Para Desenvolvedores:
- Todos os componentes possuem JSDoc completo
- Props são tipadas com TypeScript
- Exemplos de uso nos comentários
- Testes unitários para cada componente

### Para Designers:
- Figma design tokens integrados
- Guia de cores e tipografia
- Padrões de layout responsivo
- Biblioteca de componentes

### Para QA:
- Test IDs padronizados
- Cenários de teste documentados
- Estados de erro mapeados
- Fluxos de usuário detalhados

---

**📱 Sistema Pokémon Management - Componentes documentados e otimizados para produção!**
