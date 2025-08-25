// src/app/services/brand.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { BrandService } from './brand.service';
import { Brand } from '../types/brand.model';

describe('BrandService', () => {
  let service: BrandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar a lista inicial de marcas', () => {
    const brands = service.getBrands();
    expect(brands.length).toBe(4);
    expect(brands[0].name).toBe('Nike');
    expect(brands[1].name).toBe('Adidas');
  });

  it('deve adicionar uma nova marca com id incremental e createdAt', () => {
    const name = 'Puma';
    const beforeCount = service.getBrands().length;

    service.addBrand(name);
    const brands = service.getBrands();

    expect(brands.length).toBe(beforeCount + 1);
    const newBrand = brands[brands.length - 1];
    expect(newBrand.name).toBe(name);
    expect(newBrand.id).toBeGreaterThan(0);
    expect(new Date(newBrand.createdAt).toString()).not.toBe('Invalid Date');
  });

  it('deve incrementar o id corretamente', () => {
    service.addBrand('Reebok');
    const brands = service.getBrands();
    const ids = brands.map(b => b.id);
    const maxId = Math.max(...ids);
    expect(ids[ids.length - 1]).toBe(maxId);
  });
});
