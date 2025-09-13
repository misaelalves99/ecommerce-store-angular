// src/app/services/brand.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Brand } from '../types/brand.model';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  // 🔹 Subject interno para manter estado das marcas
  private brandsSubject = new BehaviorSubject<Brand[]>([
    { id: 1, name: 'Nike', createdAt: '2024-01-10T10:00:00Z', isActive: true },
    { id: 2, name: 'Adidas', createdAt: '2024-02-15T14:30:00Z', isActive: true },
    { id: 3, name: 'Apple', createdAt: '2024-03-20T09:15:00Z', isActive: true },
    { id: 4, name: 'Samsung', createdAt: '2024-04-25T16:45:00Z', isActive: true },
  ]);

  // 🔹 Expondo apenas o Observable (boa prática de encapsulamento)
  getBrands(): Observable<Brand[]> {
    return this.brandsSubject.asObservable();
  }

  addBrand(name: string): void {
    const current = this.brandsSubject.value;
    const newId = current.length ? Math.max(...current.map(b => b.id)) + 1 : 1;

    const newBrand: Brand = {
      id: newId,
      name,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    this.brandsSubject.next([...current, newBrand]);
  }

  updateBrand(id: number, name: string): void {
    const updated = this.brandsSubject.value.map(b =>
      b.id === id ? { ...b, name } : b
    );
    this.brandsSubject.next(updated);
  }

  deleteBrand(id: number): void {
    const updated = this.brandsSubject.value.filter(b => b.id !== id);
    this.brandsSubject.next(updated);
  }
}
