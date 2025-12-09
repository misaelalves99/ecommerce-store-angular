// src/app/features/catalog/products/pages/products-create-page/products-create-page.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { ProductFormComponent } from '../../../products/components/product-form/product-form.component';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-products-create-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    ProductFormComponent,
    ButtonComponent,
  ],
  templateUrl: './products-create-page.component.html',
  styleUrls: ['./products-create-page.component.css'],
})
export class ProductsCreatePageComponent {
  private readonly catalogService = inject(CatalogService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly isSaving = false;

  goBack(): void {
    this.router.navigate(['/catalog/products']);
  }

  async handleSubmit(payload: {
    name: string;
    sku: string;
    price: number;
    brandId: string;
    categoryId: string;
    stock: number;
    minStock: number;
    isActive: boolean;
  }): Promise<void> {
    try {
      // 🔧 NÃO tipamos como Partial<Product> aqui,
      // deixamos como "any" / objeto literal e fazemos o cast só na chamada.
      const body = {
        name: payload.name,
        sku: payload.sku,

        // IDs “flat” que o service usa para resolver Brand/Category
        brandId: payload.brandId,
        categoryId: payload.categoryId,

        // price/stock normalizados
        price: {
          amount: payload.price,
          currency: 'BRL',
        } as any,
        stock: {
          quantityAvailable: payload.stock,
          lowStockThreshold: payload.minStock,
        } as any,

        isActive: payload.isActive,
        active: payload.isActive,
      };

      await firstValueFrom(
        this.catalogService.createProduct(body as any),
      );

      this.notificationService.success('Produto criado com sucesso.');
      this.router.navigate(['/catalog/products']);
    } catch (error) {
      console.error(error);
      this.notificationService.error(
        'Não foi possível criar o produto. Tente novamente.',
      );
    }
  }
}
