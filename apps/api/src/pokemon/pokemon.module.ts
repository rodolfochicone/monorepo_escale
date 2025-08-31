import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { PokemonRepository } from './pokemon.repository';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [PokemonController],
  providers: [PokemonService, PokemonRepository],
})
export class PokemonModule {}
