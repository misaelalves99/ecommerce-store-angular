// src/app/features/catalog/products/pages/products-details-page/products-details-page.component.ts
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

import { CurrencyBrPipe } from '../../../../../shared/pipes/currency-br.pipe';
import { DateBrPipe } from '../../../../../shared/pipes/date-br.pipe';

import { CatalogService } from '../../../../../core/services/catalog.service';
import { Product } from '../../../../../core/models/product.model';

@Component({
  standalone: true,
  selector: 'app-products-details-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    ButtonComponent,
    CurrencyBrPipe,
    DateBrPipe,
  ],
  templateUrl: './products-details-page.component.html',
  styleUrls: ['./products-details-page.component.css'],
})
export class ProductsDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);

  private readonly idSig = computed(
    () => this.route.snapshot.paramMap.get('id') ?? '',
  );

  // Converte ApiResponse<Product> -> Product | null antes de virar signal
  readonly productSig = toSignal<Product | null>(
    this.catalogService.getProductById(this.idSig()).pipe(
      map((response) => response.data ?? null),
    ),
    { initialValue: null },
  );

  // ===== Navegação =====
  goBack(): void {
    this.router.navigate(['/catalog/products']);
  }

  goToEdit(): void {
    const product = this.productSig();
    if (!product) return;

    const anyP = product as any;
    const id = anyP.id ?? product.sku;

    if (!id) {
      this.router.navigate(['/catalog/products']);
      return;
    }

    this.router.navigate(['/catalog/products/edit', id]);
  }

  // ===== Helpers para evitar "??" e acessos quebrados no template =====

  getBrandName(product: Product | null): string {
    if (!product) return '—';
    const anyP = product as any;
    const brand = anyP.brand;
    return brand && brand.name ? brand.name : '—';
  }

  getCategoryName(product: Product | null): string {
    if (!product) return '—';
    const anyP = product as any;
    const category = anyP.category;
    return category && category.name ? category.name : '—';
  }

  getCurrentStock(product: Product | null): number {
    if (!product) return 0;
    const anyP = product as any;
    const stock = anyP.stock;
    if (!stock || stock.currentStock == null) return 0;

    const value = Number(stock.currentStock);
    return Number.isNaN(value) ? 0 : value;
  }

  getMinStock(product: Product | null): number {
    if (!product) return 0;
    const anyP = product as any;
    const stock = anyP.stock;
    if (!stock || stock.minStock == null) return 0;

    const value = Number(stock.minStock);
    return Number.isNaN(value) ? 0 : value;
  }

  isInactive(product: Product | null): boolean {
    if (!product) return false;
    return product.isActive === false;
  }
}
