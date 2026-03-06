import {
  Component,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Coluna } from '../coluna/coluna';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColunaService, Coluna as ColunaModel } from '../../services/coluna.service';
import { ModalService } from '../../services/modal.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule, Coluna],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Kanban implements OnInit, OnDestroy {
  colunas: ColunaModel[] = [];
  filteredColunas: ColunaModel[] = [];
  searchTerm = '';
  creating = false;
  loadError: string | null = null;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  private retriedLoad = false;
  private destroyed = new Subject<void>();
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private colunaService: ColunaService,
    private modalService: ModalService,
  ) {}

  ngOnInit() {
    this.forceRefresh();
    this.loadCols();
    this.modalService.change$.pipe(takeUntil(this.destroyed)).subscribe(() => this.reloadPage());
  }

  onColumnChange(evt: any) {
    switch (evt.type) {
      case 'update':
      case 'delete':
      case 'move':
        this.reloadPage();
        break;
    }
  }

  private reloadPage() {
    if (isPlatformBrowser(this.platformId)) {
      window.location.reload();
    }
  }

  private loadCols() {
    this.loadError = null;

    this.colunaService.list().subscribe({
      next: (cols) => {
        this.colunas = Array.isArray(cols)
          ? cols.map((c) => ({
              ...c,
              nome: c?.nome ?? '',
              tarefas: Array.isArray(c?.tarefas) ? c.tarefas : [],
            }))
          : [];
        this.applyFilter();
        this.forceRefresh();
      },
      error: (err: any) => {
        console.error('loadCols error', err);
        this.loadError = err.message || 'Falha ao carregar colunas';
        if (!this.retriedLoad) {
          this.retriedLoad = true;
          setTimeout(() => this.loadCols(), 800);
        }
      },
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilter();
  }

  private applyFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredColunas = this.colunas;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredColunas = this.colunas
        .map((coluna) => ({
          ...coluna,
          tarefas:
            coluna.tarefas?.filter((tarefa) =>
              (tarefa?.titulo ?? '').toLowerCase().includes(term),
            ) || [],
        }))
        .filter(
          (coluna) => coluna.tarefas.length > 0 || (coluna.nome ?? '').toLowerCase().includes(term),
        );
    }
  }

  novaColuna() {
    if (this.creating) {
      return;
    }
    this.creating = true;
    this.colunaService
      .create({ nome: 'Nova coluna' })
      .pipe(finalize(() => (this.creating = false)))
      .subscribe({
        next: () => {
          this.reloadPage();
        },
        error: (e) => {
          console.error('create column error', e);
        },
      });
  }

  getListId(index: number) {
    return `list-${index}`;
  }

  getRealIndex(coluna: ColunaModel): number {
    return this.colunas.findIndex((c) => c.id === coluna.id);
  }

  getConnected(index: number) {
    const colunaAtual = this.colunas[index];
    return this.colunas.map((c) => c.id).filter((id) => id !== colunaAtual?.id);
  }

  trackById(index: number, item: ColunaModel) {
    return item.id;
  }

  private forceRefresh() {
    setTimeout(() => {
      const input = this.searchInput?.nativeElement;
      console.log(input);
      if (input) {
        input.value = 'a';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(() => {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }, 50);
      }
    }, 100);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
