// src/app/features/catalog/categories/pages/categories-list-page/categories-list-page.component.ts
import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';
import { EmptyStateComponent } from '../../../../../shared/components/ui/empty-state/empty-state.component';
import { CategoryTableComponent } from '../../components/category-table/category-table.component';
import { CategoriesFiltersComponent } from '../../components/categories-filters/categories-filters.component';

import { CatalogService } from '../../../../../core/services/catalog.service';
import { Category } from '../../../../../core/models/category.model';

@Component({
  standalone: true,
  selector: 'app-categories-list-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    ButtonComponent,
    EmptyStateComponent,
    CategoryTableComponent,
    CategoriesFiltersComponent,
  ],
  templateUrl: './categories-list-page.component.html',
  styleUrls: ['./categories-list-page.component.css'],
})
export class CategoriesListPageComponent {
  private readonly catalogService = inject(CatalogService);
  private readonly router = inject(Router);

  private readonly allCategoriesSig = toSignal(
    this.catalogService.getCategories(),
    { initialValue: [] as Category[] },
  );

  readonly search = signal('');

  readonly filteredCategories = computed(() => {
    const term = this.search().toLowerCase().trim();
    const categories = this.allCategoriesSig() ?? [];

    return categories.filter((c) => {
      if (!term) return true;
      return (
        c.name.toLowerCase().includes(term) ||
        (c.slug ?? '').toLowerCase().includes(term)
      );
    });
  });

  constructor() {
    effect(() => {
      // força reatividade e ajuda a detectar erros no dev
      this.filteredCategories();
    });
  }

  onSearchChange(value: string): void {
    this.search.set(value);
  }

  goToCreate(): void {
    this.router.navigate(['/catalog/categories/create']);
  }

  onDetails(id: string | number): void {
    this.router.navigate(['/catalog/categories/details', id]);
  }

  onDelete(id: string | number): void {
    this.router.navigate(['/catalog/categories/delete', id]);
  }
}
