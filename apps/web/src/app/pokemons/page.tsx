"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PokemonList } from "@/components/pokemon/pokemon-list";
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
    fetchPokemons,
    clearError
  } = usePokemon();

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  const handlePokemonClick = (pokemon: Pokemon) => {
    router.push(`/pokemons/${pokemon.id}`);
  };

  const handleAddPokemon = () => {
    router.push("/pokemons/new");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Minha Coleção Pokémon
            </h1>
            <p className="text-muted-foreground">
              {pokemonCount > 0
                ? `${pokemonCount} Pokémon${pokemonCount !== 1 ? "s" : ""} na sua coleção`
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

        {/* Lista de Pokémons */}
        <PokemonList
          pokemons={pokemons}
          loading={loading}
          onPokemonClick={handlePokemonClick}
          showFilters={true}
          variant="grid"
        />

        {/* Call-to-action quando não há Pokémons */}
        {!loading && pokemonCount === 0 && !error && (
          <div className="text-center mt-12">
            <div className="max-w-md mx-auto">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
