// src/app/features/auth/components/auth-form/auth-form.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthFormComponent } from './auth-form.component';

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com formulário inválido', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('deve emitir valores válidos no submit', () => {
    // Usa o spyOn do Jasmine (não jest)
    const emitSpy = spyOn(component.submitted, 'emit');

    component.showNameField = true;
    component.showRememberMe = true;

    component.form.patchValue({
      name: 'Admin',
      email: 'admin@store.com',
      password: '123456',
      rememberMe: true,
    });

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith({
      name: 'Admin',
      email: 'admin@store.com',
      password: '123456',
      rememberMe: true,
    });
  });
});
