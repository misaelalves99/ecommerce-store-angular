// src/app/core/tokens/dashboard-metrics.token.ts

import { OrderStatus } from '../enums/order-status.enum';

/**
 * Métricas de resumo exibidas nos cards do dashboard.
 */
export interface DashboardSummaryMetric {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
  trend?: 'up' | 'down' | 'flat';
  trendPercentage?: number; // ex.: 12.5 = +12,5%
}

/**
 * Produtos mais vendidos / com maior faturamento.
 */
export interface DashboardTopProduct {
  productId: string;
  name: string;
  totalSold: number;
  revenue: number;
}

/**
 * Pedidos recentes para listagem no dashboard.
 */
export interface DashboardRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  createdAt: string; // ISO
}

/**
 * Payload completo de métricas do dashboard.
 */
export interface DashboardMetricsToken {
  summary: DashboardSummaryMetric[];
  monthlyRevenueLabels: string[];   // ex.: ['Jan', 'Fev', 'Mar', ...]
  monthlyRevenueSeries: number[];   // [1000, 2000, 1500, ...]
  topProducts: DashboardTopProduct[];
  recentOrders: DashboardRecentOrder[];
}

/**
 * Alias usado nos components para tipar cada card de métrica.
 * (os cards exibem as métricas de `summary`).
 */
export type DashboardMetric = DashboardSummaryMetric;

export const DASHBOARD_METRICS_DEFAULT: DashboardMetricsToken = {
  summary: [
    {
      key: 'totalRevenue',
      label: 'Faturamento Total',
      value: 0,
      formattedValue: 'R$ 0,00',
      trend: 'flat',
      trendPercentage: 0,
    },
    {
      key: 'totalOrders',
      label: 'Pedidos',
      value: 0,
      formattedValue: '0',
      trend: 'flat',
      trendPercentage: 0,
    },
    {
      key: 'totalCustomers',
      label: 'Clientes Ativos',
      value: 0,
      formattedValue: '0',
      trend: 'flat',
      trendPercentage: 0,
    },
    {
      key: 'totalProducts',
      label: 'Produtos Cadastrados',
      value: 0,
      formattedValue: '0',
      trend: 'flat',
      trendPercentage: 0,
    },
  ],
  monthlyRevenueLabels: [],
  monthlyRevenueSeries: [],
  topProducts: [],
  recentOrders: [],
};
