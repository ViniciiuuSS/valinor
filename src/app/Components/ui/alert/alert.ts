import { Component } from '@angular/core';
import { AlertService, Alerta } from '../../../services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  alerts: Alerta[] = [];
  constructor(private alertService: AlertService) {
    this.alertService.alerts$.subscribe((lista) => (this.alerts = lista));
  }

  remover(id: string) {
    this.alertService.remove(id);
  }
}
