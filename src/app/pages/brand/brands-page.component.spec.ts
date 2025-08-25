// src/app/pages/brands/brands-page.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { BrandsPageComponent } from './brands-page.component';
import { BrandListComponent } from '../../components/brands/brand-list.component';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../types/brand.model';

describe('BrandsPageComponent', () => {
  let mockBrandService: jasmine.SpyObj<BrandService>;

  const fakeBrands: Brand[] = [
    { id: 1, name: 'Marca A', createdAt: '2025-08-23T12:00:00Z' },
    { id: 2, name: 'Marca B', createdAt: '2025-08-23T12:00:00Z' },
  ];

  beforeEach(() => {
    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrands']);
    mockBrandService.getBrands.and.returnValue(fakeBrands);
  });

  it('should render heading and add brand link', async () => {
    await render(BrandsPageComponent, {
      imports: [BrandListComponent],
      providers: [{ provide: BrandService, useValue: mockBrandService }],
    });

    const heading = screen.getByText('Marcas');
    expect(heading).toBeTruthy();

    const addLink = screen.getByText('Adicionar Marca') as HTMLAnchorElement;
    expect(addLink.href).toContain('/brands/create');
  });

  it('should load brands on init and pass to BrandListComponent', async () => {
    await render(BrandsPageComponent, {
      imports: [BrandListComponent],
      providers: [{ provide: BrandService, useValue: mockBrandService }],
    });

    // Verifica se getBrands foi chamado
    expect(mockBrandService.getBrands).toHaveBeenCalled();

    // Verifica se os nomes das marcas estão renderizados
    fakeBrands.forEach(brand => {
      const el = screen.getByText(brand.name);
      expect(el).toBeTruthy();
    });
  });
});
