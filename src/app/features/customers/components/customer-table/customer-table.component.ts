// src/app/features/customers/components/customer-table/customer-table.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Customer } from '../../../../core/models/customer.model';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';

@Component({
  standalone: true,
  selector: 'app-customer-table',
  imports: [CommonModule, ButtonComponent, BadgeComponent],
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.css'],
})
export class CustomerTableComponent {
  @Input() customers: Customer[] = [];
  @Input() loading = false;

  @Output() detailsClicked = new EventEmitter<string | number>();
  @Output() editClicked = new EventEmitter<string | number>();
  @Output() deleteClicked = new EventEmitter<string | number>();

  // ===== Helpers reaproveitando a lógica da page =====
  getCustomerName(c: Customer | null): string {
    if (!c) return '';
    const anyC = c as any;

    if (anyC.name) return anyC.name;
    if (anyC.fullName) return anyC.fullName;

    const first = anyC.firstName ?? '';
    const last = anyC.lastName ?? '';
    const combined = `${first} ${last}`.trim();

    return combined || String(anyC.id ?? '');
  }

  getCustomerEmail(c: Customer | null): string {
    if (!c) return '';
    const anyC = c as any;
    return anyC.email ?? '';
  }

  getCustomerDocument(c: Customer | null): string {
    if (!c) return '';
    const anyC = c as any;
    return anyC.document ?? '';
  }

  isCustomerActive(c: Customer | null): boolean {
    if (!c) return false;
    const anyC = c as any;
    return !!anyC.isActive;
  }

  // ===== Emissores de eventos =====
  onDetails(id: string | number | null | undefined): void {
    if (id == null) return;
    this.detailsClicked.emit(id);
  }

  onEdit(id: string | number | null | undefined): void {
    if (id == null) return;
    this.editClicked.emit(id);
  }

  onDelete(id: string | number | null | undefined): void {
    if (id == null) return;
    this.deleteClicked.emit(id);
  }
}
