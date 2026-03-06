import { Pool } from 'pg';

const connString = process.env['POSTGRES_URL'] || process.env['DATABASE_URL'] || '';

export const useDb = !!connString;

const pool = useDb
  ? new Pool({
      connectionString: connString,
      ssl: { rejectUnauthorized: false },
    })
  : (null as unknown as Pool);

if (pool) {
  pool.on('connect', (client) => {
    client.query('SET search_path TO "Kanban"').catch(() => {});
  });
  pool.on('error', (err) => {
    console.error('Pool error:', err.message);
  });
}

if (!useDb) {
  console.log('[pool] Nenhuma URL de banco configurada — usando armazenamento local (JSON)');
}

export default pool;
