// src/app/shared/pipes/order-status.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '../../core/enums/order-status.enum';

@Pipe({
  name: 'orderStatus',
  standalone: true,
})
export class OrderStatusPipe implements PipeTransform {
  transform(status: OrderStatus | string | null | undefined): string {
    if (!status) {
      return 'Indefinido';
    }

    const value = typeof status === 'string' ? status : OrderStatus[status];

    switch (value) {
      case 'PENDING':
        return 'Pendente';
      case 'CONFIRMED':
        return 'Confirmado';
      case 'PAID':
        return 'Pago';
      case 'SHIPPED':
        return 'Enviado';
      case 'DELIVERED':
        return 'Entregue';
      case 'CANCELLED':
        return 'Cancelado';
      case 'REFUNDED':
        return 'Reembolsado';
      default:
        return value;
    }
  }
}
