"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PokemonList } from "@/components/pokemon/pokemon-list";
import { PokemonFilters } from "@/components/pokemon/pokemon-filters";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { usePokemon } from "@/hooks/use-pokemon";
import { Pokemon } from "@/types/pokemon";

export default function PokemonsPage() {
  const router = useRouter();
  const {
    pokemons,
    loading,
    error,
    pokemonCount,
    clearError,

    paginationData,
    currentPage,
    pageSize,
    searchQuery,
    typeFilter,
    fetchPaginatedPokemons,
    setPage,
    setPageSize,
    setSearchQuery,
    setTypeFilter,
    resetFilters,
    totalPages,
    totalItems,
    hasNextPage,
    hasPrevPage,
  } = usePokemon();

  useEffect(() => {
    fetchPaginatedPokemons();
  }, [fetchPaginatedPokemons]);

  const handlePokemonClick = (pokemon: Pokemon) => {
    router.push(`/pokemons/${pokemon.id}`);
  };

  const handleAddPokemon = () => {
    router.push("/pokemons/new");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Minha Coleção Pokémon
            </h1>
            <p className="text-muted-foreground">
              {totalItems > 0
                ? `${totalItems} Pokémon${totalItems !== 1 ? "s" : ""} na sua coleção`
                : "Sua coleção está vazia"
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/")}>
              ← Voltar ao início
            </Button>
            <Button onClick={handleAddPokemon}>
              Adicionar Pokémon
            </Button>
          </div>
        </div>

        {/* Tratamento de erro */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/15 text-destructive rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Erro ao carregar Pokémons</p>
                <p className="text-sm">{error}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={clearError}>
                ✕
              </Button>
            </div>
          </div>
        )}

        <PokemonFilters
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          pageSize={pageSize}
          onSearchChange={setSearchQuery}
          onTypeFilterChange={setTypeFilter}
          onPageSizeChange={setPageSize}
          onResetFilters={resetFilters}
          className="mb-6"
        />

        {totalItems > 0 && (
          <PaginationInfo
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            className="mb-4"
          />
        )}

        <PokemonList
          pokemons={pokemons}
          loading={loading}
          onPokemonClick={handlePokemonClick}
          showFilters={false}
          variant="grid"
        />

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              hasNext={hasNextPage}
              hasPrev={hasPrevPage}
            />
          </div>
        )}


        {!loading && totalItems === 0 && !error && (
          <div className="text-center mt-12">
            <div className="max-w-md mx-auto">
              {searchQuery || typeFilter ? (
                <>
                  <div className="text-8xl mb-6">🔍</div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Nenhum resultado encontrado
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Não encontramos Pokémons com os filtros aplicados.
                    Tente ajustar sua busca ou remover os filtros.
                  </p>
                  <Button onClick={resetFilters}>
                    Limpar filtros
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-8xl mb-6">✨</div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Comece sua jornada Pokémon!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Adicione seu primeiro Pokémon à coleção e comece a explorar
                    o mundo dos Pokémons com dados da PokéAPI.
                  </p>
                  <Button size="lg" onClick={handleAddPokemon}>
                    Adicionar meu primeiro Pokémon
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
