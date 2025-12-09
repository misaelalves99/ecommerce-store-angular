// src/app/features/catalog/products/pages/products-details-page/products-details-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProductsDetailsPageComponent } from './products-details-page.component';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { ActivatedRoute } from '@angular/router';

class CatalogServiceStub4 {
  getProductById() {
    return of(null);
  }
}

describe('ProductsDetailsPageComponent', () => {
  let component: ProductsDetailsPageComponent;
  let fixture: ComponentFixture<ProductsDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsDetailsPageComponent],
      providers: [
        { provide: CatalogService, useClass: CatalogServiceStub4 },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map([['id', '1']]) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });
});
