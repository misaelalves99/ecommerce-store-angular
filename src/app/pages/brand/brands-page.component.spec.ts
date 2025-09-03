// src/app/pages/brands/brands-page.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { BrandsPageComponent } from './brands-page.component';
import { BrandListComponent } from '../../components/brands/brand-list.component';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../types/brand.model';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('BrandsPageComponent', () => {
  let mockBrandService: jasmine.SpyObj<BrandService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const fakeBrands: Brand[] = [
    { id: 1, name: 'Marca A', createdAt: '2025-08-23T12:00:00Z', isActive: true },
    { id: 2, name: 'Marca B', createdAt: '2025-08-23T12:00:00Z', isActive: false },
  ];

  beforeEach(() => {
    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrands']);
    // <-- retorna Observable, não array direto
    mockBrandService.getBrands.and.returnValue(of(fakeBrands));

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  });

  it('should render heading and add brand button', async () => {
    await render(BrandsPageComponent, {
      imports: [BrandListComponent],
      providers: [
        { provide: BrandService, useValue: mockBrandService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const heading = screen.getByText('Marcas');
    expect(heading).toBeTruthy();

    const addButton = screen.getByText('Adicionar Marca') as HTMLButtonElement;
    expect(addButton).toBeTruthy();
  });

  it('should load brands on init and pass to BrandListComponent', async () => {
    await render(BrandsPageComponent, {
      imports: [BrandListComponent],
      providers: [
        { provide: BrandService, useValue: mockBrandService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    expect(mockBrandService.getBrands).toHaveBeenCalled();

    // Verifica se os nomes das marcas estão renderizados
    fakeBrands.forEach(brand => {
      expect(screen.getByText(brand.name)).toBeTruthy();
    });
  });

  it('should navigate to create page on button click', async () => {
    const { fixture } = await render(BrandsPageComponent, {
      imports: [BrandListComponent],
      providers: [
        { provide: BrandService, useValue: mockBrandService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const addButton = screen.getByText('Adicionar Marca');
    fireEvent.click(addButton);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands/create']);
  });

  it('should handle deleteBrandEvent and remove brand from list', async () => {
    const { fixture } = await render(BrandsPageComponent, {
      imports: [BrandListComponent],
      providers: [
        { provide: BrandService, useValue: mockBrandService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    fixture.componentInstance.handleDelete(1);

    expect(fixture.componentInstance.brands.length).toBe(1);
    expect(fixture.componentInstance.brands[0].id).toBe(2);
  });
});
