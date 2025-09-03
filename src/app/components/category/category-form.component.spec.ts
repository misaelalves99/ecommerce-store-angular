// src/app/components/category/category-form.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryFormComponent } from './category-form.component';
import { FormsModule } from '@angular/forms';
import { CategoryFormData } from '../../types/category-form-data.model';
import '@testing-library/jasmine-dom';

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryFormComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize input fields with initial values', () => {
    component.initialName = 'Categoria Inicial';
    component.initialDescription = 'Descrição inicial';
    component.ngOnInit();
    expect(component.name).toBe('Categoria Inicial');
    expect(component.description).toBe('Descrição inicial');
  });

  it('should show error if name or description is empty on submit', () => {
    component.name = '';
    component.description = '';
    component.handleSubmit();
    expect(component.errors.name).toBe('O nome é obrigatório.');
    expect(component.errors.description).toBe('A descrição é obrigatória.');
  });

  it('should emit submitEvent when form is valid', () => {
    spyOn(component.submitEvent, 'emit');
    component.name = 'Nova Categoria';
    component.description = 'Nova descrição';
    component.handleSubmit();
    expect(component.errors).toEqual({});
    expect(component.submitEvent.emit).toHaveBeenCalledWith({
      name: 'Nova Categoria',
      description: 'Nova descrição'
    } as CategoryFormData);
  });

  it('should emit cancelEvent when handleCancel is called', () => {
    spyOn(component.cancelEvent, 'emit');
    component.handleCancel();
    expect(component.cancelEvent.emit).toHaveBeenCalled();
  });

  it('should render input and textarea with bound values', () => {
    component.name = 'Nome Teste';
    component.description = 'Descrição Teste';
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[name="categoryName"]') as HTMLInputElement;
    const textarea = fixture.nativeElement.querySelector('textarea[name="categoryDescription"]') as HTMLTextAreaElement;

    expect(input.value).toBe('Nome Teste');
    expect(textarea.value).toBe('Descrição Teste');
  });

  it('should display error messages in template when invalid', () => {
    component.name = '';
    component.description = '';
    component.handleSubmit();
    fixture.detectChanges();

    const nameError = fixture.nativeElement.querySelector('.error');
    const descriptionError = fixture.nativeElement.querySelectorAll('.error')[1];

    expect(nameError.textContent).toContain('O nome é obrigatório.');
    expect(descriptionError.textContent).toContain('A descrição é obrigatória.');
  });
});
