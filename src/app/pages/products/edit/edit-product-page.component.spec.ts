// src/app/pages/products/edit-product-page.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { EditProductPageComponent } from './edit-product-page.component';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { Product } from '../../../types/product.model';
import { Category } from '../../../types/category.model';
import { Brand } from '../../../types/brand.model';

describe('EditProductPageComponent', () => {
  let component: EditProductPageComponent;
  let fixture: ComponentFixture<EditProductPageComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let brandServiceSpy: jasmine.SpyObj<BrandService>;

  const mockProducts: Product[] = [
    { id: 1, name: 'Produto A', description: '', sku: 'A1', price: 100, stock: 10, categoryId: 1, brandId: 1, isActive: true, category: null!, brand: null! },
    { id: 2, name: 'Produto B', description: '', sku: 'B1', price: 200, stock: 20, categoryId: 2, brandId: 2, isActive: true, category: null!, brand: null! }
  ];

  const mockCategories: Category[] = [
    { id: 1, name: 'Categoria X', description: 'Desc X', createdAt: '2025-08-23', isActive: true },
    { id: 2, name: 'Categoria Y', description: 'Desc Y', createdAt: '2025-08-23', isActive: true }
  ];

  const mockBrands: Brand[] = [
    { id: 1, name: 'Marca A', createdAt: '2025-08-23', isActive: true },
    { id: 2, name: 'Marca B', createdAt: '2025-08-23', isActive: true }
  ];

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'updateProduct']);
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories']);
    brandServiceSpy = jasmine.createSpyObj('BrandService', ['getBrands']);

    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    productServiceSpy.updateProduct.and.returnValue(of(mockProducts[0])); // retorna Observable
    categoryServiceSpy.getCategories.and.returnValue(of(mockCategories));
    brandServiceSpy.getBrands.and.returnValue(of(mockBrands));

    await TestBed.configureTestingModule({
      imports: [EditProductPageComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: BrandService, useValue: brandServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => (key === 'id' ? '1' : null) } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar o produto correto e categorias/marcas', () => {
    expect(component.product).toEqual(mockProducts[0]);
    expect(component.categories).toEqual(mockCategories);
    expect(component.brands).toEqual(mockBrands);
  });

  it('deve redirecionar se produto não encontrado', () => {
    const route = TestBed.inject(ActivatedRoute);
    (route.snapshot.paramMap as any).get = () => '999';

    spyOn(window, 'alert');
    component.ngOnInit();

    expect(window.alert).toHaveBeenCalledWith('Produto não encontrado.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('deve chamar updateProduct e navegar ao salvar', () => {
    const updated: Product = { ...mockProducts[0], name: 'Atualizado' };
    component.handleSave(updated);

    expect(productServiceSpy.updateProduct).toHaveBeenCalledWith(1, updated);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('deve navegar de volta ao cancelar', () => {
    component.handleCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
  });
});
