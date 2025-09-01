# 🌐 Documentação da API

## 📋 Índice

- [🚀 Visão Geral](#-visão-geral)
- [🔐 Autenticação](#-autenticação)
- [📝 Endpoints](#-endpoints)
- [📊 Modelos de Dados](#-modelos-de-dados)
- [⚠️ Códigos de Erro](#️-códigos-de-erro)
- [🧪 Exemplos Práticos](#-exemplos-práticos)

---

## 🚀 Visão Geral

### Base URL
- **Desenvolvimento**: `http://localhost:3333`
- **Produção**: `https://api.pokemon-manager.com`

### Documentação Interativa
- **Swagger UI**: `/api/docs`
- **Formato**: OpenAPI 3.0
- **Funcionalidades**: Try it out, exemplos, autenticação

### Tecnologias
- **Framework**: NestJS 10.x
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validação**: class-validator
- **Documentação**: Swagger/OpenAPI

---

## 🔐 Autenticação

### Sistema de Autenticação
A API utiliza **JWT (JSON Web Tokens)** para autenticação e autorização.

### Credenciais Padrão
```json
{
  "username": "admin",
  "password": "password"
}
```

### Fluxo de Autenticação

#### 1. **Login**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

#### 2. **Resposta de Sucesso**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

#### 3. **Usar Token**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Endpoints Protegidos
Os seguintes endpoints requerem autenticação JWT:
- `POST /pokemons` - Criar pokémon
- `PATCH /pokemons/:id` - Atualizar pokémon  
- `DELETE /pokemons/:id` - Remover pokémon

### Endpoints Públicos
- `GET /pokemons` - Listar pokémons
- `GET /pokemons/:id` - Buscar pokémon por ID
- `GET /pokemons/health` - Verificar saúde da API
- `POST /auth/login` - Realizar login

---

## 📝 Endpoints

### 🏥 Health Check

#### `GET /pokemons/health`
Verifica se a API está funcionando.

**Resposta:**
```json
{
  "status": "ok",
  "message": "Pokemon API is working!"
}
```

---

### 🔐 Autenticação

#### `POST /auth/login`
Realiza autenticação e retorna JWT.

**Body:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Resposta de Sucesso (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

**Resposta de Erro (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "timestamp": "2025-08-31T20:30:00.000Z",
  "path": "/auth/login"
}
```

---

### 📋 Pokémons - Listagem

#### `GET /pokemons`
Lista pokémons com paginação e filtros.

**Query Parameters:**
```typescript
page?: number     // Página desejada (padrão: 1)
limit?: number    // Itens por página (padrão: 10, máx: 100)
search?: string   // Buscar por nome
type?: string     // Filtrar por tipo
```

**Exemplo de Requisição:**
```http
GET /pokemons?page=1&limit=5&search=pika&type=electric
```

**Resposta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "pikachu",
      "pokedexId": 25,
      "imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
      "types": ["electric"],
      "abilities": ["static", "lightning-rod"],
      "createdAt": "2025-08-31T20:30:00.000Z",
      "updatedAt": "2025-08-31T20:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 150,
    "totalPages": 30,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 👁️ Pokémons - Busca Individual

#### `GET /pokemons/:id`
Busca um pokémon específico por ID.

**Path Parameters:**
- `id` (number) - ID único do pokémon

**Exemplo:**
```http
GET /pokemons/1
```

**Resposta (200):**
```json
{
  "id": 1,
  "name": "pikachu",
  "pokedexId": 25,
  "imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  "types": ["electric"],
  "abilities": ["static", "lightning-rod"],
  "createdAt": "2025-08-31T20:30:00.000Z",
  "updatedAt": "2025-08-31T20:30:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "statusCode": 404,
  "message": "Pokemon with ID 999 not found",
  "error": "Not Found",
  "timestamp": "2025-08-31T20:30:00.000Z",
  "path": "/pokemons/999"
}
```

---

### ➕ Pokémons - Criação

#### `POST /pokemons` 🔒
Cria um novo pokémon buscando dados na PokéAPI.

**Requer Autenticação:** ✅

**Body:**
```json
{
  "name": "charizard"
}
```

**Resposta (201):**
```json
{
  "id": 2,
  "name": "charizard",
  "pokedexId": 6,
  "imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
  "types": ["fire", "flying"],
  "abilities": ["blaze", "solar-power"],
  "createdAt": "2025-08-31T20:35:00.000Z",
  "updatedAt": "2025-08-31T20:35:00.000Z"
}
```

**Processo Interno:**
1. Valida nome do pokémon
2. Busca dados na PokéAPI (`https://pokeapi.co/api/v2/pokemon/{name}`)
3. Extrai informações: ID, tipos, habilidades, imagem
4. Salva no banco de dados
5. Retorna pokémon criado

**Erros Possíveis:**
- `400` - Nome inválido ou vazio
- `401` - Token ausente/inválido
- `404` - Pokémon não encontrado na PokéAPI
- `500` - Erro interno ou falha na PokéAPI

---

### ✏️ Pokémons - Atualização

#### `PATCH /pokemons/:id` 🔒
Atualiza um pokémon existente.

**Requer Autenticação:** ✅

**Path Parameters:**
- `id` (number) - ID do pokémon a ser atualizado

**Body:**
```json
{
  "name": "raichu"  // Opcional
}
```

**Resposta (200):**
```json
{
  "id": 1,
  "name": "raichu",
  "pokedexId": 26,
  "imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png",
  "types": ["electric"],
  "abilities": ["static", "lightning-rod"],
  "createdAt": "2025-08-31T20:30:00.000Z",
  "updatedAt": "2025-08-31T20:40:00.000Z"
}
```

**Comportamento:**
- Se `name` fornecido: busca novos dados na PokéAPI
- Atualiza `updatedAt` automaticamente
- Valida se pokémon existe no banco antes de atualizar

---

### 🗑️ Pokémons - Remoção

#### `DELETE /pokemons/:id` 🔒
Remove um pokémon permanentemente.

**Requer Autenticação:** ✅

**Path Parameters:**
- `id` (number) - ID do pokémon a ser removido

**Resposta (204):**
```
No Content
```

**Comportamento:**
- Verifica se pokémon existe
- Remove permanentemente do banco
- Retorna status 204 (sem conteúdo)

---

## 📊 Modelos de Dados

### Pokemon
```typescript
interface Pokemon {
  id: number;                    // ID único no banco de dados
  name: string;                  // Nome do pokémon (lowercase)
  pokedexId: number;             // ID da pokédex nacional
  imageUrl: string | null;       // URL da imagem do pokémon
  types: string[];               // Array de tipos (ex: ["fire", "flying"])
  abilities: string[];           // Array de habilidades
  createdAt: Date;               // Data de criação do registro
  updatedAt: Date;               // Data da última atualização
}
```

### CreatePokemonDto
```typescript
interface CreatePokemonDto {
  name: string;                  // Nome do pokémon (obrigatório, 1-50 chars)
}
```

### UpdatePokemonDto
```typescript
interface UpdatePokemonDto {
  name?: string;                 // Nome do pokémon (opcional, 1-50 chars)
}
```

### PaginationParams
```typescript
interface PaginationParams {
  page?: number;                 // Página (mín: 1, padrão: 1)
  limit?: number;                // Itens por página (mín: 1, máx: 100, padrão: 10)
  search?: string;               // Termo de busca por nome
  type?: string;                 // Filtro por tipo
}
```

### PaginatedResponse<T>
```typescript
interface PaginatedResponse<T> {
  data: T[];                     // Array de dados da página atual
  meta: {
    page: number;                // Página atual
    limit: number;               // Itens por página
    total: number;               // Total de itens encontrados
    totalPages: number;          // Total de páginas disponíveis
    hasNext: boolean;            // Existe próxima página
    hasPrev: boolean;            // Existe página anterior
  };
}
```

### LoginDto
```typescript
interface LoginDto {
  username: string;              // Nome de usuário (obrigatório)
  password: string;              // Senha (obrigatória, min: 1 char)
}
```

### LoginResponse
```typescript
interface LoginResponse {
  access_token: string;          // JWT token
  user: {
    id: number;                  // ID do usuário
    username: string;            // Nome de usuário
  };
}
```

---

## ⚠️ Códigos de Erro

### Códigos HTTP Utilizados

#### **2xx - Sucesso**
- `200 OK` - Requisição processada com sucesso
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Operação bem-sucedida sem conteúdo de retorno

#### **4xx - Erro do Cliente**
- `400 Bad Request` - Dados de entrada inválidos
- `401 Unauthorized` - Autenticação ausente ou inválida
- `404 Not Found` - Recurso não encontrado
- `422 Unprocessable Entity` - Dados válidos mas não processáveis

#### **5xx - Erro do Servidor**
- `500 Internal Server Error` - Erro interno do servidor

### Estrutura de Erro Padrão
```typescript
interface ErrorResponse {
  statusCode: number;            // Código HTTP
  message: string;               // Mensagem de erro
  error: string;                 // Tipo do erro
  timestamp: string;             // ISO timestamp
  path: string;                  // Caminho da requisição
}
```

### Exemplos de Erros Comuns

#### **Validação de Entrada**
```json
{
  "statusCode": 400,
  "message": "O nome do Pokémon é obrigatório",
  "error": "Bad Request",
  "timestamp": "2025-08-31T20:30:00.000Z",
  "path": "/pokemons"
}
```

#### **Pokémon Não Encontrado na PokéAPI**
```json
{
  "statusCode": 404,
  "message": "Pokémon 'inexistente' não encontrado na PokéAPI",
  "error": "Not Found",
  "timestamp": "2025-08-31T20:30:00.000Z",
  "path": "/pokemons"
}
```

#### **Token Inválido**
```json
{
  "statusCode": 401,
  "message": "Invalid token",
  "error": "Unauthorized",
  "timestamp": "2025-08-31T20:30:00.000Z",
  "path": "/pokemons"
}
```

#### **Erro da PokéAPI**
```json
{
  "statusCode": 500,
  "message": "Erro ao buscar dados da PokéAPI: Network timeout",
  "error": "Internal Server Error",
  "timestamp": "2025-08-31T20:30:00.000Z",
  "path": "/pokemons"
}
```

---

## 🧪 Exemplos Práticos

### Fluxo Completo de Uso

#### 1. **Autenticação**
```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'
```

#### 2. **Criar Pokémon**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3333/pokemons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "pikachu"}'
```

#### 3. **Listar Pokémons**
```bash
curl "http://localhost:3333/pokemons?page=1&limit=10&search=pika"
```

#### 4. **Buscar Pokémon**
```bash
curl http://localhost:3333/pokemons/1
```

#### 5. **Atualizar Pokémon**
```bash
curl -X PATCH http://localhost:3333/pokemons/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "raichu"}'
```

#### 6. **Remover Pokémon**
```bash
curl -X DELETE http://localhost:3333/pokemons/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Exemplo em JavaScript/TypeScript

```typescript
// Cliente da API
class PokemonClient {
  private baseURL = 'http://localhost:3333';
  private token: string | null = null;

  async login(username: string, password: string) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    this.token = data.access_token;
    return data;
  }

  async createPokemon(name: string) {
    const response = await fetch(`${this.baseURL}/pokemons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ name })
    });
    
    return response.json();
  }

  async getPokemons(page = 1, limit = 10, search?: string, type?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (search) params.append('search', search);
    if (type) params.append('type', type);

    const response = await fetch(`${this.baseURL}/pokemons?${params}`);
    return response.json();
  }
}

// Uso
const client = new PokemonClient();

await client.login('admin', 'password');
const newPokemon = await client.createPokemon('charizard');
const pokemons = await client.getPokemons(1, 10, 'pika', 'electric');
```

### Exemplo em Python

```python
import requests

class PokemonClient:
    def __init__(self, base_url="http://localhost:3333"):
        self.base_url = base_url
        self.token = None

    def login(self, username, password):
        response = requests.post(f"{self.base_url}/auth/login", json={
            "username": username,
            "password": password
        })
        data = response.json()
        self.token = data["access_token"]
        return data

    def create_pokemon(self, name):
        response = requests.post(f"{self.base_url}/pokemons", 
            json={"name": name},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        return response.json()

    def get_pokemons(self, page=1, limit=10, search=None, type_filter=None):
        params = {"page": page, "limit": limit}
        if search: params["search"] = search
        if type_filter: params["type"] = type_filter
        
        response = requests.get(f"{self.base_url}/pokemons", params=params)
        return response.json()

# Uso
client = PokemonClient()
client.login("admin", "password")
new_pokemon = client.create_pokemon("charizard")
pokemons = client.get_pokemons(page=1, limit=10, search="pika")
```

---

## 🔗 Links Úteis

### Documentação
- **Swagger UI**: `http://localhost:3333/api/docs`
- **OpenAPI Spec**: `http://localhost:3333/api/docs-json`

### Recursos Externos
- **PokéAPI**: `https://pokeapi.co/docs/v2`
- **NestJS**: `https://docs.nestjs.com`
- **JWT.io**: `https://jwt.io` (para decodificar tokens)

### Ferramentas de Desenvolvimento
- **Postman Collection**: Importar via OpenAPI spec
- **Insomnia**: Suporte nativo ao OpenAPI
- **VSCode REST Client**: Usar arquivos `.http`

---

**🚀 API Pokémon Management - Documentação completa para desenvolvedores!**

*Para exemplos interativos e testes em tempo real, acesse `/api/docs` na sua instância da API.*
