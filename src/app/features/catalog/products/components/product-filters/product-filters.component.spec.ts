// src/app/features/catalog/products/components/product-filters/product-filters.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFiltersComponent } from './product-filters.component';

describe('ProductFiltersComponent', () => {
  let component: ProductFiltersComponent;
  let fixture: ComponentFixture<ProductFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });
});
