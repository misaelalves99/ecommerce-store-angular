// src/app/services/brand.service.ts

import { Injectable } from '@angular/core';
import { Brand } from '../types/brand.model';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private brands: Brand[] = [
    { id: 1, name: 'Nike', createdAt: '2024-01-10T10:00:00Z' },
    { id: 2, name: 'Adidas', createdAt: '2024-02-15T14:30:00Z' },
    { id: 3, name: 'Apple', createdAt: '2024-03-20T09:15:00Z' },
    { id: 4, name: 'Samsung', createdAt: '2024-04-25T16:45:00Z' },
  ];

  getBrands(): Brand[] {
    return this.brands;
  }

  addBrand(name: string): void {
    const newId = this.brands.length
      ? Math.max(...this.brands.map((b) => b.id)) + 1
      : 1;

    const newBrand: Brand = {
      id: newId,
      name,
      createdAt: new Date().toISOString(),
    };
    this.brands.push(newBrand);
  }

  deleteBrand(id: number): void {
    this.brands = this.brands.filter((b) => b.id !== id);
  }
}
