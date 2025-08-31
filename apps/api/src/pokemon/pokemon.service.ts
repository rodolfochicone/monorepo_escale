import { Injectable, NotFoundException } from '@nestjs/common';
import { PokemonRepository } from './pokemon.repository';
import axios from 'axios';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async create(createPokemonDto: any) {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${createPokemonDto.name.toLowerCase()}`);
    const { id, types, abilities, sprites } = response.data;

    const pokemonData = {
      name: createPokemonDto.name,
      pokedexId: id,
      imageUrl: sprites.front_default,
      types: types.map((t: any) => t.type.name),
      abilities: abilities.map((a: any) => a.ability.name),
    };

    return this.pokemonRepository.create(pokemonData);
  }

  findAll() {
    return this.pokemonRepository.findAll();
  }

  async findOne(id: number) {
    const pokemon = await this.pokemonRepository.findOne(id);
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }
    return pokemon;
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    // First, check if the pokemon exists
    await this.findOne(id);

    let pokemonData = {};

    if (updatePokemonDto.name) {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${updatePokemonDto.name.toLowerCase()}`);
      const { id: pokedexId, types, abilities, sprites } = response.data;
      pokemonData = {
        name: updatePokemonDto.name,
        pokedexId: pokedexId,
        imageUrl: sprites.front_default,
        types: types.map((t: any) => t.type.name),
        abilities: abilities.map((a: any) => a.ability.name),
        updatedAt: new Date(),
      };
    } else {
      // If no name is provided, we can just update the updatedAt timestamp or handle other fields if they exist
      pokemonData = {
        updatedAt: new Date(),
      };
    }

    return this.pokemonRepository.update(id, pokemonData);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.pokemonRepository.remove(id);
  }
}
