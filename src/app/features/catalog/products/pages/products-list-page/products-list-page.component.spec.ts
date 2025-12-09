// src/app/features/catalog/products/pages/products-list-page/products-list-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProductsListPageComponent } from './products-list-page.component';
import { CatalogService } from '../../../../../core/services/catalog.service';

class CatalogServiceStub {
  getProducts() {
    return of([]);
  }
}

describe('ProductsListPageComponent', () => {
  let component: ProductsListPageComponent;
  let fixture: ComponentFixture<ProductsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsListPageComponent],
      providers: [{ provide: CatalogService, useClass: CatalogServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });
});
