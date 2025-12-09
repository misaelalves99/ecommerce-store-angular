// src/app/features/dashboard/pages/dashboard-page/dashboard-page.component.ts

import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeaderComponent } from '../../../../layout/page-header/page-header.component';
import { MetricCardComponent } from '../../../../shared/components/layout/metric-card/metric-card.component';
import {
  TableComponent,
  TableColumn,
} from '../../../../shared/components/ui/table/table.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
// import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

type MetricTrend = 'up' | 'down' | 'neutral';

interface DashboardSummaryMetric {
  label: string;
  value: string;
  helper?: string;
  trend?: MetricTrend;
  trendLabel?: string;
  icon?: string;
}

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';

interface DashboardOrder {
  id: string;
  code?: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  createdAt: string | Date;
}

interface DashboardTopProduct {
  id: string;
  name: string;
  sku: string;
  totalSold: number;
  revenue: number;
}

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [
    CommonModule,
    RouterLink,
    PageHeaderComponent,
    MetricCardComponent,
    TableComponent,
    BadgeComponent,
    // ButtonComponent removido daqui também
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
})
export class DashboardPageComponent {
  readonly loading = signal(false);

  readonly summaryMetrics = signal<DashboardSummaryMetric[]>([
    {
      label: 'Faturamento hoje',
      value: 'R$ 12.340',
      helper: 'vs ontem',
      trend: 'up',
      trendLabel: '+18%',
      icon: '💰',
    },
    {
      label: 'Pedidos hoje',
      value: '87',
      helper: 'nas últimas 24h',
      trend: 'neutral',
      trendLabel: 'estável',
      icon: '🛒',
    },
    {
      label: 'Ticket médio',
      value: 'R$ 142,00',
      helper: 'por pedido',
      trend: 'down',
      trendLabel: '-5%',
      icon: '📊',
    },
    {
      label: 'Novos clientes',
      value: '23',
      helper: 'no período',
      trend: 'up',
      trendLabel: '+12%',
      icon: '👤',
    },
  ]);

  readonly latestOrdersColumns: TableColumn[] = [
    { key: 'code', label: 'Pedido', width: '120px' },
    { key: 'customerName', label: 'Cliente' },
    { key: 'total', label: 'Total', align: 'right', width: '140px' },
    { key: 'status', label: 'Status', align: 'center', width: '140px' },
    { key: 'createdAt', label: 'Data', width: '180px' },
  ];

  readonly latestOrders = signal<DashboardOrder[]>([
    {
      id: '1',
      code: '1001',
      customerName: 'Maria Silva',
      total: 259.9,
      status: 'paid',
      createdAt: new Date(),
    },
    {
      id: '2',
      code: '1002',
      customerName: 'João Santos',
      total: 129.5,
      status: 'pending',
      createdAt: new Date(),
    },
    {
      id: '3',
      code: '1003',
      customerName: 'Ana Paula',
      total: 899.0,
      status: 'shipped',
      createdAt: new Date(),
    },
  ]);

  readonly topProductsColumns: TableColumn[] = [
    { key: 'name', label: 'Produto' },
    { key: 'sku', label: 'SKU', width: '120px' },
    { key: 'totalSold', label: 'Unidades', align: 'right', width: '120px' },
    { key: 'revenue', label: 'Faturamento', align: 'right', width: '160px' },
  ];

  readonly topProducts = signal<DashboardTopProduct[]>([
    {
      id: 'p1',
      name: 'Fone Bluetooth Pro',
      sku: 'FONE-PRO-01',
      totalSold: 143,
      revenue: 21450.9,
    },
    {
      id: 'p2',
      name: 'Smartphone XPlus',
      sku: 'PHONE-XP-64',
      totalSold: 67,
      revenue: 80599.0,
    },
    {
      id: 'p3',
      name: 'Notebook Ultra',
      sku: 'NB-ULTRA-15',
      totalSold: 21,
      revenue: 98700.0,
    },
  ]);

  trackByOrderId(_index: number, row: DashboardOrder): string {
    return row.id;
  }

  trackByProductId(_index: number, row: DashboardTopProduct): string {
    return row.id;
  }

  getOrderBadgeVariant(
    status: OrderStatus,
  ): 'neutral' | 'success' | 'warning' | 'danger' {
    switch (status) {
      case 'paid':
        return 'success';
      case 'shipped':
        return 'neutral';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'neutral';
    }
  }

  getOrderStatusLabel(status: OrderStatus): string {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'shipped':
        return 'Enviado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  }
}
