import { Module } from '@nestjs/common';
import { ColunasController } from './colunas/colunas.controller';
import { TarefasController } from './tarefas/tarefas.controller';

@Module({
  controllers: [ColunasController, TarefasController],
})
export class ApiModule {}
