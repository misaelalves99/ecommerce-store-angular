// src/app/components/brand/brand-form.component.ts

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // obrigatório para ngModel
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.css'],
})
export class BrandFormComponent implements OnInit {
  @Input() initialName = '';
  @Output() onSubmit = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<void>();

  name = '';
  error = '';

  ngOnInit(): void {
    this.name = this.initialName || '';
  }

  handleSubmit() {
    if (!this.name.trim()) {
      this.error = 'O nome da marca é obrigatório.';
      return;
    }
    this.error = '';
    this.onSubmit.emit(this.name.trim());
  }

  handleCancel() {
    this.onCancel.emit();
  }
}
