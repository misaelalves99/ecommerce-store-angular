// src/app/features/orders/components/order-items-table/order-items-table.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderItem } from '../../../../core/models/order-item.model';

@Component({
  standalone: true,
  selector: 'app-order-items-table',
  imports: [CommonModule],
  templateUrl: './order-items-table.component.html',
  styleUrls: ['./order-items-table.component.css'],
})
export class OrderItemsTableComponent {
  @Input() items: OrderItem[] = [];

  trackByItemId = (_: number, item: OrderItem) => item.id;

  getSubtotal(item: OrderItem): number {
    const anyItem = item as any;
    const rawSubtotal = anyItem?.subtotal;

    if (typeof rawSubtotal === 'number') {
      return rawSubtotal;
    }

    const calc = item.quantity * item.unitPrice;
    return typeof calc === 'number' ? calc : Number(calc) || 0;
  }
}
