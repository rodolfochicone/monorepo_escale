import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para criação de um novo Pokémon
 * Usado no endpoint POST /pokemons
 */
export class CreatePokemonDto {
  @ApiProperty({
    description: 'Nome do Pokémon a ser buscado na PokéAPI',
    example: 'pikachu',
    minLength: 1,
    maxLength: 50,
    type: String,
    required: true,
  })
  @IsString({ message: 'O nome deve ser uma string válida' })
  @IsNotEmpty({ message: 'O nome do Pokémon é obrigatório' })
  @MinLength(1, { message: 'O nome deve ter pelo menos 1 caractere' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  name: string;
}