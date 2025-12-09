// src/app/features/marketing/coupons/pages/coupons-list-page/coupons-list-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouponsListPageComponent } from './coupons-list-page.component';

describe('CouponsListPageComponent', () => {
  let component: CouponsListPageComponent;
  let fixture: ComponentFixture<CouponsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponsListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CouponsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
