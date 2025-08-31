"use client";

import { useState, useMemo } from "react";
import { Pokemon } from "@/types/pokemon";
import { PokemonCard } from "./pokemon-card";
import { PokemonListSkeleton } from "./pokemon-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PokemonListProps {
  pokemons: Pokemon[];
  loading?: boolean;
  onPokemonClick?: (pokemon: Pokemon) => void;
  showFilters?: boolean;
  variant?: "grid" | "compact";
}

export function PokemonList({
  pokemons,
  loading = false,
  onPokemonClick,
  showFilters = true,
  variant = "grid"
}: PokemonListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("pokedex");

  // Obter tipos únicos dos Pokémons
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    pokemons.forEach(pokemon => {
      pokemon.types.forEach(type => types.add(type));
    });
    return Array.from(types).sort();
  }, [pokemons]);

  // Filtrar e ordenar Pokémons
  const filteredPokemons = useMemo(() => {
    let filtered = pokemons.filter(pokemon => {
      const matchesSearch = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pokemon.types.some(type => type.toLowerCase().includes(searchQuery.toLowerCase())) ||
        pokemon.abilities.some(ability => ability.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === "all" || pokemon.types.includes(typeFilter);

      return matchesSearch && matchesType;
    });

    // Ordenação
    switch (sortBy) {
      case "name":
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "pokedex":
        filtered = filtered.sort((a, b) => a.pokedexId - b.pokedexId);
        break;
      case "newest":
        filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered = filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      default:
        break;
    }

    return filtered;
  }, [pokemons, searchQuery, typeFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setSortBy("pokedex");
  };

  if (loading && pokemons.length === 0) {
    return (
      <div className="space-y-6">
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
              <CardDescription>
                Carregando filtros...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="animate-pulse bg-muted h-10 rounded-md"></div>
                </div>
                <div className="animate-pulse bg-muted h-10 rounded-md"></div>
                <div className="animate-pulse bg-muted h-10 rounded-md"></div>
              </div>
            </CardContent>
          </Card>
        )}
        <PokemonListSkeleton variant={variant} />
      </div>
    );
  }

  if (pokemons.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Nenhum Pokémon encontrado</CardTitle>
          <CardDescription>
            Sua coleção está vazia. Que tal adicionar seu primeiro Pokémon?
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-sm text-muted-foreground">
            Adicione Pokémons à sua coleção para vê-los aqui
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
            <CardDescription>
              Encontre Pokémons específicos na sua coleção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Buscar por nome, tipo ou habilidade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {availableTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <span className="capitalize">{type}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pokedex">Número da Pokédex</SelectItem>
                  <SelectItem value="name">Nome (A-Z)</SelectItem>
                  <SelectItem value="newest">Mais recente</SelectItem>
                  <SelectItem value="oldest">Mais antigo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchQuery || typeFilter !== "all" || sortBy !== "pokedex") && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {filteredPokemons.length} de {pokemons.length} Pokémons
                </p>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lista de Pokémons */}
      {filteredPokemons.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-semibold mb-2">Nenhum resultado encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tente ajustar os filtros ou buscar por outro termo
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Resultados */}
          <div className={`grid gap-4 ${variant === "compact"
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`} data-testid="pokemon-grid">
            {filteredPokemons.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={onPokemonClick}
                variant={variant === "compact" ? "compact" : "default"}
                data-testid="pokemon-card"
              />
            ))}
          </div>

          {/* Loading indicator para carregamento adicional */}
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
