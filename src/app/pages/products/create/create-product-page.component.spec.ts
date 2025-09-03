// src/app/pages/products/create-product-page.component.spec.ts

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CreateProductPageComponent } from './create-product-page.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Product } from '../../../types/product.model';
import { Category } from '../../../types/category.model';
import { Brand } from '../../../types/brand.model';

// 🔹 IMPORTS DOS SERVIÇOS REAIS
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';

// 🔹 Mocks dos serviços
class MockProductService {
  addProduct(product: Product) {
    return of(product); // simula Observable
  }
}

class MockCategoryService {
  getCategories() {
    const categories: Category[] = [
      {
        id: 1,
        name: 'Eletrônicos',
        description: 'Categoria Eletrônicos',
        createdAt: '2025-08-23T12:00:00Z',
        isActive: true
      }
    ];
    return of(categories);
  }
}

class MockBrandService {
  getBrands() {
    const brands: Brand[] = [
      { id: 1, name: 'Marca X', createdAt: '2025-08-23T12:00:00Z', isActive: true }
    ];
    return of(brands);
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('CreateProductPageComponent', () => {
  let component: CreateProductPageComponent;
  let fixture: ComponentFixture<CreateProductPageComponent>;
  let productService: MockProductService;
  let router: MockRouter;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CreateProductPageComponent], // componente standalone
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: ProductService, useClass: MockProductService },
        { provide: CategoryService, useClass: MockCategoryService },
        { provide: BrandService, useClass: MockBrandService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductPageComponent);
    component = fixture.componentInstance;

    // 🔹 Inject com tipo correto
    productService = TestBed.inject(ProductService) as any;
    router = TestBed.inject(Router) as any;

    fixture.detectChanges(); // dispara ngOnInit
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar categorias e marcas do serviço no ngOnInit', () => {
    expect(component.categories.length).toBe(1);
    expect(component.categories[0].name).toBe('Eletrônicos');

    expect(component.brands.length).toBe(1);
    expect(component.brands[0].name).toBe('Marca X');
  });

  it('deve chamar addProduct e navegar ao salvar', () => {
    const spyAdd = spyOn(productService, 'addProduct').and.callThrough();

    const newProduct: Product = {
      id: 99,
      name: 'Novo Produto',
      description: 'Desc',
      sku: 'SKU123',
      price: 123,
      stock: 10,
      categoryId: 1,
      brandId: 1,
      isActive: true
    };

    component.handleSave(newProduct);

    expect(spyAdd).toHaveBeenCalledWith(newProduct);
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('deve navegar ao cancelar', () => {
    component.handleCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });
});
