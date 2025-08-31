"use client";

import { PokemonForm } from "@/components/pokemon/pokemon-form";

export default function NewPokemonPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Adicionar Novo Pokémon
          </h1>
          <p className="text-muted-foreground">
            Busque um Pokémon na PokéAPI e adicione à sua coleção
          </p>
        </div>

        <PokemonForm mode="create" />
      </div>
    </div>
  );
}
