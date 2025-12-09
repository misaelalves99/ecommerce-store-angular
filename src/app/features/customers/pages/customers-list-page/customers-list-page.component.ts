// src/app/features/customers/pages/customers-list-page/customers-list-page.component.ts
import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Customer } from '../../../../core/models/customer.model';
import { CustomerService } from '../../../../core/services/customer.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { PageHeaderComponent } from '../../../../layout/page-header/page-header.component';
import { SearchInputComponent } from '../../../../shared/components/ui/search-input/search-input.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CustomerTableComponent } from '../../components/customer-table/customer-table.component';

@Component({
  standalone: true,
  selector: 'app-customers-list-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    SearchInputComponent,
    ButtonComponent,
    CustomerTableComponent,
  ],
  templateUrl: './customers-list-page.component.html',
  styleUrls: ['./customers-list-page.component.css'],
})
export class CustomersListPageComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly searchTerm = signal('');
  readonly customers = signal<Customer[]>([]);

  readonly filteredCustomers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.customers();

    return this.customers().filter((customer) => {
      const anyC = customer as any;

      const nameFromParts = `${anyC.firstName ?? ''} ${anyC.lastName ?? ''}`.trim();

      const rawName =
        anyC.name ??
        anyC.fullName ??
        (nameFromParts || String(anyC.id ?? ''));

      const name = String(rawName).toLowerCase();
      const email = String(anyC.email ?? '').toLowerCase();
      const document = String(anyC.document ?? '').toLowerCase();

      return (
        name.includes(term) ||
        email.includes(term) ||
        document.includes(term)
      );
    });
  });

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading.set(true);

    this.customerService.getCustomers().subscribe({
      next: (response: any) => {
        const data = response?.data ?? response;
        const items = Array.isArray(data)
          ? data
          : (data?.items as Customer[] | undefined) ?? [];

        this.customers.set(items);
      },
      error: () => {
        this.notificationService.error(
          'Não foi possível carregar a lista de clientes.',
        );
      },
      complete: () => this.loading.set(false),
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  create(): void {
    this.router.navigate(['/customers/create']);
  }

  details(id: string | number): void {
    this.router.navigate(['/customers/details', id]);
  }

  edit(id: string | number): void {
    this.router.navigate(['/customers/edit', id]);
  }

  /** Aqui garantimos a rota correta para a página de delete */
  delete(id: string | number): void {
    this.router.navigate(['/customers/delete', id]);
  }
}
