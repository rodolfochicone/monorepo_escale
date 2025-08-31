import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../pokemon.entity';

export const drizzleProvider = {
  provide: 'DRIZZLE_INSTANCE',
  useFactory: async () => {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    return drizzle(pool, { schema });
  },
};
