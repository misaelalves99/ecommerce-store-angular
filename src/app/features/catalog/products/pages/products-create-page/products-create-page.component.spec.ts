// src/app/features/catalog/products/pages/products-create-page/products-create-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProductsCreatePageComponent } from './products-create-page.component';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { NotificationService } from '../../../../../core/services/notification.service';

class CatalogServiceStub2 {
  createProduct() {
    return Promise.resolve();
  }
}

class NotificationServiceStub {
  success() {}
  error() {}
}

describe('ProductsCreatePageComponent', () => {
  let component: ProductsCreatePageComponent;
  let fixture: ComponentFixture<ProductsCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCreatePageComponent],
      providers: [
        { provide: CatalogService, useClass: CatalogServiceStub2 },
        { provide: NotificationService, useClass: NotificationServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });
});
