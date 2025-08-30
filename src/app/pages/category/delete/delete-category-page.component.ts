// src/app/pages/category/delete-category-page.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../types/category.model';

@Component({
  selector: 'app-delete-category-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-category-page.component.html',
  styleUrls: ['./delete-category-page.component.css'],
})
export class DeleteCategoryPageComponent implements OnInit {
  category?: Category;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.category = this.categoryService.getCategories().find(c => c.id === id);

    if (!this.category) {
      alert('Categoria não encontrada.');
      this.router.navigate(['/categories']);
    }
  }

  handleDelete() {
    if (this.category) {
      this.categoryService.deleteCategory(this.category.id);
      this.router.navigate(['/categories']);
    }
  }

  handleCancel() {
    this.router.navigate(['/categories']);
  }
}
