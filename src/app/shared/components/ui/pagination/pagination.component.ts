// src/app/shared/components/ui/pagination/pagination.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;
  @Input() pageSizeOptions: number[] = [10, 20, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get totalPages(): number {
    if (this.totalItems === 0) return 1;
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get canPrev(): boolean {
    return this.page > 1;
  }

  get canNext(): boolean {
    return this.page < this.totalPages;
  }

  get rangeLabel(): string {
    if (!this.totalItems) return '0 de 0';

    const start = (this.page - 1) * this.pageSize + 1;
    const end = Math.min(this.page * this.pageSize, this.totalItems);
    return `${start}–${end} de ${this.totalItems}`;
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.page) return;
    this.pageChange.emit(page);
  }

  onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(value);
  }
}
