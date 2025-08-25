// src/app/pages/products/products-page.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsPageComponent } from './products-page.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../types/product.model';
import { RouterTestingModule } from '@angular/router/testing';

// Criamos um mock completo para o serviço
class MockProductService {
  getProducts(): Product[] {
    return [
      {
        id: 1,
        name: 'Produto A',
        description: 'Descrição A',
        sku: 'SKU-A1',
        price: 100,
        stock: 10,
        categoryId: 1,
        brandId: 1,
        isActive: true
      },
      {
        id: 2,
        name: 'Produto B',
        description: 'Descrição B',
        sku: 'SKU-B1',
        price: 200,
        stock: 5,
        categoryId: 2,
        brandId: 2,
        isActive: false
      }
    ];
  }
}

describe('ProductsPageComponent', () => {
  let component: ProductsPageComponent;
  let fixture: ComponentFixture<ProductsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ProductsPageComponent],
      providers: [{ provide: ProductService, useClass: MockProductService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os produtos do serviço no ngOnInit', () => {
    expect(component.products.length).toBe(2);
    expect(component.products[0].name).toBe('Produto A');
  });

  it('deve renderizar o título corretamente', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Produtos');
  });

  it('deve ter o link "Adicionar Produto"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a.btnPrimary') as HTMLAnchorElement;
    expect(link.getAttribute('ng-reflect-router-link')).toBe('/products/create');
    expect(link.textContent?.trim()).toBe('Adicionar Produto');
  });

  it('deve renderizar o componente <app-product-list>', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-product-list')).toBeTruthy();
  });
});
