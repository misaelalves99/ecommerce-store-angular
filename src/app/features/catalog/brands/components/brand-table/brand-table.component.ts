// src/app/features/catalog/brands/components/brand-table/brand-table.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Brand } from '../../../../../core/models/brand.model';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-brand-table',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './brand-table.component.html',
  styleUrls: ['./brand-table.component.css'],
})
export class BrandTableComponent {
  @Input() brands: Brand[] = [];
  @Input() loading = false;

  @Output() details = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  trackById(_index: number, brand: Brand): string {
    return brand.id;
  }

  onDetails(id: string | null | undefined): void {
    if (!id) return;
    this.details.emit(id);
  }

  onEdit(id: string | null | undefined): void {
    if (!id) return;
    this.edit.emit(id);
  }

  onDelete(id: string | null | undefined): void {
    if (!id) return;
    this.delete.emit(id);
  }
}
