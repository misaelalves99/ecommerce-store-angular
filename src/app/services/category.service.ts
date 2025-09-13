// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Category } from '../types/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories$ = new BehaviorSubject<Category[]>([
    {
      id: 1,
      name: 'Eletrônicos',
      description: 'Produtos eletrônicos variados',
      createdAt: '2023-01-10T10:00:00Z',
      isActive: true,
    },
    {
      id: 2,
      name: 'Moda',
      description: 'Roupas e acessórios de moda',
      createdAt: '2023-02-05T15:30:00Z',
      isActive: true,
    },
    {
      id: 3,
      name: 'Casa e Decoração',
      description: 'Produtos para casa e decoração',
      createdAt: '2023-03-01T12:45:00Z',
      isActive: true,
    },
    {
      id: 4,
      name: 'Esportes',
      description: 'Equipamentos e acessórios esportivos',
      createdAt: '2023-03-20T09:20:00Z',
      isActive: true,
    },
  ]);

  getCategories(): Observable<Category[]> {
    return this.categories$.asObservable();
  }

  addCategory(category: Omit<Category, 'id' | 'createdAt' | 'isActive'>): Observable<Category> {
    const current = this.categories$.value;
    const newId = current.length ? Math.max(...current.map(c => c.id)) + 1 : 1;

    const newCategory: Category = {
      id: newId,
      createdAt: new Date().toISOString(),
      isActive: true,
      ...category,
    };

    this.categories$.next([...current, newCategory]);
    return of(newCategory);
  }

  updateCategory(id: number, data: Partial<Category>): Observable<Category | null> {
    let updated: Category | null = null;

    const updatedCategories = this.categories$.value.map(c => {
      if (c.id === id) {
        updated = { ...c, ...data };
        return updated;
      }
      return c;
    });

    if (updated) {
      this.categories$.next(updatedCategories);
      return of(updated);
    }

    return of(null);
  }

  deleteCategory(id: number): Observable<null> {
    this.categories$.next(this.categories$.value.filter(c => c.id !== id));
    return of(null);
  }

  getCategoryById(id: number): Observable<Category | null> {
    const category = this.categories$.value.find(c => c.id === id) || null;
    return of(category);
  }
}
