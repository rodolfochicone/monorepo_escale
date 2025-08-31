import { useCallback } from 'react';
import { usePokemonStore } from '@/store/pokemon-store';
import type { CreatePokemonDto, UpdatePokemonDto } from '@/types/pokemon';

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

    // Ações
    fetchPokemons: handleFetchPokemons,
    fetchPokemonById: handleFetchPokemonById,
    createPokemon: handleCreatePokemon,
    updatePokemon: handleUpdatePokemon,
    deletePokemon: handleDeletePokemon,
    clearError: handleClearError,
    clearSelectedPokemon: handleClearSelectedPokemon,

    // Utilitários
    getPokemonById,
    searchPokemons,
  };
};
