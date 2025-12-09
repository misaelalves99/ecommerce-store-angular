// src/app/features/catalog/categories/pages/categories-create-page/categories-create-page.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { CategoryFormComponent } from '../../../categories/components/category-form/category-form.component';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Category } from '../../../../../core/models/category.model';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-categories-create-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    CategoryFormComponent,
    ButtonComponent, // ✅ necessário para usar <app-button> no template
  ],
  templateUrl: './categories-create-page.component.html',
  styleUrls: ['./categories-create-page.component.css'],
})
export class CategoriesCreatePageComponent {
  private readonly catalogService = inject(CatalogService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  /** Voltar para a listagem de categorias */
  goBack(): void {
    this.router.navigate(['/catalog/categories']);
  }

  async handleSubmit(payload: Partial<Category>): Promise<void> {
    try {
      await this.catalogService.createCategory(payload);
      this.notificationService.success('Categoria criado com sucesso.');
      this.router.navigate(['/catalog/categories']);
    } catch (error) {
      console.error(error);
      this.notificationService.error(
        'Não foi possível criar a categoria. Tente novamente.',
      );
    }
  }
}
