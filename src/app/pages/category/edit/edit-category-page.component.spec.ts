// src/app/pages/category/edit-category-page.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { EditCategoryPageComponent } from './edit-category-page.component';
import { CategoryFormComponent } from '../../../components/category/category-form.component';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { Category } from '../../../types/category.model';

describe('EditCategoryPageComponent', () => {
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const fakeCategory: Category = {
    id: 1,
    name: 'Categoria Teste',
    description: 'Descrição teste',
    createdAt: '2025-08-23T12:00:00Z',
    isActive: true, // corrigido
  };

  beforeEach(() => {
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getCategories', 'updateCategory']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  });

  it('should show "Carregando" when no category found initially', async () => {
    mockCategoryService.getCategories.and.returnValue(of([]));

    await render(EditCategoryPageComponent, {
      imports: [CategoryFormComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } }
      ]
    });

    const loadingText = screen.getByText(/Carregando categoria/i);
    expect(loadingText).toBeTruthy();
  });

  it('should load category and render the form when found', async () => {
    mockCategoryService.getCategories.and.returnValue(of([fakeCategory]));

    await render(EditCategoryPageComponent, {
      imports: [CategoryFormComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } }
      ]
    });

    expect(screen.getByText(/Editar Categoria/i)).toBeTruthy();
    expect(screen.getByDisplayValue(fakeCategory.name)).toBeTruthy();
    expect(screen.getByDisplayValue(fakeCategory.description)).toBeTruthy();
  });

  it('should alert and navigate if category does not exist', async () => {
    spyOn(window, 'alert');
    mockCategoryService.getCategories.and.returnValue(of([]));

    await render(EditCategoryPageComponent, {
      imports: [CategoryFormComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '99' }) } } }
      ]
    });

    expect(window.alert).toHaveBeenCalledWith('Categoria não encontrada.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/categories']);
  });

  it('should call updateCategory and navigate when handleUpdate is triggered', async () => {
    mockCategoryService.getCategories.and.returnValue(of([fakeCategory]));

    const { fixture } = await render(EditCategoryPageComponent, {
      imports: [CategoryFormComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } }
      ]
    });

    fixture.componentInstance.handleUpdate({ name: 'Novo Nome', description: 'Nova Desc' });

    expect(mockCategoryService.updateCategory).toHaveBeenCalledWith(1, { name: 'Novo Nome', description: 'Nova Desc' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/categories']);
  });

  it('should navigate when handleCancel is triggered', async () => {
    mockCategoryService.getCategories.and.returnValue(of([fakeCategory]));

    const { fixture } = await render(EditCategoryPageComponent, {
      imports: [CategoryFormComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } }
      ]
    });

    fixture.componentInstance.handleCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/categories']);
  });
});
