// src/app/components/brand/brand-details.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandDetailsComponent, Brand } from './brand-details.component';
import { By } from '@angular/platform-browser';

describe('BrandDetailsComponent', () => {
  let component: BrandDetailsComponent;
  let fixture: ComponentFixture<BrandDetailsComponent>;

  const mockBrand: Brand = { id: 1, name: 'Marca X' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandDetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandDetailsComponent);
    component = fixture.componentInstance;
    component.brand = mockBrand;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render brand id and name correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const spans = compiled.querySelectorAll('.detailItem span');
    expect(spans.length).toBeGreaterThanOrEqual(2);

    expect(spans[0].textContent).toContain('1'); // ID
    expect(spans[1].textContent).toContain('Marca X'); // Name
  });

  it('should update displayed brand when input changes', () => {
    const newBrand: Brand = { id: 2, name: 'Marca Y' };
    component.brand = newBrand;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const spans = compiled.querySelectorAll('.detailItem span');

    expect(spans[0].textContent).toContain('2');
    expect(spans[1].textContent).toContain('Marca Y');
  });
});
