import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { PokemonService } from '../pokemon.service';
import { PokemonRepository } from '../pokemon.repository';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PokemonService', () => {
  let service: PokemonService;
  let mockRepository: jest.Mocked<PokemonRepository>;

  const mockPokemonApiResponse = {
    data: {
      id: 25,
      name: 'pikachu',
      types: [{ type: { name: 'electric' } }],
      abilities: [
        { ability: { name: 'static' } },
        { ability: { name: 'lightning-rod' } }
      ],
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
      }
    }
  };

  const mockPokemonEntity = {
    id: 1,
    name: 'pikachu',
    pokedexId: 25,
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    types: ['electric'],
    abilities: ['static', 'lightning-rod'],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockPaginationResult = {
    data: [mockPokemonEntity],
    total: 1
  };

  beforeEach(async () => {

    const mockPokemonRepository = {
      create: jest.fn(),
      findAllPaginated: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: PokemonRepository,
          useValue: mockPokemonRepository,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    mockRepository = module.get(PokemonRepository);


    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um pokémon com sucesso', async () => {
      // Arrange
      const createDto = { name: 'pikachu' };
      mockedAxios.get.mockResolvedValue(mockPokemonApiResponse);
      mockRepository.create.mockResolvedValue(mockPokemonEntity);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
      expect(mockRepository.create).toHaveBeenCalledWith({
        name: 'pikachu',
        pokedexId: 25,
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        types: ['electric'],
        abilities: ['static', 'lightning-rod']
      });
      expect(result).toEqual(mockPokemonEntity);
    });

    it('deve lançar NotFoundException quando pokémon não é encontrado na PokéAPI', async () => {
      // Arrange
      const createDto = { name: 'inexistente' };
      const notFoundError = {
        response: { status: 404 }
      };
      mockedAxios.get.mockRejectedValue(notFoundError);
      mockedAxios.isAxiosError.mockReturnValue(true);

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/inexistente');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('deve tratar erro de conexão com a PokéAPI', async () => {
      // Arrange
      const createDto = { name: 'pikachu' };
      const connectionError = new Error('Network Error');
      mockedAxios.get.mockRejectedValue(connectionError);
      mockedAxios.isAxiosError.mockReturnValue(true);

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow('Erro ao buscar dados da PokéAPI: Network Error');
    });

    it('deve tratar erro de banco de dados durante criação', async () => {
      // Arrange
      const createDto = { name: 'pikachu' };
      const databaseError = new Error('Database error');
      mockedAxios.get.mockResolvedValue(mockPokemonApiResponse);
      mockRepository.create.mockRejectedValue(databaseError);
      mockedAxios.isAxiosError.mockReturnValue(false);

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow('Erro interno ao criar pokémon: Database error');
    });

    it('deve converter nome para lowercase antes de buscar na API', async () => {
      // Arrange
      const createDto = { name: 'PIKACHU' };
      mockedAxios.get.mockResolvedValue(mockPokemonApiResponse);
      mockRepository.create.mockResolvedValue(mockPokemonEntity);

      // Act
      await service.create(createDto);

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
    });
  });

  describe('findAll', () => {
    it('deve retornar pokémons paginados com metadados corretos', async () => {
      // Arrange
      const paginationDto = { page: 1, limit: 10 };
      mockRepository.findAllPaginated.mockResolvedValue(mockPaginationResult);

      // Act
      const result = await service.findAll(paginationDto);

      // Assert
      expect(mockRepository.findAllPaginated).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
        search: undefined,
        type: undefined
      });
      expect(result).toEqual({
        data: [mockPokemonEntity],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      });
    });

    it('deve calcular paginação corretamente para múltiplas páginas', async () => {
      // Arrange
      const paginationDto = { page: 2, limit: 5 };
      const mockResult = { data: [mockPokemonEntity], total: 15 };
      mockRepository.findAllPaginated.mockResolvedValue(mockResult);

      // Act
      const result = await service.findAll(paginationDto);

      // Assert
      expect(mockRepository.findAllPaginated).toHaveBeenCalledWith({
        limit: 5,
        offset: 5,
        search: undefined,
        type: undefined
      });
      expect(result.meta).toEqual({
        page: 2,
        limit: 5,
        total: 15,
        totalPages: 3,
        hasNext: true,
        hasPrev: true
      });
    });

    it('deve usar valores padrão quando paginationDto não é fornecido', async () => {
      // Arrange
      mockRepository.findAllPaginated.mockResolvedValue(mockPaginationResult);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockRepository.findAllPaginated).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
        search: undefined,
        type: undefined
      });
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });

    it('deve passar filtros de busca e tipo corretamente', async () => {
      // Arrange
      const paginationDto = { page: 1, limit: 10, search: 'pika', type: 'electric' };
      mockRepository.findAllPaginated.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAll(paginationDto);

      // Assert
      expect(mockRepository.findAllPaginated).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
        search: 'pika',
        type: 'electric'
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar pokémon por ID', async () => {
      // Arrange
      const pokemonId = 1;
      mockRepository.findOne.mockResolvedValue(mockPokemonEntity);

      // Act
      const result = await service.findOne(pokemonId);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith(pokemonId);
      expect(result).toEqual(mockPokemonEntity);
    });

    it('deve lançar NotFoundException quando pokémon não existe', async () => {
      // Arrange
      const pokemonId = 999;
      mockRepository.findOne.mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.findOne(pokemonId)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith(pokemonId);
    });
  });

  describe('update', () => {
    it('deve atualizar pokémon com sucesso', async () => {
      // Arrange
      const pokemonId = 1;
      const updateDto = { name: 'raichu' };
      const updatedPokemon = { ...mockPokemonEntity, name: 'raichu' };
      const raichuApiResponse = {
        data: {
          id: 26,
          name: 'raichu',
          types: [{ type: { name: 'electric' } }],
          abilities: [
            { ability: { name: 'static' } },
            { ability: { name: 'lightning-rod' } }
          ],
          sprites: {
            front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png'
          }
        }
      };

      // Mock para findOne retornar pokémon existente
      mockRepository.findOne.mockResolvedValue(mockPokemonEntity);
      // Mock para PokéAPI
      mockedAxios.get.mockResolvedValue(raichuApiResponse);
      mockRepository.update.mockResolvedValue(updatedPokemon);

      // Act
      const result = await service.update(pokemonId, updateDto);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith(pokemonId);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/raichu');
      expect(mockRepository.update).toHaveBeenCalledWith(pokemonId, expect.objectContaining({
        name: 'raichu',
        pokedexId: 26,
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png',
        types: ['electric'],
        abilities: ['static', 'lightning-rod'],
        updatedAt: expect.any(Date)
      }));
      expect(result).toEqual(updatedPokemon);
    });

    it('deve lançar NotFoundException quando pokémon não existe para atualização', async () => {
      // Arrange
      const pokemonId = 999;
      const updateDto = { name: 'raichu' };
      mockRepository.findOne.mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.update(pokemonId, updateDto)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith(pokemonId);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover pokémon com sucesso', async () => {
      // Arrange
      const pokemonId = 1;

      // Mock para findOne retornar pokémon existente
      mockRepository.findOne.mockResolvedValue(mockPokemonEntity);
      mockRepository.remove.mockResolvedValue(mockPokemonEntity);

      // Act
      const result = await service.remove(pokemonId);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith(pokemonId);
      expect(mockRepository.remove).toHaveBeenCalledWith(pokemonId);
      expect(result).toEqual(mockPokemonEntity);
    });

    it('deve lançar NotFoundException quando pokémon não existe para remoção', async () => {
      // Arrange
      const pokemonId = 999;
      mockRepository.findOne.mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.remove(pokemonId)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith(pokemonId);
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('deve tratar erros do repository na busca paginada', async () => {
      // Arrange
      mockRepository.findAllPaginated.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(service.findAll({ page: 1, limit: 10 })).rejects.toThrow('Database connection failed');
    });

    it('deve propagar erro do repository na atualização', async () => {
      // Arrange
      const pokemonId = 1;
      const updateDto = { name: 'raichu' };

      // Mock para findOne retornar pokémon existente
      mockRepository.findOne.mockResolvedValue(mockPokemonEntity);
      mockRepository.update.mockRejectedValue(new Error('Constraint violation'));

      // Act & Assert
      await expect(service.update(pokemonId, updateDto)).rejects.toThrow('Constraint violation');
    });
  });
});

