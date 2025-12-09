// src/app/core/services/product.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from '../models/product.model';
import { BrandService } from './brand.service';
import { CategoryService } from './category.service';
import { Category } from '../models/category.model';
import { Brand } from '../models/brand.model';

import {
  PRODUCTS_MOCK,
  ProductMock,
} from '../../testing/mocks/products.mock';

export interface ProductInput {
  id?: string | number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  stock: number;
  categoryId: string | number;
  brandId: string | number;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  /** Estado interno de produtos (mock em memória) */
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);

  constructor(
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
  ) {
    // Inicializa os produtos usando PRODUCTS_MOCK + categorias/marcas reais
    combineLatest([
      this.categoryService.getCategories(),
      this.brandService.getBrands(),
    ]).subscribe(([categories, brands]: [Category[], Brand[]]) => {
      const findCategoryById = (id: string) =>
        categories.find((c) => String((c as any).id) === id) as
          | Category
          | undefined;

      const findBrandById = (id: string) =>
        brands.find((b) => String((b as any).id) === id) as
          | Brand
          | undefined;

      const initialProducts: Product[] = PRODUCTS_MOCK.map(
        (mock: ProductMock) => {
          const category = findCategoryById(mock.categoryId);
          const brand = findBrandById(mock.brandId);

          const product: Product = {
            id: mock.id,
            name: mock.name,
            description: mock.description,
            sku: mock.sku,
            isActive: mock.isActive,
            // Estrutura completa de preço/estoque do mock
            price: mock.price as any,
            stock: mock.stock as any,
            createdAt: mock.createdAt,
            updatedAt: mock.updatedAt,
            slug: (mock as any).slug,
            tags: (mock as any).tags,
            category: category as any,
            brand: brand as any,
          } as unknown as Product;

          return product;
        },
      );

      this.productsSubject.next(initialProducts);
    });
  }

  /** Observable somente-leitura de produtos */
  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  /** Busca produto por id (aceita string ou number) */
  getProductById(id: string | number): Observable<Product | undefined> {
    const targetId = String(id);
    return this.productsSubject.pipe(
      map((products) =>
        products.find((p) => String((p as any).id) === targetId),
      ),
    );
  }

  /** Cria um novo produto a partir de um payload simples */
  addProduct(input: ProductInput): Observable<Product> {
    return combineLatest([
      this.categoryService.getCategories(),
      this.brandService.getBrands(),
    ]).pipe(
      map(([categories, brands]: [Category[], Brand[]]) => {
        const current = this.productsSubject.value;

        // Gera um novo id string baseado no maior id numérico atual
        const newIdNumber =
          current.length > 0
            ? Math.max(
                ...current.map((p) => {
                  const n = Number((p as any).id);
                  return Number.isNaN(n) ? 0 : n;
                }),
              ) + 1
            : 1001;
        const newId = `p-${newIdNumber}`;

        const categoryId = String(input.categoryId);
        const brandId = String(input.brandId);

        const category = categories.find(
          (c) => String((c as any).id) === categoryId,
        ) as Category;
        const brand = brands.find(
          (b) => String((b as any).id) === brandId,
        ) as Brand;

        const newProduct = {
          id: newId,
          name: input.name,
          description: input.description ?? '',
          sku: input.sku,
          // monta estrutura de preço/estoque básica
          price: {
            amount: input.price,
            currency: 'BRL',
          } as any,
          stock: {
            quantityAvailable: input.stock,
          } as any,
          isActive: input.isActive ?? true,
          category: category as any,
          brand: brand as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as unknown as Product;

        this.productsSubject.next([...current, newProduct]);
        return newProduct;
      }),
    );
  }

  /** Atualiza um produto existente */
  updateProduct(
    id: string | number,
    input: ProductInput,
  ): Observable<Product | undefined> {
    const targetId = String(id);

    return combineLatest([
      this.categoryService.getCategories(),
      this.brandService.getBrands(),
    ]).pipe(
      map(([categories, brands]: [Category[], Brand[]]) => {
        const current = this.productsSubject.value;

        const categoryId = String(input.categoryId);
        const brandId = String(input.brandId);

        const category = categories.find(
          (c) => String((c as any).id) === categoryId,
        ) as Category;
        const brand = brands.find(
          (b) => String((b as any).id) === brandId,
        ) as Brand;

        let updated: Product | undefined;

        const next = current.map((p) => {
          if (String((p as any).id) !== targetId) return p;

          const merged = {
            ...(p as any),
            name: input.name,
            description: input.description ?? '',
            sku: input.sku,
            price: {
              amount: input.price,
              currency: 'BRL',
            } as any,
            stock: {
              quantityAvailable: input.stock,
            } as any,
            isActive: input.isActive ?? (p as any).isActive ?? true,
            category: category as any,
            brand: brand as any,
            updatedAt: new Date(),
          } as unknown as Product;

          updated = merged;
          return merged;
        });

        this.productsSubject.next(next);
        return updated;
      }),
    );
  }

  /** Remove um produto (aceita id string ou number) */
  deleteProduct(id: string | number): void {
    const targetId = String(id);
    const next = this.productsSubject.value.filter(
      (p) => String((p as any).id) !== targetId,
    );
    this.productsSubject.next(next);
  }
}
