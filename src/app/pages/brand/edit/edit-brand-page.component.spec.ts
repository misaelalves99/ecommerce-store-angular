// src/app/pages/brands/edit/edit-brand-page.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { EditBrandPageComponent } from './edit-brand-page.component';
import { BrandFormComponent } from '../../../components/brands/brand-form.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BrandService } from '../../../services/brand.service';

describe('EditBrandPageComponent', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockBrandService: jasmine.SpyObj<BrandService>;

  const fakeBrand = { id: 1, name: 'Marca Teste', createdAt: '2025-08-23T12:00:00Z' };

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrands', 'addBrand']);
    mockBrandService.getBrands.and.returnValue([fakeBrand]);
  });

  it('should show loading if brand is not loaded', async () => {
    await render(EditBrandPageComponent, {
      imports: [BrandFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', null]]) } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    const loadingText = screen.getByText('Carregando marca...');
    expect(loadingText).toBeTruthy();
  });

  it('should load brand by route param', async () => {
    await render(EditBrandPageComponent, {
      imports: [BrandFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '1']]) } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    const title = screen.getByText('Editar Marca');
    expect(title).toBeTruthy();
    const input = screen.getByDisplayValue('Marca Teste') as HTMLInputElement;
    expect(input).toBeTruthy();
  });

  it('should alert and navigate if brand not found', async () => {
    spyOn(window, 'alert');
    mockBrandService.getBrands.and.returnValue([]);

    await render(EditBrandPageComponent, {
      imports: [BrandFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '999']]) } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    expect(window.alert).toHaveBeenCalledWith('Marca não encontrada.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands']);
  });

  it('should update brand on handleUpdate', async () => {
    const { fixture } = await render(EditBrandPageComponent, {
      imports: [BrandFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '1']]) } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    fixture.componentInstance.handleUpdate('Nova Marca');

    expect(mockBrandService.addBrand).toHaveBeenCalledWith('Nova Marca');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands']);
  });

  it('should navigate to brands on handleCancel', async () => {
    const { fixture } = await render(EditBrandPageComponent, {
      imports: [BrandFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '1']]) } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    fixture.componentInstance.handleCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands']);
  });
});
