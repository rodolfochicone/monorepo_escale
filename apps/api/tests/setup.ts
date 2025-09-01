import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  jest.setTimeout(30000);
});

afterAll(async () => {
});

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.mock('axios', () => ({
  get: jest.fn(),
  isAxiosError: jest.fn(),
}));

export { };
