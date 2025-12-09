// src/app/shared/components/ui/modal/modal.component.ts

import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type ModalSize = 'sm' | 'md' | 'lg';

@Component({
  standalone: true,
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() open = false;
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() size: ModalSize = 'md';
  @Input() showClose = true;
  @Input() closeOnBackdrop = true;
  @Input() maxHeight = '80vh';

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.handleClose();
    }
  }

  handleBackdropClick(event: MouseEvent): void {
    if (!this.closeOnBackdrop) return;

    const target = event.target as HTMLElement;
    if (target.classList.contains('modal__backdrop')) {
      this.handleClose();
    }
  }

  handleClose(): void {
    this.closed.emit();
  }

  handleConfirm(): void {
    this.confirmed.emit();
  }
}
