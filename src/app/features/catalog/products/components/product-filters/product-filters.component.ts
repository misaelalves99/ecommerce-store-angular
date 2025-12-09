// src/app/features/catalog/products/components/product-filters/product-filters.component.ts

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ProductStatusFilter = 'all' | 'active' | 'inactive';

@Component({
  standalone: true,
  selector: 'app-product-filters',
  imports: [CommonModule],
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.css'],
})
export class ProductFiltersComponent {
  @Input() search = '';
  @Input() status: ProductStatusFilter = 'all';

  @Output() searchChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<ProductStatusFilter>();
  @Output() createClicked = new EventEmitter<void>();

  onSearchInput(value: string): void {
    this.searchChange.emit(value);
  }

  onStatusSelect(value: string): void {
    const normalized = (value as ProductStatusFilter) ?? 'all';
    this.statusChange.emit(normalized);
  }

  onCreateClick(): void {
    this.createClicked.emit();
  }
}
