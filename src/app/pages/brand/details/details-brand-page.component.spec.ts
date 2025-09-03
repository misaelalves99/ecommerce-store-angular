import { render, screen, fireEvent } from '@testing-library/angular';
import { DetailsBrandPageComponent } from './details-brand-page.component';
import { BrandDetailsComponent } from '../../../components/brands/brand-details.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { of } from 'rxjs'; // <-- importante!

describe('DetailsBrandPageComponent', () => {
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
    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrands']);
    // retorna Observable, não array
    mockBrandService.getBrands.and.returnValue(of([fakeBrand]));
  });

  it('should show loading when brand is not yet loaded', async () => {
    await render(DetailsBrandPageComponent, {
      imports: [BrandDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    expect(screen.getByText('Carregando detalhes da marca...')).toBeTruthy();
  });

  it('should load brand based on route param', async () => {
    await render(DetailsBrandPageComponent, {
      imports: [BrandDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    expect(screen.getByText('Detalhes da Marca')).toBeTruthy();
    expect(screen.getByText('Marca Teste')).toBeTruthy();
  });

  it('should alert and navigate away if brand not found', async () => {
    spyOn(window, 'alert');
    mockBrandService.getBrands.and.returnValue(of([])); // <-- Observable vazio

    await render(DetailsBrandPageComponent, {
      imports: [BrandDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '999' } } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    expect(window.alert).toHaveBeenCalledWith('Marca não encontrada.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands']);
  });

  it('should navigate back when goBack() is called', async () => {
    const { fixture } = await render(DetailsBrandPageComponent, {
      imports: [BrandDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    fixture.componentInstance.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands']);
  });

  it('should navigate to edit page when goToEdit() is called', async () => {
    const { fixture } = await render(DetailsBrandPageComponent, {
      imports: [BrandDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    fixture.componentInstance.goToEdit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands/edit', 1]);
  });

  it('should navigate to edit button click', async () => {
    await render(DetailsBrandPageComponent, {
      imports: [BrandDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    fireEvent.click(screen.getByText('Editar'));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands/edit', 1]);
  });

  it('should navigate to back button click', async () => {
    await render(DetailsBrandPageComponent, {
      imports: [BrandDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    fireEvent.click(screen.getByText('Voltar'));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands']);
  });
});
