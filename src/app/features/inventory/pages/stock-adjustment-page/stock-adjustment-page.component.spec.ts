// src/app/features/inventory/pages/stock-adjustment-page/stock-adjustment-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockAdjustmentPageComponent } from './stock-adjustment-page.component';

describe('StockAdjustmentPageComponent', () => {
  let component: StockAdjustmentPageComponent;
  let fixture: ComponentFixture<StockAdjustmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockAdjustmentPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StockAdjustmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
