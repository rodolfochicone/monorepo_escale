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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Cabeçalho com botões */}
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" onClick={() => router.push("/pokemons")}>
              ← Voltar
            </Button>
            <div className="flex gap-2">
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

          {/* Card principal - Design similar à imagem */}
          <Card className="bg-white shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
                {/* Coluna Esquerda - Informações */}
                <div className="lg:col-span-4 p-8 bg-gradient-to-b from-blue-50 to-white">
                  {/* Informações no topo */}
                  <div className="mb-8">
                    <div className="text-sm text-gray-600 mb-2">
                      Se {selectedPokemon.name} ficar realmente bravo, a chama no final de sua cauda queima em um tom azul claro.
                    </div>

                    {/* Versões */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm font-medium">Versões:</span>
                      <div className="flex gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">GO</span>
                        </div>
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">PK</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats principais */}
                  <div className="space-y-6">
                    <div className="bg-blue-500 text-white p-4 rounded-2xl">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm opacity-80">Altura</div>
                          <div className="text-xl font-bold">1.7 m</div>
                        </div>
                        <div>
                          <div className="text-sm opacity-80">Categoria</div>
                          <div className="text-xl font-bold">Flame</div>
                        </div>
                        <div>
                          <div className="text-sm opacity-80">Peso</div>
                          <div className="text-xl font-bold">90.5 kg</div>
                        </div>
                        <div>
                          <div className="text-sm opacity-80">Habilidades</div>
                          <div className="text-lg font-bold capitalize">
                            {selectedPokemon.abilities[0]?.replace("-", " ")}
                          </div>
                        </div>
                      </div>

                      {/* Sexo */}
                      <div className="mt-4">
                        <div className="text-sm opacity-80 mb-2">Sexo</div>
                        <div className="flex gap-2">
                          <span className="text-xl">♂</span>
                          <span className="text-xl">♀</span>
                        </div>
                      </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="bg-gray-100 p-4 rounded-2xl">
                      <h3 className="font-bold mb-4">Estatísticas</h3>
                      <div className="space-y-3">
                        {['HP', 'Ataque', 'Defesa', 'Atq. Esp.', 'Def. Esp.', 'Velocidade'].map((stat, index) => (
                          <div key={stat} className="flex items-center gap-2">
                            <span className="text-sm w-16 text-gray-600">{stat}</span>
                            <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${Math.random() * 80 + 20}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna Central - Imagem do Pokémon */}
                <div className="lg:col-span-4 flex items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-white relative">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold capitalize mb-4 text-gray-800">
                      {selectedPokemon.name}
                    </h1>
                    {selectedPokemon.imageUrl && (
                      <img
                        src={selectedPokemon.imageUrl}
                        alt={`${selectedPokemon.name} artwork`}
                        className="w-80 h-80 object-contain mx-auto"
                      />
                    )}
                    <div className="text-2xl font-bold text-gray-600 mt-4">
                      #{String(selectedPokemon.pokedexId).padStart(3, "0")}
                    </div>
                  </div>
                </div>

                {/* Coluna Direita - Tipos e Fraquezas */}
                <div className="lg:col-span-4 p-8 bg-gradient-to-b from-slate-50 to-white">
                  <div className="space-y-6">
                    {/* Tipos */}
                    <div>
                      <h3 className="font-bold text-lg mb-4">Tipo</h3>
                      <div className="space-y-2">
                        {selectedPokemon.types.map((type) => (
                          <Badge
                            key={type}
                            className="w-full justify-center py-3 text-white font-bold text-base capitalize"
                            style={{
                              backgroundColor: getTypeColor(type),
                            }}
                          >
                            {getTypeNameInPortuguese(type)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Fraquezas */}
                    <div>
                      <h3 className="font-bold text-lg mb-4">Fraquezas</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {getWeaknesses(selectedPokemon.types).map((weakness) => (
                          <Badge
                            key={weakness}
                            className="justify-center py-3 text-white font-bold text-base"
                            style={{
                              backgroundColor: getTypeColor(weakness),
                            }}
                          >
                            {getTypeNameInPortuguese(weakness)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Dados adicionais */}
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <h3 className="font-bold mb-3">Dados da Coleção</h3>
                      <div className="text-sm space-y-2">
                        <div>
                          <span className="text-gray-600">Adicionado:</span>
                          <div className="font-medium">
                            {new Date(selectedPokemon.createdAt).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Atualizado:</span>
                          <div className="font-medium">
                            {new Date(selectedPokemon.updatedAt).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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

// Função para traduzir nomes dos tipos para português
function getTypeNameInPortuguese(type: string): string {
  const typeNames: Record<string, string> = {
    normal: "Normal",
    fire: "Fogo",
    water: "Água",
    electric: "Elétrico",
    grass: "Planta",
    ice: "Gelo",
    fighting: "Lutador",
    poison: "Veneno",
    ground: "Terra",
    flying: "Voador",
    psychic: "Psíquico",
    bug: "Inseto",
    rock: "Pedra",
    ghost: "Fantasma",
    dragon: "Dragão",
    dark: "Sombrio",
    steel: "Aço",
    fairy: "Fada",
  };
  return typeNames[type] || type;
}

// Função para determinar fraquezas baseadas nos tipos
function getWeaknesses(types: string[]): string[] {
  const weaknessMap: Record<string, string[]> = {
    normal: ["fighting"],
    fire: ["water", "ground", "rock"],
    water: ["electric", "grass"],
    electric: ["ground"],
    grass: ["fire", "ice", "poison", "flying", "bug"],
    ice: ["fire", "fighting", "rock", "steel"],
    fighting: ["flying", "psychic", "fairy"],
    poison: ["ground", "psychic"],
    ground: ["water", "grass", "ice"],
    flying: ["electric", "ice", "rock"],
    psychic: ["bug", "ghost", "dark"],
    bug: ["fire", "flying", "rock"],
    rock: ["water", "grass", "fighting", "ground", "steel"],
    ghost: ["ghost", "dark"],
    dragon: ["ice", "dragon", "fairy"],
    dark: ["fighting", "bug", "fairy"],
    steel: ["fire", "fighting", "ground"],
    fairy: ["poison", "steel"],
  };

  const allWeaknesses = new Set<string>();
  types.forEach(type => {
    const weaknesses = weaknessMap[type] || [];
    weaknesses.forEach(weakness => allWeaknesses.add(weakness));
  });

  // Para a demonstração, vamos retornar algumas fraquezas comuns baseadas nos tipos mais populares
  const commonWeaknesses = Array.from(allWeaknesses).slice(0, 3);

  // Se não tiver fraquezas específicas, retorna algumas padrão da imagem
  if (commonWeaknesses.length === 0) {
    return ["water", "electric", "rock"];
  }

  return commonWeaknesses;
}
