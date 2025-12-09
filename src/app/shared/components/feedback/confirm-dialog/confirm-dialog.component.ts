// src/app/shared/components/feedback/confirm-dialog/confirm-dialog.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../../ui/button/button.component';
import { CardComponent } from '../../ui/card/card.component';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  imports: [CommonModule ],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() loading = false;
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';

  /** controla se o dialog está visível; por padrão, true */
  @Input() open = true;

  /** se true, aplica estilo “danger” no botão de confirmação */
  @Input() destructive = true;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  handleConfirm(): void {
    if (this.loading) return;
    this.confirm.emit();
  }

  handleCancel(): void {
    if (this.loading) return;
    this.cancel.emit();
  }

  handleBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    // Fecha apenas se o clique for diretamente no backdrop
    if (target.classList.contains('confirm-dialog__backdrop')) {
      this.handleCancel();
    }
  }
}
