// src/app/features/catalog/brands/pages/brands-edit-page/brands-edit-page.component.ts
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { BrandFormComponent } from '../../components/brand-form/brand-form.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-brands-edit-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    BrandFormComponent,
    ButtonComponent,
  ],
  templateUrl: './brands-edit-page.component.html',
  styleUrls: ['./brands-edit-page.component.css'],
})
export class BrandsEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly brandId = computed(
    () => this.route.snapshot.paramMap.get('id') ?? null,
  );

  goBack(): void {
    this.router.navigate(['/catalog/brands']);
  }
}
