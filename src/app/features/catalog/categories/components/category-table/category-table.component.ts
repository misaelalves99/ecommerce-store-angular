// src/app/features/catalog/categories/components/category-table/category-table.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  TableComponent,
  TableColumn,
} from '../../../../../shared/components/ui/table/table.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';
import { Category } from '../../../../../core/models/category.model';

@Component({
  standalone: true,
  selector: 'app-category-table',
  imports: [CommonModule, RouterLink, TableComponent, ButtonComponent],
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.css'],
})
export class CategoryTableComponent {
  @Input() categories: Category[] = [];

  /** Exclusão */
  @Output() deleteClicked = new EventEmitter<string>();

  /** Detalhes (nome novo para evitar conflito com evento nativo) */
  @Output() detailsClicked = new EventEmitter<string | number>();

  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Categoria' },
    { key: 'slug', label: 'Slug', width: '180px' },
    { key: 'description', label: 'Descrição' },
    {
      key: 'actions',
      label: 'Ações',
      align: 'right',
      width: '240px',
    },
  ];

  get rows(): Record<string, unknown>[] {
    return this.categories as unknown as Record<string, unknown>[];
  }

  onDelete(id: string | number | null | undefined): void {
    if (id === null || id === undefined) return;
    this.deleteClicked.emit(String(id));
  }

  onDetailsClicked(id: string | number | null | undefined): void {
    if (id === null || id === undefined) return;
    this.detailsClicked.emit(id);
  }
}
