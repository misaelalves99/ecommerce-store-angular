// src/app/features/auth/pages/register-page/register-page.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { RegisterPageComponent } from './register-page.component';
import { AuthService } from '../../../../core/services/auth.service';

class AuthServiceStub {
  register() {
    return of({});
  }
}

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useClass: AuthServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve começar com formulário inválido', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('deve detectar senhas diferentes', () => {
    component.form.patchValue({
      name: 'Admin',
      email: 'admin@store.com',
      password: '123456',
      confirmPassword: '654321',
      acceptTerms: true,
    });

    expect(component.passwordMismatch).toBeTrue();
    expect(component.form.valid).toBeFalse();
  });
});
