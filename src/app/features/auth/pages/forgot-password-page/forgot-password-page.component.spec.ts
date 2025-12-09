// src/app/features/auth/pages/forgot-password-page/forgot-password-page.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ForgotPasswordPageComponent } from './forgot-password-page.component';
import { AuthService } from '../../../../core/services/auth.service';

class AuthServiceStub {
  requestPasswordReset() {
    return of({});
  }
}

describe('ForgotPasswordPageComponent', () => {
  let component: ForgotPasswordPageComponent;
  let fixture: ComponentFixture<ForgotPasswordPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordPageComponent],
      providers: [{ provide: AuthService, useClass: AuthServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com formulário inválido', () => {
    expect(component.form.valid).toBeFalse();
  });
});
