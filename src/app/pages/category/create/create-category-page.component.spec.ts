// src/app/pages/category/create/create-category-page.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { CreateCategoryPageComponent } from './create-category-page.component';
import { CategoryFormComponent } from '../../../components/category/category-form.component';
import { CategoryService } from '../../../services/category.service';
import { Router } from '@angular/router';

describe('CreateCategoryPageComponent', () => {
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['addCategory']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  });

  it('should render heading and category form', async () => {
    await render(CreateCategoryPageComponent, {
      imports: [CategoryFormComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const heading = screen.getByText('Adicionar Categoria');
    expect(heading).toBeTruthy(); // substituído toBeInTheDocument
  });

  it('should call service and navigate when handleCreate is triggered', async () => {
    const { fixture } = await render(CreateCategoryPageComponent, {
      imports: [CategoryFormComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const component = fixture.componentInstance;
    const fakeData = { name: 'Nova Categoria', description: 'Descrição teste', createdAt: '2025-08-23T12:00:00Z' };

    component.handleCreate(fakeData);

    expect(mockCategoryService.addCategory).toHaveBeenCalledWith(fakeData);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/categories']);
  });

  it('should navigate when handleCancel is triggered', async () => {
    const { fixture } = await render(CreateCategoryPageComponent, {
      imports: [CategoryFormComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const component = fixture.componentInstance;
    component.handleCancel();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/categories']);
  });
});
