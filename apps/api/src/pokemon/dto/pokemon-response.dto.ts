import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination.dto';

/**
 * DTO de resposta para um Pokémon individual
 */
export class PokemonResponseDto {
  @ApiProperty({
    description: 'ID único do Pokémon no banco de dados',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Nome do Pokémon',
    example: 'pikachu',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'ID do Pokémon na Pokédex Nacional',
    example: 25,
    type: Number,
  })
  pokedexId: number;

  @ApiProperty({
    description: 'URL da imagem do Pokémon',
    example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    type: String,
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({
    description: 'Lista de tipos do Pokémon',
    example: ['electric'],
    type: [String],
    isArray: true,
  })
  types: string[];

  @ApiProperty({
    description: 'Lista de habilidades do Pokémon',
    example: ['static', 'lightning-rod'],
    type: [String],
    isArray: true,
  })
  abilities: string[];

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2025-08-31T20:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2025-08-31T20:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}

/**
 * DTO de resposta paginada para lista de Pokémons
 */
export class PaginatedPokemonResponseDto {
  @ApiProperty({
    description: 'Lista de Pokémons da página atual',
    type: [PokemonResponseDto],
    isArray: true,
  })
  data: PokemonResponseDto[];

  @ApiProperty({
    description: 'Metadados da paginação',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}

/**
 * DTO de resposta para verificação de saúde da API
 */
export class HealthCheckResponseDto {
  @ApiProperty({
    description: 'Status da API',
    example: 'ok',
    type: String,
  })
  status: string;

  @ApiProperty({
    description: 'Mensagem de status',
    example: 'Pokemon API is working!',
    type: String,
  })
  message: string;
}

/**
 * DTO de resposta para erros da API
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 400,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'Pokémon não encontrado na PokéAPI',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Tipo do erro',
    example: 'Not Found',
    type: String,
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp do erro',
    example: '2025-08-31T20:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Caminho da requisição que causou o erro',
    example: '/pokemons',
    type: String,
  })
  path: string;
}
