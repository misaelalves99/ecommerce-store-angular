// src/app/shared/components/layout/metric-card/metric-card.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricCardComponent } from './metric-card.component';

describe('MetricCardComponent', () => {
  let component: MetricCardComponent;
  let fixture: ComponentFixture<MetricCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create MetricCardComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should apply up trend class', () => {
    component.trend = 'up';
    expect(component.trendClass).toBe('metric-card__trend--up');
  });
});
