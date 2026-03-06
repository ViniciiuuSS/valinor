import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type TipoAlerta = 'success' | 'danger' | 'info' | 'warning';

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  mensagem: string;
  duracao?: number;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  static instancia: AlertService | null = null;

  private _alerts = new BehaviorSubject<Alerta[]>([]);
  alerts$ = this._alerts.asObservable();

  constructor() {
    AlertService.instancia = this;
  }

  private next(lista: Alerta[]) {
    this._alerts.next(lista);
  }

  add(mensagem: string, tipo: TipoAlerta = 'success', duracao?: number) {
    const id = Math.random().toString(36).slice(2, 9);
    const alerta: Alerta = { id, tipo, mensagem, duracao };
    const novo = [...this._alerts.getValue(), alerta];
    this.next(novo);
    if (duracao && duracao > 0) {
      setTimeout(() => this.remove(id), duracao);
    }
    return id;
  }

  remove(id: string) {
    const novo = this._alerts.getValue().filter((a) => a.id !== id);
    this.next(novo);
  }

  clear() {
    this.next([]);
  }
}
