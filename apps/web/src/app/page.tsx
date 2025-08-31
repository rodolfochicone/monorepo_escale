"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useHomePokemons } from "@/hooks/use-home-pokemons";

export default function Home() {
  const {
    pokemons,
    loading,
    loadingMore,
    error,
    hasMore,
    totalItems,
    pokemonCount,
    loadMorePokemons,
    searchPokemons,
    clearError,
    isInitialLoading,
    hasPokemons
  } = useHomePokemons();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPokemons, setFilteredPokemons] = useState(pokemons);

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
          {totalItems > 0 && (
            <p className="text-sm text-muted-foreground">
              {totalItems} Pokémon{totalItems !== 1 ? "s" : ""} na sua coleção {pokemonCount < totalItems && `• ${pokemonCount} carregado${pokemonCount !== 1 ? "s" : ""}`}
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
                {isInitialLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}
                {!isInitialLoading && !hasPokemons && (
                  <p className="text-sm text-muted-foreground">Nenhum Pokémon encontrado</p>
                )}
                {!isInitialLoading && hasPokemons && (
                  <p className="text-sm text-muted-foreground">
                    {totalItems} Pokémon{totalItems !== 1 ? "s" : ""} cadastrado{totalItems !== 1 ? "s" : ""}
                  </p>
                )}
                <Button className="w-full" disabled={isInitialLoading} asChild>
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
              <Button className="w-full" disabled={isInitialLoading} asChild>
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
                disabled={isInitialLoading}
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
                disabled={isInitialLoading || !searchQuery}
                onClick={() => console.log("Buscar:", filteredPokemons)}
              >
                Buscar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Seção da Coleção com "Carregar Mais" */}
        {(hasPokemons || isInitialLoading) && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              {searchQuery ? "Resultados da Busca" : "Sua Coleção"}
            </h2>

            {isInitialLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Carregando sua coleção...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {filteredPokemons.map((pokemon) => (
                    <Card key={pokemon.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <Link href={`/pokemons/${pokemon.id}`}>
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
                              <h3 className="font-semibold capitalize text-sm">{pokemon.name}</h3>
                              <p className="text-xs text-muted-foreground">#{pokemon.pokedexId}</p>
                              <div className="flex flex-wrap justify-center gap-1 mt-2">
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
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Botão Carregar Mais - somente se não estiver buscando e houver mais itens */}
                {!searchQuery && hasMore && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={loadMorePokemons}
                      disabled={loadingMore}
                      variant="outline"
                      size="lg"
                      className="px-8"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Carregando...
                        </>
                      ) : (
                        `Carregar mais (${totalItems - pokemonCount} restantes)`
                      )}
                    </Button>
                  </div>
                )}

                {/* Indicador de busca com resultados limitados */}
                {searchQuery && filteredPokemons.length < pokemons.length && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Mostrando resultados dos {pokemonCount} Pokémons carregados.
                      <br />
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="p-0 h-auto text-xs"
                      >
                        Limpar busca para ver todos
                      </Button>
                    </p>
                  </div>
                )}

                {/* Indicador quando todos os pokémons foram carregados */}
                {!searchQuery && !hasMore && pokemonCount > 0 && (
                  <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                      🎉 Todos os {pokemonCount} Pokémons da sua coleção foram carregados!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Mensagem quando não há pokémons */}
        {!hasPokemons && !isInitialLoading && (
          <div className="text-center mt-8">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="text-6xl">📱</div>
                  <h3 className="text-lg font-semibold">Sua coleção está vazia</h3>
                  <p className="text-sm text-muted-foreground">
                    Comece adicionando seu primeiro Pokémon à sua coleção!
                  </p>
                  <Button asChild>
                    <Link href="/pokemons/new">Adicionar Primeiro Pokémon</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
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