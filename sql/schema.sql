CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS "Kanban";

CREATE TABLE IF NOT EXISTS "Kanban"."colunas" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  posicao integer NOT NULL DEFAULT 0,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Kanban"."tarefas" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  posicao integer NOT NULL DEFAULT 0,
  coluna_id uuid REFERENCES "Kanban"."colunas"(id) ON DELETE CASCADE,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_colunas_posicao ON "Kanban"."colunas"(posicao);
CREATE INDEX IF NOT EXISTS idx_tarefas_coluna_posicao ON "Kanban"."tarefas"(coluna_id, posicao);

CREATE OR REPLACE FUNCTION "Kanban".mover_tarefa(p_tarefa uuid, p_nova_coluna uuid, p_nova_posicao integer)
RETURNS void AS $$
DECLARE
  v_antiga_coluna uuid;
  v_antiga_pos integer;
BEGIN
  SELECT coluna_id, posicao INTO v_antiga_coluna, v_antiga_pos FROM "Kanban"."tarefas" WHERE id = p_tarefa;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tarefa não encontrada';
  END IF;

  IF v_antiga_coluna = p_nova_coluna THEN
    IF v_antiga_pos < p_nova_posicao THEN
      UPDATE "Kanban"."tarefas"
      SET posicao = posicao - 1
      WHERE coluna_id = v_antiga_coluna AND posicao > v_antiga_pos AND posicao <= p_nova_posicao;
    ELSE
      UPDATE "Kanban"."tarefas"
      SET posicao = posicao + 1
      WHERE coluna_id = v_antiga_coluna AND posicao >= p_nova_posicao AND posicao < v_antiga_pos;
    END IF;
  ELSE
    UPDATE "Kanban"."tarefas"
    SET posicao = posicao - 1
    WHERE coluna_id = v_antiga_coluna AND posicao > v_antiga_pos;

    UPDATE "Kanban"."tarefas"
    SET posicao = posicao + 1
    WHERE coluna_id = p_nova_coluna AND posicao >= p_nova_posicao;
  END IF;

  UPDATE "Kanban"."tarefas"
  SET coluna_id = p_nova_coluna, posicao = p_nova_posicao
  WHERE id = p_tarefa;
END;
$$ LANGUAGE plpgsql;