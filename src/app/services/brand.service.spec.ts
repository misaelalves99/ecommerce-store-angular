// src/app/services/brand.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { BrandService } from './brand.service';
import { Brand } from '../types/brand.model';
import { firstValueFrom } from 'rxjs';

describe('BrandService', () => {
  let service: BrandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar a lista inicial de marcas', async () => {
    const brands: Brand[] = await firstValueFrom(service.getBrands());
    expect(brands.length).toBe(4);
    expect(brands[0].name).toBe('Nike');
    expect(brands[1].name).toBe('Adidas');
  });

  it('deve adicionar uma nova marca com id incremental e createdAt', async () => {
    const name = 'Puma';
    let brands: Brand[] = await firstValueFrom(service.getBrands());
    const beforeCount = brands.length;

    service.addBrand(name);
    brands = await firstValueFrom(service.getBrands());

    expect(brands.length).toBe(beforeCount + 1);
    const newBrand = brands[brands.length - 1];
    expect(newBrand.name).toBe(name);
    expect(newBrand.id).toBeGreaterThan(0);
    expect(new Date(newBrand.createdAt).toString()).not.toBe('Invalid Date');
  });

  it('deve incrementar o id corretamente', async () => {
    service.addBrand('Reebok');
    const brands: Brand[] = await firstValueFrom(service.getBrands());
    const ids = brands.map(b => b.id);
    const maxId = Math.max(...ids);
    expect(ids[ids.length - 1]).toBe(maxId);
  });

  it('deve atualizar uma marca existente', async () => {
    await firstValueFrom(service.getBrands());
    service.updateBrand(1, 'Nike Atualizada');
    const brands: Brand[] = await firstValueFrom(service.getBrands());
    const updated = brands.find(b => b.id === 1);
    expect(updated?.name).toBe('Nike Atualizada');
  });

  it('deve deletar uma marca existente', async () => {
    await firstValueFrom(service.getBrands());
    service.deleteBrand(2);
    const brands: Brand[] = await firstValueFrom(service.getBrands());
    expect(brands.find(b => b.id === 2)).toBeUndefined();
  });
});
