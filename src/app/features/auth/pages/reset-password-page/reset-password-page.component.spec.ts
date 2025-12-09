// src/app/features/auth/pages/reset-password-page/reset-password-page.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { of } from 'rxjs';

import { ResetPasswordPageComponent } from './reset-password-page.component';
import { AuthService } from '../../../../core/services/auth.service';

class AuthServiceStub {
  resetPassword() {
    return of({});
  }
}

describe('ResetPasswordPageComponent', () => {
  let component: ResetPasswordPageComponent;
  let fixture: ComponentFixture<ResetPasswordPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordPageComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        provideRouter([], withComponentInputBinding()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordPageComponent);
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
