import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { TarefasService } from '../../services/tarefas.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  imports: [FormsModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal implements OnInit, OnDestroy {
  @Input() coluna: any = null;

  private sub: Subscription | null = null;
  private modalService = inject(ModalService);
  private tarefasService = inject(TarefasService);

  ngOnInit(): void {
    if (this.modalService) {
      this.sub = this.modalService.coluna$.subscribe((c) => {
        this.coluna = c;
      });
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  open(coluna: any, form?: any) {
    this.coluna = coluna;
    this.modalService.open(coluna);
    if (form) {
      form.reset();
    }
  }

  close() {
    this.modalService.close();
  }

  onSubmit(form: any) {
    if (form.valid && this.coluna) {
      this.tarefasService
        .create({
          titulo: form.value.name,
          coluna_id: this.coluna.id,
        })
        .subscribe(() => {
          form.reset();
          this.modalService.notifyChange();
          this.close();
        });
    }
  }
}
