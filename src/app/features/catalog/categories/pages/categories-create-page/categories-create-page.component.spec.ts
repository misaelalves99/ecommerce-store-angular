// src/app/features/catalog/categories/pages/categories-create-page/categories-create-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesCreatePageComponent } from './categories-create-page.component';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { NotificationService } from '../../../../../core/services/notification.service';

// Stub de notificações
class NotificationServiceStub {
  success(_msg: string): void {}
  error(_msg: string): void {}
  info(_msg: string): void {}
  warning(_msg: string): void {}
}

class CatalogServiceStubCat2 {
  createCategory() {
    return Promise.resolve();
  }
}

describe('CategoriesCreatePageComponent', () => {
  let component: CategoriesCreatePageComponent;
  let fixture: ComponentFixture<CategoriesCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesCreatePageComponent],
      providers: [
        { provide: CatalogService, useClass: CatalogServiceStubCat2 },
        { provide: NotificationService, useClass: NotificationServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });
});
