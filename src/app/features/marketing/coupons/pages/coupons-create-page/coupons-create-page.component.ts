// src/app/features/marketing/coupons/pages/coupons-create-page/coupons-create-page.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CouponFormComponent } from '../../components/coupon-form/coupon-form.component';
import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-coupons-create-page',
  imports: [CommonModule, CouponFormComponent, PageHeaderComponent, ButtonComponent],
  templateUrl: './coupons-create-page.component.html',
  styleUrls: ['./coupons-create-page.component.css'],
})
export class CouponsCreatePageComponent {
  private readonly router = inject(Router);

  goBack(): void {
    this.router.navigate(['/marketing/coupons']);
  }

  onCreated(): void {
    this.router.navigate(['/marketing/coupons']);
  }

  onCancel(): void {
    this.router.navigate(['/marketing/coupons']);
  }
}
