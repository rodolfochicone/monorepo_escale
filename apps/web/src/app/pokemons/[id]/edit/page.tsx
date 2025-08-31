"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { usePokemon } from "@/hooks/use-pokemon";
import { PokemonForm } from "@/components/pokemon/pokemon-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EditPokemonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPokemonPage({ params }: EditPokemonPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const {
    selectedPokemon,
    loading,
    error,
    fetchPokemonById,
    clearSelectedPokemon,
    clearError
  } = usePokemon();

  const pokemonId = parseInt(resolvedParams.id);

  useEffect(() => {
    if (pokemonId) {
      fetchPokemonById(pokemonId);
    }

    return () => {
      clearSelectedPokemon();
    };
  }, [pokemonId, fetchPokemonById, clearSelectedPokemon]);

  if (loading && !selectedPokemon) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando Pokémon...</p>
          </div>
        </div>
      </div>
    );
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Editar Pokémon
          </h1>
          <p className="text-muted-foreground">
            Editando: <span className="capitalize font-medium">{selectedPokemon.name}</span>
          </p>
        </div>

        <PokemonForm pokemon={selectedPokemon} mode="edit" />
      </div>
    </div>
  );
}

