import { render, screen, fireEvent } from '@testing-library/angular';
import { DeleteCategoryPageComponent } from './delete-category-page.component';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { Category } from '../../../types/category.model';

describe('DeleteCategoryPageComponent', () => {
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
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getCategories', 'deleteCategory']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  });

  it('should load category if found by route param', async () => {
    mockCategoryService.getCategories.and.returnValue(of([fakeCategory]));

    await render(DeleteCategoryPageComponent, {
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
      ],
    });

    expect(screen.getByText('Deletar Categoria')).toBeTruthy();
    expect(screen.getByText(fakeCategory.name)).toBeTruthy();
  });

  it('should alert and navigate if category not found', async () => {
    spyOn(window, 'alert');
    mockCategoryService.getCategories.and.returnValue(of([]));

    await render(DeleteCategoryPageComponent, {
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '999' }) } } },
      ],
    });

    expect(window.alert).toHaveBeenCalledWith('Categoria não encontrada.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/categories']);
  });

  it('should delete category and navigate on handleDelete', async () => {
    mockCategoryService.getCategories.and.returnValue(of([fakeCategory]));

    await render(DeleteCategoryPageComponent, {
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
      ],
    });

    const deleteButton = screen.getByText('Deletar');
    fireEvent.click(deleteButton);

    expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith(fakeCategory.id);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/categories']);
  });

  it('should navigate to categories on handleCancel', async () => {
    mockCategoryService.getCategories.and.returnValue(of([fakeCategory]));

    await render(DeleteCategoryPageComponent, {
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
      ],
    });

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/categories']);
  });
});
