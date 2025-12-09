// src/app/core/services/catalog.service.ts

import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Brand } from '../models/brand.model';
import { ApiResponse } from '../interfaces/api-response.interface';
import { PaginatedResult } from '../interfaces/pagination.interface';

// ✅ Mocks
import { BRANDS_MOCK } from '../../testing/mocks/brands.mock';
import { PRODUCTS_MOCK } from '../../testing/mocks/products.mock';
import { CATEGORIES_MOCK } from '../../testing/mocks/categories.mock';

export type FilterWithExtras<T extends Record<string, unknown>> = T & {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
};

export type ProductFilter = FilterWithExtras<{
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}>;

export type CategoryFilter = FilterWithExtras<{
  parentId?: string | null;
}>;

export type BrandFilter = FilterWithExtras<{
  active?: boolean;
}>;

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  // ======= STATE: PRODUCTS =======
  private readonly _products: WritableSignal<Product[]> = signal<Product[]>([]);
  private readonly _productsLoading: WritableSignal<boolean> =
    signal<boolean>(false);
  private readonly _selectedProduct: WritableSignal<Product | null> =
    signal<Product | null>(null);

  readonly products: Signal<Product[]> = this._products.asReadonly();
  readonly productsLoading: Signal<boolean> =
    this._productsLoading.asReadonly();
  readonly selectedProduct: Signal<Product | null> =
    this._selectedProduct.asReadonly();

  // ======= STATE: CATEGORIES =======
  private readonly _categories: WritableSignal<Category[]> =
    signal<Category[]>([]);
  private readonly _categoriesLoading: WritableSignal<boolean> =
    signal<boolean>(false);

  readonly categories: Signal<Category[]> = this._categories.asReadonly();
  readonly categoriesLoading: Signal<boolean> =
    this._categoriesLoading.asReadonly();

  // ======= STATE: BRANDS =======
  private readonly _brands: WritableSignal<Brand[]> = signal<Brand[]>([]);
  private readonly _brandsLoading: WritableSignal<boolean> =
    signal<boolean>(false);

  readonly brands: Signal<Brand[]> = this._brands.asReadonly();
  readonly brandsLoading: Signal<boolean> = this._brandsLoading.asReadonly();

  // ======= DERIVED STATE =======
  readonly totalProducts: Signal<number> = computed(
    () => this._products().length,
  );
  readonly totalCategories: Signal<number> = computed(
    () => this._categories().length,
  );
  readonly totalBrands: Signal<number> = computed(
    () => this._brands().length,
  );

  constructor() {
    // Seed inicial de marcas, categorias e produtos (100% em memória)
    if (!this._brands().length) {
      this._brands.set([...BRANDS_MOCK] as unknown as Brand[]);
    }

    if (!this._categories().length) {
      this._categories.set([...CATEGORIES_MOCK] as unknown as Category[]);
    }

    if (!this._products().length) {
      this._products.set([...PRODUCTS_MOCK] as unknown as Product[]);
    }
  }

  // ---------------------------------------------------------------------------
  // PRODUCTS – EM MEMÓRIA (PRODUCTS_MOCK)
  // ---------------------------------------------------------------------------

  loadProducts(
    filter?: ProductFilter,
  ): Observable<ApiResponse<PaginatedResult<Product>>> {
    this._productsLoading.set(true);

    let items = [...this._products()];

    // Filtro por categoria
    if (filter?.categoryId) {
      const cid = String(filter.categoryId);
      items = items.filter((p: any) => {
        const fromId = String(p.categoryId ?? '');
        const fromObj = String(p.category?.id ?? '');
        return fromId === cid || fromObj === cid;
      });
    }

    // Filtro por marca
    if (filter?.brandId) {
      const bid = String(filter.brandId);
      items = items.filter((p: any) => {
        const fromId = String(p.brandId ?? '');
        const fromObj = String(p.brand?.id ?? '');
        return fromId === bid || fromObj === bid;
      });
    }

    // Filtro por preço
    if (filter?.minPrice != null || filter?.maxPrice != null) {
      items = items.filter((p: any) => {
        const amount = p.price?.amount ?? p.price ?? 0;

        if (filter.minPrice != null && amount < filter.minPrice) {
          return false;
        }
        if (filter.maxPrice != null && amount > filter.maxPrice) {
          return false;
        }
        return true;
      });
    }

    // Filtro por estoque
    if (typeof filter?.inStock === 'boolean') {
      items = items.filter((p: any) => {
        const qty = p.stock?.quantityAvailable ?? p.stock ?? 0;
        return filter.inStock ? qty > 0 : qty <= 0;
      });
    }

    // Filtro por texto (search)
    if (filter?.search) {
      const term = String(filter.search).toLowerCase().trim();
      items = items.filter((p: any) => {
        const name = (p.name ?? '').toLowerCase();
        const sku = (p.sku ?? '').toLowerCase();
        const slug = (p.slug ?? '').toLowerCase();
        return name.includes(term) || sku.includes(term) || slug.includes(term);
      });
    }

    const total = items.length;
    const page = filter?.page && filter.page > 0 ? filter.page : 1;
    const pageSize =
      filter?.pageSize && filter.pageSize > 0 ? filter.pageSize : total || 10;

    const start = (page - 1) * pageSize;
    const pagedItems = items.slice(start, start + pageSize);

    const result = {
      items: pagedItems,
      total,
      page,
      pageSize,
    } as unknown as PaginatedResult<Product>;

    const response: ApiResponse<PaginatedResult<Product>> = {
      success: true,
      data: result,
    };

    this._productsLoading.set(false);
    return of(response);
  }

  getProducts(filter?: ProductFilter): Observable<PaginatedResult<Product>> {
    return this.loadProducts(filter).pipe(
      map((response) => response.data as PaginatedResult<Product>),
    );
  }

  getProductById(id: string): Observable<ApiResponse<Product>> {
    const product =
      this._products().find((p: any) => String(p.id) === String(id)) ?? null;

    const response: ApiResponse<Product> = {
      success: !!product,
      data: (product ?? ({} as Product)) as Product,
    };

    return of(response);
  }

  /**
   * Criação de produto em memória.
   *
   * ✅ Garante:
   *  - brandId / categoryId preenchidos
   *  - objetos brand / category resolvidos a partir do estado (mocks)
   *  - price no formato { amount, currency, ... }
   *  - stock no formato { quantityAvailable, lowStockThreshold, ... }
   *  - flags active / isActive coerentes
   *
   * Aceita tanto o payload “flat” do formulário quanto um Partial<Product>.
   */
  createProduct(payload: Partial<Product>): Observable<ApiResponse<Product>> {
    const now = new Date();
    const raw = payload as any;

    // --- IDs de marca / categoria -----------------------------------------
    const brandId = String(raw.brandId ?? raw.brand?.id ?? '');
    const categoryId = String(
      raw.categoryId ?? raw.category?.id ?? raw.categoryId ?? '',
    );

    // Usa o estado atual (que já foi seedado com os mocks)
    const brandFromState =
      this._brands().find((b: any) => String(b.id) === brandId) ?? null;
    const categoryFromState =
      this._categories().find((c: any) => String(c.id) === categoryId) ?? null;

    // Fallback para o que vier no payload, se existir
    const brand = (brandFromState ?? raw.brand ?? null) as Brand | null;
    const category = (categoryFromState ?? raw.category ?? null) as
      | Category
      | null;

    // --- Preço -------------------------------------------------------------
    const priceAmount =
      typeof raw.price === 'number'
        ? raw.price
        : typeof raw.price?.amount === 'number'
          ? raw.price.amount
          : 0;

    const price = {
      ...(typeof raw.price === 'object' ? raw.price : {}),
      amount: priceAmount,
      currency: raw.price?.currency ?? 'BRL',
    };

    // --- Estoque -----------------------------------------------------------
    const stockQuantity =
      raw.stock?.quantityAvailable ??
      raw.stock?.currentStock ??
      (typeof raw.stock === 'number' ? raw.stock : 0) ??
      0;

    const lowStockThreshold =
      raw.minStock ?? raw.stock?.lowStockThreshold ?? 0;

    const stock = {
      ...(typeof raw.stock === 'object' ? raw.stock : {}),
      quantityAvailable: stockQuantity,
      lowStockThreshold,
    };

    // --- Flags de status ---------------------------------------------------
    const isActive = raw.isActive ?? raw.active ?? true;

    const newProduct: Product = {
      ...(raw as any),
      id: raw.id ?? this.generateProductId(),
      name: raw.name ?? '',
      sku: raw.sku ?? '',
      slug:
        raw.slug ??
        this.slugify(`${raw.name ?? 'produto'}-${raw.sku ?? ''}`),
      description: raw.description ?? '',
      // relacionamento
      brandId,
      categoryId,
      brand: brand as any,
      category: category as any,
      // preço / estoque normalizados
      price: price as any,
      stock: stock as any,
      // flags
      isActive,
      active: isActive,
      // datas
      createdAt: raw.createdAt ?? now,
      updatedAt: raw.updatedAt ?? now,
    } as Product;

    this._products.set([newProduct, ...this._products()]);

    const response: ApiResponse<Product> = {
      success: true,
      data: newProduct,
    };

    return of(response);
  }

  /**
   * Atualização de produto em memória com a mesma normalização de createProduct.
   */
  updateProduct(
    id: string,
    payload: Partial<Product>,
  ): Observable<ApiResponse<Product>> {
    const now = new Date();
    const body = payload as any;

    let updated: Product | null = null;

    this._products.set(
      this._products().map((p: any) => {
        if (String(p.id) !== String(id)) return p;

        // --- IDs de marca / categoria -------------------------------------
        const brandId = String(
          body.brandId ?? body.brand?.id ?? p.brandId ?? p.brand?.id ?? '',
        );
        const categoryId = String(
          body.categoryId ??
            body.category?.id ??
            p.categoryId ??
            p.category?.id ??
            '',
        );

        const brandFromState =
          this._brands().find((b: any) => String(b.id) === brandId) ?? null;
        const categoryFromState =
          this._categories().find((c: any) => String(c.id) === categoryId) ??
          null;

        const brand = (brandFromState ?? body.brand ?? p.brand ?? null) as
          | Brand
          | null;
        const category = (categoryFromState ??
          body.category ??
          p.category ??
          null) as Category | null;

        // --- Preço ---------------------------------------------------------
        const priceAmount =
          typeof body.price === 'number'
            ? body.price
            : typeof body.price?.amount === 'number'
              ? body.price.amount
              : p.price?.amount ?? p.price ?? 0;

        const price = {
          ...(typeof p.price === 'object' ? p.price : {}),
          ...(typeof body.price === 'object' ? body.price : {}),
          amount: priceAmount,
          currency: body.price?.currency ?? p.price?.currency ?? 'BRL',
        };

        // --- Estoque -------------------------------------------------------
        const stockQuantity =
          body.stock?.quantityAvailable ??
          body.stock?.currentStock ??
          (typeof body.stock === 'number'
            ? body.stock
            : p.stock?.quantityAvailable ??
              p.stock?.currentStock ??
              p.stock ??
              0);

        const lowStockThreshold =
          body.minStock ??
          body.stock?.lowStockThreshold ??
          p.stock?.lowStockThreshold ??
          0;

        const stock = {
          ...(typeof p.stock === 'object' ? p.stock : {}),
          ...(typeof body.stock === 'object' ? body.stock : {}),
          quantityAvailable: stockQuantity,
          lowStockThreshold,
        };

        const isActive =
          body.isActive ?? body.active ?? p.isActive ?? p.active ?? true;

        updated = {
          ...(p as any),
          ...(body as any),
          id,
          name: body.name ?? p.name,
          sku: body.sku ?? p.sku,
          slug:
            body.slug ??
            p.slug ??
            this.slugify(`${body.name ?? p.name}-${body.sku ?? p.sku}`),
          brandId,
          categoryId,
          brand: brand as any,
          category: category as any,
          price: price as any,
          stock: stock as any,
          isActive,
          active: isActive,
          updatedAt: body.updatedAt ?? now,
        } as Product;

        return updated;
      }),
    );

    const response: ApiResponse<Product> = {
      success: !!updated,
      data: (updated ?? ({} as Product)) as Product,
    };

    return of(response);
  }

  deleteProduct(id: string): Observable<ApiResponse<null>> {
    const before = this._products().length;
    this._products.set(
      this._products().filter((p: any) => String(p.id) !== String(id)),
    );
    const after = this._products().length;

    const response: ApiResponse<null> = {
      success: after < before,
      data: null,
    };

    return of(response);
  }

  // ---------------------------------------------------------------------------
  // CATEGORIES – EM MEMÓRIA (CATEGORIES_MOCK)
  // ---------------------------------------------------------------------------

  loadCategories(
    filter?: CategoryFilter,
  ): Observable<ApiResponse<Category[]>> {
    this._categoriesLoading.set(true);

    let items = [...this._categories()];

    // filtro por categoria pai (hierarquia)
    if (typeof filter?.parentId !== 'undefined') {
      const parent = filter.parentId ?? null;
      items = items.filter((c: any) => (c.parentId ?? null) === parent);
    }

    // filtro por busca (nome, slug, descrição)
    if (filter?.search) {
      const term = String(filter.search).toLowerCase().trim();
      items = items.filter((c: any) => {
        const name = (c.name ?? '').toLowerCase();
        const slug = (c.slug ?? '').toLowerCase();
        const desc = (c.description ?? '').toLowerCase();
        return name.includes(term) || slug.includes(term) || desc.includes(term);
      });
    }

    const response: ApiResponse<Category[]> = {
      success: true,
      data: items,
    };

    this._categoriesLoading.set(false);
    return of(response);
  }

  getCategories(filter?: CategoryFilter): Observable<Category[]> {
    return this.loadCategories(filter).pipe(
      map((response) => (response.data ?? []) as Category[]),
    );
  }

  createCategory(
    payload: Partial<Category>,
  ): Observable<ApiResponse<Category>> {
    const now = new Date();

    const category: Category = {
      ...(payload as any),
      id: (payload as any).id ?? this.generateCategoryId(),
      name: payload.name ?? 'Nova categoria',
      slug:
        payload.slug ?? this.slugify(payload.name ?? 'nova-categoria'),
      description: payload.description ?? null,
      isActive: (payload as any).isActive ?? true,
      createdAt: (payload as any).createdAt ?? now,
      updatedAt: (payload as any).updatedAt ?? now,
    } as Category;

    this._categories.set([category, ...this._categories()]);

    const response: ApiResponse<Category> = {
      success: true,
      data: category,
    };

    return of(response);
  }

  updateCategory(
    id: string,
    payload: Partial<Category>,
  ): Observable<ApiResponse<Category>> {
    let updated: Category | null = null;

    this._categories.set(
      this._categories().map((c: any) => {
        if (String(c.id) !== String(id)) return c;

        updated = {
          ...c,
          ...payload,
          id,
          updatedAt: (payload as any).updatedAt ?? new Date(),
        } as Category;

        return updated;
      }),
    );

    const response: ApiResponse<Category> = {
      success: !!updated,
      data: (updated ?? ({} as Category)) as Category,
    };

    return of(response);
  }

  deleteCategory(id: string): Observable<ApiResponse<null>> {
    const before = this._categories().length;
    this._categories.set(
      this._categories().filter((c: any) => String(c.id) !== String(id)),
    );
    const after = this._categories().length;

    const response: ApiResponse<null> = {
      success: after < before,
      data: null,
    };

    return of(response);
  }

  // ---------------------------------------------------------------------------
  // BRANDS – EM MEMÓRIA (BRANDS_MOCK)
  // ---------------------------------------------------------------------------

  loadBrands(filter?: BrandFilter): Observable<ApiResponse<Brand[]>> {
    this._brandsLoading.set(true);

    let items = [...this._brands()];

    if (filter && typeof filter.active === 'boolean') {
      items = items.filter((b) => (b as any).isActive === filter.active);
    }

    const response: ApiResponse<Brand[]> = {
      success: true,
      data: items,
    };

    this._brandsLoading.set(false);
    return of(response);
  }

  getBrands(filter?: BrandFilter): Observable<Brand[]> {
    return this.loadBrands(filter).pipe(
      map((response) => (response.data ?? []) as Brand[]),
    );
  }

  getBrandById(id: string): Observable<Brand | null> {
    const brand = this._brands().find((b: any) => b.id === id) ?? null;
    return of(brand);
  }

  createBrand(payload: Partial<Brand>): Observable<ApiResponse<Brand>> {
    const now = new Date();

    const brand: Brand = {
      id: (payload as any).id ?? `brand-${now.getTime()}`,
      name: payload.name ?? '',
      slug: payload.slug ?? this.slugify(payload.name ?? 'nova-marca'),
      description: payload.description ?? '',
      isActive: payload.isActive ?? true,
      createdAt: (payload as any).createdAt ?? now,
      updatedAt: (payload as any).updatedAt ?? now,
    } as Brand;

    this._brands.set([brand, ...this._brands()]);

    const response: ApiResponse<Brand> = {
      success: true,
      data: brand,
    };

    return of(response);
  }

  updateBrand(
    id: string,
    payload: Partial<Brand>,
  ): Observable<ApiResponse<Brand>> {
    let updated: Brand | null = null;

    this._brands.set(
      this._brands().map((b: any) => {
        if (b.id !== id) return b;

        updated = {
          ...b,
          ...payload,
          id,
          updatedAt: (payload as any).updatedAt ?? new Date(),
        } as Brand;

        return updated;
      }),
    );

    const response: ApiResponse<Brand> = {
      success: !!updated,
      data: (updated ?? ({} as Brand)) as Brand,
    };

    return of(response);
  }

  deleteBrand(id: string): Observable<ApiResponse<null>> {
    const before = this._brands().length;
    this._brands.set(this._brands().filter((b: any) => b.id !== id));
    const after = this._brands().length;

    const response: ApiResponse<null> = {
      success: after < before,
      data: null,
    };

    return of(response);
  }

  // ---------------------------------------------------------------------------
  // UTILS
  // ---------------------------------------------------------------------------

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  private generateProductId(): string {
    const current = this._products();
    const numericIds = current
      .map((p) => {
        const rawId = String((p as any).id ?? '');
        const match = rawId.match(/\d+/g);
        if (!match) return 0;
        return Number(match.join('')) || 0;
      })
      .filter((n) => !Number.isNaN(n));

    const next = numericIds.length ? Math.max(...numericIds) + 1 : 1001;
    return `p-${next}`;
  }

  private generateCategoryId(): string {
    const current = this._categories();
    const numericIds = current
      .map((c) => {
        const rawId = String((c as any).id ?? '');
        const match = rawId.match(/\d+/g);
        if (!match) return 0;
        return Number(match.join('')) || 0;
      })
      .filter((n) => !Number.isNaN(n));

    const next = numericIds.length ? Math.max(...numericIds) + 1 : 1;
    return `cat-${next}`;
  }
}
