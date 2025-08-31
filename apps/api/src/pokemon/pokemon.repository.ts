import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../pokemon.entity';
import { pokemons } from '../pokemon.entity';
import { eq } from 'drizzle-orm';

@Injectable()
export class PokemonRepository {
  constructor(
    @Inject('DRIZZLE_INSTANCE') private readonly db: NodePgDatabase<typeof schema>,
  ) { }

  async create(createPokemonDto: any) {
    const [newPokemon] = await this.db.insert(pokemons).values(createPokemonDto).returning();
    return newPokemon;
  }

  async findAll() {
    try {
      console.log('🔍 PokemonRepository.findAll() - Executando query no banco...');
      const result = await this.db.select().from(pokemons);
      console.log('✅ PokemonRepository.findAll() - Query executada com sucesso:', result?.length || 0, 'registros');
      return result;
    } catch (error) {
      console.error('❌ PokemonRepository.findAll() - Erro na query:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const [result] = await this.db.select().from(pokemons).where(eq(pokemons.id, id));
    return result;
  }

  async update(id: number, updatePokemonDto: any) {
    const [updatedPokemon] = await this.db.update(pokemons).set(updatePokemonDto).where(eq(pokemons.id, id)).returning();
    return updatedPokemon;
  }

  async remove(id: number) {
    const [deletedPokemon] = await this.db.delete(pokemons).where(eq(pokemons.id, id)).returning();
    return deletedPokemon;
  }
}
