// src/app/features/catalog/categories/pages/categories-edit-page/categories-edit-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CategoriesEditPageComponent } from './categories-edit-page.component';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ActivatedRoute } from '@angular/router';

// Stub de notificações
class NotificationServiceStub {
  success(_msg: string): void {}
  error(_msg: string): void {}
  info(_msg: string): void {}
  warning(_msg: string): void {}
}

class CatalogServiceStubCat3 {
  getCategoryById() {
    return of(null);
  }
  updateCategory() {
    return Promise.resolve();
  }
}

describe('CategoriesEditPageComponent', () => {
  let component: CategoriesEditPageComponent;
  let fixture: ComponentFixture<CategoriesEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesEditPageComponent],
      providers: [
        { provide: CatalogService, useClass: CatalogServiceStubCat3 },
        { provide: NotificationService, useClass: NotificationServiceStub },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', '1']]) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });
});
