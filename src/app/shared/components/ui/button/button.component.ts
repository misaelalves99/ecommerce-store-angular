// src/app/shared/components/ui/button/button.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  standalone: true,
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth = false;
  @Input() loading = false;
  @Input() disabled = false;

  @Output() appClick = new EventEmitter<MouseEvent>();

  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  onClick(event: MouseEvent): void {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.appClick.emit(event);
  }
}
