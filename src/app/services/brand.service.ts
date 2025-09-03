// src/app/services/brand.service.ts
import { Injectable } from '@angular/core';
import { Brand } from '../types/brand.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private brands: Brand[] = [
    { id: 1, name: 'Nike', createdAt: '2024-01-10T10:00:00Z', isActive: true },
    { id: 2, name: 'Adidas', createdAt: '2024-02-15T14:30:00Z', isActive: true },
    { id: 3, name: 'Apple', createdAt: '2024-03-20T09:15:00Z', isActive: true },
    { id: 4, name: 'Samsung', createdAt: '2024-04-25T16:45:00Z', isActive: true },
  ];

  // Retorna Observable<Brand[]> ao invés de array direto
  getBrands(): Observable<Brand[]> {
    return of(this.brands);
  }

  addBrand(name: string): void {
    const newId = this.brands.length
      ? Math.max(...this.brands.map(b => b.id)) + 1
      : 1;

    this.brands.push({
      id: newId,
      name,
      createdAt: new Date().toISOString(),
      isActive: true,
    });
  }

  updateBrand(id: number, name: string): void {
    const brand = this.brands.find(b => b.id === id);
    if (brand) brand.name = name;
  }

  deleteBrand(id: number): void {
    this.brands = this.brands.filter(b => b.id !== id);
  }
}
