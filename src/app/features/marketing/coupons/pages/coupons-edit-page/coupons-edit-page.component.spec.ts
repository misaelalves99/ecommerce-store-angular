// src/app/features/marketing/coupons/pages/coupons-edit-page/coupons-edit-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouponsEditPageComponent } from './coupons-edit-page.component';

describe('CouponsEditPageComponent', () => {
  let component: CouponsEditPageComponent;
  let fixture: ComponentFixture<CouponsEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponsEditPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CouponsEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
