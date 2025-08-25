// src/app/pages/brands/create/create-brand-page.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { CreateBrandPageComponent } from './create-brand-page.component';
import { BrandFormComponent } from '../../../components/brands/brand-form.component';
import { Router } from '@angular/router';
import { BrandService } from '../../../services/brand.service';

describe('CreateBrandPageComponent', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockBrandService: jasmine.SpyObj<BrandService>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockBrandService = jasmine.createSpyObj('BrandService', ['addBrand']);
  });

  it('should render the page title', async () => {
    await render(CreateBrandPageComponent, {
      componentProperties: {},
      imports: [BrandFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    const title = screen.getByText('Adicionar Marca');
    expect(title).toBeTruthy();
  });

  it('should call brandService.addBrand and navigate on create', async () => {
    const { fixture } = await render(CreateBrandPageComponent, {
      imports: [BrandFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    // Simula emissão do evento onSubmit
    fixture.componentInstance.handleCreate('Marca Teste');

    expect(mockBrandService.addBrand).toHaveBeenCalledWith('Marca Teste');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands']);
  });

  it('should navigate on cancel', async () => {
    const { fixture } = await render(CreateBrandPageComponent, {
      imports: [BrandFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: BrandService, useValue: mockBrandService },
      ],
    });

    fixture.componentInstance.handleCancel();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands']);
  });
});
