import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { DetailsCategoryPageComponent } from './details-category-page.component';
import { CategoryDetailsComponent } from '../../../components/category/category-details.component';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { Category } from '../../../types/category.model';

describe('DetailsCategoryPageComponent', () => {
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
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getCategories']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  });

  it('should render loading when category not yet loaded', async () => {
    mockCategoryService.getCategories.and.returnValue(of([]));

    await render(DetailsCategoryPageComponent, {
      imports: [CategoryDetailsComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
      ],
    });

    const loadingText = screen.getByText(/Carregando detalhes da categoria/i);
    expect(loadingText).toBeTruthy();
  });

  it('should load category details when found', async () => {
    mockCategoryService.getCategories.and.returnValue(of([fakeCategory]));

    await render(DetailsCategoryPageComponent, {
      imports: [CategoryDetailsComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
      ],
    });

    const heading = screen.getByText(/Detalhes da Categoria/i);
    expect(heading).toBeTruthy();

    const name = screen.getByText(fakeCategory.name);
    expect(name).toBeTruthy();
  });

  it('should alert and navigate when category not found', async () => {
    spyOn(window, 'alert');
    mockCategoryService.getCategories.and.returnValue(of([]));

    await render(DetailsCategoryPageComponent, {
      imports: [CategoryDetailsComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '999' }) } } },
      ],
    });

    expect(window.alert).toHaveBeenCalledWith('Categoria não encontrada.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/categories']);
  });
});
