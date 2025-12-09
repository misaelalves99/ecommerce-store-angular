// src/app/features/settings/components/user-form/user-form.component.ts

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { User } from '../../../../core/models/user.model';
import { UserRole } from '../../../../core/enums/user-role.enum';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnChanges {
  @Input() value: User | null = null;
  @Output() saved = new EventEmitter<User>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;

  readonly roles = Object.values(UserRole);

  constructor(private readonly fb: FormBuilder) {
    this.form = this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      if (this.value) {
        this.form.patchValue({
          id: this.value.id,
          name: this.value.name,
          email: this.value.email,
          role: this.value.role,
          isActive: this.value.isActive ?? true,
        });
      } else {
        this.form.reset({
          id: null,
          name: '',
          email: '',
          role: UserRole.MANAGER, // <- enum em CAIXA ALTA
          isActive: true,
        });
      }
    }
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [UserRole.MANAGER, Validators.required], // <- enum em CAIXA ALTA
      isActive: [true],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saved.emit(this.form.value as User);
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  hasError(control: string, error: string): boolean {
    const c = this.form.get(control);
    return !!c && c.touched && c.hasError(error);
  }
}
