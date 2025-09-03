// src/app/pages/category/details/details-category-page.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Category } from '../../../types/category.model';
import { CategoryService } from '../../../services/category.service';
import { CategoryDetailsComponent } from '../../../components/category/category-details.component';

@Component({
  selector: 'app-details-category-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryDetailsComponent],
  templateUrl: './details-category-page.component.html',
  styleUrls: ['./details-category-page.component.css']
})
export class DetailsCategoryPageComponent implements OnInit {
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
      this.categoryService.getCategories().subscribe(categories => {
        const foundCategory = categories.find(c => c.id === id);
        if (foundCategory) {
          this.category = foundCategory;
        } else {
          alert('Categoria não encontrada.');
          this.router.navigate(['/categories']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/categories']);
  }

  goToEdit(): void {
    if (this.category) {
      this.router.navigate(['/categories/edit', this.category.id]);
    }
  }
}
