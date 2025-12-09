// src/app/features/marketing/banners/pages/banners-page/banners-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannersPageComponent } from './banners-page.component';

describe('BannersPageComponent', () => {
  let component: BannersPageComponent;
  let fixture: ComponentFixture<BannersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannersPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BannersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
