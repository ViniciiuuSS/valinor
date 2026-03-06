import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Coluna {
  id: string;
  nome: string;
  posicao: number;
  tarefas?: Tarefa[];
}

export interface NewColuna {
  nome: string;
  posicao?: number;
}

export interface Tarefa {
  id: string;
  titulo: string;
  posicao: number;
  coluna_id: string;
}

@Injectable({ providedIn: 'root' })
export class ColunaService {
  private base = '/api/colunas';

  constructor(private http: HttpClient) {}

  list(): Observable<Coluna[]> {
    return this.http.get<Coluna[]>(`${this.base}?_ts=${Date.now()}`).pipe(
      map((res: unknown) => {
        const payload =
          typeof res === 'string'
            ? JSON.parse(res)
            : res && typeof res === 'object' && 'data' in res
              ? (res as { data: unknown }).data
              : res;

        const cols = Array.isArray(payload) ? payload : [];
        return cols.map((c: any) => ({
          ...c,
          nome: c?.nome ?? '',
          tarefas: Array.isArray(c?.tarefas) ? c.tarefas : [],
        }));
      }),
    );
  }

  get(id: string): Observable<Coluna> {
    return this.http.get<Coluna>(`${this.base}/${id}`);
  }

  create(data: NewColuna): Observable<Coluna> {
    return this.http.post<Coluna>(this.base, data);
  }

  update(id: string, changes: Partial<NewColuna>): Observable<Coluna> {
    return this.http.put<Coluna>(`${this.base}/${id}`, changes);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  listTarefas(colunaId: string): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.base}/${colunaId}/tarefas`);
  }

  moveTarefa(id: string, coluna_id: string, posicao: number) {
    const tarefasBase = '/api/tarefas';
    return this.http.patch<void>(`${tarefasBase}/${id}/mover`, { coluna_id, posicao });
  }
}
