// src/app/features/marketing/coupons/pages/coupons-delete-page/coupons-delete-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CouponService } from '../../../../../core/services/coupon.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Coupon } from '../../../../../core/models/coupon.model';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

type CouponWithMeta = Partial<Coupon> & {
  id?: string | number;
  name?: string;
};

@Component({
  standalone: true,
  selector: 'app-coupons-delete-page',
  imports: [CommonModule, PageHeaderComponent, ButtonComponent],
  templateUrl: './coupons-delete-page.component.html',
  styleUrls: ['./coupons-delete-page.component.css'],
})
export class CouponsDeletePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly couponService = inject(CouponService);
  private readonly notificationService = inject(NotificationService);

  readonly loading = signal(true);
  readonly deleting = signal(false);
  readonly coupon = signal<CouponWithMeta | null>(null);

  constructor() {
    this.loadCoupon();
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
        this.notificationService.warning?.('Cupom não encontrado.');
        this.router.navigate(['/marketing/coupons']);
        return;
      }

      this.coupon.set({
        ...(found as Coupon),
        id: (found as any).id ?? (found as any).code,
        name: (found as any).name ?? (found as any).code,
      } as CouponWithMeta);
    } catch {
      this.notificationService.error(
        'Não foi possível carregar as informações do cupom.',
      );
      this.router.navigate(['/marketing/coupons']);
    } finally {
      this.loading.set(false);
    }
  }

  async confirmDelete(): Promise<void> {
    const coupon = this.coupon();
    if (!coupon) return;

    const id = (coupon as any).id ?? coupon.code;
    this.deleting.set(true);

    try {
      const svc: any = this.couponService;

      if (typeof svc.deleteCoupon === 'function') {
        await svc.deleteCoupon(id);
      } else if (typeof svc.delete === 'function') {
        await svc.delete(id);
      } else if (typeof svc.remove === 'function') {
        await svc.remove(id);
      } else {
        throw new Error('Método de exclusão não disponível no serviço de cupons.');
      }

      this.notificationService.success('Cupom excluído com sucesso.');
      this.router.navigate(['/marketing/coupons']);
    } catch (error) {
      console.error(error);
      this.notificationService.error(
        'Não foi possível excluir o cupom. Tente novamente.',
      );
    } finally {
      this.deleting.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['/marketing/coupons']);
  }
}
