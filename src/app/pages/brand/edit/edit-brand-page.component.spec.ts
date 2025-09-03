// src/app/pages/brands/edit/edit-brand-page.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { EditBrandPageComponent } from './edit-brand-page.component';
import { BrandFormComponent } from '../../../components/brands/brand-form.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { of } from 'rxjs';

describe('EditBrandPageComponent', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockBrandService: jasmine.SpyObj<BrandService>;

  const fakeBrand = { 
    id: 1, 
    name: 'Marca Teste', 
    createdAt: '2025-08-23T12:00:00Z',
    isActive: true
  };

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrands', 'updateBrand']);
  });

  it('should show loading if brand is not loaded', async () => {
    mockBrandService.getBrands.and.returnValue(of([]));

    await render(EditBrandPageComponent, {
      imports: [BrandFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    expect(screen.getByText('Carregando marca...')).toBeTruthy();
  });

  it('should load brand by route param', async () => {
    mockBrandService.getBrands.and.returnValue(of([fakeBrand]));

    await render(EditBrandPageComponent, {
      imports: [BrandFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    expect(screen.getByText('Editar Marca')).toBeTruthy();
    expect(screen.getByDisplayValue('Marca Teste')).toBeTruthy();
  });

  it('should alert and navigate if brand not found', async () => {
    spyOn(window, 'alert');
    mockBrandService.getBrands.and.returnValue(of([]));

    await render(EditBrandPageComponent, {
      imports: [BrandFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '999' } } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    expect(window.alert).toHaveBeenCalledWith('Marca não encontrada.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands']);
  });

  it('should update brand on handleUpdate', async () => {
    mockBrandService.getBrands.and.returnValue(of([fakeBrand]));

    const { fixture } = await render(EditBrandPageComponent, {
      imports: [BrandFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    fixture.componentInstance.handleUpdate('Nova Marca');

    expect(mockBrandService.updateBrand).toHaveBeenCalledWith(1, 'Nova Marca');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands']);
  });

  it('should navigate to brands on handleCancel', async () => {
    mockBrandService.getBrands.and.returnValue(of([fakeBrand]));

    const { fixture } = await render(EditBrandPageComponent, {
      imports: [BrandFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    fixture.componentInstance.handleCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands']);
  });
});
