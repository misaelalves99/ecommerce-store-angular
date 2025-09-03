// src/app/pages/products/details-product-page.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { DetailsProductPageComponent } from './details-product-page.component';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../types/product.model';

describe('DetailsProductPageComponent', () => {
  let component: DetailsProductPageComponent;
  let fixture: ComponentFixture<DetailsProductPageComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const mockProducts: Product[] = [
    { id: 1, name: 'Produto A', description: '', sku: 'A1', price: 100, stock: 10, categoryId: 1, brandId: 1, isActive: true, category: null!, brand: null! },
    { id: 2, name: 'Produto B', description: '', sku: 'B1', price: 200, stock: 20, categoryId: 2, brandId: 2, isActive: true, category: null!, brand: null! }
  ];

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);
    // <-- Retorna Observable agora
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      imports: [DetailsProductPageComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ProductService, useValue: productServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'id') return '1';
                  return null;
                }
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar o produto correto baseado no id da rota', () => {
    expect(component.product).toEqual(mockProducts[0]);
  });

  it('deve navegar de volta para /products quando goBack for chamado', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('deve redirecionar para /products se o produto não for encontrado', () => {
    const route = TestBed.inject(ActivatedRoute);
    (route.snapshot.paramMap as any).get = () => '999'; // simula id inexistente

    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
  });
});
