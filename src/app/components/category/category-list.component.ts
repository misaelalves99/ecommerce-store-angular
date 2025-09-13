// src/app/components/category/category-list.component.ts

// src/app/components/category/category-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Category } from '../../types/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent {
  @Input() categories: Category[] | null = [];
  @Output() deleteCategoryEvent = new EventEmitter<number>();

  constructor(private router: Router) {}

  goToDetails(id: number) {
    this.router.navigate(['/categories/details', id]);
  }

  goToEdit(id: number) {
    this.router.navigate(['/categories/edit', id]);
  }

  goToDelete(id: number) {
    this.router.navigate(['/categories/delete', id]);
    this.deleteCategoryEvent.emit(id);
  }
}
