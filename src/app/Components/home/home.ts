import { Component } from '@angular/core';
import { Kanban } from "../kanban/kanban";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Kanban],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
