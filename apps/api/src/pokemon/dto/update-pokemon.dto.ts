import { IsString, IsOptional } from 'class-validator';

export class UpdatePokemonDto {
  @IsString()
  @IsOptional()
  name?: string;
}
