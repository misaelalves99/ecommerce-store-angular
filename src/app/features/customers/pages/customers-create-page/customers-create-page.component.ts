// src/app/features/customers/pages/customers-create-page/customers-create-page.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PageHeaderComponent } from '../../../../layout/page-header/page-header.component';
import { CustomerFormComponent } from '../../components/customer-form/customer-form.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-customers-create-page',
  imports: [CommonModule, PageHeaderComponent, CustomerFormComponent, ButtonComponent],
  templateUrl: './customers-create-page.component.html',
  styleUrls: ['./customers-create-page.component.css'],
})
export class CustomersCreatePageComponent {
  private readonly router = inject(Router);

  goBack(): void {
    this.router.navigate(['/customers']);
  }
}
