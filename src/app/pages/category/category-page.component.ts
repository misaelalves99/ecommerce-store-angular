// src/app/pages/category/category-page.component.ts

// src/app/pages/category/category-page.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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
export class CategoryPageComponent implements OnInit {
  categories: Category[] = [];

  constructor(private router: Router, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categories = this.categoryService.getCategories();
  }

  navigateToCreate() {
    this.router.navigate(['/categories/create']);
  }

  handleDelete(id: number) {
    // Remove a categoria da lista local ao navegar para delete
    this.categories = this.categories.filter(c => c.id !== id);
  }
}
