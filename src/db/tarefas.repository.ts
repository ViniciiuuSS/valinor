import pool, { useDb } from './pool';
import * as local from './local-store';

export interface Tarefa {
  id: string;
  titulo: string;
  posicao: number;
  coluna_id: string;
}

export interface NewTarefa {
  titulo: string;
  coluna_id: string;
  posicao?: number;
}

export async function listTarefasByColuna(colunaId: string): Promise<Tarefa[]> {
  if (!useDb) return local.listTarefasByColuna(colunaId) as Tarefa[];
  const { rows } = await pool.query('SELECT * FROM tarefas WHERE coluna_id = $1 ORDER BY posicao', [
    colunaId,
  ]);
  return rows;
}

export async function getTarefa(id: string): Promise<Tarefa | null> {
  if (!useDb) return local.getTarefa(id) as Tarefa | null;
  const { rows } = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function createTarefa(data: NewTarefa): Promise<Tarefa> {
  if (!useDb) return local.createTarefa(data) as Tarefa;
  const q =
    'INSERT INTO tarefas (titulo,coluna_id,posicao) VALUES ($1,$2,COALESCE($3, (SELECT COALESCE(MAX(posicao),0)+1 FROM tarefas WHERE coluna_id=$2))) RETURNING *';
  const { rows } = await pool.query(q, [data.titulo, data.coluna_id, data.posicao]);
  return rows[0];
}

export async function updateTarefa(
  id: string,
  changes: Partial<NewTarefa>,
): Promise<Tarefa | null> {
  if (!useDb) return local.updateTarefa(id, changes) as Tarefa | null;
  const q =
    'UPDATE tarefas SET titulo = COALESCE($1,titulo), coluna_id=COALESCE($2,coluna_id), posicao=COALESCE($3,posicao) WHERE id = $4 RETURNING *';
  const { rows } = await pool.query(q, [changes.titulo, changes.coluna_id, changes.posicao, id]);
  return rows[0] || null;
}

export async function deleteTarefa(id: string): Promise<void> {
  if (!useDb) {
    local.deleteTarefa(id);
    return;
  }
  await pool.query('DELETE FROM tarefas WHERE id = $1', [id]);
}

export async function moveTarefa(
  tarefaId: string,
  novaColuna: string,
  novaPosicao: number,
): Promise<void> {
  if (!useDb) {
    local.moveTarefa(tarefaId, novaColuna, novaPosicao);
    return;
  }
  await pool.query(`SELECT "Kanban".mover_tarefa($1,$2,$3)`, [tarefaId, novaColuna, novaPosicao]);
}
