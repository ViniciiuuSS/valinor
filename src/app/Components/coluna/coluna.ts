import { Component, Input, Output, EventEmitter, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { Card } from '../card/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { ModalService } from '../../services/modal.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ColunaService, Coluna as ColunaModel, Tarefa } from '../../services/coluna.service';

export type ColunaChange =
  | { type: 'update'; coluna: ColunaModel }
  | { type: 'delete'; coluna: ColunaModel }
  | { type: 'move'; fromId: string; toId: string; tarefaId: string; novaPos: number };

@Component({
  selector: 'app-coluna',
  standalone: true,
  imports: [CommonModule, FormsModule, Card, DragDropModule],
  templateUrl: './coluna.html',
  styleUrl: './coluna.css',
})
export class Coluna {
  @Input() coluna!: ColunaModel;
  @Input() listId: string | undefined;
  @Input() connectedTo: string[] | undefined;
  @Input() indice: number | undefined;
  @Input() todasColunas: ColunaModel[] | undefined;
  @Output() changed = new EventEmitter<ColunaChange>();
  private readonly platformId = inject(PLATFORM_ID);
  tooltipVisivel = false;
  deleting = false;
  editarColuna() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const componente = <HTMLInputElement>document.getElementById(this.coluna.nome);
    componente.disabled = false;
    componente.focus();
  }

  salvarNome(input: HTMLInputElement) {
    input.disabled = true;
    const novo = input.value;
    if (this.coluna) {
      this.colunaService
        .update(this.coluna.id, { nome: novo })
        .subscribe(() => this.changed.emit({ type: 'update', coluna: this.coluna }));
    }
  }

  excluirColuna() {
    if (!this.coluna) return;
    const temTarefas = (this.coluna.tarefas?.length ?? 0) > 0;
    const msg = temTarefas
      ? 'A coluna ainda contém tarefas. Deseja realmente excluir?'
      : 'Deseja excluir esta coluna?';
    if (isPlatformBrowser(this.platformId) && !window.confirm(msg)) {
      return;
    }
    this.deleting = true;
    this.colunaService
      .delete(this.coluna.id)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => this.changed.emit({ type: 'delete', coluna: this.coluna }));
  }
  constructor(
    private modalService: ModalService,
    private colunaService: ColunaService,
  ) {}

  openModal(coluna: any) {
    this.modalService.open(coluna);
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
  }
  drop(event: CdkDragDrop<any[]>) {
    const prevId = event.previousContainer.id;
    const destId = event.container.id;
    if (!prevId || !destId) return;

    const tarefa = (event.previousContainer.data as Tarefa[])[event.previousIndex];
    const novaColunaId = destId;
    const novaPos = event.currentIndex;

    this.colunaService.moveTarefa(tarefa.id, novaColunaId, novaPos).subscribe(
      () => {
        this.changed.emit({
          type: 'move',
          fromId: prevId,
          toId: novaColunaId,
          tarefaId: tarefa.id,
          novaPos,
        });
      },
      (error) => {
        console.error('Move failed', error);
      },
    );
  }
  desabilitarInput(input: HTMLInputElement) {
    input.disabled = true;
    this.salvarNome(input);
  }
}
