// src/app/features/auth/pages/register-page/register-page.component.ts

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
  selector: 'app-register-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
    AutofocusDirective,
  ],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]],
    },
    {
      validators: (group) => {
        const pass = group.get('password')?.value;
        const confirm = group.get('confirmPassword')?.value;
        return pass && confirm && pass !== confirm
          ? { passwordMismatch: true }
          : null;
      },
    },
  );

  readonly canSubmit = computed(() => this.form.valid && !this.loading());

  get nameCtrl() {
    return this.form.controls.name;
  }

  get emailCtrl() {
    return this.form.controls.email;
  }

  get passwordCtrl() {
    return this.form.controls.password;
  }

  get confirmPasswordCtrl() {
    return this.form.controls.confirmPassword;
  }

  get passwordMismatch(): boolean {
    return !!this.form.errors?.['passwordMismatch'];
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const { name, email, password } = this.form.getRawValue();

    this.authService
      .registerWithPayload({ name, email, password })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (error: unknown) => {
          console.error('Register error', error);
          this.loading.set(false);

          const message =
            (error as any)?.message ??
            'Não foi possível criar a conta. Tente novamente em alguns instantes.';
          this.errorMessage.set(message);
        },
      });
  }

  // ===== Registro / login social =====

  onRegisterWithGoogle(): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    // No Firebase, o login social já cria a conta se não existir
    this.authService.loginWithGoogle().subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Register with Google error', error);
        this.loading.set(false);

        const message =
          (error as any)?.message ??
          'Não foi possível criar/entrar com Google. Tente novamente.';
        this.errorMessage.set(message);
      },
    });
  }

  onRegisterWithFacebook(): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.loginWithFacebook().subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Register with Facebook error', error);
        this.loading.set(false);

        const message =
          (error as any)?.message ??
          'Não foi possível criar/entrar com Facebook. Tente novamente.';
        this.errorMessage.set(message);
      },
    });
  }
}
