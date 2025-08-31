import { IsString } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  name: string;
}
