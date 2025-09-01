import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para atualização de um Pokémon existente
 * Usado no endpoint PATCH /pokemons/:id
 */
export class UpdatePokemonDto {
  @ApiPropertyOptional({
    description: 'Novo nome do Pokémon (opcional). Quando fornecido, busca novos dados na PokéAPI',
    example: 'raichu',
    minLength: 1,
    maxLength: 50,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string válida' })
  @MinLength(1, { message: 'O nome deve ter pelo menos 1 caractere' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  name?: string;
}