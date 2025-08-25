// src/app/components/brand/brand-list.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandListComponent, Brand } from './brand-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import '@testing-library/jasmine-dom';

describe('BrandListComponent', () => {
  let component: BrandListComponent;
  let fixture: ComponentFixture<BrandListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandListComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display message when brands array is empty', () => {
    component.brands = [];
    fixture.detectChanges();
    const p = fixture.nativeElement.querySelector('.empty');
    expect(p.textContent).toContain('Nenhuma marca cadastrada.');
  });

  it('should render a table when brands array has items', () => {
    component.brands = [
      { id: 1, name: 'Marca A' },
      { id: 2, name: 'Marca B' }
    ];
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('table');
    expect(table).toBeTruthy();
    const rows = table.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('should call handleDelete and trigger alert', () => {
    spyOn(window, 'alert');
    const brand: Brand = { id: 1, name: 'Marca Teste' };
    component.handleDelete(brand);
    expect(window.alert).toHaveBeenCalledWith('Excluir marca Marca Teste');
  });

  it('should display brand data correctly in the table', () => {
    component.brands = [{ id: 10, name: 'Marca X' }];
    fixture.detectChanges();
    const tdElements = fixture.nativeElement.querySelectorAll('tbody td');
    expect(tdElements[0].textContent).toContain('10');
    expect(tdElements[1].textContent).toContain('Marca X');
  });
});
