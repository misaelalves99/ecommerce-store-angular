// src/app/features/catalog/products/components/product-table/product-table.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductTableComponent } from './product-table.component';

describe('ProductTableComponent', () => {
  let component: ProductTableComponent;
  let fixture: ComponentFixture<ProductTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });
});
