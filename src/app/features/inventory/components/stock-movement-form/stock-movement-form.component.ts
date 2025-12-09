// src/app/features/inventory/components/stock-movement-form/stock-movement-form.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { StockMovement } from '../../../../core/models/stock.model';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-stock-movement-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './stock-movement-form.component.html',
  styleUrls: ['./stock-movement-form.component.css'],
})
export class StockMovementFormComponent {
  @Output() submitted = new EventEmitter<StockMovement>();

  form: FormGroup;

  readonly movementTypes = [
    { value: 'IN', label: 'Entrada' },
    { value: 'OUT', label: 'Saída' },
    { value: 'ADJUST', label: 'Ajuste manual' },
  ];

  constructor(private readonly fb: FormBuilder) {
    this.form = this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      sku: ['', Validators.required],
      movementType: ['IN', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
      note: [''],
      reference: [''],
      occurredAt: [new Date().toISOString().substring(0, 10), Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dto: StockMovement = {
      ...this.form.value,
    } as StockMovement;

    this.submitted.emit(dto);
    this.form.reset({
      movementType: 'IN',
      quantity: 0,
      occurredAt: new Date().toISOString().substring(0, 10),
    });
  }

  hasError(control: string, error: string): boolean {
    const c = this.form.get(control);
    return !!c && c.touched && c.hasError(error);
  }
}
