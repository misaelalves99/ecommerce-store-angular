// src/app/features/customers/components/customer-form/customer-form.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { Customer } from '../../../../core/models/customer.model';
import { CustomerService } from '../../../../core/services/customer.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-customer-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
})
export class CustomerFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() customerId: string | null = null;

  @Output() saved = new EventEmitter<Customer>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly customerService: CustomerService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
  ) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.customerId) {
      this.loadCustomer();
    }
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      document: ['', Validators.required],
      isActive: [true],
    });
  }

  private loadCustomer(): void {
    if (!this.customerId) return;

    this.loading = true;

    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (response: any) => {
        const customer: any = response?.data ?? response;

        const nameFromModel =
          customer.name ??
          customer.fullName ??
          [customer.firstName, customer.lastName].filter(Boolean).join(' ');

        this.form.patchValue({
          name: nameFromModel ?? '',
          email: customer.email ?? '',
          phone: customer.phone ?? '',
          document: customer.document ?? '',
          isActive: customer.isActive ?? true,
        });
      },
      error: () => {
        this.notificationService.error(
          'Não foi possível carregar os dados do cliente.',
        );
        this.router.navigate(['/customers']);
      },
      complete: () => (this.loading = false),
    });
  }

  // ===== Helpers usados no template =====

  title(): string {
    return this.mode === 'create' ? 'Novo cliente' : 'Editar cliente';
  }

  get nameControl() {
    return this.form.get('name')!;
  }

  get emailControl() {
    return this.form.get('email')!;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const value = this.form.value;

    try {
      let response: any;

      if (this.mode === 'create') {
        response = await firstValueFrom(
          this.customerService.createCustomer(value as any),
        );
      } else if (this.customerId) {
        response = await firstValueFrom(
          this.customerService.updateCustomer(
            this.customerId,
            value as any,
          ),
        );
      }

      const customer = (response?.data ?? response) as Customer;

      this.notificationService.success(
        this.mode === 'create'
          ? 'Cliente criado com sucesso.'
          : 'Cliente atualizado com sucesso.',
      );

      this.saved.emit(customer);
      this.router.navigate(['/customers']);
    } catch {
      this.notificationService.error(
        this.mode === 'create'
          ? 'Não foi possível criar o cliente.'
          : 'Não foi possível atualizar o cliente.',
      );
    } finally {
      this.loading = false;
    }
  }

  onCancel(): void {
    this.cancelled.emit();
    this.router.navigate(['/customers']);
  }

  hasError(control: string, error: string): boolean {
    const c = this.form.get(control);
    return !!c && c.touched && c.hasError(error);
  }
}
