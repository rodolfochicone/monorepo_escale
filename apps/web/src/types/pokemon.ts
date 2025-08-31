export interface Pokemon {
  id: number;
  name: string;
  pokedexId: number;
  imageUrl: string | null;
  types: string[];
  abilities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePokemonDto {
  name: string;
}

export interface UpdatePokemonDto {
  name?: string;
}

export interface PokemonListResponse {
  data: Pokemon[];
  total: number;
}

export interface ApiError {
  message: string;
  status: number;
}
