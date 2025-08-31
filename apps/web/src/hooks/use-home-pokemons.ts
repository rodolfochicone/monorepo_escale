import { useState, useCallback, useEffect } from 'react';
import { Pokemon, PaginationParams } from '@/types/pokemon';
import { pokemonApi } from '@/services/api';
import { toast } from 'sonner';

interface HomePagePokemonState {
  pokemons: Pokemon[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  totalItems: number;
}

const ITEMS_PER_LOAD = 6;

export const useHomePokemons = () => {
  const [state, setState] = useState<HomePagePokemonState>({
    pokemons: [],
    loading: false,
    loadingMore: false,
    error: null,
    currentPage: 0,
    hasMore: true,
    totalItems: 0,
  });

  // Carregar pokémons iniciais
  const loadInitialPokemons = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null, currentPage: 0 }));

    try {
      const params: PaginationParams = {
        page: 1,
        limit: ITEMS_PER_LOAD,
      };

      const response = await pokemonApi.getPaginatedPokemons(params);

      setState(prev => ({
        ...prev,
        pokemons: response.data,
        loading: false,
        currentPage: 1,
        hasMore: response.data.length === ITEMS_PER_LOAD && response.meta.hasNext,
        totalItems: response.meta.total,
      }));
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao carregar Pokémons';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      toast.error(errorMessage);
    }
  }, []);

  // Carregar mais pokémons
  const loadMorePokemons = useCallback(async () => {
    if (state.loading || state.loadingMore || !state.hasMore) return;

    setState(prev => ({ ...prev, loadingMore: true, error: null }));

    try {
      const nextPage = state.currentPage + 1;
      const params: PaginationParams = {
        page: nextPage,
        limit: ITEMS_PER_LOAD,
      };

      const response = await pokemonApi.getPaginatedPokemons(params);

      setState(prev => ({
        ...prev,
        pokemons: [...prev.pokemons, ...response.data],
        loadingMore: false,
        currentPage: nextPage,
        hasMore: response.data.length === ITEMS_PER_LOAD && response.meta.hasNext,
      }));

      toast.success(`${response.data.length} novo${response.data.length !== 1 ? 's' : ''} Pokémon${response.data.length !== 1 ? 's' : ''} carregado${response.data.length !== 1 ? 's' : ''}!`);
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao carregar mais Pokémons';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loadingMore: false,
      }));
      toast.error(errorMessage);
    }
  }, [state.currentPage, state.hasMore, state.loading, state.loadingMore]);

  // Filtrar pokémons localmente (para busca na página inicial)
  const searchPokemons = useCallback((query: string) => {
    if (!query.trim()) return state.pokemons;

    const lowerQuery = query.toLowerCase();
    return state.pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(lowerQuery) ||
      pokemon.types.some(type => type.toLowerCase().includes(lowerQuery)) ||
      pokemon.abilities.some(ability => ability.toLowerCase().includes(lowerQuery))
    );
  }, [state.pokemons]);

  // Limpar erro
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Carregar pokémons na inicialização
  useEffect(() => {
    loadInitialPokemons();
  }, [loadInitialPokemons]);

  return {
    // Estado
    pokemons: state.pokemons,
    loading: state.loading,
    loadingMore: state.loadingMore,
    error: state.error,
    hasMore: state.hasMore,
    totalItems: state.totalItems,
    pokemonCount: state.pokemons.length,

    // Ações
    loadMorePokemons,
    searchPokemons,
    clearError,

    // Estados utilitários
    isInitialLoading: state.loading && state.pokemons.length === 0,
    hasPokemons: state.pokemons.length > 0,
  };
};
