import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TarefasService, Tarefa } from '../../services/tarefas.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-card',
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  @Input() tarefa!: Tarefa;
  @Input() colIndex: number | undefined;
  @Input() tarefaIndex: number | undefined;

  constructor(
    private tarefasService: TarefasService,
    private modalService: ModalService,
  ) {}

  editarTarefa() {
    const componente = <HTMLInputElement>document.getElementById('id_' + this.tarefa.id);
    componente.disabled = false;
    componente.focus();
  }

  excluirTarefa() {
    if (this.tarefa) {
      this.tarefasService.delete(this.tarefa.id).subscribe(() => {
        this.modalService.notifyChange();
      });
    }
  }

  desabilitarInput(event: any) {
    const input = event.target as HTMLInputElement;
    input.disabled = true;
    const novoTitulo = input.value;
    if (this.tarefa) {
      this.tarefasService.update(this.tarefa.id, { titulo: novoTitulo }).subscribe(() => {
        this.modalService.notifyChange();
      });
    }
  }
}
