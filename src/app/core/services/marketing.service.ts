// src/app/core/services/marketing.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Banner } from '../models/banner.model';
import { BANNERS_MOCK } from '../../testing/mocks/banners.mock';

@Injectable({
  providedIn: 'root',
})
export class MarketingService {
  /**
   * Estado interno de banners, inicializado com mocks em memória.
   */
  private readonly bannersSubject = new BehaviorSubject<Banner[]>([
    ...BANNERS_MOCK,
  ]);

  /**
   * Observable público (se quiser usar em outros lugares).
   */
  get banners$(): Observable<Banner[]> {
    return this.bannersSubject.asObservable();
  }

  /**
   * Retorna a lista atual de banners (Promise para ficar alinhado com a página).
   */
  async getBanners(): Promise<Banner[]> {
    return this.bannersSubject.value;
  }

  /**
   * Cria ou atualiza um banner em memória.
   */
  async upsertBanner(banner: Banner): Promise<Banner> {
    const current = this.bannersSubject.value;
    const now = new Date();

    const existingIndex = current.findIndex((b) => b.id === banner.id);
    let result: Banner;

    if (existingIndex >= 0) {
      // Atualização
      result = {
        ...current[existingIndex],
        ...banner,
        updatedAt: now,
      };

      const clone = [...current];
      clone[existingIndex] = result;
      this.bannersSubject.next(clone);
    } else {
      // Criação
      const id = banner.id || crypto.randomUUID();
      result = {
        ...banner,
        id,
        createdAt: banner.createdAt ?? now,
        updatedAt: banner.updatedAt ?? now,
      };

      this.bannersSubject.next([result, ...current]);
    }

    return result;
  }

  /**
   * Exclusão opcional (já deixo pronto caso você queira usar depois).
   */
  async deleteBanner(id: string): Promise<void> {
    const current = this.bannersSubject.value;
    const updated = current.filter((b) => b.id !== id);
    this.bannersSubject.next(updated);
  }
}
