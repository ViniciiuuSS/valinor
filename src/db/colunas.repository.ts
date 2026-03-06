import pool from './pool';
import { Tarefa } from './tarefas.repository';

export interface Coluna {
  id: string;
  nome: string;
  posicao: number;
  tarefas?: Tarefa[];
}

export interface NewColuna {
  nome: string;
  posicao?: number;
}

const baseSelect = `
  SELECT c.id, c.nome, c.posicao,
    COALESCE(json_agg(json_build_object(
      'id', t.id,'titulo',t.titulo,'posicao',t.posicao
    ) ORDER BY t.posicao) FILTER (WHERE t.id IS NOT NULL), '[]')
    AS tarefas
  FROM colunas c
  LEFT JOIN tarefas t ON t.coluna_id = c.id
`;

/** lista ordenada */
export async function listColunas(): Promise<Coluna[]> {
  const { rows } = await pool.query(baseSelect + ` GROUP BY c.id ORDER BY c.posicao`);
  return rows;
}

export async function getColuna(id: string): Promise<Coluna | null> {
  const { rows } = await pool.query(baseSelect + ` WHERE c.id = $1 GROUP BY c.id`, [id]);
  return rows[0] || null;
}

export async function createColuna(data: NewColuna): Promise<Coluna> {
  const q =
    'INSERT INTO colunas (nome,posicao) VALUES ($1, COALESCE($2, (SELECT COALESCE(MAX(posicao),0)+1 FROM colunas))) RETURNING *';
  const { rows } = await pool.query(q, [data.nome, data.posicao]);
  return rows[0];
}

export async function updateColuna(
  id: string,
  changes: Partial<NewColuna>,
): Promise<Coluna | null> {
  const q =
    'UPDATE colunas SET nome = COALESCE($1,nome), posicao = COALESCE($2,posicao) WHERE id = $3 RETURNING *';
  const { rows } = await pool.query(q, [changes.nome, changes.posicao, id]);
  return rows[0] || null;
}

export async function deleteColuna(id: string): Promise<void> {
  await pool.query('DELETE FROM colunas WHERE id = $1', [id]);
}
