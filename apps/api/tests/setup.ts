/**
 * Configuração global para os testes da API
 * Task 2.7: Setup dos testes Jest
 */

import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente para testes
dotenv.config({ path: '.env.test' });

// Configurações globais para os testes
beforeAll(async () => {
  // Configurar timeouts
  jest.setTimeout(30000);
});

afterAll(async () => {
  // Cleanup global se necessário
});

// Mocks globais
global.console = {
  ...console,
  log: jest.fn(), // Silenciar logs durante os testes
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock para axios - usado nas integrações com PokéAPI
jest.mock('axios', () => ({
  get: jest.fn(),
  isAxiosError: jest.fn(),
}));

export { };
