import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeaderComponent } from '../../../../layout/page-header/page-header.component';
import { CustomerFormComponent } from '../../components/customer-form/customer-form.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-customers-edit-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    CustomerFormComponent,
    ButtonComponent,
  ],
  templateUrl: './customers-edit-page.component.html',
  styleUrls: ['./customers-edit-page.component.css'],
})
export class CustomersEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly customerId = computed(
    () => this.route.snapshot.paramMap.get('id') ?? null,
  );

  goBack(): void {
    this.router.navigate(['/customers']);
  }
}
