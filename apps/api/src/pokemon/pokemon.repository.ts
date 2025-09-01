import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../pokemon.entity';
import { pokemons } from '../pokemon.entity';
import { eq, like, sql, count, and } from 'drizzle-orm';

@Injectable()
export class PokemonRepository {
  constructor(
    @Inject('DRIZZLE_INSTANCE') private readonly db: NodePgDatabase<typeof schema>,
  ) { }

  async create(createPokemonDto: any) {
    try {
      console.log('💾 PokemonRepository.create() - Inserindo no banco de dados:', createPokemonDto);
      const [newPokemon] = await this.db.insert(pokemons).values(createPokemonDto).returning();
      console.log('✅ PokemonRepository.create() - Pokémon criado:', newPokemon);
      return newPokemon;
    } catch (error) {
      console.error('❌ PokemonRepository.create() - Erro na inserção:', {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        data: createPokemonDto,
        error: error
      });
      throw error;
    }
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

  async findAllPaginated(options: {
    limit: number;
    offset: number;
    search?: string;
    type?: string;
  }) {
    try {
      const conditions = [];

      if (options.search) {
        conditions.push(like(pokemons.name, `%${options.search.toLowerCase()}%`));
      }

      if (options.type) {
        conditions.push(sql`${pokemons.types} @> ${JSON.stringify([options.type.toLowerCase()])}`);
      }

      const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

      const dataQuery = this.db
        .select()
        .from(pokemons)
        .where(whereCondition)
        .limit(options.limit)
        .offset(options.offset)
        .orderBy(pokemons.id);

      const countQuery = this.db
        .select({ count: count() })
        .from(pokemons)
        .where(whereCondition);

      const [data, totalResult] = await Promise.all([
        dataQuery,
        countQuery
      ]);

      const total = totalResult[0]?.count || 0;

      const limitedData = data.slice(0, options.limit);

      return { data: limitedData, total };
    } catch (error) {
      console.error('❌ PokemonRepository.findAllPaginated() - Erro na query:', error);
      throw error;
    }
  }

  async findOneByName(name: string) {
    const [result] = await this.db.select().from(pokemons).where(eq(pokemons.name, name));
    console.log('✅ PokemonRepository.findOneByName() - Pokémon encontrado:', result);
    return result;
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
