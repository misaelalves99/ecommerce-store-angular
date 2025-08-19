// src/app/components/category/category-list.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Category } from '../../types/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule], // Necessário para *ngIf e *ngFor
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent {
  @Input() categories: Category[] = [];

  constructor(private router: Router, private categoryService: CategoryService) {}

  goToDetails(id: number) {
    this.router.navigate(['/categories', id]);
  }

  goToEdit(id: number) {
    this.router.navigate(['/categories/edit', id]);
  }

  deleteCategory(category: Category) {
    if (confirm(`Deseja realmente excluir a categoria "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id);
      // Atualiza a lista local
      this.categories = this.categories.filter(c => c.id !== category.id);
    }
  }
}
