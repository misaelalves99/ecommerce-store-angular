// src/app/features/inventory/pages/stock-dashboard-page/stock-dashboard-page.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryService } from '../../../../core/services/inventory.service';
import { StockOverviewItem } from '../../../../core/models/stock.model';
import { PageHeaderComponent } from '../../../../layout/page-header/page-header.component';
import { MetricCardComponent } from '../../../../shared/components/layout/metric-card/metric-card.component';
import { StockTableComponent } from '../../components/stock-table/stock-table.component';
import { SearchInputComponent } from '../../../../shared/components/ui/search-input/search-input.component';
import { PaginationComponent } from '../../../../shared/components/ui/pagination/pagination.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';

@Component({
  standalone: true,
  selector: 'app-stock-dashboard-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    MetricCardComponent,
    StockTableComponent,
    SearchInputComponent,
    PaginationComponent,
    EmptyStateComponent,
  ],
  templateUrl: './stock-dashboard-page.component.html',
  styleUrls: ['./stock-dashboard-page.component.css'],
})
export class StockDashboardPageComponent {
  private readonly inventoryService = inject(InventoryService);

  readonly loading = signal<boolean>(true);
  readonly query = signal<string>('');
  readonly page = signal<number>(1);
  readonly pageSize = 10;

  readonly items = signal<StockOverviewItem[]>([]);

  // ===== Filtro e paginação =====

  readonly filteredItems = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.items();

    return this.items().filter((item) => {
      const name = item.productName?.toLowerCase() ?? '';
      const sku = item.sku?.toLowerCase() ?? '';
      const brand = item.brandName?.toLowerCase() ?? '';
      const category = item.categoryName?.toLowerCase() ?? '';
      return (
        name.includes(q) ||
        sku.includes(q) ||
        brand.includes(q) ||
        category.includes(q)
      );
    });
  });

  readonly paginatedItems = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredItems().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredItems().length / this.pageSize)),
  );

  // ===== Métricas numéricas =====

  readonly totalSkus = computed(() => this.items().length);

  readonly totalQuantity = computed(() =>
    this.items().reduce((acc, s) => acc + (s.quantity ?? 0), 0),
  );

  readonly lowStockCount = computed(
    () => this.items().filter((s) => s.isLowStock).length,
  );

  readonly outOfStockCount = computed(
    () => this.items().filter((s) => (s.quantity ?? 0) <= 0).length,
  );

  // ===== Métricas formatadas para o MetricCard (sempre string) =====

  readonly totalSkusDisplay = computed(() =>
    this.totalSkus().toLocaleString('pt-BR'),
  );

  readonly totalQuantityDisplay = computed(() =>
    this.totalQuantity().toLocaleString('pt-BR'),
  );

  readonly lowStockCountDisplay = computed(() =>
    this.lowStockCount().toLocaleString('pt-BR'),
  );

  readonly outOfStockCountDisplay = computed(() =>
    this.outOfStockCount().toLocaleString('pt-BR'),
  );

  constructor() {
    this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.inventoryService.getCurrentStock();
      this.items.set(data);
    } finally {
      this.loading.set(false);
    }
  }

  onSearchChange(value: string): void {
    this.query.set(value);
    this.page.set(1);
  }

  onPageChange(page: number): void {
    this.page.set(page);
  }
}
