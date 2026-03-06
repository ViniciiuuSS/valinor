import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import type { NewColuna } from '../../db/colunas.repository';
import * as colunasRepo from '../../db/colunas.repository';

@Controller('api/colunas')
export class ColunasController {
  @Get()
  async listar() {
    try {
      return await colunasRepo.listColunas();
    } catch (erro) {
      throw this.erroInterno(erro);
    }
  }

  @Post()
  async criar(@Body() dados: NewColuna) {
    try {
      const result = await colunasRepo.createColuna(dados);
      return result;
    } catch (erro) {
      throw this.erroInterno(erro);
    }
  }

  @Put(':id')
  async atualizar(@Param('id') id: string, @Body() alteracoes: Partial<NewColuna>) {
    try {
      const result = await colunasRepo.updateColuna(id, alteracoes);
      return result;
    } catch (erro) {
      throw this.erroInterno(erro);
    }
  }

  @Delete(':id')
  async remover(@Param('id') id: string) {
    try {
      await colunasRepo.deleteColuna(id);
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
