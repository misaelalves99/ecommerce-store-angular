import { Injectable } from '@angular/core';
import { Category } from '../types/category.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories: Category[] = [
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
  ];

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  addCategory(category: Omit<Category, 'id' | 'createdAt' | 'isActive'>): Observable<Category> {
    const newId = this.categories.length
      ? Math.max(...this.categories.map(c => c.id)) + 1
      : 1;

    const newCategory: Category = {
      id: newId,
      createdAt: new Date().toISOString(),
      isActive: true,
      ...category,
    };

    this.categories.push(newCategory);
    return of(newCategory);
  }

  updateCategory(id: number, data: { name: string; description: string; isActive?: boolean }): Observable<Category | null> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categories[index] = { ...this.categories[index], ...data };
      return of(this.categories[index]);
    }
    return of(null);
  }

  deleteCategory(id: number): Observable<null> {
    this.categories = this.categories.filter(c => c.id !== id);
    return of(null);
  }

  getCategoryById(id: number): Observable<Category | null> {
    const category = this.categories.find(c => c.id === id) || null;
    return of(category);
  }
}
