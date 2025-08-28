// src/app/services/product.service.ts

import { Injectable } from '@angular/core';
import { Product } from '../types/product.model';
import { BrandService } from './brand.service';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [];

  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService
  ) {
    const brands = this.brandService.getBrands();
    const categories = this.categoryService.getCategories();

    this.products = [
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
        category: categories.find(c => c.id === 1),
        brand: brands.find(b => b.id === 1),
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
        category: categories.find(c => c.id === 2),
        brand: brands.find(b => b.id === 2),
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
        category: categories.find(c => c.id === 3),
        brand: brands.find(b => b.id === 3),
      },
    ];
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addProduct(product: Product): void {
    const newId = this.products.length
      ? Math.max(...this.products.map(p => p.id)) + 1
      : 1;

    const category = this.categoryService
      .getCategories()
      .find(c => c.id === product.categoryId);
    const brand = this.brandService
      .getBrands()
      .find(b => b.id === product.brandId);

    const newProduct: Product = {
      ...product,
      id: newId,
      category,
      brand,
    };

    this.products.push(newProduct);
  }

  updateProduct(id: number, updatedProduct: Product): void {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      const category = this.categoryService
        .getCategories()
        .find(c => c.id === updatedProduct.categoryId);
      const brand = this.brandService
        .getBrands()
        .find(b => b.id === updatedProduct.brandId);

      this.products[index] = {
        ...updatedProduct,
        id,
        category,
        brand,
      };
    }
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
  }
}
