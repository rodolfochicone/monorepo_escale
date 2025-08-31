import { Injectable, NotFoundException } from '@nestjs/common';
import { PokemonRepository } from './pokemon.repository';
import { PaginationDto, PaginatedResult } from './dto/pagination.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import axios from 'axios';

@Injectable()
export class PokemonService {
  constructor(private readonly pokemonRepository: PokemonRepository) { }



  async create(createPokemonDto: any) {
    try {
      console.log('🐾 PokemonService.create() - Iniciando criação de pokémon:', createPokemonDto.name);

      // Buscar dados na PokéAPI
      console.log('🌐 Buscando dados na PokéAPI...');
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${createPokemonDto.name.toLowerCase()}`);
      const { id, types, abilities, sprites } = response.data;
      console.log('✅ Dados obtidos da PokéAPI:', { id, types: types.length, abilities: abilities.length });

      const pokemonData = {
        name: createPokemonDto.name,
        pokedexId: id,
        imageUrl: sprites.front_default,
        types: types.map((t: any) => t.type.name),
        abilities: abilities.map((a: any) => a.ability.name),
      };

      console.log('💾 Salvando pokémon no banco de dados...', pokemonData);
      const result = await this.pokemonRepository.create(pokemonData);
      console.log('✅ Pokémon criado com sucesso:', result);

      return result;
    } catch (error) {
      console.error('❌ PokemonService.create() - Erro:', {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        pokemonName: createPokemonDto.name,
        error: error
      });

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new NotFoundException(`Pokémon '${createPokemonDto.name}' não encontrado na PokéAPI`);
        }
        throw new Error(`Erro ao buscar dados da PokéAPI: ${error.message}`);
      }

      throw new Error(`Erro interno ao criar pokémon: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }



  async findAll(paginationDto: PaginationDto = {}): Promise<PaginatedResult<any>> {
    try {
      const { page = 1, limit = 10, search, type } = paginationDto;

      console.log(`🔍 PokemonService.findAll() - Iniciando busca paginada: página ${page}, limite ${limit}`);

      const offset = (page - 1) * limit;

      const { data, total } = await this.pokemonRepository.findAllPaginated({
        limit,
        offset,
        search,
        type
      });

      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      console.log(`✅ PokemonService.findAll() - Busca concluída: ${data.length}/${total} pokémons, página ${page}/${totalPages}`);

      return {
        data,
        meta: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev
        }
      };
    } catch (error) {
      console.error('❌ PokemonService.findAll() - Erro:', error);
      throw error;
    }
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
