// src/app/features/customers/pages/customers-delete-page/customers-delete-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { Customer } from '../../../../core/models/customer.model';
import { CustomerService } from '../../../../core/services/customer.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { PageHeaderComponent } from '../../../../layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

type CustomerWithMeta = Partial<Customer> & {
  id?: string | number;
  name?: string;
  email?: string;
  document?: string;
  isActive?: boolean;
};

@Component({
  standalone: true,
  selector: 'app-customers-delete-page',
  imports: [CommonModule, PageHeaderComponent, ButtonComponent],
  templateUrl: './customers-delete-page.component.html',
  styleUrls: ['./customers-delete-page.component.css'],
})
export class CustomersDeletePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);
  private readonly notificationService = inject(NotificationService);

  readonly loading = signal(true);
  readonly deleting = signal(false);
  readonly customer = signal<CustomerWithMeta | null>(null);

  constructor() {
    this.loadCustomer();
  }

  private getCustomerName(raw: any): string {
    if (!raw) return '';

    if (raw.name) return raw.name;
    if (raw.fullName) return raw.fullName;

    const first = raw.firstName ?? '';
    const last = raw.lastName ?? '';
    const combined = `${first} ${last}`.trim();

    return combined || raw.id || '';
  }

  private async loadCustomer(): Promise<void> {
    this.loading.set(true);
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        this.router.navigate(['/customers']);
        return;
      }

      const response = await firstValueFrom(
        this.customerService.getCustomerById(id),
      );

      const raw: any = response?.data ?? response;

      if (!raw) {
        this.notificationService.warning?.('Cliente não encontrado.');
        this.router.navigate(['/customers']);
        return;
      }

      const enriched: CustomerWithMeta = {
        ...(raw as Customer),
        id: raw.id ?? id,
        name: this.getCustomerName(raw),
        email: raw.email ?? '',
        document: raw.document ?? '',
        isActive: raw.isActive ?? true,
      };

      this.customer.set(enriched);
    } catch (error) {
      console.error(error);
      this.notificationService.error(
        'Não foi possível carregar as informações do cliente.',
      );
      this.router.navigate(['/customers']);
    } finally {
      this.loading.set(false);
    }
  }

  async confirmDelete(): Promise<void> {
    const customer = this.customer();
    if (!customer) return;

    const id = (customer as any).id ?? customer.id;
    if (id == null) return;

    this.deleting.set(true);

    try {
      const svc: any = this.customerService;

      if (typeof svc.deleteCustomer === 'function') {
        await svc.deleteCustomer(id);
      } else if (typeof svc.delete === 'function') {
        await svc.delete(id);
      } else if (typeof svc.remove === 'function') {
        await svc.remove(id);
      } else {
        throw new Error('Método de exclusão não disponível no serviço de clientes.');
      }

      this.notificationService.success('Cliente excluído com sucesso.');
      this.router.navigate(['/customers']);
    } catch (error) {
      console.error(error);
      this.notificationService.error(
        'Não foi possível excluir o cliente. Tente novamente.',
      );
    } finally {
      this.deleting.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['/customers']);
  }
}
