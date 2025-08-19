// src/app/components/category/category-form.component.ts

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CategoryFormData {
  name: string;
  description: string;
}

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  @Input() initialName: string = '';
  @Input() initialDescription: string = '';
  @Output() submitEvent = new EventEmitter<CategoryFormData>();
  @Output() cancelEvent = new EventEmitter<void>();

  name: string = '';
  description: string = '';
  errors: { name?: string; description?: string } = {};

  ngOnInit() {
    // Inicializa os valores quando o componente for montado
    this.name = this.initialName || '';
    this.description = this.initialDescription || '';
  }

  handleSubmit() {
    const newErrors: typeof this.errors = {};

    if (!this.name.trim()) {
      newErrors.name = 'O nome é obrigatório.';
    }

    if (!this.description.trim()) {
      newErrors.description = 'A descrição é obrigatória.';
    }

    if (Object.keys(newErrors).length > 0) {
      this.errors = newErrors;
      return;
    }

    this.errors = {};
    this.submitEvent.emit({
      name: this.name.trim(),
      description: this.description.trim()
    });
  }

  handleCancel() {
    this.cancelEvent.emit();
  }
}
