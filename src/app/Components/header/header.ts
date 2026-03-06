import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  constructor() {}
  arrLinks = [
    {
      name: 'GitHub Vinicius',
      link: 'https://github.com/ViniciiuuSS',
    },
    {
      name: 'Portifolio Vinicius',
      link: 'https://vinicius-guedes-portifolio.vercel.app/',
    },
  ];
}
