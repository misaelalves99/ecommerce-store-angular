import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DeleteBrandPageComponent } from './delete-brand-page.component';
import { BrandService } from '../../../services/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand } from '../../../types/brand.model';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

describe('DeleteBrandPageComponent', () => {
  let component: DeleteBrandPageComponent;
  let fixture: ComponentFixture<DeleteBrandPageComponent>;
  let brandService: jasmine.SpyObj<BrandService>;
  let router: jasmine.SpyObj<Router>;

  const mockBrand: Brand = {
    id: 1,
    name: 'Marca Teste',
    createdAt: '2025-08-23',
    isActive: true
  };

  beforeEach(async () => {
    const brandServiceSpy = jasmine.createSpyObj('BrandService', ['getBrands', 'deleteBrand']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [DeleteBrandPageComponent],
      providers: [
        { provide: BrandService, useValue: brandServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteBrandPageComponent);
    component = fixture.componentInstance;
    brandService = TestBed.inject(BrandService) as jasmine.SpyObj<BrandService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize brand if found', () => {
    brandService.getBrands.and.returnValue(of([mockBrand])); // retorna Observable
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.brand).toEqual(mockBrand);
  });

  it('should navigate away if brand not found', () => {
    spyOn(window, 'alert');
    brandService.getBrands.and.returnValue(of([])); // retorna Observable vazio
    component.ngOnInit();
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Marca não encontrada.');
    expect(router.navigate).toHaveBeenCalledWith(['/brands']);
  });

  it('should delete brand and navigate back', () => {
    brandService.getBrands.and.returnValue(of([mockBrand]));
    component.ngOnInit();
    fixture.detectChanges();

    component.handleDelete();

    expect(brandService.deleteBrand).toHaveBeenCalledWith(mockBrand.id);
    expect(router.navigate).toHaveBeenCalledWith(['/brands']);
  });

  it('should navigate back on cancel', () => {
    component.handleCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/brands']);
  });
});
