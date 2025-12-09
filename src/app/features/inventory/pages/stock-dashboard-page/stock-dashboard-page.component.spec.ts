// src/app/features/inventory/pages/stock-dashboard-page/stock-dashboard-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockDashboardPageComponent } from './stock-dashboard-page.component';

describe('StockDashboardPageComponent', () => {
  let component: StockDashboardPageComponent;
  let fixture: ComponentFixture<StockDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockDashboardPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StockDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
