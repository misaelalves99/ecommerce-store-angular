// src/app/features/catalog/categories/pages/categories-delete-page/categories-delete-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CategoriesDeletePageComponent } from './categories-delete-page.component';
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

class CatalogServiceStubCat5 {
  getCategoryById() {
    return of(null);
  }
  deleteCategory() {
    return Promise.resolve();
  }
}

describe('CategoriesDeletePageComponent', () => {
  let component: CategoriesDeletePageComponent;
  let fixture: ComponentFixture<CategoriesDeletePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesDeletePageComponent],
      providers: [
        { provide: CatalogService, useClass: CatalogServiceStubCat5 },
        { provide: NotificationService, useClass: NotificationServiceStub },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', '1']]) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesDeletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });
});
