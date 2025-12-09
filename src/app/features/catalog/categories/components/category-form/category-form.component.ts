// src/app/features/catalog/categories/components/category-form/category-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';
import { Category } from '../../../../../core/models/category.model';

@Component({
  standalone: true,
  selector: 'app-category-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent {
  private readonly fb = new FormBuilder();

  @Input() title = 'Nova categoria';
  @Input() submitLabel = 'Salvar categoria';
  @Input() initialValue: Category | null = null;
  @Output() submitted = new EventEmitter<Partial<Category>>();

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    description: [''],
  });

  ngOnChanges(): void {
    if (this.initialValue) {
      this.form.patchValue({
        name: this.initialValue.name,
        slug: this.initialValue.slug ?? '',
        description: this.initialValue.description ?? '',
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }
}