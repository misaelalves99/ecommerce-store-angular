// src/app/shared/components/ui/badge/badge.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  standalone: true,
  selector: 'app-badge',
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css'],
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
  @Input() size: BadgeSize = 'md';
  @Input() pill = true;
  @Input() dot = false;
  @Input() upper = false;

  /**
   * Opcional: permite usar <app-badge [label]="..."></app-badge>
   * além de <app-badge>conteúdo</app-badge>.
   */
  @Input() label?: string;
}
