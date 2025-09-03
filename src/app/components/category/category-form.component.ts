import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryFormData } from '../../types/category-form-data.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // obrigatório para ngModel
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit {
  @Input() initialName = '';
  @Input() initialDescription = '';
  @Output() submitEvent = new EventEmitter<CategoryFormData>();
  @Output() cancelEvent = new EventEmitter<void>();

  name = '';
  description = '';
  errors: { name?: string; description?: string } = {};

  ngOnInit(): void {
    this.name = this.initialName;
    this.description = this.initialDescription;
  }

  handleSubmit() {
    const newErrors: typeof this.errors = {};
    if (!this.name.trim()) newErrors.name = 'O nome é obrigatório.';
    if (!this.description.trim()) newErrors.description = 'A descrição é obrigatória.';

    if (Object.keys(newErrors).length) {
      this.errors = newErrors;
      return;
    }

    this.errors = {};
    this.submitEvent.emit({ name: this.name.trim(), description: this.description.trim() });
  }

  handleCancel() {
    this.cancelEvent.emit();
  }
}
