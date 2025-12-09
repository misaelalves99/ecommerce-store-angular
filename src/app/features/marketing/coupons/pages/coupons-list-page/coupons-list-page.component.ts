// src/app/features/marketing/coupons/pages/coupons-list-page/coupons-list-page.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CouponService } from '../../../../../core/services/coupon.service';
import { Coupon } from '../../../../../core/models/coupon.model';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { SearchInputComponent } from '../../../../../shared/components/ui/search-input/search-input.component';
import { PaginationComponent } from '../../../../../shared/components/ui/pagination/pagination.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';
import { EmptyStateComponent } from '../../../../../shared/components/ui/empty-state/empty-state.component';
import { CouponTableComponent } from '../../components/coupon-table/coupon-table.component';

type CouponWithMeta = Coupon & {
  id?: string | number;
  name?: string;
  typeLabel?: string;
  displayValue?: string;
};

@Component({
  standalone: true,
  selector: 'app-coupons-list-page',
  imports: [
    CommonModule,
    RouterLink,
    PageHeaderComponent,
    SearchInputComponent,
    PaginationComponent,
    ButtonComponent,
    EmptyStateComponent,
    CouponTableComponent,
  ],
  templateUrl: './coupons-list-page.component.html',
  styleUrls: ['./coupons-list-page.component.css'],
})
export class CouponsListPageComponent {
  private readonly couponService = inject(CouponService);

  readonly loading = signal<boolean>(true);
  readonly query = signal<string>('');
  readonly page = signal<number>(1);
  readonly pageSize = 10;

  readonly coupons = signal<CouponWithMeta[]>([]);

  readonly filteredCoupons = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.coupons();

    return this.coupons().filter((c) => {
      const code = (c.code ?? '').toLowerCase();
      const name = (c.name ?? '').toLowerCase();
      const description = (c.description ?? '').toLowerCase();

      return code.includes(q) || name.includes(q) || description.includes(q);
    });
  });

  readonly paginatedCoupons = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredCoupons().slice(start, start + this.pageSize);
  });

  constructor() {
    this.loadCoupons();
  }

  /** Mapeia tipo (discountType/type/kind) para label amigável */
  private buildTypeLabel(coupon: CouponWithMeta): string {
    const anyCoupon = coupon as any;

    const rawType = (
      anyCoupon.type ??
      anyCoupon.discountType ??
      anyCoupon.kind ??
      ''
    )
      .toString()
      .toLowerCase();

    if (rawType === 'percent' || rawType === 'percentage') {
      return 'Percentual';
    }

    if (
      rawType === 'fixed' ||
      rawType === 'fixed_value' ||
      rawType === 'fixed_amount' ||
      rawType === 'value' ||
      rawType === 'amount'
    ) {
      return 'Valor fixo';
    }

    if (rawType === 'freight' || rawType === 'shipping') {
      return 'Frete';
    }

    return 'Outro';
  }

  /** Monta valor do cupom (% ou R$) usando discountType/type/kind + value/amount */
  private buildDisplayValue(coupon: CouponWithMeta): string {
    const anyCoupon = coupon as any;

    const rawType = (
      anyCoupon.type ??
      anyCoupon.discountType ??
      anyCoupon.kind ??
      ''
    )
      .toString()
      .toLowerCase();

    const rawValue = Number(anyCoupon.value ?? anyCoupon.amount ?? 0);

    if (Number.isNaN(rawValue) || !rawValue) {
      return '—';
    }

    if (rawType === 'percent' || rawType === 'percentage') {
      return `${rawValue}%`;
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(rawValue);
  }

  async loadCoupons(): Promise<void> {
    this.loading.set(true);
    try {
      const rawList = await this.couponService.getAll();
      const list = rawList as CouponWithMeta[];

      const enriched = list.map((coupon) => {
        const c = coupon as CouponWithMeta & { [key: string]: any };

        if (c.id == null) c.id = c.code;
        if (c.name == null) c.name = c.code;

        c.typeLabel = c.typeLabel ?? this.buildTypeLabel(c);
        c.displayValue = c.displayValue ?? this.buildDisplayValue(c);

        return c;
      });

      this.coupons.set(enriched);
    } finally {
      this.loading.set(false);
    }
  }

  onSearchChange(value: string): void {
    this.query.set(value);
    this.page.set(1);
  }

  onPageChange(page: number): void {
    this.page.set(page);
  }

  trackById(_index: number, item: CouponWithMeta): string {
    const anyItem = item as any;
    return anyItem.id ?? item.code ?? String(_index);
  }
}
