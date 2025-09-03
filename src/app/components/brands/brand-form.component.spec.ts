// src/app/components/brand/brand-form.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandFormComponent } from './brand-form.component';
import '@testing-library/jasmine-dom';
import { render } from '@testing-library/angular';

describe('BrandFormComponent', () => {
  let component: BrandFormComponent;
  let fixture: ComponentFixture<BrandFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize name with initialName', () => {
    component.initialName = 'Marca Inicial';
    component.ngOnInit();
    expect(component.name).toBe('Marca Inicial');
  });

  it('should display error if name is empty on submit', () => {
    component.name = '   ';
    component.handleSubmit();
    expect(component.error).toBe('O nome da marca é obrigatório.');
  });

  it('should emit onSubmit event with trimmed name when valid', () => {
    spyOn(component.onSubmit, 'emit');
    component.name = '  Nova Marca  ';
    component.handleSubmit();
    expect(component.error).toBe('');
    expect(component.onSubmit.emit).toHaveBeenCalledWith('Nova Marca');
  });

  it('should emit onCancel event when handleCancel is called', () => {
    spyOn(component.onCancel, 'emit');
    component.handleCancel();
    expect(component.onCancel.emit).toHaveBeenCalled();
  });

  it('should display error message in the template', () => {
    component.error = 'Erro de teste';
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('.error');
    expect(span.textContent).toContain('Erro de teste');
  });

  it('should bind input to name property (with testing-library)', async () => {
    const { container } = await render(BrandFormComponent, {
      componentProperties: { initialName: 'Marca X' },
    });
    const input = container.querySelector('input[name="brandName"]') as HTMLInputElement;
    expect(input.value).toBe('Marca X');
  });
});
