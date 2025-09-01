import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
  Query,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProduces,
} from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  PokemonResponseDto,
  PaginatedPokemonResponseDto,
  HealthCheckResponseDto,
  ErrorResponseDto,
} from './dto/pokemon-response.dto';

@ApiTags('pokemon')
@Controller('pokemons')
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Criar um novo Pokémon',
    description: `
      Cria um novo Pokémon na coleção buscando dados automaticamente da PokéAPI.
      
      **Funcionalidades:**
      - Busca informações completas na PokéAPI (tipos, habilidades, imagem)
      - Valida se o Pokémon existe na PokéAPI
      - Armazena dados enriquecidos no banco de dados
      - Retorna o Pokémon criado com todas as informações
      
      **Requer autenticação JWT.**
    `,
    externalDocs: {
      description: 'Documentação da PokéAPI',
      url: 'https://pokeapi.co/docs/v2',
    },
  })
  @ApiBody({
    type: CreatePokemonDto,
    description: 'Dados para criação do Pokémon',
    examples: {
      pikachu: {
        summary: 'Exemplo: Pikachu',
        description: 'Criação do Pokémon mais famoso',
        value: {
          name: 'pikachu'
        }
      },
      charizard: {
        summary: 'Exemplo: Charizard',
        description: 'Criação de um Pokémon tipo fogo/voador',
        value: {
          name: 'charizard'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Pokémon criado com sucesso',
    type: PokemonResponseDto,
    examples: {
      pikachu: {
        summary: 'Pokémon criado',
        value: {
          id: 1,
          name: 'pikachu',
          pokedexId: 25,
          imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
          types: ['electric'],
          abilities: ['static', 'lightning-rod'],
          createdAt: '2025-08-31T20:30:00.000Z',
          updatedAt: '2025-08-31T20:30:00.000Z'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos',
    type: ErrorResponseDto,
    examples: {
      'invalid-name': {
        summary: 'Nome inválido',
        value: {
          statusCode: 400,
          message: 'O nome do Pokémon é obrigatório',
          error: 'Bad Request',
          timestamp: '2025-08-31T20:30:00.000Z',
          path: '/pokemons'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação ausente ou inválido',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pokémon não encontrado na PokéAPI',
    type: ErrorResponseDto,
    examples: {
      'not-found': {
        summary: 'Pokémon não existe',
        value: {
          statusCode: 404,
          message: 'Pokémon inexistente não encontrado na PokéAPI',
          error: 'Not Found',
          timestamp: '2025-08-31T20:30:00.000Z',
          path: '/pokemons'
        }
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Pokémon já existe na coleção',
    type: ErrorResponseDto,
    examples: {
      'already-exists': {
        summary: 'Pokémon duplicado',
        value: {
          statusCode: 409,
          message: 'Pokemon with name pikachu already exists',
          error: 'Conflict',
          timestamp: '2025-08-31T20:30:00.000Z',
          path: '/pokemons'
        }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor ou falha na PokéAPI',
    type: ErrorResponseDto,
  })
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get('/health')
  @ApiTags('health')
  @ApiOperation({
    summary: 'Verificar saúde da API',
    description: 'Endpoint para verificar se a API está funcionando corretamente',
  })
  @ApiResponse({
    status: 200,
    description: 'API funcionando normalmente',
    type: HealthCheckResponseDto,
    examples: {
      healthy: {
        summary: 'API saudável',
        value: {
          status: 'ok',
          message: 'Pokemon API is working!'
        }
      }
    }
  })
  healthCheck() {
    return { status: 'ok', message: 'Pokemon API is working!' };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar Pokémons',
    description: `
      Retorna uma lista paginada de Pokémons da coleção com suporte a filtros.
      
      **Funcionalidades:**
      - Paginação configurável (padrão: 10 itens por página)
      - Filtro por nome do Pokémon
      - Filtro por tipo (fire, water, electric, etc.)
      - Metadados completos de paginação
      - Ordenação por ID
    `,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página (padrão: 1)',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Itens por página (padrão: 10, máximo: 100)',
    example: 10,
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por nome do Pokémon',
    example: 'pikachu',
    type: String,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filtrar por tipo do Pokémon',
    example: 'electric',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de Pokémons retornada com sucesso',
    type: PaginatedPokemonResponseDto,
    examples: {
      'paginated-list': {
        summary: 'Lista paginada',
        value: {
          data: [
            {
              id: 1,
              name: 'pikachu',
              pokedexId: 25,
              imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
              types: ['electric'],
              abilities: ['static', 'lightning-rod'],
              createdAt: '2025-08-31T20:30:00.000Z',
              updatedAt: '2025-08-31T20:30:00.000Z'
            }
          ],
          meta: {
            page: 1,
            limit: 10,
            total: 150,
            totalPages: 15,
            hasNext: true,
            hasPrev: false
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros de paginação inválidos',
    type: ErrorResponseDto,
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.pokemonService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar Pokémon por ID',
    description: 'Retorna um Pokémon específico pelo seu ID único no banco de dados',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do Pokémon no banco de dados',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Pokémon encontrado',
    type: PokemonResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pokémon não encontrado',
    type: ErrorResponseDto,
    examples: {
      'not-found': {
        summary: 'ID não existe',
        value: {
          statusCode: 404,
          message: 'Pokemon with ID 999 not found',
          error: 'Not Found',
          timestamp: '2025-08-31T20:30:00.000Z',
          path: '/pokemons/999'
        }
      }
    }
  })
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
    return this.pokemonService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Atualizar Pokémon',
    description: `
      Atualiza um Pokémon existente. Quando um novo nome é fornecido, 
      busca automaticamente novos dados na PokéAPI.
      
      **Funcionalidades:**
      - Atualização de nome com busca automática na PokéAPI
      - Validação de existência do Pokémon no banco
      - Atualização automática do timestamp
      - Mantém integridade dos dados
      
      **Requer autenticação JWT.**
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do Pokémon a ser atualizado',
    example: 1,
    type: Number,
  })
  @ApiBody({
    type: UpdatePokemonDto,
    description: 'Dados para atualização do Pokémon',
    examples: {
      evolution: {
        summary: 'Evolução do Pokémon',
        description: 'Atualizando Pikachu para Raichu',
        value: {
          name: 'raichu'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Pokémon atualizado com sucesso',
    type: PokemonResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação ausente ou inválido',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pokémon não encontrado no banco ou na PokéAPI',
    type: ErrorResponseDto,
  })
  update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
    @Body() updatePokemonDto: UpdatePokemonDto
  ) {
    return this.pokemonService.update(id, updatePokemonDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Remover Pokémon',
    description: `
      Remove um Pokémon permanentemente da coleção.
      
      **Atenção:** Esta operação é irreversível.
      
      **Requer autenticação JWT.**
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do Pokémon a ser removido',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 204,
    description: 'Pokémon removido com sucesso (sem conteúdo de retorno)',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação ausente ou inválido',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pokémon não encontrado',
    type: ErrorResponseDto,
  })
  remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
    return this.pokemonService.remove(id);
  }
}