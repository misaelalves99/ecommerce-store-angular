// src/app/core/services/category.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Category } from '../models/category.model';
import { CATEGORIES_MOCK } from '../../testing/mocks/categories.mock';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // ✅ Agora as categorias vêm do CATEGORIES_MOCK
  private readonly categories$ = new BehaviorSubject<Category[]>(
    [...CATEGORIES_MOCK] as unknown as Category[],
  );

  getCategories(): Observable<Category[]> {
    return this.categories$.asObservable();
  }

  addCategory(
    category: Omit<Category, 'id'>,
  ): Observable<Category> {
    const current = this.categories$.value;
    const newId = this.generateCategoryId(current);

    const newCategory: Category = {
      ...(category as any),
      id: newId,
    } as Category;

    this.categories$.next([...current, newCategory]);
    return of(newCategory);
  }

  updateCategory(
    id: string,
    data: Partial<Category>,
  ): Observable<Category | null> {
    let updated: Category | null = null;

    const updatedCategories: Category[] = this.categories$.value.map((c) => {
      if (String(c.id) !== String(id)) return c;

      const merged = {
        ...(c as any),
        ...(data as any),
        id,
      } as Category;

      updated = merged;
      return merged;
    });

    if (updated) {
      this.categories$.next(updatedCategories);
      return of(updated);
    }

    return of(null);
  }

  deleteCategory(id: string): Observable<null> {
    this.categories$.next(
      this.categories$.value.filter((c) => String(c.id) !== String(id)),
    );
    return of(null);
  }

  getCategoryById(id: string): Observable<Category | null> {
    const category =
      this.categories$.value.find((c) => String(c.id) === String(id)) ?? null;
    return of(category);
  }

  /** Gera ids no padrão cat-XXXX para manter consistência com os mocks */
  private generateCategoryId(current: Category[]): string {
    const numericIds = current
      .map((c) => {
        const rawId = String((c as any).id ?? '');
        const match = rawId.match(/\d+/g);
        if (!match) return 0;
        return Number(match.join('')) || 0;
      })
      .filter((n) => !Number.isNaN(n));

    const next = numericIds.length ? Math.max(...numericIds) + 1 : 1;
    return `cat-${next}`;
  }
}
