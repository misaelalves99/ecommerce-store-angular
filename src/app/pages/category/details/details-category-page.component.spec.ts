// src/app/pages/category/details/details-category-page.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { DetailsCategoryPageComponent } from './details-category-page.component';
import { CategoryDetailsComponent } from '../../../components/category/category-details.component';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('DetailsCategoryPageComponent', () => {
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getCategories']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  });

  it('should render "Carregando" when no category is found initially', async () => {
    mockCategoryService.getCategories.and.returnValue([]);
    const fakeActivatedRoute = {
      snapshot: { paramMap: new Map([['id', '1']]) }
    };

    await render(DetailsCategoryPageComponent, {
      imports: [CategoryDetailsComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
      ],
    });

    const loadingText = screen.getByText(/Carregando detalhes da categoria/i);
    expect(loadingText).toBeTruthy();
  });

  it('should load category details when found', async () => {
    const fakeCategory = { id: 1, name: 'Categoria Teste', description: 'Desc', createdAt: '2025-08-23T12:00:00Z' };
    mockCategoryService.getCategories.and.returnValue([fakeCategory]);

    const fakeActivatedRoute = {
      snapshot: { paramMap: new Map([['id', '1']]) }
    };

    await render(DetailsCategoryPageComponent, {
      imports: [CategoryDetailsComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
      ],
    });

    const heading = screen.getByText(/Categoria - Detalhes/i);
    expect(heading).toBeTruthy();

    const name = screen.getByText(fakeCategory.name);
    expect(name).toBeTruthy();
  });

  it('should alert and navigate when category not found', async () => {
    spyOn(window, 'alert');
    mockCategoryService.getCategories.and.returnValue([]);
    const fakeActivatedRoute = {
      snapshot: { paramMap: new Map([['id', '99']]) }
    };

    await render(DetailsCategoryPageComponent, {
      imports: [CategoryDetailsComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
      ],
    });

    expect(window.alert).toHaveBeenCalledWith('Categoria não encontrada.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/categories']);
  });
});
