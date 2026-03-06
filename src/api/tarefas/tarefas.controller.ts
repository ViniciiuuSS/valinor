import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import type { NewTarefa } from '../../db/tarefas.repository';
import * as tarefasRepo from '../../db/tarefas.repository';

interface MoverTarefaDto {
  coluna_id: string;
  posicao: number;
}

@Controller('api')
export class TarefasController {
  @Get('colunas/:id/tarefas')
  async listarPorColuna(@Param('id') id: string) {
    try {
      return await tarefasRepo.listTarefasByColuna(id);
    } catch (erro) {
      throw this.erroInterno(erro);
    }
  }

  @Post('tarefas')
  async criar(@Body() dados: NewTarefa) {
    try {
      const result = await tarefasRepo.createTarefa(dados);
      return result;
    } catch (erro) {
      throw this.erroInterno(erro);
    }
  }

  @Put('tarefas/:id')
  async atualizar(@Param('id') id: string, @Body() alteracoes: Partial<NewTarefa>) {
    try {
      const result = await tarefasRepo.updateTarefa(id, alteracoes);
      return result;
    } catch (erro) {
      throw this.erroInterno(erro);
    }
  }

  @Delete('tarefas/:id')
  async remover(@Param('id') id: string) {
    try {
      await tarefasRepo.deleteTarefa(id);
      return { ok: true };
    } catch (erro) {
      throw this.erroInterno(erro);
    }
  }

  @Patch('tarefas/:id/mover')
  async mover(@Param('id') id: string, @Body() dados: MoverTarefaDto) {
    try {
      await tarefasRepo.moveTarefa(id, dados.coluna_id, dados.posicao);
      return { ok: true };
    } catch (erro) {
      throw this.erroInterno(erro);
    }
  }

  private erroInterno(erro: unknown): HttpException {
    if (erro instanceof Error) {
      return new HttpException({ error: erro.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return new HttpException(
      { error: 'Erro interno no servidor' },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
