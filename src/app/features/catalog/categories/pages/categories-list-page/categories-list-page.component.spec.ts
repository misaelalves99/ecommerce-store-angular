// src/app/features/catalog/categories/pages/categories-list-page/categories-list-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CategoriesListPageComponent } from './categories-list-page.component';
import { CatalogService } from '../../../../../core/services/catalog.service';

class CatalogServiceStubCat1 {
  getCategories() {
    return of([]);
  }
}

describe('CategoriesListPageComponent', () => {
  let component: CategoriesListPageComponent;
  let fixture: ComponentFixture<CategoriesListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesListPageComponent],
      providers: [{ provide: CatalogService, useClass: CatalogServiceStubCat1 }],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });
});
