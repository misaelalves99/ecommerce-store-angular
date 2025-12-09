// src/app/features/orders/pages/orders-details-page/orders-details-page.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeaderComponent } from '../../../../layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { OrderItemsTableComponent } from '../../components/order-items-table/order-items-table.component';
import { OrderStatusBadgeComponent } from '../../components/order-status-badge/order-status-badge.component';

@Component({
  standalone: true,
  selector: 'app-orders-details-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    ButtonComponent,
    BadgeComponent,
    OrderItemsTableComponent,
    OrderStatusBadgeComponent,
  ],
  templateUrl: './orders-details-page.component.html',
  styleUrls: ['./orders-details-page.component.css'],
})
export class OrdersDetailsPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Em um cenário real você pode trocar `any` pelo tipo Order do seu domínio
  readonly loading = signal(false);
  readonly order = signal<any | null>(null);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    // Aqui você pode plugar seu serviço de pedidos.
    // Exemplo (ajustar para seu OrderService):
    //
    // const id = this.route.snapshot.paramMap.get('id');
    // if (!id) {
    //   this.errorMessage.set('Pedido não encontrado.');
    //   return;
    // }
    //
    // this.loading.set(true);
    // this.orderService.getById(id).subscribe({
    //   next: (o) => {
    //     this.order.set(o);
    //     this.loading.set(false);
    //   },
    //   error: () => {
    //     this.errorMessage.set('Não foi possível carregar o pedido.');
    //     this.loading.set(false);
    //   },
    // });
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  goTimeline(): void {
    // Usa o id da rota ou do próprio pedido (se você popular isso depois)
    const current = this.order();
    const idFromOrder = current?.id ?? current?.code;
    const idFromRoute = this.route.snapshot.paramMap.get('id');

    const id = idFromOrder ?? idFromRoute;
    if (!id) return;

    this.router.navigate(['/orders/timeline', id]);
  }
}
