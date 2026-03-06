import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const DATA_FILE = join(process.cwd(), 'kanban-data.json');

interface KanbanData {
  colunas: LocalColuna[];
  tarefas: LocalTarefa[];
}

interface LocalColuna {
  id: string;
  nome: string;
  posicao: number;
}

interface LocalTarefa {
  id: string;
  titulo: string;
  posicao: number;
  coluna_id: string;
}

function load(): KanbanData {
  if (!existsSync(DATA_FILE)) {
    return { colunas: [], tarefas: [] };
  }
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return { colunas: [], tarefas: [] };
  }
}

function save(data: KanbanData) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ── Colunas ──

export function listColunas() {
  const data = load();
  return data.colunas
    .sort((a, b) => a.posicao - b.posicao)
    .map((c) => ({
      ...c,
      tarefas: data.tarefas
        .filter((t) => t.coluna_id === c.id)
        .sort((a, b) => a.posicao - b.posicao),
    }));
}

export function getColuna(id: string) {
  const data = load();
  const col = data.colunas.find((c) => c.id === id);
  if (!col) return null;
  return {
    ...col,
    tarefas: data.tarefas.filter((t) => t.coluna_id === id).sort((a, b) => a.posicao - b.posicao),
  };
}

export function createColuna(dados: { nome: string; posicao?: number }) {
  const data = load();
  const maxPos = data.colunas.reduce((m, c) => Math.max(m, c.posicao), 0);
  const coluna: LocalColuna = {
    id: randomUUID(),
    nome: dados.nome,
    posicao: dados.posicao ?? maxPos + 1,
  };
  data.colunas.push(coluna);
  save(data);
  return { ...coluna, tarefas: [] };
}

export function updateColuna(id: string, changes: { nome?: string; posicao?: number }) {
  const data = load();
  const col = data.colunas.find((c) => c.id === id);
  if (!col) return null;
  if (changes.nome !== undefined) col.nome = changes.nome;
  if (changes.posicao !== undefined) col.posicao = changes.posicao;
  save(data);
  return { ...col, tarefas: data.tarefas.filter((t) => t.coluna_id === id) };
}

export function deleteColuna(id: string) {
  const data = load();
  data.colunas = data.colunas.filter((c) => c.id !== id);
  data.tarefas = data.tarefas.filter((t) => t.coluna_id !== id);
  save(data);
}

// ── Tarefas ──

export function listTarefasByColuna(colunaId: string) {
  const data = load();
  return data.tarefas.filter((t) => t.coluna_id === colunaId).sort((a, b) => a.posicao - b.posicao);
}

export function getTarefa(id: string) {
  const data = load();
  return data.tarefas.find((t) => t.id === id) ?? null;
}

export function createTarefa(dados: { titulo: string; coluna_id: string; posicao?: number }) {
  const data = load();
  const tarefasCol = data.tarefas.filter((t) => t.coluna_id === dados.coluna_id);
  const maxPos = tarefasCol.reduce((m, t) => Math.max(m, t.posicao), 0);
  const tarefa: LocalTarefa = {
    id: randomUUID(),
    titulo: dados.titulo,
    coluna_id: dados.coluna_id,
    posicao: dados.posicao ?? maxPos + 1,
  };
  data.tarefas.push(tarefa);
  save(data);
  return tarefa;
}

export function updateTarefa(
  id: string,
  changes: { titulo?: string; coluna_id?: string; posicao?: number },
) {
  const data = load();
  const t = data.tarefas.find((t) => t.id === id);
  if (!t) return null;
  if (changes.titulo !== undefined) t.titulo = changes.titulo;
  if (changes.coluna_id !== undefined) t.coluna_id = changes.coluna_id;
  if (changes.posicao !== undefined) t.posicao = changes.posicao;
  save(data);
  return t;
}

export function deleteTarefa(id: string) {
  const data = load();
  data.tarefas = data.tarefas.filter((t) => t.id !== id);
  save(data);
}

export function moveTarefa(tarefaId: string, novaColuna: string, novaPosicao: number) {
  const data = load();
  const tarefa = data.tarefas.find((t) => t.id === tarefaId);
  if (!tarefa) return;
  tarefa.coluna_id = novaColuna;
  tarefa.posicao = novaPosicao;
  save(data);
}
