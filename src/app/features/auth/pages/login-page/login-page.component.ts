// src/app/features/auth/pages/login-page/login-page.component.ts

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { AutofocusDirective } from '../../../../shared/directives/autofocus.directive';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
    AutofocusDirective,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [true],
  });

  readonly canSubmit = computed(
    () => this.form.valid && !this.loading(),
  );

  get emailCtrl() {
    return this.form.controls.email;
  }

  get passwordCtrl() {
    return this.form.controls.password;
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error', error);
        this.loading.set(false);

        const message =
          (error as any)?.message ??
          'Não foi possível entrar. Verifique seus dados e tente novamente.';
        this.errorMessage.set(message);
      },
    });
  }

  // ===== Login Social =====

  onLoginWithGoogle(): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.loginWithGoogle().subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login with Google error', error);
        this.loading.set(false);

        const message =
          (error as any)?.message ??
          'Não foi possível entrar com Google. Tente novamente.';
        this.errorMessage.set(message);
      },
    });
  }

  onLoginWithFacebook(): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.loginWithFacebook().subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login with Facebook error', error);
        this.loading.set(false);

        const message =
          (error as any)?.message ??
          'Não foi possível entrar com Facebook. Tente novamente.';
        this.errorMessage.set(message);
      },
    });
  }
}
