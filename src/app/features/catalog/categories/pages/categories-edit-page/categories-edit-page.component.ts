// src/app/features/catalog/categories/pages/categories-edit-page/categories-edit-page.component.ts
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { CategoryFormComponent } from '../../../categories/components/category-form/category-form.component';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Category } from '../../../../../core/models/category.model';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-categories-edit-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    CategoryFormComponent,
    ButtonComponent,
  ],
  templateUrl: './categories-edit-page.component.html',
  styleUrls: ['./categories-edit-page.component.css'],
})
export class CategoriesEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly notificationService = inject(NotificationService);

  private readonly idSig = computed(
    () => this.route.snapshot.paramMap.get('id') ?? '',
  );

  // Agora trata array direto, { data }, { items } e casa por id OU slug
  readonly categorySig = toSignal(
    this.catalogService.getCategories().pipe(
      map((response: any) => {
        const currentId = this.idSig();
        if (!currentId) return null;

        const raw = response?.data ?? response;

        const list: any[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.items)
          ? raw.items
          : [];

        if (!list.length) return null;

        const found = list.find((c) => {
          const anyC = c as any;
          const id = anyC.id != null ? String(anyC.id) : '';
          const slug = anyC.slug != null ? String(anyC.slug) : '';
          const routeId = String(currentId);
          return id === routeId || slug === routeId;
        });

        return (found as Category) ?? null;
      }),
    ),
    { initialValue: null as Category | null },
  );

  goBack(): void {
    this.router.navigate(['/catalog/categories']);
  }

  async handleSubmit(payload: Partial<Category>): Promise<void> {
    const id = this.idSig();
    if (!id) return;

    try {
      await firstValueFrom(
        this.catalogService.updateCategory(id, payload),
      );
      this.notificationService.success('Categoria atualizada com sucesso.');
      this.router.navigate(['/catalog/categories']);
    } catch (error: unknown) {
      console.error(error);
      this.notificationService.error(
        'Não foi possível atualizar a categoria. Tente novamente.',
      );
    }
  }
}
