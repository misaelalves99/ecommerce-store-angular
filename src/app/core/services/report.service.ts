// src/app/core/services/report.service.ts

import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { HttpService } from './http.service';
import {
  DashboardMetric,
  DashboardMetricsToken,
  DASHBOARD_METRICS_DEFAULT,
} from '../tokens/dashboard-metrics.token';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly http = inject(HttpService);

  /**
   * Métricas do dashboard (faturamento, pedidos, clientes etc.).
   * A API devolve DashboardMetricsToken; aqui retornamos só o summary[]
   * tipado como DashboardMetric[] para alimentar os cards.
   */
  getDashboardMetrics(): Observable<DashboardMetric[]> {
    return this.http
      .get<DashboardMetricsToken>('/reports/dashboard-metrics')
      .pipe(
        map((res: ApiResponse<DashboardMetricsToken>) => {
          return res.data?.summary ?? DASHBOARD_METRICS_DEFAULT.summary;
        }),
      );
  }

  /**
   * Últimos pedidos para a tabela do dashboard.
   */
  getLatestOrders(limit = 5): Observable<Order[]> {
    return this.http
      .get<Order[]>('/reports/latest-orders', {
        params: { limit } as any,
      })
      .pipe(map((res: ApiResponse<Order[]>) => res.data ?? []));
  }

  /**
   * Hook de conveniência para o botão "Atualizar".
   * No futuro pode invalidar cache, refazer chamadas, etc.
   */
  refreshDashboard(): void {
    // No-op por enquanto. Mantido só para compatibilidade.
  }
}
