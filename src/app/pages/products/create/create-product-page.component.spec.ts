// src/app/pages/products/create-product-page.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProductPageComponent } from './create-product-page.component';
import { Router } from '@angular/router';
import { Product } from '../../../types/product.model';
import { Category } from '../../../types/category.model';
import { Brand } from '../../../types/brand.model';

// Mocks de serviços
class MockProductService {
  addProduct(product: Product) {}
}
class MockCategoryService {
  getCategories(): Category[] {
    return [
      { id: 1, name: 'Eletrônicos', description: 'Categoria Eletrônicos', createdAt: '2025-08-23T12:00:00Z' }
    ];
  }
}
class MockBrandService {
  getBrands(): Brand[] {
    return [
      { id: 1, name: 'Marca X', createdAt: '2025-08-23T12:00:00Z' }
    ];
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProductPageComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: 'ProductService', useClass: MockProductService },
        { provide: 'CategoryService', useClass: MockCategoryService },
        { provide: 'BrandService', useClass: MockBrandService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductPageComponent);
    component = fixture.componentInstance;

    productService = TestBed.inject(MockProductService);
    router = TestBed.inject(Router) as any;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar categorias e marcas do serviço no construtor', () => {
    expect(component.categories.length).toBe(1);
    expect(component.categories[0].name).toBe('Eletrônicos');
    expect(component.brands.length).toBe(1);
    expect(component.brands[0].name).toBe('Marca X');
  });

  it('deve chamar ProductService.addProduct e navegar ao salvar', () => {
    const spyAdd = spyOn(productService, 'addProduct');
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

  it('deve renderizar título corretamente', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Adicionar Produto');
  });

  it('deve renderizar o formulário de produto', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-product-form')).toBeTruthy();
  });
});
