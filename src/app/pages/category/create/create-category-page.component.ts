// src/app/pages/category/create/create-category-page.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { CategoryFormComponent } from '../../../components/category/category-form.component';
import { CategoryFormData } from '../../../types/category-form-data.model';

@Component({
  selector: 'app-create-category-page',
  standalone: true,
  imports: [CategoryFormComponent],
  templateUrl: './create-category-page.component.html',
  styleUrls: ['./create-category-page.component.css'],
})
export class CreateCategoryPageComponent {
  constructor(private router: Router, private categoryService: CategoryService) {}

  handleCreate(data: CategoryFormData) {
    this.categoryService.addCategory(data);
    this.router.navigate(['/categories']);
  }

  handleCancel() {
    this.router.navigate(['/categories']);
  }
}
