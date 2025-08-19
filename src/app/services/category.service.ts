// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import { Category } from '../types/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories: Category[] = [
    { id: 1, name: 'Eletrônicos', description: 'Produtos eletrônicos variados', createdAt: '2023-01-10T10:00:00Z' },
    { id: 2, name: 'Moda', description: 'Roupas e acessórios de moda', createdAt: '2023-02-05T15:30:00Z' },
    { id: 3, name: 'Casa e Decoração', description: 'Produtos para casa e decoração', createdAt: '2023-03-01T12:45:00Z' },
    { id: 4, name: 'Esportes', description: 'Equipamentos e acessórios esportivos', createdAt: '2023-03-20T09:20:00Z' },
  ];

  getCategories(): Category[] {
    return this.categories;
  }

  addCategory(category: Omit<Category, 'id' | 'createdAt'>): void {
    const newId = this.categories.length
      ? Math.max(...this.categories.map(c => c.id)) + 1
      : 1;

    const newCategory: Category = {
      id: newId,
      createdAt: new Date().toISOString(),
      ...category,
    };

    this.categories.push(newCategory);
  }

  updateCategory(id: number, data: { name: string; description: string }): void {
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categories[index] = { ...this.categories[index], ...data };
    } else {
      throw new Error('Categoria não encontrada');
    }
  }

  deleteCategory(id: number): void {
    this.categories = this.categories.filter(c => c.id !== id);
  }
}
