"use client";

import Image from "next/image";
import { Pokemon } from "@/types/pokemon";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: (pokemon: Pokemon) => void;
  variant?: "default" | "compact";
}

export function PokemonCard({ pokemon, onClick, variant = "default" }: PokemonCardProps) {
  const isCompact = variant === "compact";

  return (
    <Card
      className={`hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group animate-in fade-in-0 slide-in-from-bottom-4 ${isCompact ? "p-2" : "p-4"}`}
      onClick={() => onClick?.(pokemon)}
    >
      <CardContent className={isCompact ? "p-2" : "p-4"}>
        <div className="text-center space-y-3">
          {/* Imagem do Pokémon */}
          <div className={`mx-auto bg-gradient-to-br from-muted/30 to-muted/60 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${isCompact ? "w-12 h-12" : "w-20 h-20"}`}>
            {pokemon.imageUrl ? (
              <Image
                src={pokemon.imageUrl}
                alt={`${pokemon.name} sprite`}
                width={isCompact ? 32 : 64}
                height={isCompact ? 32 : 64}
                className="object-contain"
                unoptimized
              />
            ) : (
              <span className={`${isCompact ? "text-lg" : "text-3xl"}`}>
                {getTypeEmoji(pokemon.types[0])}
              </span>
            )}
          </div>

          {/* Informações do Pokémon */}
          <div className="space-y-1">
            <h3 className={`font-semibold capitalize ${isCompact ? "text-sm" : "text-lg"}`}>
              {pokemon.name}
            </h3>
            <p className={`text-muted-foreground ${isCompact ? "text-xs" : "text-sm"}`}>
              #{String(pokemon.pokedexId).padStart(3, '0')}
            </p>
          </div>

          {/* Tipos */}
          <div className={`flex flex-wrap justify-center gap-1 ${isCompact ? "gap-0.5" : "gap-1"}`}>
            {pokemon.types.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className={`${isCompact ? "text-xs px-1.5 py-0.5" : "text-xs px-2 py-1"}`}
                style={{
                  backgroundColor: getTypeColor(type),
                  color: "white",
                  fontSize: isCompact ? "0.625rem" : "0.75rem"
                }}
              >
                {type}
              </Badge>
            ))}
          </div>

          {/* Habilidades (apenas na versão padrão) */}
          {!isCompact && pokemon.abilities.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Habilidades:</p>
              <div className="flex flex-wrap justify-center gap-1">
                {pokemon.abilities.slice(0, 2).map((ability) => (
                  <span
                    key={ability}
                    className="px-2 py-1 bg-muted rounded-md capitalize"
                  >
                    {ability.replace("-", " ")}
                  </span>
                ))}
                {pokemon.abilities.length > 2 && (
                  <span className="px-2 py-1 bg-muted rounded-md">
                    +{pokemon.abilities.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Função para obter emoji baseado no tipo
function getTypeEmoji(type: string): string {
  const typeEmojis: Record<string, string> = {
    normal: "⚪",
    fire: "🔥",
    water: "💧",
    electric: "⚡",
    grass: "🌿",
    ice: "❄️",
    fighting: "👊",
    poison: "☠️",
    ground: "🌍",
    flying: "🦅",
    psychic: "🔮",
    bug: "🐛",
    rock: "🪨",
    ghost: "👻",
    dragon: "🐉",
    dark: "🌙",
    steel: "⚙️",
    fairy: "🧚",
  };
  return typeEmojis[type] || "❓";
}

// Função para obter cor baseada no tipo
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
