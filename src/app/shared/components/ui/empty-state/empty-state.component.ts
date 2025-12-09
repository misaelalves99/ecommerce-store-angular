// src/app/shared/components/ui/empty-state/empty-state.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-empty-state',
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css'],
})
export class EmptyStateComponent {
  @Input() emoji = '📭';
  @Input() title = 'Nenhum dado encontrado';
  @Input() description = 'Tente ajustar os filtros ou criar um novo registro.';
  @Input() actionLabel?: string;

  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}
