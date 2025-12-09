// src/app/features/orders/pages/orders-list-page/orders-list-page.component.ts
import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Order } from '../../../../core/models/order.model';
import { OrderService } from '../../../../core/services/order.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { PageHeaderComponent } from '../../../../layout/page-header/page-header.component';
import { SearchInputComponent } from '../../../../shared/components/ui/search-input/search-input.component';
import { OrderTableComponent } from '../../components/order-table/order-table.component';

@Component({
  standalone: true,
  selector: 'app-orders-list-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    SearchInputComponent,
    OrderTableComponent,
  ],
  templateUrl: './orders-list-page.component.html',
  styleUrls: ['./orders-list-page.component.css'],
})
export class OrdersListPageComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly searchTerm = signal('');
  readonly orders = signal<Order[]>([]);

  readonly filteredOrders = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.orders();

    return this.orders().filter((order) => {
      const code = (order as any).code?.toLowerCase?.() ?? '';
      const customerName = (order as any).customerName?.toLowerCase?.() ?? '';
      const customerEmail = (order as any).customerEmail?.toLowerCase?.() ?? '';

      return (
        code.includes(term) ||
        customerName.includes(term) ||
        customerEmail.includes(term)
      );
    });
  });

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);

    this.orderService.getOrders().subscribe({
      next: (response) => {
        const data = response?.data ?? [];
        this.orders.set(data);
        this.loading.set(false); // <- desliga aqui
      },
      error: () => {
        this.notificationService.error(
          'Não foi possível carregar a lista de pedidos.',
        );
        this.loading.set(false); // <- e aqui em caso de erro
      },
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  onDetails(id: string): void {
    this.router.navigate(['/orders/details', id]);
  }

  onTimeline(id: string): void {
    this.router.navigate(['/orders/timeline', id]);
  }
}
