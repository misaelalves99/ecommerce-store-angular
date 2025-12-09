// src/app/features/marketing/coupons/components/coupon-table/coupon-table.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Coupon } from '../../../../../core/models/coupon.model';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

type CouponWithMeta = Partial<Coupon> & {
  id?: string | number;
  name?: string;
  typeLabel?: string;
  displayValue?: string;
  active?: boolean;
  isActive?: boolean;
};

@Component({
  standalone: true,
  selector: 'app-coupon-table',
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './coupon-table.component.html',
  styleUrls: ['./coupon-table.component.css'],
})
export class CouponTableComponent {
  @Input() coupons: CouponWithMeta[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'Nenhum cupom encontrado.';

  trackById(index: number, item: CouponWithMeta): string {
    const id =
      item.id != null
        ? item.id
        : item.code != null
        ? item.code
        : index;

    return String(id);
  }

  getRouteId(item: CouponWithMeta, index: number): string {
    const id =
      item.id != null
        ? item.id
        : item.code != null
        ? item.code
        : index;

    return String(id);
  }

  isInactive(item: CouponWithMeta): boolean {
    if (item.active === false) {
      return true;
    }

    if (item.isActive === false) {
      return true;
    }

    return false;
  }
}
