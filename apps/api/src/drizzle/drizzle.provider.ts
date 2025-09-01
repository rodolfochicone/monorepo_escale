import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../pokemon.entity';

export const drizzleProvider = {
  provide: 'DRIZZLE_INSTANCE',
  useFactory: async () => {
    console.log('🔗 Configurando conexão Drizzle...');
    console.log('📍 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'NÃO CONFIGURADA');

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    try {
      const client = await pool.connect();
      console.log('✅ Conexão PostgreSQL estabelecida com sucesso!');
      client.release();
    } catch (error) {
      console.error('❌ Erro ao conectar no PostgreSQL:', error);
    }

    return drizzle(pool, { schema });
  },
};
