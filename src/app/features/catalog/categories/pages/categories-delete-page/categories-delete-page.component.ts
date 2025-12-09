// src/app/features/catalog/categories/pages/categories-delete-page/categories-delete-page.component.ts
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Category } from '../../../../../core/models/category.model';

@Component({
  standalone: true,
  selector: 'app-categories-delete-page',
  imports: [CommonModule, PageHeaderComponent, ButtonComponent],
  templateUrl: './categories-delete-page.component.html',
  styleUrls: ['./categories-delete-page.component.css'],
})
export class CategoriesDeletePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly notificationService = inject(NotificationService);

  private readonly idSig = computed(
    () => this.route.snapshot.paramMap.get('id') ?? '',
  );

  readonly categorySig = toSignal(
    this.catalogService.getCategories().pipe(
      map((response: any) => {
        const currentId = this.idSig();

        // Garante que pegamos sempre o array, independente do formato
        const base = (response && response.data) ? response.data : response;
        const data = (base && (base.items ?? base)) as
          | Category[]
          | null
          | undefined;

        if (!data) return null;

        const list = Array.isArray(data) ? data : [];

        // Match por ID OU por SLUG (URL /delete/cat-fashion)
        return (
          list.find((c: any) => {
            const cid = c.id ?? c.slug;
            return String(cid) === String(currentId);
          }) ?? null
        );
      }),
    ),
    { initialValue: null as Category | null },
  );

  async confirmDelete(): Promise<void> {
    const id = this.idSig();
    if (!id) return;

    try {
      await this.catalogService.deleteCategory(id);
      this.notificationService.success('Categoria excluída com sucesso.');
      this.router.navigate(['/catalog/categories']);
    } catch (error: unknown) {
      console.error(error);
      this.notificationService.error(
        'Não foi possível excluir a categoria. Tente novamente.',
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/catalog/categories']);
  }
}
