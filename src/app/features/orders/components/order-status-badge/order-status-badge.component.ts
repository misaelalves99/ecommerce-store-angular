// src/app/features/orders/components/order-status-badge/order-status-badge.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  OrderStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_BADGE_VARIANT,
  OrderStatusBadgeVariant,
} from '../../../../core/enums/order-status.enum';

import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';

@Component({
  standalone: true,
  selector: 'app-order-status-badge',
  imports: [CommonModule, BadgeComponent],
  templateUrl: './order-status-badge.component.html',
  styleUrls: ['./order-status-badge.component.css'],
})
export class OrderStatusBadgeComponent {
  @Input({ required: true }) status!: OrderStatus;

  // Usa o mapeamento centralizado de variantes
  get variant(): OrderStatusBadgeVariant {
    return ORDER_STATUS_BADGE_VARIANT[this.status] ?? 'neutral';
  }

  // Usa os labels centralizados
  get label(): string {
    return ORDER_STATUS_LABELS[this.status] ?? 'Desconhecido';
  }
}
