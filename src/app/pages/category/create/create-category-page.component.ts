// src/app/pages/category/create/create-category-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryFormComponent } from '../../../components/category/category-form.component';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-create-category-page',
  standalone: true,
  imports: [CommonModule, CategoryFormComponent],
  templateUrl: './create-category-page.component.html',
  styleUrls: ['./create-category-page.component.css']
})
export class CreateCategoryPageComponent {
  constructor(private categoryService: CategoryService, private router: Router) {}

  handleCreate(data: { name: string; description: string }) {
    this.categoryService.addCategory(data);
    this.router.navigate(['/categories']);
  }

  handleCancel() {
    this.router.navigate(['/categories']);
  }
}
