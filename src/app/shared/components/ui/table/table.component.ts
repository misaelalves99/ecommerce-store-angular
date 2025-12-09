// src/app/shared/components/ui/table/table.component.ts
import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

@Component({
  standalone: true,
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() rows: any[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'Nenhum registro encontrado.';
  @Input() rowTemplate?: TemplateRef<any>;
}
