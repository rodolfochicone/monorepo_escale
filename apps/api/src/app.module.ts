import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PokemonModule, AuthModule],
})
export class AppModule {}
