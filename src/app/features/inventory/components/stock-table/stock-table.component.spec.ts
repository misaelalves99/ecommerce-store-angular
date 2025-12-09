// src/app/features/inventory/components/stock-table/stock-table.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockTableComponent } from './stock-table.component';

describe('StockTableComponent', () => {
  let component: StockTableComponent;
  let fixture: ComponentFixture<StockTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StockTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
