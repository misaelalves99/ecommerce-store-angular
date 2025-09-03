// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../types/product.model';
import { BrandService } from './brand.service';
import { CategoryService } from './category.service';
import { Category } from '../types/category.model';
import { Brand } from '../types/brand.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products$ = new BehaviorSubject<Product[]>([]);

  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService
  ) {
    // Inicializa produtos usando combineLatest para categorias e marcas
    combineLatest([
      this.categoryService.getCategories(),
      this.brandService.getBrands()
    ]).subscribe(([categories, brands]: [Category[], Brand[]]) => {
      const initialProducts: Product[] = [
        {
          id: 1,
          name: 'Notebook Gamer',
          description: 'Notebook potente para jogos',
          sku: 'NB-001',
          price: 5999.9,
          stock: 10,
          categoryId: 1,
          brandId: 1,
          isActive: true,
          category: categories.find(c => c.id === 1)!,
          brand: brands.find(b => b.id === 1)!,
        },
        {
          id: 2,
          name: 'Camiseta Esportiva',
          description: 'Camiseta confortável para esportes',
          sku: 'CM-002',
          price: 99.9,
          stock: 50,
          categoryId: 2,
          brandId: 2,
          isActive: true,
          category: categories.find(c => c.id === 2)!,
          brand: brands.find(b => b.id === 2)!,
        },
        {
          id: 3,
          name: 'Livro de Programação',
          description: 'Livro para aprender programação em JS',
          sku: 'LB-003',
          price: 59.9,
          stock: 100,
          categoryId: 3,
          brandId: 3,
          isActive: false,
          category: categories.find(c => c.id === 3)!,
          brand: brands.find(b => b.id === 3)!,
        },
      ];

      this.products$.next(initialProducts);
    });
  }

  // Retorna todos os produtos
  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  // Retorna produto por ID
  getProductById(id: number): Observable<Product | undefined> {
    return this.products$.pipe(map(products => products.find(p => p.id === id)));
  }

  // Adiciona produto
  addProduct(product: Product): Observable<Product> {
    return combineLatest([
      this.categoryService.getCategories(),
      this.brandService.getBrands()
    ]).pipe(
      map(([categories, brands]: [Category[], Brand[]]) => {
        const currentProducts = this.products$.value;
        const newId = currentProducts.length
          ? Math.max(...currentProducts.map(p => p.id)) + 1
          : 1;

        const category = categories.find(c => c.id === product.categoryId)!;
        const brand = brands.find(b => b.id === product.brandId)!;

        const newProduct: Product = { ...product, id: newId, category, brand };
        this.products$.next([...currentProducts, newProduct]);
        return newProduct;
      })
    );
  }

  // Atualiza produto
  updateProduct(id: number, updatedProduct: Product): Observable<Product | undefined> {
    return combineLatest([
      this.categoryService.getCategories(),
      this.brandService.getBrands()
    ]).pipe(
      map(([categories, brands]: [Category[], Brand[]]) => {
        const currentProducts = this.products$.value;

        const category = categories.find(c => c.id === updatedProduct.categoryId)!;
        const brand = brands.find(b => b.id === updatedProduct.brandId)!;

        let updated: Product | undefined;
        const products = currentProducts.map(p => {
          if (p.id !== id) return p;
          updated = { ...updatedProduct, id, category, brand };
          return updated;
        });

        this.products$.next(products);
        return updated;
      })
    );
  }

  // Remove produto
  deleteProduct(id: number): void {
    this.products$.next(this.products$.value.filter(p => p.id !== id));
  }
}
