// src/app/shared/components/feedback/toast-container/toast-container.component.ts

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

@Component({
  standalone: true,
  selector: 'app-toast-container',
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.css'],
})
export class ToastContainerComponent {
  @Input() toasts: Toast[] = [];
  @Output() dismiss = new EventEmitter<string>();

  getIcon(type: ToastType): string {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '⛔';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  }

  onDismiss(id: string): void {
    this.dismiss.emit(id);
  }
}
