// src/app/features/catalog/products/pages/products-list-page/products-list-page.component.ts
import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProductService } from '../../../../../core/services/product.service';
import { BrandService } from '../../../../../core/services/brand.service';
import { CategoryService } from '../../../../../core/services/category.service';

import { Product } from '../../../../../core/models/product.model';
import { Brand } from '../../../../../core/models/brand.model';
import { Category } from '../../../../../core/models/category.model';

import { SearchInputComponent } from '../../../../../shared/components/ui/search-input/search-input.component';
import { PaginationComponent } from '../../../../../shared/components/ui/pagination/pagination.component';
import { EmptyStateComponent } from '../../../../../shared/components/ui/empty-state/empty-state.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';
import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { ProductTableComponent } from '../../components/product-table/product-table.component';

interface SimpleOption {
  id: string;
  name: string;
}

@Component({
  standalone: true,
  selector: 'app-products-list-page',
  imports: [
    CommonModule,
    RouterLink,
    SearchInputComponent,
    ProductTableComponent,
    PaginationComponent,
    EmptyStateComponent,
    ButtonComponent,
    PageHeaderComponent,
  ],
  templateUrl: './products-list-page.component.html',
  styleUrls: ['./products-list-page.component.css'],
})
export class ProductsListPageComponent {
  // ======= Serviços =======================================================
  private readonly productService = inject(ProductService);
  private readonly brandService = inject(BrandService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);

  // ======= Estado da UI ===================================================
  readonly loading = signal<boolean>(false);

  // filtros
  readonly query = signal<string>('');
  readonly statusFilter = signal<'all' | 'active' | 'inactive'>('all');
  readonly brandFilter = signal<string>('all');
  readonly categoryFilter = signal<string>('all');

  // paginação
  readonly page = signal<number>(1);
  readonly pageSize = 10;

  // ======= Fonte reativa (Observables -> Signals) =========================
  private readonly productsSig = toSignal(
    this.productService.getProducts(),
    { initialValue: [] as Product[] },
  );

  private readonly brandsSig = toSignal(
    this.brandService.getBrands(),
    { initialValue: [] as Brand[] },
  );

  private readonly categoriesSig = toSignal(
    this.categoryService.getCategories(),
    { initialValue: [] as Category[] },
  );

  // ======= Opções de filtro de marca / categoria =========================
  readonly brandOptions = computed<SimpleOption[]>(() => {
    const brands = this.brandsSig() ?? [];

    return [
      { id: 'all', name: 'Todas as marcas' },
      ...brands
        .filter((b: any) => b && b.id != null)
        .map(
          (b: any): SimpleOption => ({
            id: String(b.id),
            name: b.name || '—',
          }),
        ),
    ];
  });

  readonly categoryOptions = computed<SimpleOption[]>(() => {
    const categories = this.categoriesSig() ?? [];

    return [
      { id: 'all', name: 'Todas as categorias' },
      ...categories
        .filter((c: any) => c && c.id != null)
        .map(
          (c: any): SimpleOption => ({
            id: String(c.id),
            name: c.name || '—',
          }),
        ),
    ];
  });

  // ========================= FILTROS / PAGINAÇÃO =========================
  readonly filteredProducts = computed<Product[]>(() => {
    const q = this.query().toLowerCase().trim();
    const status = this.statusFilter();
    const brandId = this.brandFilter();
    const categoryId = this.categoryFilter();

    const all = this.productsSig() ?? [];

    return (all as any[]).filter((p: any) => {
      const name = (p.name ?? '').toLowerCase();
      const sku = (p.sku ?? '').toLowerCase();

      const matchesSearch = !q || name.includes(q) || sku.includes(q);

      // status
      const isActive =
        typeof p.isActive === 'boolean'
          ? p.isActive
          : typeof p.active === 'boolean'
          ? p.active
          : true;

      const matchesStatus =
        status === 'all' ||
        (status === 'active' && isActive) ||
        (status === 'inactive' && !isActive);

      // brand
      const productBrandId = String(
        p.brandId ?? p.brand?.id ?? '',
      );
      const matchesBrand =
        brandId === 'all' || productBrandId === brandId;

      // category
      const productCategoryId = String(
        p.categoryId ?? p.category?.id ?? '',
      );
      const matchesCategory =
        categoryId === 'all' || productCategoryId === categoryId;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesBrand &&
        matchesCategory
      );
    }) as Product[];
  });

  readonly paginatedProducts = computed<Product[]>(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredProducts().slice(
      start,
      start + this.pageSize,
    );
  });

  // ==================== Handlers de UI =======================
  onSearchChange(value: string): void {
    this.query.set(value);
    this.page.set(1);
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = (select && select.value) || 'all';
    this.statusFilter.set(value as 'all' | 'active' | 'inactive');
    this.page.set(1);
  }

  onBrandChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = (select && select.value) || 'all';
    this.brandFilter.set(value);
    this.page.set(1);
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = (select && select.value) || 'all';
    this.categoryFilter.set(value);
    this.page.set(1);
  }

  onPageChange(page: number): void {
    this.page.set(page);
  }

  /** Exclusão vinda do ProductTableComponent -> ir para página de delete */
  onDeleteProduct(id: string | number): void {
    this.router.navigate(['/catalog/products/delete', id]);
  }

  /** Navegação para detalhes do produto */
  onDetailsProduct(id: string | number): void {
    this.router.navigate(['/catalog/products/details', id]);
  }

  trackById(index: number, item: Product): string {
    return String((item as any).id ?? index);
  }
}
