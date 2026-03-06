import { Injectable } from '@nestjs/common';
import type { Coluna, NewColuna } from '../../db/colunas.repository';
import * as colunasRepo from '../../db/colunas.repository';

@Injectable()
export class ColunasService {
  listarColunas(): Promise<Coluna[]> {
    return colunasRepo.listColunas();
  }

  criarColuna(dados: NewColuna): Promise<Coluna> {
    return colunasRepo.createColuna(dados);
  }

  atualizarColuna(id: string, alteracoes: Partial<NewColuna>): Promise<Coluna | null> {
    return colunasRepo.updateColuna(id, alteracoes);
  }

  removerColuna(id: string): Promise<void> {
    return colunasRepo.deleteColuna(id);
  }
}
