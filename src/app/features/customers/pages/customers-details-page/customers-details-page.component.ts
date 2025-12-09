// src/app/features/customers/pages/customers-details-page/customers-details-page.component.ts
import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Customer } from '../../../../core/models/customer.model';
import { Address } from '../../../../core/models/address.model';
import { CustomerService } from '../../../../core/services/customer.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { PageHeaderComponent } from '../../../../layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CustomerAddressListComponent } from '../../components/customer-address-list/customer-address-list.component';

@Component({
  standalone: true,
  selector: 'app-customers-details-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    ButtonComponent,
    CustomerAddressListComponent,
  ],
  templateUrl: './customers-details-page.component.html',
  styleUrls: ['./customers-details-page.component.css'],
})
export class CustomersDetailsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);
  private readonly notificationService = inject(NotificationService);

  readonly loading = signal(true);
  readonly customer = signal<Customer | null>(null);

  readonly customerId = computed(
    () => this.route.snapshot.paramMap.get('id') ?? '',
  );

  ngOnInit(): void {
    this.loadCustomer();
  }

  private loadCustomer(): void {
    const id = this.customerId();
    if (!id) {
      this.router.navigate(['/customers']);
      return;
    }

    this.loading.set(true);

    this.customerService.getCustomerById(id).subscribe({
      next: (response: any) => {
        // Aceita ApiResponse<Customer> ou Customer direto
        const data = (response?.data ?? response) as Customer | null;
        this.customer.set(data);
      },
      error: () => {
        this.notificationService.error(
          'Não foi possível carregar os detalhes do cliente.',
        );
        this.router.navigate(['/customers']);
      },
      complete: () => this.loading.set(false),
    });
  }

  // ===== Navegação =====

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  goToEdit(): void {
    const id = this.customerId();
    if (!id) {
      this.router.navigate(['/customers']);
      return;
    }

    this.router.navigate(['/customers/edit', id]);
  }

  // ===== Helpers de exibição =====

  private getAny(): any | null {
    const c = this.customer();
    return c as any | null;
  }

  getCustomerName(): string {
    const anyC = this.getAny();
    if (!anyC) return '';

    if (anyC.name) return anyC.name;
    if (anyC.fullName) return anyC.fullName;

    const first = anyC.firstName ?? '';
    const last = anyC.lastName ?? '';
    const combined = `${first} ${last}`.trim();

    return combined || anyC.id || '';
  }

  getCustomerEmail(): string {
    const anyC = this.getAny();
    if (!anyC) return '';
    return anyC.email ?? '';
  }

  getCustomerDocument(): string {
    const anyC = this.getAny();
    if (!anyC) return '';
    return anyC.document ?? '';
  }

  getCustomerPhone(): string {
    const anyC = this.getAny();
    if (!anyC) return '';
    return anyC.phone ?? '';
  }

  isCustomerActive(): boolean {
    const anyC = this.getAny();
    if (!anyC) return false;
    return !!anyC.isActive;
  }

  getCustomerAddresses(): Address[] {
    const anyC = this.getAny();
    if (!anyC) return [];
    return (anyC.addresses ?? []) as Address[];
  }
}
