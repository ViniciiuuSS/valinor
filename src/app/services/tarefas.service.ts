import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tarefa {
  id: string;
  titulo: string;
  posicao: number;
  coluna_id: string;
}

export interface NewTarefa {
  titulo: string;
  coluna_id: string;
  posicao?: number;
}

@Injectable({ providedIn: 'root' })
export class TarefasService {
  private base = '/api/tarefas';

  constructor(private http: HttpClient) {}

  listByColuna(colunaId: string): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`/api/colunas/${colunaId}/tarefas`);
  }

  create(data: NewTarefa): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.base, data);
  }

  update(id: string, changes: Partial<NewTarefa>): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.base}/${id}`, changes);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  move(id: string, coluna_id: string, posicao: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/${id}/mover`, { coluna_id, posicao });
  }
}
