// src/app/core/services/brand.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Brand } from '../models/brand.model';
import { BRANDS_MOCK } from '../../testing/mocks/brands.mock';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  /**
   * Estado interno de marcas, inicializado com os mocks em memória.
   * Isso permite que a UI funcione mesmo sem backend.
   */
  private readonly brandsSubject = new BehaviorSubject<Brand[]>([
    ...BRANDS_MOCK,
  ]);

  /**
   * Expondo apenas o Observable (boa prática de encapsulamento).
   * Componentes assinam isso para reagir às mudanças.
   */
  getBrands(): Observable<Brand[]> {
    return this.brandsSubject.asObservable();
  }

  /**
   * Adiciona uma nova marca em memória.
   * Mantive a assinatura original (name: string) pra não quebrar nada.
   * Se quiser depois, podemos evoluir para payload com slug/description/etc.
   */
  addBrand(name: string): void {
    const current = this.brandsSubject.value;

    // Gera um id numérico simples baseado nos ids existentes
    const newIdNumber =
      current.length > 0
        ? Math.max(
            ...current.map((b) => {
              const numericId = Number((b as any).id);
              return Number.isNaN(numericId) ? 0 : numericId;
            }),
          ) + 1
        : 1;

    const now = new Date();

    const newBrand: Brand = {
      id: String(newIdNumber),
      name,
      slug: this.slugify(name),
      description: '',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    } as Brand;

    this.brandsSubject.next([...current, newBrand]);
  }

  /**
   * Atualiza apenas o nome da marca, mantendo o resto dos dados.
   * Também atualiza o slug e a data de atualização.
   */
  updateBrand(id: string, name: string): void {
    const now = new Date();

    const updated = this.brandsSubject.value.map((b) => {
      const currentId = String((b as any).id);

      if (currentId === id) {
        return {
          ...(b as any),
          name,
          slug: this.slugify(name),
          updatedAt: now,
        } as Brand;
      }

      return b;
    });

    this.brandsSubject.next(updated);
  }

  /**
   * Remove uma marca pelo id (em memória).
   */
  deleteBrand(id: string): void {
    const updated = this.brandsSubject.value.filter((b) => {
      const currentId = String((b as any).id);
      return currentId !== id;
    });

    this.brandsSubject.next(updated);
  }

  /**
   * Utilitário simples para gerar slug a partir do nome.
   */
  private slugify(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9]+/g, '-') // tudo que não é letra/número vira hífen
      .replace(/(^-|-$)+/g, ''); // remove hífens no começo/fim
  }
}
