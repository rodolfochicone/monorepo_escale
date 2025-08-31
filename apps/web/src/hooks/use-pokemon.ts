import { useCallback } from 'react';
import { usePokemonStore } from '@/store/pokemon-store';
import type { CreatePokemonDto, UpdatePokemonDto, PaginationParams } from '@/types/pokemon';

export const usePokemon = () => {
  const {
    pokemons,
    selectedPokemon,
    loading,
    error,
    fetchPokemons,
    fetchPokemonById,
    createPokemon,
    updatePokemon,
    deletePokemon,
    clearError,
    clearSelectedPokemon,

    // Estado da paginação
    paginationData,
    currentPage,
    pageSize,
    searchQuery,
    typeFilter,

    // Ações de paginação
    fetchPaginatedPokemons,
    setPage,
    setPageSize,
    setSearchQuery,
    setTypeFilter,
    resetFilters,
  } = usePokemonStore();

  // Hook customizado com memoização das ações
  const handleFetchPokemons = useCallback(() => {
    return fetchPokemons();
  }, [fetchPokemons]);

  const handleFetchPokemonById = useCallback((id: number) => {
    return fetchPokemonById(id);
  }, [fetchPokemonById]);

  const handleCreatePokemon = useCallback((data: CreatePokemonDto) => {
    return createPokemon(data);
  }, [createPokemon]);

  const handleUpdatePokemon = useCallback((id: number, data: UpdatePokemonDto) => {
    return updatePokemon(id, data);
  }, [updatePokemon]);

  const handleDeletePokemon = useCallback((id: number) => {
    return deletePokemon(id);
  }, [deletePokemon]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  const handleClearSelectedPokemon = useCallback(() => {
    clearSelectedPokemon();
  }, [clearSelectedPokemon]);

  // Callbacks para ações de paginação
  const handleFetchPaginatedPokemons = useCallback((params?: PaginationParams) => {
    return fetchPaginatedPokemons(params);
  }, [fetchPaginatedPokemons]);

  const handleSetPage = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
  }, [setPageSize]);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  const handleSetTypeFilter = useCallback((type: string) => {
    setTypeFilter(type);
  }, [setTypeFilter]);

  const handleResetFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  // Funcões utilitárias
  const getPokemonById = useCallback((id: number) => {
    return pokemons.find(pokemon => pokemon.id === id) || null;
  }, [pokemons]);

  const searchPokemons = useCallback((query: string) => {
    if (!query.trim()) return pokemons;

    const lowerQuery = query.toLowerCase();
    return pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(lowerQuery) ||
      pokemon.types.some(type => type.toLowerCase().includes(lowerQuery)) ||
      pokemon.abilities.some(ability => ability.toLowerCase().includes(lowerQuery))
    );
  }, [pokemons]);

  const pokemonCount = pokemons.length;
  const hasPokemons = pokemonCount > 0;
  const isLoadingPokemons = loading && pokemons.length === 0;

  return {
    // Estado
    pokemons,
    selectedPokemon,
    loading,
    error,
    pokemonCount,
    hasPokemons,
    isLoadingPokemons,

    // Estado da paginação
    paginationData,
    currentPage,
    pageSize,
    searchQuery,
    typeFilter,

    // Ações
    fetchPokemons: handleFetchPokemons,
    fetchPokemonById: handleFetchPokemonById,
    createPokemon: handleCreatePokemon,
    updatePokemon: handleUpdatePokemon,
    deletePokemon: handleDeletePokemon,
    clearError: handleClearError,
    clearSelectedPokemon: handleClearSelectedPokemon,

    // Ações de paginação
    fetchPaginatedPokemons: handleFetchPaginatedPokemons,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearchQuery: handleSetSearchQuery,
    setTypeFilter: handleSetTypeFilter,
    resetFilters: handleResetFilters,

    // Utilitários
    getPokemonById,
    searchPokemons,

    // Utilitários de paginação
    totalPages: paginationData?.meta?.totalPages || 0,
    totalItems: paginationData?.meta?.total || 0,
    hasNextPage: paginationData?.meta?.hasNext || false,
    hasPrevPage: paginationData?.meta?.hasPrev || false,
  };
};
