// src/app/features/catalog/categories/pages/categories-details-page/categories-details-page.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

import { CatalogService } from '../../../../../core/services/catalog.service';
import { Category } from '../../../../../core/models/category.model';

@Component({
  standalone: true,
  selector: 'app-categories-details-page',
  imports: [CommonModule, PageHeaderComponent, ButtonComponent],
  templateUrl: './categories-details-page.component.html',
  styleUrls: ['./categories-details-page.component.css'],
})
export class CategoriesDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);

  readonly loading = signal(true);

  private readonly idSig = computed(
    () => this.route.snapshot.paramMap.get('id') ?? '',
  );

  readonly categorySig = toSignal<Category | null>(
    this.catalogService.getCategories().pipe(
      map((response: any) => {
        const currentId = this.idSig();

        // Aceita ApiResponse<{ items: Category[] }>, Category[] ou direto
        const base = (response?.data ?? response) as
          | { items: Category[] }
          | Category[]
          | null
          | undefined;

        if (!base) return null;

        const list = Array.isArray(base) ? base : base.items ?? [];

        const found =
          list.find((c) => {
            const anyC = c as any;
            const cid = anyC.id ?? anyC.slug;
            return String(cid) === String(currentId);
          }) ?? null;

        return found;
      }),
    ),
    { initialValue: null },
  );

  constructor() {
    // só para controlar o "loading" simples
    this.categorySig(); // dispara o toSignal
    this.loading.set(false);
  }

  // ===== Navegação =====
  goBack(): void {
    this.router.navigate(['/catalog/categories']);
  }

  goToEdit(): void {
    const category = this.categorySig();
    if (!category) return;

    const anyC = category as any;
    const id = anyC.id ?? category.slug;

    if (!id) {
      this.router.navigate(['/catalog/categories']);
      return;
    }

    this.router.navigate(['/catalog/categories/edit', id]);
  }

  // ===== Helpers para template =====

  isInactive(category: Category | null): boolean {
    if (!category) return false;
    const anyC = category as any;

    if (anyC.active === false) return true;
    if (anyC.isActive === false) return true;

    return false;
  }

  getStatusLabel(category: Category | null): string {
    return this.isInactive(category) ? 'Inativa' : 'Ativa';
  }

  getDescription(category: Category | null): string {
    if (!category) return 'Sem descrição registrada.';
    return category.description?.trim()
      ? category.description
      : 'Sem descrição registrada.';
  }
}
