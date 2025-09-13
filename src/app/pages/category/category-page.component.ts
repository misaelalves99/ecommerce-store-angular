// src/app/pages/category/category-page.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Category } from '../../types/category.model';
import { CategoryService } from '../../services/category.service';
import { CategoryListComponent } from '../../components/category/category-list.component';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, CategoryListComponent],
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css'],
})
export class CategoryPageComponent {
  categories$: Observable<Category[]>;

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.categories$ = this.categoryService.getCategories();
  }

  navigateToCreate() {
    this.router.navigate(['/categories/create']);
  }

  handleDelete(id: number) {
    // atualiza via serviço para refletir em todos os assinantes
    this.categoryService.deleteCategory(id);
  }
}
