// src/app/features/marketing/coupons/components/coupon-form/coupon-form.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouponFormComponent } from './coupon-form.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('CouponFormComponent', () => {
  let component: CouponFormComponent;
  let fixture: ComponentFixture<CouponFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CouponFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
