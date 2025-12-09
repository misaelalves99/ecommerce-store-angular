// src/app/core/services/coupon.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Coupon } from '../models/coupon.model';
import { ApiResponse } from '../interfaces/api-response.interface';
import { COUPONS_MOCK } from '../../testing/mocks/coupons.mock';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  /**
   * Estado interno de cupons, inicializado com os mocks em memória.
   * Isso permite que as telas funcionem mesmo sem backend real.
   */
  private readonly couponsSubject = new BehaviorSubject<Coupon[]>(
    [...COUPONS_MOCK] as unknown as Coupon[],
  );

  /**
   * Lista de cupons (Observable no formato ApiResponse<Coupon[]>),
   * mantendo a assinatura anterior para compatibilidade.
   */
  getCoupons(): Observable<ApiResponse<Coupon[]>> {
    return this.couponsSubject.asObservable().pipe(
      map(
        (coupons): ApiResponse<Coupon[]> => ({
          data: coupons,
          success: true,
        }),
      ),
    );
  }

  /**
   * Cupom por id (Observable no formato ApiResponse<Coupon>).
   */
  getCoupon(id: string): Observable<ApiResponse<Coupon>> {
    return this.couponsSubject.asObservable().pipe(
      map((coupons) => {
        const found =
          coupons.find((c) => String((c as any).id) === String(id)) ?? null;

        return {
          data: found as Coupon | null,
          success: !!found,
        } as ApiResponse<Coupon>;
      }),
    );
  }

  /**
   * Helper usado pela tela de listagem.
   * Agora lê diretamente do BehaviorSubject.
   */
  async getAll(): Promise<Coupon[]> {
    return this.couponsSubject.value;
  }

  /**
   * Helper usado pela tela de edição/detalhes.
   */
  async getById(id: string): Promise<Coupon | null> {
    const current = this.couponsSubject.value;
    return (
      current.find((c) => String((c as any).id) === String(id)) ?? null
    );
  }

  /**
   * Criação de cupom em memória.
   * Mantém a assinatura async/Promise<Coupon>.
   */
  async create(payload: Partial<Coupon>): Promise<Coupon> {
    const current = this.couponsSubject.value;
    const now = new Date();

    const newId = this.generateId(current);

    const newCoupon: Coupon = {
      ...(payload as any),
      id: newId,
      createdAt: now,
      updatedAt: now,
    } as Coupon;

    this.couponsSubject.next([newCoupon, ...current]);

    return newCoupon;
  }

  /**
   * Atualização de cupom em memória.
   */
  async update(id: string, payload: Partial<Coupon>): Promise<Coupon> {
    const current = this.couponsSubject.value;
    let updatedCoupon: Coupon | null = null;
    const now = new Date();

    const updatedList = current.map((c) => {
      const currentId = String((c as any).id);
      if (currentId === String(id)) {
        updatedCoupon = {
          ...(c as any),
          ...(payload as any),
          id,
          updatedAt: now,
        } as Coupon;
        return updatedCoupon;
      }
      return c;
    });

    if (!updatedCoupon) {
      throw new Error('Cupom não encontrado para atualização.');
    }

    this.couponsSubject.next(updatedList);
    return updatedCoupon;
  }

  /**
   * Exclusão de cupom em memória.
   */
  async delete(id: string): Promise<void> {
    const current = this.couponsSubject.value;
    const updated = current.filter(
      (c) => String((c as any).id) !== String(id),
    );
    this.couponsSubject.next(updated);
  }

  /**
   * Gera um id simples baseado em números presentes nos ids existentes.
   * Ex.: c-bf-2025, c-welcome-10 → vira algo como "c-2026".
   */
  private generateId(current: Coupon[]): string {
    const numericIds = current
      .map((c) => {
        const rawId = String((c as any).id ?? '');
        const match = rawId.match(/\d+/g);
        if (!match) return 0;
        return Number(match.join('')) || 0;
      })
      .filter((n) => !Number.isNaN(n));

    const next = numericIds.length ? Math.max(...numericIds) + 1 : 1;
    return `c-${next}`;
  }
}
