import { Injectable } from '@nestjs/common';
import type { NewTarefa, Tarefa } from '../../db/tarefas.repository';
import * as tarefasRepo from '../../db/tarefas.repository';

@Injectable()
export class TarefasService {
  listarPorColuna(colunaId: string): Promise<Tarefa[]> {
    return tarefasRepo.listTarefasByColuna(colunaId);
  }

  criarTarefa(dados: NewTarefa): Promise<Tarefa> {
    return tarefasRepo.createTarefa(dados);
  }

  atualizarTarefa(id: string, alteracoes: Partial<NewTarefa>): Promise<Tarefa | null> {
    return tarefasRepo.updateTarefa(id, alteracoes);
  }

  removerTarefa(id: string): Promise<void> {
    return tarefasRepo.deleteTarefa(id);
  }

  moverTarefa(id: string, colunaId: string, posicao: number): Promise<void> {
    return tarefasRepo.moveTarefa(id, colunaId, posicao);
  }
}
