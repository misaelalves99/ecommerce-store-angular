// src/app/features/catalog/products/pages/products-delete-page/products-delete-page.component.ts

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';
import { CurrencyBrPipe } from '../../../../../shared/pipes/currency-br.pipe';

import { CatalogService } from '../../../../../core/services/catalog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Product } from '../../../../../core/models/product.model';

@Component({
  standalone: true,
  selector: 'app-products-delete-page',
  imports: [CommonModule, PageHeaderComponent, ButtonComponent, CurrencyBrPipe],
  templateUrl: './products-delete-page.component.html',
  styleUrls: ['./products-delete-page.component.css'],
})
export class ProductsDeletePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly notificationService = inject(NotificationService);

  private readonly idSig = computed(
    () => this.route.snapshot.paramMap.get('id') ?? '',
  );

  readonly deleting = signal(false);

  readonly productSig = toSignal<Product | null>(
    this.catalogService.getProductById(this.idSig()).pipe(
      map((res: any) => (res?.data ?? res) as Product | null),
    ),
    { initialValue: null },
  );

  async confirmDelete(): Promise<void> {
    const id = this.idSig();
    if (!id) return;

    this.deleting.set(true);

    try {
      await this.catalogService.deleteProduct(id);
      this.notificationService.success('Produto excluído com sucesso.');
      this.router.navigate(['/catalog/products']);
    } catch (error) {
      console.error(error);
      this.notificationService.error(
        'Não foi possível excluir o produto. Tente novamente.',
      );
    } finally {
      this.deleting.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['/catalog/products']);
  }
}
