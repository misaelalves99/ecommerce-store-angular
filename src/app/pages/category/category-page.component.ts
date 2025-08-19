// src/app/pages/category/category-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryListComponent } from '../../components/category/category-list.component';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/category.model';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryListComponent],
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {
    this.categories = this.categoryService.getCategories();
  }
}
