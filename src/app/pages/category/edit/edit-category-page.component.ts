// src/app/pages/category/edit-category-page.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../types/category.model';
import { CategoryService } from '../../../services/category.service';
import { CategoryFormComponent } from '../../../components/category/category-form.component';

@Component({
  selector: 'app-edit-category-page',
  standalone: true,
  imports: [CommonModule, CategoryFormComponent],
  templateUrl: './edit-category-page.component.html',
  styleUrls: ['./edit-category-page.component.css']
})
export class EditCategoryPageComponent implements OnInit {
  category: Category | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      const foundCategory = this.categoryService.getCategories().find(c => c.id === id);
      if (foundCategory) {
        this.category = foundCategory;
      } else {
        alert('Categoria não encontrada.');
        this.router.navigate(['/categories']);
      }
    }
  }

  handleUpdate(data: { name: string; description: string }) {
    if (this.category) {
      // Atualiza a categoria via service
      this.categoryService.updateCategory(this.category.id, data);
      console.log('Categoria atualizada:', { id: this.category.id, ...data });
      this.router.navigate(['/categories']);
    }
  }

  handleCancel() {
    this.router.navigate(['/categories']);
  }
}
