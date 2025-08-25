// src/app/pages/category/category-page.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryPageComponent } from './category-page.component';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/category.model';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';

// 🔹 Mock do CategoryListComponent (evita carregar template real)
@Component({
  selector: 'app-category-list',
  template: '<div>Mock Category List - {{ categories?.length }}</div>'
})
class MockCategoryListComponent {
  @Input() categories: Category[] = [];
}

// 🔹 Mock do CategoryService
class MockCategoryService {
  getCategories(): Category[] {
    return [
      { id: 1, name: 'Categoria A', description: 'Desc A', createdAt: '2025-08-23T12:00:00Z' },
      { id: 2, name: 'Categoria B', description: 'Desc B', createdAt: '2025-08-23T12:00:00Z' }
    ];
  }
}

describe('CategoryPageComponent', () => {
  let component: CategoryPageComponent;
  let fixture: ComponentFixture<CategoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule], // necessário p/ routerLink
      declarations: [CategoryPageComponent, MockCategoryListComponent],
      providers: [{ provide: CategoryService, useClass: MockCategoryService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar as categorias do CategoryService', () => {
    expect(component.categories.length).toBe(2);
    expect(component.categories[0].name).toBe('Categoria A');
  });

  it('deve renderizar título e botão de adicionar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.heading')?.textContent).toContain('Categorias');
    expect(compiled.querySelector('a.btn')?.textContent).toContain('Adicionar Categoria');
  });

  it('deve renderizar o mock CategoryList com categorias', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Mock Category List - 2');
  });
});
