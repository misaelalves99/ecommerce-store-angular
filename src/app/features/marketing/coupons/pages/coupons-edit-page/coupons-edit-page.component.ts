import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CouponFormComponent } from '../../components/coupon-form/coupon-form.component';
import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { CouponService } from '../../../../../core/services/coupon.service';
import { Coupon } from '../../../../../core/models/coupon.model';
import { EmptyStateComponent } from '../../../../../shared/components/ui/empty-state/empty-state.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-coupons-edit-page',
  imports: [
    CommonModule,
    RouterLink,
    CouponFormComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    ButtonComponent,
  ],
  templateUrl: './coupons-edit-page.component.html',
  styleUrls: ['./coupons-edit-page.component.css'],
})
export class CouponsEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly couponService = inject(CouponService);

  readonly loading = signal<boolean>(true);
  readonly coupon = signal<Coupon | null>(null);

  constructor() {
    this.loadCoupon();
  }

  async loadCoupon(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      return;
    }

    try {
      const found = await this.couponService.getById(id);
      this.coupon.set(found);
    } finally {
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/marketing/coupons']);
  }

  onUpdated(): void {
    this.router.navigate(['/marketing/coupons']);
  }

  onCancel(): void {
    this.router.navigate(['/marketing/coupons']);
  }
}
