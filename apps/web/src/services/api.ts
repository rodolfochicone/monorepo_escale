import axios from 'axios';
import type { Pokemon, CreatePokemonDto, UpdatePokemonDto, PokemonListResponse } from '@/types/pokemon';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const authStore = localStorage.getItem('auth-store');
    if (authStore) {
      try {
        const parsed = JSON.parse(authStore);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Erro ao carregar token do localStorage:', error);
      }
    }
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Erro interno do servidor';
    const status = error.response?.status || 500;

    return Promise.reject({ message, status });
  }
);

export const pokemonApi = {
  // Buscar todos os Pokémons
  getAllPokemons: async (): Promise<Pokemon[]> => {
    const response = await api.get<Pokemon[]>('/pokemons');
    return response.data;
  },

  // Buscar Pokémon por ID
  getPokemonById: async (id: number): Promise<Pokemon> => {
    const response = await api.get<Pokemon>(`/pokemons/${id}`);
    return response.data;
  },

  // Criar novo Pokémon
  createPokemon: async (data: CreatePokemonDto): Promise<Pokemon> => {
    const response = await api.post<Pokemon>('/pokemons', data);
    return response.data;
  },

  // Atualizar Pokémon
  updatePokemon: async (id: number, data: UpdatePokemonDto): Promise<Pokemon> => {
    const response = await api.patch<Pokemon>(`/pokemons/${id}`, data);
    return response.data;
  },

  // Deletar Pokémon
  deletePokemon: async (id: number): Promise<void> => {
    await api.delete(`/pokemons/${id}`);
  },
};

export const authApi = {
  // Login
  login: async (credentials: { username: string; password: string }): Promise<{ access_token: string }> => {
    const response = await api.post<{ access_token: string }>('/auth/login', credentials);
    return response.data;
  },
};
