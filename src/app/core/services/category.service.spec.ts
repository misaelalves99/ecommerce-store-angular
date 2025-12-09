// src/app/services/category.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { Category } from '../types/category.model';
import { firstValueFrom } from 'rxjs';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar a lista inicial de categorias', async () => {
    const categories: Category[] = await firstValueFrom(service.getCategories());
    expect(categories.length).toBe(4);
    expect(categories[0].name).toBe('Eletrônicos');
    expect(categories[1].name).toBe('Moda');
  });

  it('deve adicionar uma nova categoria com id incremental e createdAt', async () => {
    const newCategory = { name: 'Jogos', description: 'Jogos de tabuleiro' };
    let categories: Category[] = await firstValueFrom(service.getCategories());
    const beforeCount = categories.length;

    await firstValueFrom(service.addCategory(newCategory));
    categories = await firstValueFrom(service.getCategories());

    expect(categories.length).toBe(beforeCount + 1);
    const added = categories[categories.length - 1];
    expect(added.name).toBe(newCategory.name);
    expect(added.description).toBe(newCategory.description);
    expect(added.id).toBeGreaterThan(0);
    expect(new Date(added.createdAt).toString()).not.toBe('Invalid Date');
  });

  it('deve atualizar uma categoria existente', async () => {
    const updateData = { name: 'Eletrônicos Atualizados', description: 'Novos produtos eletrônicos' };
    await firstValueFrom(service.updateCategory(1, updateData));

    const categories: Category[] = await firstValueFrom(service.getCategories());
    const updated = categories.find(c => c.id === 1);

    expect(updated).toBeTruthy();
    expect(updated?.name).toBe(updateData.name);
    expect(updated?.description).toBe(updateData.description);
  });

  it('deve retornar null ao atualizar categoria inexistente', async () => {
    const result = await firstValueFrom(service.updateCategory(999, { name: 'X', description: 'Y' }));
    expect(result).toBeNull();
  });

  it('deve deletar uma categoria existente', async () => {
    let categories: Category[] = await firstValueFrom(service.getCategories());
    const beforeCount = categories.length;

    await firstValueFrom(service.deleteCategory(2));
    categories = await firstValueFrom(service.getCategories());

    expect(categories.length).toBe(beforeCount - 1);
    expect(categories.find(c => c.id === 2)).toBeUndefined();
  });

  it('deve retornar categoria por id', async () => {
    const category = await firstValueFrom(service.getCategoryById(1));
    expect(category).toBeTruthy();
    expect(category?.id).toBe(1);
  });

  it('deve retornar null ao buscar categoria inexistente', async () => {
    const category = await firstValueFrom(service.getCategoryById(999));
    expect(category).toBeNull();
  });
});
