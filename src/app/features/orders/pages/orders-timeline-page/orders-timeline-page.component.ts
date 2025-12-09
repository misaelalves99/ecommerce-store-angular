// src/app/features/orders/pages/orders-timeline-page/orders-timeline-page.component.ts
import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Order } from '../../../../core/models/order.model';
import { OrderService } from '../../../../core/services/order.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { PageHeaderComponent } from '../../../../layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { OrderStatusBadgeComponent } from '../../components/order-status-badge/order-status-badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

interface OrderTimelineEvent {
  id?: string;
  title: string;
  description?: string;
  createdAt: string | Date;
  meta?: string;
}

/** View model com timeline + cliente opcional */
type OrderWithTimeline = Order & {
  customer?: {
    name?: string | null;
    email?: string | null;
  } | null;
  timeline?: OrderTimelineEvent[];
};

@Component({
  standalone: true,
  selector: 'app-orders-timeline-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    CardComponent,
    OrderStatusBadgeComponent,
    ButtonComponent,
  ],
  templateUrl: './orders-timeline-page.component.html',
  styleUrls: ['./orders-timeline-page.component.css'],
})
export class OrdersTimelinePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);
  private readonly notificationService = inject(NotificationService);

  readonly loading = signal(false);
  readonly order = signal<OrderWithTimeline | null>(null);

  readonly orderId = computed(
    () => this.route.snapshot.paramMap.get('id') ?? '',
  );

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(): void {
    const id = this.orderId();
    if (!id) return;

    this.loading.set(true);
    this.orderService.getOrderTimeline(id).subscribe({
      next: (orderTimeline: OrderWithTimeline) => this.order.set(orderTimeline),
      error: () => {
        this.notificationService.error(
          'Não foi possível carregar a timeline do pedido.',
        );
        this.router.navigate(['/orders']);
      },
      complete: () => this.loading.set(false),
    });
  }

  goBack(): void {
    this.router.navigate(['/orders/details', this.orderId()]);
  }

  trackByEventId(_index: number, event: OrderTimelineEvent): string {
    return event?.id ?? String(_index);
  }

  /** Evita uso de ?? no template, mantendo fallback code -> id */
  getOrderCode(order: OrderWithTimeline): string {
    const anyOrder = order as any;
    return anyOrder.code || anyOrder.id || '';
  }
}
