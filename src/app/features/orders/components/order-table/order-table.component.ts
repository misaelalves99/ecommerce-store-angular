// src/app/features/orders/components/order-table/order-table.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Order } from '../../../../core/models/order.model';
import { OrderStatusBadgeComponent } from '../order-status-badge/order-status-badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

/** View model para a tabela, estende o Order do domínio */
type OrderTableViewModel = Order & {
  customer?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

@Component({
  standalone: true,
  selector: 'app-order-table',
  imports: [CommonModule, OrderStatusBadgeComponent, ButtonComponent],
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.css'],
})
export class OrderTableComponent {
  @Input() orders: OrderTableViewModel[] = [];
  @Input() loading = false;

  @Output() details = new EventEmitter<string>();
  @Output() timeline = new EventEmitter<string>();

  onDetails(id: string): void {
    this.details.emit(id);
  }

  onTimeline(id: string): void {
    this.timeline.emit(id);
  }

  trackByOrderId = (_: number, order: OrderTableViewModel) => order.id;

  getOrderTotal(order: OrderTableViewModel): number {
    const anyOrder = order as any;
    const raw = anyOrder?.grandTotal ?? anyOrder?.total ?? 0;

    if (typeof raw === 'number') return raw;
    return Number(raw) || 0;
  }

  /** Evita uso de ?? no template, mantendo o fallback code -> id */
  getOrderDisplayCode(order: OrderTableViewModel): string {
    const anyOrder = order as any;
    return anyOrder.code || anyOrder.id || '';
  }
}
