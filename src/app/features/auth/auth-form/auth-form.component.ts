// src/app/features/auth/components/auth-form/auth-form.component.ts

import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AutofocusDirective } from '../../../shared/directives/autofocus.directive';

export interface AuthFormValue {
  name?: string;
  email: string;
  password: string;
  rememberMe?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-auth-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, AutofocusDirective],
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css'],
})
export class AuthFormComponent {
  private readonly fb = inject(FormBuilder);

  @Input() mode: 'login' | 'register' = 'login';
  @Input() title = 'Acessar painel';
  @Input() subtitle =
    'Entre com suas credenciais administrativas para acessar o dashboard.';
  @Input() primaryButtonLabel = 'Entrar';
  @Input() secondaryText = 'Não tem conta?';
  @Input() secondaryLinkLabel = 'Criar conta';
  @Input() secondaryLink = '/auth/register';
  @Input() showRememberMe = true;
  @Input() showNameField = false;

  @Output() submitted = new EventEmitter<AuthFormValue>();

  readonly loading = this.fb.nonNullable.control(false);
  readonly errorMessage = this.fb.nonNullable.control<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [true],
  });

  readonly canSubmit = computed(
    () => this.form.valid && !this.loading.value,
  );

  get nameCtrl() {
    return this.form.controls.name;
  }

  get emailCtrl() {
    return this.form.controls.email;
  }

  get passwordCtrl() {
    return this.form.controls.password;
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading.value) return;

    this.errorMessage.setValue(null);
    const raw = this.form.getRawValue();

    const payload: AuthFormValue = {
      name: this.showNameField ? raw.name || undefined : undefined,
      email: raw.email,
      password: raw.password,
      rememberMe: this.showRememberMe ? raw.rememberMe : undefined,
    };

    this.submitted.emit(payload);
  }

  setLoading(isLoading: boolean): void {
    this.loading.setValue(isLoading);
  }

  setError(message: string | null): void {
    this.errorMessage.setValue(message);
  }
}