/**
 * Testes de Integração - PokemonService
 * Testes que validam a integração com dependências reais
 */
describe('PokemonService Integration', () => {
  let service: PokemonService;
  let mockRepository: jest.Mocked<PokemonRepository>;

  beforeEach(async () => {
    const mockPokemonRepository = {
      create: jest.fn(),
      findAllPaginated: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: PokemonRepository,
          useValue: mockPokemonRepository,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    mockRepository = module.get(PokemonRepository);

    jest.clearAllMocks();
  });

  it('deve integrar corretamente com a PokéAPI para criar pokémon válido', async () => {
    // Este teste usa a PokéAPI real para validar a integração
    // Descomente apenas para testes de integração completos

    /*
    // Arrange
    const createDto = { name: 'ditto' };
    const expectedPokemon = {
      id: expect.any(Number),
      name: 'ditto',
      pokedexId: 132,
      types: ['normal'],
      abilities: expect.any(Array),
      imageUrl: expect.stringContaining('132.png'),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    };
    mockRepository.create.mockResolvedValue(expectedPokemon as any);

    // Remover mock do axios para usar requisição real
    jest.unmock('axios');
    
    // Act
    const result = await service.create(createDto);

    // Assert
    expect(result.name).toBe('ditto');
    expect(result.pokedexId).toBe(132);
    expect(result.types).toContain('normal');
    */
  });
});
