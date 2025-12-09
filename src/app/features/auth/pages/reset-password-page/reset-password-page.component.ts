// src/app/features/auth/pages/reset-password-page/reset-password-page.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { AutofocusDirective } from '../../../../shared/directives/autofocus.directive';

@Component({
  standalone: true,
  selector: 'app-reset-password-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
    AutofocusDirective,
  ],
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.css'],
})
export class ResetPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  // Token vindo via query string (?token=...)
  private readonly token: string =
    this.route.snapshot.queryParamMap.get('token') ?? '';

  readonly form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
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

  readonly canSubmit = computed(() => {
    return !!this.token && this.form.valid && !this.loading();
  });

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
    if (!this.token || this.form.invalid || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { password } = this.form.getRawValue();

    this.authService.changePassword(password).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set(
          'Senha redefinida com sucesso! Você já pode fazer login com a nova senha.',
        );
        // this.router.navigate(['/auth/login']);
      },
      error: (error: unknown) => {
        console.error('Reset password error', error);
        this.loading.set(false);
        this.errorMessage.set(
          (error as any)?.message ??
            'Não foi possível redefinir a senha. Verifique o link ou solicite uma nova recuperação.',
        );
      },
    });
  }
}
