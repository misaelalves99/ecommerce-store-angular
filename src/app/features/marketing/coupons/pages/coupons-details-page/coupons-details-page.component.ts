// src/app/features/marketing/coupons/pages/coupons-details-page/coupons-details-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CouponService } from '../../../../../core/services/coupon.service';
import { Coupon } from '../../../../../core/models/coupon.model';
import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

type CouponWithMeta = Partial<Coupon> & {
  id?: string | number;
  name?: string;
  typeLabel?: string;
  displayValue?: string;
};

@Component({
  standalone: true,
  selector: 'app-coupons-details-page',
  imports: [CommonModule, PageHeaderComponent, ButtonComponent],
  templateUrl: './coupons-details-page.component.html',
  styleUrls: ['./coupons-details-page.component.css'],
})
export class CouponsDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly couponService = inject(CouponService);

  readonly loading = signal(true);
  readonly coupon = signal<CouponWithMeta | null>(null);

  constructor() {
    this.loadCoupon();
  }

  private buildTypeLabel(coupon: any): string {
    const rawType = (
      coupon.type ?? coupon.discountType ?? coupon.kind ?? ''
    )
      .toString()
      .toLowerCase();

    if (rawType === 'percent' || rawType === 'percentage') return 'Percentual';
    if (
      rawType === 'fixed' ||
      rawType === 'fixed_value' ||
      rawType === 'fixed_amount' ||
      rawType === 'value' ||
      rawType === 'amount'
    ) {
      return 'Valor fixo';
    }
    if (rawType === 'freight' || rawType === 'shipping') return 'Frete';

    return 'Outro';
  }

  private buildDisplayValue(coupon: any): string {
    const rawType = (
      coupon.type ?? coupon.discountType ?? coupon.kind ?? ''
    )
      .toString()
      .toLowerCase();
    const rawValue = Number(coupon.value ?? coupon.amount ?? 0);

    if (Number.isNaN(rawValue) || !rawValue) return '—';

    if (rawType === 'percent' || rawType === 'percentage') {
      return `${rawValue}%`;
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(rawValue);
  }

  private async loadCoupon(): Promise<void> {
    this.loading.set(true);
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        this.router.navigate(['/marketing/coupons']);
        return;
      }

      const rawList = await this.couponService.getAll();
      const list = rawList as any[];

      const found = (list || []).find((c) => {
        const anyC = c as any;
        const cid = anyC.id ?? anyC.code;
        return String(cid) === String(id);
      });

      if (!found) {
        this.router.navigate(['/marketing/coupons']);
        return;
      }

      const enriched: CouponWithMeta = {
        ...(found as Coupon),
        id: (found as any).id ?? (found as any).code,
        name: (found as any).name ?? (found as any).code,
        typeLabel: this.buildTypeLabel(found),
        displayValue: this.buildDisplayValue(found),
      };

      this.coupon.set(enriched);
    } finally {
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/marketing/coupons']);
  }

  goToEdit(): void {
    const c = this.coupon();
    if (!c) return;
    const id = (c as any).id ?? (c as any).code;
    this.router.navigate(['/marketing/coupons/edit', id]);
  }

  // ===== Helpers usados no template (para evitar "??" lá) =====

  isInactive(): boolean {
    const c = this.coupon();
    if (!c) return false;
    const anyC = c as any;
    return anyC.active === false || anyC.isActive === false;
  }

  getMinOrderValue(): number {
    const c = this.coupon();
    if (!c) return 0;
    const anyC = c as any;

    let value =
      anyC.minOrderValue != null
        ? anyC.minOrderValue
        : anyC.minOrderAmount != null
        ? anyC.minOrderAmount
        : anyC.minAmount != null
        ? anyC.minAmount
        : 0;

    value = Number(value);
    return Number.isNaN(value) ? 0 : value;
  }

  getUsageLimit(): string | number {
    const c = this.coupon();
    if (!c) return 'Ilimitado';
    const anyC = c as any;

    const value =
      anyC.maxUses != null ? anyC.maxUses : anyC.usageLimit;

    if (value == null || value === 0) {
      return 'Ilimitado';
    }

    return value;
  }
}
