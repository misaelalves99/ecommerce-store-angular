// src/app/components/category/category-details.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Category {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent {
  @Input() category!: Category;
}
