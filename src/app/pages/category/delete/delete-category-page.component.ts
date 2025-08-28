// src/app/pages/category/delete-category-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../types/category.model';

@Component({
  selector: 'app-delete-category-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-category-page.component.html',
  styleUrls: ['./delete-category-page.component.css'],
})
export class DeleteCategoryPageComponent {
  category: Category | undefined;

  constructor(private categoryService: CategoryService, private router: Router) {
    // Pegar o id da URL
    const url = window.location.pathname;
    const idStr = url.split('/').pop();
    const id = idStr ? Number(idStr) : 0;

    this.category = this.categoryService.getCategories().find(c => c.id === id);

    if (!this.category) {
      alert('Categoria não encontrada.');
      this.router.navigate(['/categories']);
    }
  }

  handleDelete() {
    if (this.category) {
      const confirmed = confirm(`Deseja realmente deletar a categoria "${this.category.name}"?`);
      if (confirmed) {
        this.categoryService.deleteCategory(this.category.id);
        this.router.navigate(['/categories']);
      }
    }
  }

  handleCancel() {
    this.router.navigate(['/categories']);
  }
}
