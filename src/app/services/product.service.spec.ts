// src/app/services/product.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { BrandService } from './brand.service';
import { CategoryService } from './category.service';
import { Product } from '../types/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let brandService: BrandService;
  let categoryService: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService, BrandService, CategoryService],
    });

    service = TestBed.inject(ProductService);
    brandService = TestBed.inject(BrandService);
    categoryService = TestBed.inject(CategoryService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar a lista inicial de produtos', () => {
    const products = service.getProducts();
    expect(products.length).toBe(3);

    const notebook = products.find(p => p.id === 1);
    expect(notebook).toBeTruthy();
    expect(notebook?.name).toBe('Notebook Gamer');
    expect(notebook?.category?.name).toBe('Eletrônicos');
    expect(notebook?.brand?.name).toBe('Nike');
  });

  it('deve adicionar um novo produto corretamente', () => {
    const newProduct: Product = {
      id: 0, // será sobrescrito
      name: 'Mouse Gamer',
      description: 'Mouse com RGB',
      sku: 'MS-004',
      price: 299.9,
      stock: 25,
      categoryId: 1,
      brandId: 1,
      isActive: true,
      category: undefined,
      brand: undefined,
    };

    const beforeCount = service.getProducts().length;
    service.addProduct(newProduct);

    const products = service.getProducts();
    expect(products.length).toBe(beforeCount + 1);

    const added = products[products.length - 1];
    expect(added.id).toBeGreaterThan(0);
    expect(added.name).toBe(newProduct.name);
    expect(added.sku).toBe(newProduct.sku);
    expect(added.category?.name).toBe('Eletrônicos');
    expect(added.brand?.name).toBe('Nike');
  });
});
