// src/app/features/catalog/products/pages/products-delete-page/products-delete-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProductsDeletePageComponent } from './products-delete-page.component';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ActivatedRoute } from '@angular/router';

// Stub simples para notificações
class NotificationServiceStub {
  success(_msg: string): void {}
  error(_msg: string): void {}
  info(_msg: string): void {}
  warning(_msg: string): void {}
}

class CatalogServiceStub5 {
  getProductById() {
    return of(null);
  }
  deleteProduct() {
    return Promise.resolve();
  }
}

describe('ProductsDeletePageComponent', () => {
  let component: ProductsDeletePageComponent;
  let fixture: ComponentFixture<ProductsDeletePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsDeletePageComponent],
      providers: [
        { provide: CatalogService, useClass: CatalogServiceStub5 },
        { provide: NotificationService, useClass: NotificationServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map([['id', '1']]) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsDeletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });
});
