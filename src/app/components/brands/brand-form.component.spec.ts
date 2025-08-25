// src/app/components/brand/brand-form.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandFormComponent } from './brand-form.component';
import { FormsModule } from '@angular/forms';
import { render, screen, fireEvent } from '@testing-library/angular';
import '@testing-library/jasmine-dom';

describe('BrandFormComponent', () => {
  let component: BrandFormComponent;
  let fixture: ComponentFixture<BrandFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandFormComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize name with initialName', () => {
    component.initialName = 'Marca Inicial';
    component.ngOnInit();
    expect(component.name).toBe('Marca Inicial');
  });

  it('should display error if name is empty on submit', async () => {
    component.name = '   ';
    component.handleSubmit();
    expect(component.error).toBe('O nome da marca é obrigatório.');
  });

  it('should emit onSubmit event with trimmed name when valid', async () => {
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

  it('should display error message in the template', async () => {
    component.error = 'Erro de teste';
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('.error');
    expect(span.textContent).toContain('Erro de teste');
  });

  it('should bind input to name property', async () => {
    await render(BrandFormComponent, {
      componentProperties: { initialName: 'Marca X' },
    });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Marca X');
  });
});
