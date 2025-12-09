// src/app/features/settings/components/store-settings-form/store-settings-form.component.ts
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { StoreSettingsViewModel } from '../../pages/settings-store-page/settings-store-page.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-store-settings-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './store-settings-form.component.html',
  styleUrls: ['./store-settings-form.component.css'],
})
export class StoreSettingsFormComponent implements OnChanges {
  @Input() value!: StoreSettingsViewModel;
  @Output() saved = new EventEmitter<StoreSettingsViewModel>();

  form: FormGroup;

  readonly timezones = ['America/Sao_Paulo', 'America/New_York', 'Europe/Lisbon'];
  readonly currencies = ['BRL', 'USD', 'EUR'];

  constructor(private readonly fb: FormBuilder) {
    this.form = this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.value) {
      this.form.patchValue(this.value);
    }
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      cnpj: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      timezone: ['', Validators.required],
      currency: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saved.emit(this.form.value as StoreSettingsViewModel);
  }

  hasError(c: string, e: string): boolean {
    const ctrl = this.form.get(c);
    return !!ctrl && ctrl.touched && ctrl.hasError(e);
  }
}
