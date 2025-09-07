"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePokemon } from "@/hooks/use-pokemon";
import { Pokemon } from "@/types/pokemon";

const pokemonFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres")
    .toLowerCase()
    .refine((value) => /^[a-z0-9-]+$/.test(value), {
      message: "Nome deve conter apenas letras minúsculas, números e hífens",
    }),
});

type PokemonFormValues = z.infer<typeof pokemonFormSchema>;

interface PokemonFormProps {
  pokemon?: Pokemon;
  mode: "create" | "edit";
}

export function PokemonForm({ pokemon, mode }: PokemonFormProps) {
  const router = useRouter();
  const { createPokemon, updatePokemon, loading } = usePokemon();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PokemonFormValues>({
    resolver: zodResolver(pokemonFormSchema),
    defaultValues: {
      name: pokemon?.name || "",
    },
  });

  const onSubmit = async (data: PokemonFormValues) => {
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const result = await createPokemon({ name: data.name });
        if (result) {
          router.push(`/pokemons/${result.id}`);
        }
      } else if (mode === "edit" && pokemon) {
        const result = await updatePokemon(pokemon.id, { name: data.name });
        if (result) {
          router.push(`/pokemons/${result.id}`);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar Pokémon:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (pokemon) {
      router.push(`/pokemons/${pokemon.id}`);
    } else {
      router.push("/pokemons");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "create" ? "Adicionar Novo Pokémon" : "Editar Pokémon"}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Digite o nome de um Pokémon para adicioná-lo à sua coleção. Os dados serão buscados automaticamente na PokéAPI."
              : "Edite as informações do Pokémon selecionado."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Pokémon</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: pikachu, charizard, bulbasaur..."
                        {...field}
                        disabled={isSubmitting || loading}
                      />
                    </FormControl>
                    <FormDescription>
                      Digite o nome exato como aparece na PokéAPI (geralmente em
                      inglês e minúsculo)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preview se estiver editando */}
              {mode === "edit" && pokemon && (
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">Preview Atual:</h4>
                  <div className="flex items-center gap-4">
                    {pokemon.imageUrl && (
                      <img
                        src={pokemon.imageUrl}
                        alt={pokemon.name}
                        className="w-16 h-16 object-contain"
                      />
                    )}
                    <div>
                      <p className="font-medium capitalize">{pokemon.name}</p>
                      <p className="text-sm text-muted-foreground">
                        #{pokemon.pokedexId}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {pokemon.types.map((type) => (
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
                </div>
              )}

              {/* Informações adicionais */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-blue-500 text-lg">ℹ️</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Como funciona?
                    </h4>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          Digite o nome exato do Pokémon (ex:
                          &quot;pikachu&quot;, &quot;charizard&quot;)
                        </li>
                        <li>
                          Os dados serão buscados automaticamente na PokéAPI
                        </li>
                        <li>
                          Informações como tipo, habilidades e imagem serão
                          preenchidas automaticamente
                        </li>
                        <li>O Pokémon será adicionado à sua coleção pessoal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="flex-1"
                >
                  {isSubmitting
                    ? "Salvando..."
                    : mode === "create"
                      ? "Adicionar Pokémon"
                      : "Salvar Alterações"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
