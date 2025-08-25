// src/app/components/category/category-list.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryListComponent } from './category-list.component';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/category.model';
import { CommonModule } from '@angular/common';
import '@testing-library/jasmine-dom';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['deleteCategory']);

    await TestBed.configureTestingModule({
      imports: [CategoryListComponent, CommonModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: CategoryService, useValue: categoryServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render "Nenhuma categoria cadastrada" if categories is empty', () => {
    component.categories = [];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.empty')?.textContent).toContain('Nenhuma categoria cadastrada');
  });

  it('should render categories in the table', () => {
    const categories: Category[] = [
      { id: 1, name: 'Cat 1', description: 'Desc 1', createdAt: '2025-08-23' },
      { id: 2, name: 'Cat 2', description: 'Desc 2', createdAt: '2025-08-23' }
    ];
    component.categories = categories;
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Cat 1');
    expect(rows[1].textContent).toContain('Cat 2');
  });

  it('should navigate to details page on goToDetails', () => {
    component.goToDetails(5);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/categories', 5]);
  });

  it('should navigate to edit page on goToEdit', () => {
    component.goToEdit(10);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/categories/edit', 10]);
  });

  it('should delete category when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    const category: Category = { id: 1, name: 'Cat 1', description: 'Desc 1', createdAt: '2025-08-23' };
    component.categories = [category];
    fixture.detectChanges();

    component.deleteCategory(category);

    expect(categoryServiceSpy.deleteCategory).toHaveBeenCalledWith(1);
    expect(component.categories.length).toBe(0);
  });

  it('should not delete category when canceled', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    const category: Category = { id: 1, name: 'Cat 1', description: 'Desc 1', createdAt: '2025-08-23' };
    component.categories = [category];
    fixture.detectChanges();

    component.deleteCategory(category);

    expect(categoryServiceSpy.deleteCategory).not.toHaveBeenCalled();
    expect(component.categories.length).toBe(1);
  });
});
