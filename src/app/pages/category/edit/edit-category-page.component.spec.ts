// src/app/pages/category/edit-category-page.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { EditCategoryPageComponent } from './edit-category-page.component';
import { CategoryFormComponent } from '../../../components/category/category-form.component';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('EditCategoryPageComponent', () => {
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getCategories', 'updateCategory']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  });

  it('should show "Carregando" when no category found initially', async () => {
    mockCategoryService.getCategories.and.returnValue([]);
    const fakeActivatedRoute = {
      snapshot: { paramMap: new Map([['id', '1']]) }
    };

    await render(EditCategoryPageComponent, {
      imports: [CategoryFormComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    });

    const loadingText = screen.getByText(/Carregando categoria/i);
    expect(loadingText).toBeTruthy();
  });

  it('should load category and render the form when found', async () => {
    const fakeCategory = { id: 1, name: 'Categoria Teste', description: 'Desc', createdAt: '2025-08-23T12:00:00Z' };
    mockCategoryService.getCategories.and.returnValue([fakeCategory]);

    const fakeActivatedRoute = {
      snapshot: { paramMap: new Map([['id', '1']]) }
    };

    await render(EditCategoryPageComponent, {
      imports: [CategoryFormComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    });

    expect(screen.getByText(/Editar Categoria/i)).toBeTruthy();
    expect(screen.getByDisplayValue(fakeCategory.name)).toBeTruthy();
    expect(screen.getByDisplayValue(fakeCategory.description)).toBeTruthy();
  });

  it('should alert and navigate if category does not exist', async () => {
    spyOn(window, 'alert');
    mockCategoryService.getCategories.and.returnValue([]);
    const fakeActivatedRoute = {
      snapshot: { paramMap: new Map([['id', '99']]) }
    };

    await render(EditCategoryPageComponent, {
      imports: [CategoryFormComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    });

    expect(window.alert).toHaveBeenCalledWith('Categoria não encontrada.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/categories']);
  });

  it('should call updateCategory and navigate when handleUpdate is triggered', async () => {
    const fakeCategory = { id: 1, name: 'Old Name', description: 'Old Desc', createdAt: '2025-08-23T12:00:00Z' };
    mockCategoryService.getCategories.and.returnValue([fakeCategory]);

    const fakeActivatedRoute = {
      snapshot: { paramMap: new Map([['id', '1']]) }
    };

    const { fixture } = await render(EditCategoryPageComponent, {
      imports: [CategoryFormComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    });

    fixture.componentInstance.handleUpdate({ name: 'Novo Nome', description: 'Nova Desc' });

    expect(mockCategoryService.updateCategory).toHaveBeenCalledWith(1, { name: 'Novo Nome', description: 'Nova Desc' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/categories']);
  });

  it('should navigate when handleCancel is triggered', async () => {
    const fakeCategory = { id: 1, name: 'Categoria Teste', description: 'Desc', createdAt: '2025-08-23T12:00:00Z' };
    mockCategoryService.getCategories.and.returnValue([fakeCategory]);

    const fakeActivatedRoute = {
      snapshot: { paramMap: new Map([['id', '1']]) }
    };

    const { fixture } = await render(EditCategoryPageComponent, {
      imports: [CategoryFormComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    });

    fixture.componentInstance.handleCancel();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/categories']);
  });
});
