// src/app/features/auth/pages/forgot-password-page/forgot-password-page.component.ts

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { AutofocusDirective } from '../../../../shared/directives/autofocus.directive';

@Component({
  standalone: true,
  selector: 'app-forgot-password-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
    AutofocusDirective,
  ],
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.css'],
})
export class ForgotPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly canSubmit = computed(() => this.form.valid && !this.loading());

  get emailCtrl() {
    return this.form.controls.email;
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { email } = this.form.getRawValue();

    // Usa o método existente no AuthService: resetPassword(email: string)
    this.authService.resetPassword(email).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set(
          'Enviamos um e-mail com instruções para redefinir sua senha.',
        );
      },
      error: (error: unknown) => {
        console.error('Forgot password error', error);
        this.loading.set(false);
        this.errorMessage.set(
          (error as any)?.message ??
            'Não foi possível enviar o e-mail de recuperação. Tente novamente.',
        );
      },
    });
  }
}
