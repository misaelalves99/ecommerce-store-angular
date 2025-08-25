// src/app/components/category/category-details.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryDetailsComponent, Category } from './category-details.component';
import { render, screen } from '@testing-library/angular';
import '@testing-library/jasmine-dom';

describe('CategoryDetailsComponent', () => {
  let component: CategoryDetailsComponent;
  let fixture: ComponentFixture<CategoryDetailsComponent>;

  const mockCategory: Category = {
    id: 1,
    name: 'Categoria Teste',
    description: 'Descrição da categoria teste'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryDetailsComponent);
    component = fixture.componentInstance;
    component.category = mockCategory;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display category id, name and description', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('div.detailItem:nth-child(2) span').textContent).toContain(mockCategory.id.toString());
    expect(compiled.querySelector('div.detailItem:nth-child(3) span').textContent).toContain(mockCategory.name);
    expect(compiled.querySelector('div.detailItem:nth-child(4) span').textContent).toContain(mockCategory.description);
  });

  it('should render heading correctly', () => {
    const heading = fixture.nativeElement.querySelector('h2.heading');
    expect(heading.textContent).toContain('Detalhes da Categoria');
  });
});
