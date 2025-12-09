// src/app/features/catalog/categories/pages/categories-details-page/categories-details-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CategoriesDetailsPageComponent } from './categories-details-page.component';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { ActivatedRoute } from '@angular/router';

class CatalogServiceStubCat4 {
  getCategoryById() {
    return of(null);
  }
}

describe('CategoriesDetailsPageComponent', () => {
  let component: CategoriesDetailsPageComponent;
  let fixture: ComponentFixture<CategoriesDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesDetailsPageComponent],
      providers: [
        { provide: CatalogService, useClass: CatalogServiceStubCat4 },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', '1']]) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });
});
