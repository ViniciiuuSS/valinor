import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private colunaSubject = new BehaviorSubject<any | null>(null);
  coluna$ = this.colunaSubject.asObservable();
  private readonly platformId = inject(PLATFORM_ID);

  private changeSubject = new Subject<void>();
  change$ = this.changeSubject.asObservable();

  open(coluna: any) {
    this.colunaSubject.next(coluna);
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const el = document.getElementById('crud-modal');
    if (el) {
      el.classList.remove('hidden');
      el.classList.add('flex');
    }
  }

  close() {
    this.colunaSubject.next(null);
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const el = document.getElementById('crud-modal');
    if (el) {
      el.classList.remove('flex');
      el.classList.add('hidden');
    }
  }
  notifyChange() {
    this.changeSubject.next();
  }
}
