"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { usePokemon } from "@/hooks/use-pokemon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PokemonCard } from "@/components/pokemon/pokemon-card";
import { PokemonDetailSkeleton } from "@/components/pokemon/pokemon-skeleton";

interface PokemonDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const {
    selectedPokemon,
    loading,
    error,
    fetchPokemonById,
    deletePokemon,
    clearError,
    clearSelectedPokemon
  } = usePokemon();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const pokemonId = parseInt(resolvedParams.id);

  useEffect(() => {
    if (pokemonId) {
      fetchPokemonById(pokemonId);
    }

    return () => {
      clearSelectedPokemon();
    };
  }, [pokemonId, fetchPokemonById, clearSelectedPokemon]);

  const handleEdit = () => {
    router.push(`/pokemons/${pokemonId}/edit`);
  };

  const handleDelete = async () => {
    if (!selectedPokemon) return;

    setIsDeleting(true);
    const success = await deletePokemon(selectedPokemon.id);

    if (success) {
      router.push("/pokemons");
    } else {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading && !selectedPokemon) {
    return <PokemonDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-4">❌</div>
                <h2 className="text-xl font-semibold mb-2">Erro ao carregar Pokémon</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <div className="space-x-2">
                  <Button onClick={() => fetchPokemonById(pokemonId)}>
                    Tentar novamente
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/pokemons")}>
                    Voltar à lista
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedPokemon) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold mb-2">Pokémon não encontrado</h2>
                <p className="text-muted-foreground mb-4">
                  O Pokémon solicitado não existe na sua coleção
                </p>
                <Button onClick={() => router.push("/pokemons")}>
                  Voltar à lista
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight capitalize mb-2">
              {selectedPokemon.name}
            </h1>
            <p className="text-muted-foreground">
              #{String(selectedPokemon.pokedexId).padStart(3, "0")} •
              Adicionado em {new Date(selectedPokemon.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/pokemons")}>
              ← Voltar
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              Editar
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
            >
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card principal do Pokémon */}
          <div className="lg:col-span-1">
            <PokemonCard pokemon={selectedPokemon} variant="default" />
          </div>

          {/* Detalhes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Tipos</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPokemon.types.map((type) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="capitalize"
                        style={{
                          backgroundColor: getTypeColor(type),
                          color: "white"
                        }}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Habilidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPokemon.abilities.map((ability) => (
                      <Badge key={ability} variant="outline" className="capitalize">
                        {ability.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">ID da Pokédex</h4>
                  <p className="text-2xl font-mono font-bold">
                    #{String(selectedPokemon.pokedexId).padStart(3, "0")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Imagem grande */}
            {selectedPokemon.imageUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Artwork</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <img
                      src={selectedPokemon.imageUrl}
                      alt={`${selectedPokemon.name} artwork`}
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dados da coleção */}
            <Card>
              <CardHeader>
                <CardTitle>Dados da Coleção</CardTitle>
                <CardDescription>
                  Informações sobre quando este Pokémon foi adicionado à sua coleção
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Data de adição</h4>
                  <p className="text-muted-foreground">
                    {new Date(selectedPokemon.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Última atualização</h4>
                  <p className="text-muted-foreground">
                    {new Date(selectedPokemon.updatedAt).toLocaleString("pt-BR")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal de confirmação de exclusão */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>Confirmar Exclusão</CardTitle>
                <CardDescription>
                  Tem certeza que deseja excluir <strong className="capitalize">{selectedPokemon.name}</strong> da sua coleção?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Função auxiliar para cores dos tipos (repetida do PokemonCard)
function getTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };
  return typeColors[type] || "#68A090";
}
