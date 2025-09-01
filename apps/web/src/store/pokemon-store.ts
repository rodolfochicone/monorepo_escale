import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { toast } from 'sonner';
import { Pokemon, CreatePokemonDto, UpdatePokemonDto, ApiError, PaginationParams, PaginatedResponse } from '@/types/pokemon';
import { pokemonApi } from '@/services/api';

interface PokemonStore {
  pokemons: Pokemon[];
  selectedPokemon: Pokemon | null;
  loading: boolean;
  error: string | null;

  paginationData: PaginatedResponse<Pokemon> | null;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  typeFilter: string;

  fetchPokemons: () => Promise<void>;
  fetchPokemonById: (id: number) => Promise<void>;
  createPokemon: (data: CreatePokemonDto) => Promise<Pokemon | null>;
  updatePokemon: (id: number, data: UpdatePokemonDto) => Promise<Pokemon | null>;
  deletePokemon: (id: number) => Promise<boolean>;
  clearError: () => void;
  clearSelectedPokemon: () => void;
  setLoading: (loading: boolean) => void;

  fetchPaginatedPokemons: (params?: PaginationParams) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: string) => void;
  resetFilters: () => void;
}

export const usePokemonStore = create<PokemonStore>()(
  devtools(
    (set, get) => ({
      pokemons: [],
      selectedPokemon: null,
      loading: false,
      error: null,

      paginationData: null,
      currentPage: 1,
      pageSize: 10,
      searchQuery: '',
      typeFilter: '',

      // Ações
      fetchPokemons: async () => {
        set({ loading: true, error: null });
        try {
          const pokemons = await pokemonApi.getAllPokemons();
          set({ pokemons, loading: false });
        } catch (error) {
          const apiError = error as ApiError;
          const errorMessage = apiError.message || 'Erro ao buscar Pokémons';
          set({
            error: errorMessage,
            loading: false
          });
          toast.error(errorMessage);
        }
      },

      fetchPokemonById: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const pokemon = await pokemonApi.getPokemonById(id);
          set({ selectedPokemon: pokemon, loading: false });
        } catch (error) {
          const apiError = error as ApiError;
          const errorMessage = apiError.message || 'Erro ao buscar Pokémon';
          set({
            error: errorMessage,
            loading: false
          });
          toast.error(errorMessage);
        }
      },

      createPokemon: async (data: CreatePokemonDto) => {
        set({ loading: true, error: null });
        try {
          const newPokemon = await pokemonApi.createPokemon(data);
          const currentPokemons = get().pokemons;
          set({
            pokemons: [...currentPokemons, newPokemon],
            loading: false
          });
          toast.success(`${newPokemon.name} foi adicionado à sua coleção!`);
          return newPokemon;
        } catch (error) {
          const apiError = error as ApiError;
          const errorMessage = apiError.message || 'Erro ao criar Pokémon';
          set({
            error: errorMessage,
            loading: false
          });
          toast.error(errorMessage);
          return null;
        }
      },

      updatePokemon: async (id: number, data: UpdatePokemonDto) => {
        set({ loading: true, error: null });
        try {
          const updatedPokemon = await pokemonApi.updatePokemon(id, data);
          const currentPokemons = get().pokemons;
          const updatedPokemons = currentPokemons.map(pokemon =>
            pokemon.id === id ? updatedPokemon : pokemon
          );
          set({
            pokemons: updatedPokemons,
            selectedPokemon: updatedPokemon,
            loading: false
          });
          toast.success(`${updatedPokemon.name} foi atualizado com sucesso!`);
          return updatedPokemon;
        } catch (error) {
          const apiError = error as ApiError;
          const errorMessage = apiError.message || 'Erro ao atualizar Pokémon';
          set({
            error: errorMessage,
            loading: false
          });
          toast.error(errorMessage);
          return null;
        }
      },

      deletePokemon: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const pokemonToDelete = get().pokemons.find(p => p.id === id);
          await pokemonApi.deletePokemon(id);
          const currentPokemons = get().pokemons;
          const filteredPokemons = currentPokemons.filter(pokemon => pokemon.id !== id);
          set({
            pokemons: filteredPokemons,
            selectedPokemon: null,
            loading: false
          });
          toast.success(`${pokemonToDelete?.name || 'Pokémon'} foi removido da sua coleção!`);
          return true;
        } catch (error) {
          const apiError = error as ApiError;
          const errorMessage = apiError.message || 'Erro ao deletar Pokémon';
          set({
            error: errorMessage,
            loading: false
          });
          toast.error(errorMessage);
          return false;
        }
      },

      clearError: () => set({ error: null }),
      clearSelectedPokemon: () => set({ selectedPokemon: null }),
      setLoading: (loading: boolean) => set({ loading }),

      // Implementações das ações de paginação
      fetchPaginatedPokemons: async (params?: PaginationParams) => {
        set({ loading: true, error: null });
        try {
          const { currentPage, pageSize, searchQuery, typeFilter } = get();

          const requestParams: PaginationParams = {
            page: params?.page ?? currentPage,
            limit: params?.limit ?? pageSize,
            search: params?.search ?? (searchQuery || undefined),
            type: params?.type ?? (typeFilter || undefined),
            ...params
          };

          console.log('🔍 Store.fetchPaginatedPokemons() - Parâmetros:', requestParams);

          const paginatedResponse = await pokemonApi.getPaginatedPokemons(requestParams);

          console.log('📊 Store.fetchPaginatedPokemons() - Response:', {
            data: paginatedResponse.data.length + ' pokemons',
            meta: paginatedResponse.meta
          });

          set({
            paginationData: paginatedResponse,
            pokemons: paginatedResponse.data, // Manter compatibilidade
            currentPage: paginatedResponse.meta.page,
            loading: false
          });
        } catch (error) {
          const apiError = error as ApiError;
          const errorMessage = apiError.message || 'Erro ao buscar Pokémons';
          console.error('❌ Store.fetchPaginatedPokemons() - Erro:', error);
          set({
            error: errorMessage,
            loading: false
          });
          toast.error(errorMessage);
        }
      },

      setPage: (page: number) => {
        console.log('📄 Store.setPage() - Mudando para página:', page);
        set({ currentPage: page });
        get().fetchPaginatedPokemons({ page });
      },

      setPageSize: (size: number) => {
        set({ pageSize: size, currentPage: 1 });
        get().fetchPaginatedPokemons({ limit: size, page: 1 });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query, currentPage: 1 });
        get().fetchPaginatedPokemons({ search: query, page: 1 });
      },

      setTypeFilter: (type: string) => {
        set({ typeFilter: type, currentPage: 1 });
        get().fetchPaginatedPokemons({ type, page: 1 });
      },

      resetFilters: () => {
        set({ searchQuery: '', typeFilter: '', currentPage: 1 });
        get().fetchPaginatedPokemons({ search: undefined, type: undefined, page: 1 });
      },
    }),
    {
      name: 'pokemon-store',
    }
  )
);
