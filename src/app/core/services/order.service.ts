// src/app/core/services/order.service.ts
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Order } from '../models/order.model';
import { FilterParams } from '../interfaces/filter.interface';
import { OrderStatus } from '../enums/order-status.enum';
import { ApiResponse } from '../interfaces/api-response.interface';
import { ORDERS_MOCK } from '../../testing/mocks/orders.mock';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // Mantém os pedidos em memória usando os mocks
  private readonly ordersSubject = new BehaviorSubject<Order[]>(
    [...ORDERS_MOCK] as unknown as Order[],
  );

  /**
   * Lista pedidos com filtros simples (status, customerId, code, search).
   * Mantém assinatura: Observable<ApiResponse<Order[]>>.
   */
  getOrders(filters?: FilterParams): Observable<ApiResponse<Order[]>> {
    return this.ordersSubject.asObservable().pipe(
      map((all) => {
        const { status, customerId, code, paymentStatus, search } =
          (filters || {}) as any;

        let filtered = [...all];

        if (status) {
          filtered = filtered.filter(
            (o) => (o as any).status === status,
          );
        }

        if (paymentStatus) {
          filtered = filtered.filter(
            (o) => (o as any).paymentStatus === paymentStatus,
          );
        }

        if (customerId) {
          filtered = filtered.filter(
            (o) => (o as any).customerId === customerId,
          );
        }

        if (code) {
          filtered = filtered.filter(
            (o) => (o as any).code === code,
          );
        }

        if (search) {
          const term = String(search).toLowerCase().trim();
          filtered = filtered.filter((o) => {
            const c = o as any;
            return (
              c.code?.toLowerCase().includes(term) ||
              c.customerId?.toLowerCase().includes(term)
            );
          });
        }

        return {
          data: filtered,
          success: true,
        } as ApiResponse<Order[]>;
      }),
    );
  }

  /**
   * Busca pedido por id.
   * Mantém assinatura: Observable<ApiResponse<Order>>.
   */
  getOrderById(id: string): Observable<ApiResponse<Order>> {
    const current = this.ordersSubject.value;
    const found =
      current.find((o) => String((o as any).id) === String(id)) ?? null;

    return of({
      data: found as Order | null,
      success: !!found,
    } as ApiResponse<Order>);
  }

  /**
   * Cria pedido em memória.
   */
  createOrder(order: Order): Observable<ApiResponse<Order>> {
    const current = this.ordersSubject.value;
    const now = new Date();
    const newId = this.generateId(current);

    const newOrder: Order = {
      ...(order as any),
      id: (order as any).id ?? newId,
      createdAt: (order as any).createdAt ?? now,
      updatedAt: now,
    } as Order;

    this.ordersSubject.next([...current, newOrder]);

    return of({
      data: newOrder,
      success: true,
    } as ApiResponse<Order>);
  }

  /**
   * Atualiza pedido em memória.
   */
  updateOrder(
    id: string,
    order: Order,
  ): Observable<ApiResponse<Order>> {
    const current = this.ordersSubject.value;
    const now = new Date();
    let updatedOrder: Order | null = null;

    const updatedList = current.map((o) => {
      const currentId = String((o as any).id);
      if (currentId === String(id)) {
        updatedOrder = {
          ...(o as any),
          ...(order as any),
          id,
          updatedAt: now,
        } as Order;
        return updatedOrder;
      }
      return o;
    });

    if (!updatedOrder) {
      return of({
        data: null as any,
        success: false,
      } as ApiResponse<Order>);
    }

    this.ordersSubject.next(updatedList);

    return of({
      data: updatedOrder,
      success: true,
    } as ApiResponse<Order>);
  }

  /**
   * Atualiza apenas o status do pedido.
   * Mantém assinatura original.
   */
  updateOrderStatus(
    id: string,
    payload: { status: OrderStatus; reason?: string },
  ): Observable<ApiResponse<Order>> {
    const current = this.ordersSubject.value;
    const now = new Date();
    let updatedOrder: Order | null = null;

    const updatedList = current.map((o) => {
      const currentId = String((o as any).id);
      if (currentId === String(id)) {
        updatedOrder = {
          ...(o as any),
          status: payload.status,
          // se quiser registrar reason em algum campo custom, pode estender aqui
          updatedAt: now,
        } as Order;
        return updatedOrder;
      }
      return o;
    });

    if (!updatedOrder) {
      return of({
        data: null as any,
        success: false,
      } as ApiResponse<Order>);
    }

    this.ordersSubject.next(updatedList);

    return of({
      data: updatedOrder,
      success: true,
    } as ApiResponse<Order>);
  }

  cancelOrder(
    id: string,
    reason?: string,
  ): Observable<ApiResponse<Order>> {
    return this.updateOrderStatus(id, {
      status: OrderStatus.CANCELLED,
      reason,
    });
  }

  completeOrder(id: string): Observable<ApiResponse<Order>> {
    return this.updateOrderStatus(id, {
      status: OrderStatus.DELIVERED,
    });
  }

  /**
   * Remove pedido em memória.
   */
  deleteOrder(id: string): Observable<ApiResponse<null>> {
    const current = this.ordersSubject.value;
    const filtered = current.filter(
      (o) => String((o as any).id) !== String(id),
    );

    this.ordersSubject.next(filtered);

    return of({
      data: null,
      success: true,
    } as ApiResponse<null>);
  }

  /**
   * Timeline/histórico de status do pedido.
   * Aqui devolvemos o próprio pedido (mantendo assinatura Observable<Order>).
   * Se no futuro você tiver um modelo de timeline separado, é só adaptar.
   */
  getOrderTimeline(id: string): Observable<Order> {
    const current = this.ordersSubject.value;
    const found =
      current.find((o) => String((o as any).id) === String(id)) ?? null;

    return of(found as Order);
  }

  /**
   * Placeholder para uso futuro no Dashboard.
   * Já funciona porque o estado está em memória no BehaviorSubject.
   */
  refreshOrders(): void {
    // força um "tick" caso queira reagatilhamento no futuro
    const current = this.ordersSubject.value;
    this.ordersSubject.next([...current]);
  }

  /**
   * Gera um id baseado no padrão existente: ord-1001, ord-1002, ...
   */
  private generateId(current: Order[]): string {
    const numericIds = current
      .map((o) => {
        const rawId = String((o as any).id ?? '');
        const match = rawId.match(/\d+/g);
        if (!match) return 0;
        return Number(match.join('')) || 0;
      })
      .filter((n) => !Number.isNaN(n));

    const next = numericIds.length ? Math.max(...numericIds) + 1 : 1001;
    return `ord-${next}`;
  }
}
