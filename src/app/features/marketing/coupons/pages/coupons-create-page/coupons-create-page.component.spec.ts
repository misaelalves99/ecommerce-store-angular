// src/app/features/marketing/coupons/pages/coupons-create-page/coupons-create-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouponsCreatePageComponent } from './coupons-create-page.component';

describe('CouponsCreatePageComponent', () => {
  let component: CouponsCreatePageComponent;
  let fixture: ComponentFixture<CouponsCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponsCreatePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CouponsCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
