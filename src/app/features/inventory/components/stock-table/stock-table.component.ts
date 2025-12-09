// src/app/features/inventory/components/stock-table/stock-table.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockOverviewItem } from '../../../../core/models/stock.model';
import { TableComponent } from '../../../../shared/components/ui/table/table.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';

@Component({
  standalone: true,
  selector: 'app-stock-table',
  imports: [CommonModule, TableComponent, BadgeComponent],
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.css'],
})
export class StockTableComponent {
  @Input() items: StockOverviewItem[] = [];

  trackById(_index: number, item: StockOverviewItem): string {
    return item.id ?? item.sku ?? String(_index);
  }

  // ===== Helpers “flexíveis” para campos opcionais/legados =====

  getVariantName(item: StockOverviewItem): string {
    const anyItem = item as any;
    return anyItem.variantName ?? '';
  }

  getReorderPoint(item: StockOverviewItem): string | number {
    const anyItem = item as any;
    const value = anyItem.reorderPoint;
    return value ?? '-';
  }

  getStatusVariant(
    item: StockOverviewItem,
  ): 'success' | 'warning' | 'danger' | 'neutral' {
    const qty = item.quantity ?? 0;
    if (qty <= 0) return 'danger';
    if (item.isLowStock) return 'warning';
    return 'success';
  }

  getStatusLabel(item: StockOverviewItem): string {
    const qty = item.quantity ?? 0;
    if (qty <= 0) return 'Esgotado';
    if (item.isLowStock) return 'Baixo estoque';
    return 'Saudável';
  }
}
