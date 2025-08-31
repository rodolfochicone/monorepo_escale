"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePokemon } from "@/hooks/use-pokemon";

export default function Home() {
  const {
    pokemons,
    loading,
    error,
    pokemonCount,
    fetchPokemons,
    searchPokemons,
    clearError
  } = usePokemon();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPokemons, setFilteredPokemons] = useState(pokemons);

  // Buscar Pokémons na inicialização
  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  // Atualizar lista filtrada quando pokemons ou query mudarem
  useEffect(() => {
    setFilteredPokemons(searchPokemons(searchQuery));
  }, [pokemons, searchQuery, searchPokemons]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Pokémon Management Platform
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Gerencie sua coleção pessoal de Pokémons
          </p>
          {pokemonCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {pokemonCount} Pokémon{pokemonCount !== 1 ? "s" : ""} na sua coleção
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/15 text-destructive rounded-lg">
            <div className="flex items-center justify-between">
              <p>{error}</p>
              <Button variant="ghost" size="sm" onClick={clearError}>
                ✕
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Pokémons</CardTitle>
              <CardDescription>
                Visualize todos os Pokémons cadastrados na sua coleção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {loading && <p className="text-sm text-muted-foreground">Carregando...</p>}
                {!loading && pokemonCount === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhum Pokémon encontrado</p>
                )}
                {!loading && pokemonCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {pokemonCount} Pokémon{pokemonCount !== 1 ? "s" : ""} cadastrado{pokemonCount !== 1 ? "s" : ""}
                  </p>
                )}
                <Button className="w-full" disabled={loading} asChild>
                  <Link href="/pokemons">Ver Pokémons</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adicionar Pokémon</CardTitle>
              <CardDescription>
                Adicione um novo Pokémon à sua coleção buscando na PokéAPI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled={loading} asChild>
                <Link href="/pokemons/new">Adicionar Pokémon</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Buscar Pokémon</CardTitle>
              <CardDescription>
                Encontre um Pokémon específico na sua coleção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Digite o nome do Pokémon..."
                className="mb-4"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={loading}
              />
              <div className="text-xs text-muted-foreground mb-2">
                {searchQuery ? (
                  `${filteredPokemons.length} resultado${filteredPokemons.length !== 1 ? "s" : ""} encontrado${filteredPokemons.length !== 1 ? "s" : ""}`
                ) : (
                  "Digite para buscar por nome, tipo ou habilidade"
                )}
              </div>
              <Button
                className="w-full"
                disabled={loading || !searchQuery}
                onClick={() => console.log("Buscar:", filteredPokemons)}
              >
                Buscar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview dos Pokémons encontrados */}
        {filteredPokemons.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              {searchQuery ? "Resultados da Busca" : "Sua Coleção"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPokemons.slice(0, 8).map((pokemon) => (
                <Card key={pokemon.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                        {pokemon.imageUrl ? (
                          <img
                            src={pokemon.imageUrl}
                            alt={pokemon.name}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <span className="text-2xl">🔥</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">{pokemon.name}</h3>
                        <p className="text-xs text-muted-foreground">#{pokemon.pokedexId}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pokemon.types.slice(0, 2).map((type) => (
                            <span
                              key={type}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredPokemons.length > 8 && (
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  E mais {filteredPokemons.length - 8} Pokémons...
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Frontend com Next.js, Tailwind CSS, shadcn/ui e Zustand | Backend integrado com PokéAPI
          </p>
        </div>
      </div>
    </div>
  );
}