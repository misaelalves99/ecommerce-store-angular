// src/app/components/brand/brand-list.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Brand } from '../../types/brand.model';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css'],
})
export class BrandListComponent {
  @Input() brands: Brand[] = [];
  @Output() deleteBrandEvent = new EventEmitter<number>(); // ✅

  constructor(private router: Router) {}

  goToDetails(id: number) {
    this.router.navigate(['/brands/details', id]);
  }

  goToEdit(id: number) {
    this.router.navigate(['/brands/edit', id]);
  }

  goToDelete(id: number) {
    // Navega para a rota de delete
    this.router.navigate(['/brands/delete', id]);
    // Emite o id para o componente pai atualizar lista se necessário
    this.deleteBrandEvent.emit(id);
  }
}
