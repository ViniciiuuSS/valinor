import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connString = process.env['POSTGRES_URL'] || process.env['DATABASE_URL'] || '';
const useSsl = (process.env['POSTGRES_SSL'] || '').toLowerCase() === 'true';

let pool = new Pool({
  connectionString: connString,
  ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
});

pool.on('connect', (client) => {
  client.query('SET search_path TO "Kanban"').catch(() => {});
});

pool.query('SELECT 1').catch((err: any) => {
  const msg: string = (err && err.message) || '';
  if (
    /server does not support ssl|does not support SSL/i.test(msg) ||
    (/SSL/i.test(msg) && !useSsl)
  ) {
    return;
  }

  if (/server does not support ssl|does not support SSL/i.test(msg)) {
    console.warn('Pool: servidor não suporta SSL — tentando reconectar sem SSL');
    try {
      pool.end().catch(() => {});
    } catch {}
    pool = new Pool({ connectionString: connString });
    pool.on('connect', (client) => {
      client.query('SET search_path TO "Kanban"').catch(() => {});
    });
  }
});

export default pool;
