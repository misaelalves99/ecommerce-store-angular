// src/app/features/catalog/products/components/product-table/product-table.component.ts
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  TableComponent,
  TableColumn,
} from '../../../../../shared/components/ui/table/table.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';
import { Product } from '../../../../../core/models/product.model';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { Brand } from '../../../../../core/models/brand.model';
import { Category } from '../../../../../core/models/category.model';

@Component({
  standalone: true,
  selector: 'app-product-table',
  imports: [CommonModule, RouterLink, TableComponent, ButtonComponent],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css'],
})
export class ProductTableComponent {
  private readonly catalogService = inject(CatalogService);

  @Input() products: Product[] = [];

  /** já existia */
  @Output() deleteClicked = new EventEmitter<string>();

  /** NOVO: para navegação de detalhes na página pai */
  @Output() detailsClicked = new EventEmitter<string | number>();

  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Produto' },
    { key: 'sku', label: 'SKU' },
    { key: 'brand', label: 'Marca' },
    { key: 'category', label: 'Categoria' },
    { key: 'price', label: 'Preço', align: 'right' },
    { key: 'stock', label: 'Estoque', align: 'right' },
    { key: 'status', label: 'Status', align: 'center' },
    { key: 'actions', label: 'Ações', align: 'right', width: '240px' },
  ];

  private readonly brandsSig = toSignal(
    this.catalogService.getBrands(),
    { initialValue: [] as Brand[] },
  );

  private readonly categoriesSig = toSignal(
    this.catalogService.getCategories(),
    { initialValue: [] as Category[] },
  );

  get rows(): Record<string, unknown>[] {
    const brands = this.brandsSig() ?? [];
    const categories = this.categoriesSig() ?? [];

    return (this.products ?? []).map((p) => {
      const anyProduct = p as any;

      // ----- Marca -----
      const brandObj = anyProduct.brand;
      const brandIdFromObj = brandObj?.id;
      const brandIdFromField =
        anyProduct.brandId ?? anyProduct.brand_id ?? null;

      const brandId = String(brandIdFromField ?? brandIdFromObj ?? '');
      const brandFromState =
        brands.find((b) => String((b as any).id) === brandId) ?? null;

      const brandName: string =
        typeof brandObj === 'string'
          ? brandObj
          : brandObj?.name ??
            brandFromState?.name ??
            anyProduct.brandName ??
            '-';

      // ----- Categoria -----
      const categoryObj = anyProduct.category;
      const categoryIdFromObj = categoryObj?.id;
      const categoryIdFromField =
        anyProduct.categoryId ?? anyProduct.category_id ?? null;

      const categoryId = String(
        categoryIdFromField ?? categoryIdFromObj ?? '',
      );

      const categoryFromState =
        categories.find((c) => String((c as any).id) === categoryId) ?? null;

      const categoryName: string =
        typeof categoryObj === 'string'
          ? categoryObj
          : categoryObj?.name ??
            categoryFromState?.name ??
            anyProduct.categoryName ??
            '-';

      // ----- Preço -----
      const rawPrice = anyProduct.price;
      const unitPrice =
        typeof rawPrice === 'number'
          ? rawPrice
          : rawPrice?.amount ?? rawPrice?.value ?? 0;

      // ----- Estoque -----
      const rawStock = anyProduct.stock;
      const stockQuantity =
        typeof rawStock === 'number'
          ? rawStock
          : rawStock?.quantityAvailable ??
            rawStock?.availableQuantity ??
            rawStock?.currentStock ??
            0;

      // ----- Status -----
      const isActive =
        typeof anyProduct.isActive === 'boolean'
          ? anyProduct.isActive
          : typeof anyProduct.active === 'boolean'
          ? anyProduct.active
          : true;

      const statusLabel = isActive ? 'Ativo' : 'Inativo';

      return {
        ...anyProduct,
        brandName,
        categoryName,
        unitPrice,
        stockQuantity,
        statusLabel,
      } as Record<string, unknown>;
    });
  }

  onDelete(id: string | number | null | undefined): void {
    if (id === null || id === undefined) return;
    this.deleteClicked.emit(String(id));
  }

  onDetails(id: string | number | null | undefined): void {
    if (id === null || id === undefined) return;
    this.detailsClicked.emit(id);
  }
}
