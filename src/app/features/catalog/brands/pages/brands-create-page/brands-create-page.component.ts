// src/app/features/catalog/brands/pages/brands-create-page/brands-create-page.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { BrandFormComponent } from '../../components/brand-form/brand-form.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-brands-create-page',
  imports: [CommonModule, PageHeaderComponent, BrandFormComponent, ButtonComponent],
  templateUrl: './brands-create-page.component.html',
  styleUrls: ['./brands-create-page.component.css'],
})
export class BrandsCreatePageComponent {
  private readonly router = inject(Router);

  goBack(): void {
    this.router.navigate(['/catalog/brands']);
  }
}
