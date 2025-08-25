// src/app/pages/brands/details/details-brand-page.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { DetailsBrandPageComponent } from './details-brand-page.component';
import { BrandDetailsComponent } from '../../../components/brands/brand-details.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BrandService } from '../../../services/brand.service';

describe('DetailsBrandPageComponent', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockBrandService: jasmine.SpyObj<BrandService>;

  const fakeBrand = { id: 1, name: 'Marca Teste', createdAt: '2025-08-23T12:00:00Z' };

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrands']);
    mockBrandService.getBrands.and.returnValue([fakeBrand]);
  });

  it('should show loading when brand is not yet loaded', async () => {
    await render(DetailsBrandPageComponent, {
      imports: [BrandDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', null]]) } },
        },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    const loadingText = screen.getByText('Carregando detalhes da marca...');
    expect(loadingText).toBeTruthy();
  });

  it('should load brand based on route param', async () => {
    await render(DetailsBrandPageComponent, {
      imports: [BrandDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', '1']]) } },
        },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    const title = screen.getByText('Marca - Detalhes');
    const brandName = screen.getByText('Marca Teste');

    expect(title).toBeTruthy();
    expect(brandName).toBeTruthy();
  });

  it('should navigate to brands if brand not found', async () => {
    spyOn(window, 'alert');
    await render(DetailsBrandPageComponent, {
      imports: [BrandDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', '999']]) } },
        },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    expect(window.alert).toHaveBeenCalledWith('Marca não encontrada.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands']);
  });

  it('should navigate to brands on navigateToBrands()', async () => {
    const { fixture } = await render(DetailsBrandPageComponent, {
      imports: [BrandDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', '1']]) } },
        },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    fixture.componentInstance.navigateToBrands();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands']);
  });

  it('should navigate to edit on navigateToEdit()', async () => {
    const { fixture } = await render(DetailsBrandPageComponent, {
      imports: [BrandDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', '1']]) } },
        },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    fixture.componentInstance.navigateToEdit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands/edit', 1]);
  });
});
