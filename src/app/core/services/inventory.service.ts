// src/app/core/services/inventory.service.ts

import { inject, Injectable } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';

import { HttpService } from './http.service';
import { Stock, StockMovement } from '../models/stock.model';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Product } from '../models/product.model';

export interface StockAdjustmentPayload {
  productId: string;
  quantity: number;
  reason: string;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly http = inject(HttpService);

  getStock(): Observable<ApiResponse<Stock[]>> {
    return this.http.get<Stock[]>('/inventory');
  }

  getStockByProductId(productId: string): Observable<ApiResponse<Stock>> {
    return this.http.get<Stock>(`/inventory/${productId}`);
  }

  adjustStock(
    payload: StockAdjustmentPayload,
  ): Observable<ApiResponse<Stock>> {
    return this.http.post<Stock>('/inventory/adjust', payload);
  }

  hasStock(
    productId: string,
    quantity: number,
  ): Observable<ApiResponse<boolean>> {
    return this.http.get<boolean>(`/inventory/${productId}/has-stock`, {
      params: { quantity },
    });
  }

  /** Produtos com baixo estoque para o dashboard principal */
  getLowStockProducts(limit = 5): Observable<Product[]> {
    return this.http
      .get<Product[]>('/inventory/low-stock', {
        params: { limit } as any,
      })
      .pipe(map((res: ApiResponse<Product[]>) => res.data ?? []));
  }

  /** Snapshot completo de estoque para a tela de estoque */
  async getCurrentStock(): Promise<Stock[]> {
    const res = await firstValueFrom(this.getStock());
    return res.data ?? [];
  }

  /** Registrar movimentação a partir do formulário de ajuste */
  async registerMovement(movement: StockMovement): Promise<void> {
    const quantity =
      movement.operation === 'OUT'
        ? -Math.abs(movement.quantity)
        : Math.abs(movement.quantity);

    await firstValueFrom(
      this.adjustStock({
        productId: movement.productId,
        quantity,
        reason: movement.reason,
      }),
    );
  }

  refreshInventory(): void {
    // noop por enquanto (ponto de extensão para cache/revalidação)
  }
}
