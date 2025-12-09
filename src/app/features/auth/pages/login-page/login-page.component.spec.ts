// src/app/features/auth/pages/login-page/login-page.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../../../core/services/auth.service';
import { of } from 'rxjs';

class AuthServiceStub {
  login() {
    return of({});
  }
}

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useClass: AuthServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com formulário inválido', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('deve validar formulário válido após preencher campos obrigatórios', () => {
    component.form.patchValue({
      email: 'admin@store.com',
      password: '123456',
    });

    expect(component.form.valid).toBeTrue();
  });
});
