import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

/**
 * DTO para parâmetros de paginação e filtros
 * Usado nos endpoints de listagem GET /pokemons
 */
export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Número da página desejada',
    example: 1,
    minimum: 1,
    type: Number,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'A página deve ser um número inteiro' })
  @Min(1, { message: 'A página deve ser pelo menos 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    type: Number,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O limit deve ser um número inteiro' })
  @Min(1, { message: 'O limit deve ser pelo menos 1' })
  @Max(100, { message: 'O limit deve ser no máximo 100' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Termo de busca para filtrar por nome do Pokémon',
    example: 'pikachu',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'A busca deve ser uma string' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtro por tipo de Pokémon (ex: fire, water, electric)',
    example: 'electric',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O tipo deve ser uma string' })
  type?: string;
}

/**
 * Interface para resposta paginada
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * DTO de resposta para metadados de paginação
 */
export class PaginationMetaDto {
  @ApiProperty({
    description: 'Página atual',
    example: 1,
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    example: 10,
    type: Number,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de itens encontrados',
    example: 150,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Total de páginas disponíveis',
    example: 15,
    type: Number,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Indica se há próxima página',
    example: true,
    type: Boolean,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Indica se há página anterior',
    example: false,
    type: Boolean,
  })
  hasPrev: boolean;
}