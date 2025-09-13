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
    if (isNaN(id)) {
      alert('ID inválido.');
      this.router.navigate(['/categories']);
      return;
    }

    // Corrigido: atualiza category dentro do subscribe
    this.categoryService.getCategories().subscribe(categories => {
      const found = categories.find(c => c.id === id);
      this.category = found; // ✅ aqui apenas atualiza a variável
    });
  }

  handleDelete(): void {
    if (!this.category) return;
    this.categoryService.deleteCategory(this.category.id).subscribe(() => {
      this.router.navigate(['/categories']);
    });
  }

  handleCancel(): void {
    this.router.navigate(['/categories']);
  }
}
