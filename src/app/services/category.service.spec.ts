// src/app/services/category.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { Category } from '../types/category.model';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar a lista inicial de categorias', () => {
    const categories = service.getCategories();
    expect(categories.length).toBe(4);
    expect(categories[0].name).toBe('Eletrônicos');
    expect(categories[1].name).toBe('Moda');
  });

  it('deve adicionar uma nova categoria com id incremental e createdAt', () => {
    const newCategory = { name: 'Jogos', description: 'Jogos de tabuleiro' };
    const beforeCount = service.getCategories().length;

    service.addCategory(newCategory);
    const categories = service.getCategories();

    expect(categories.length).toBe(beforeCount + 1);
    const added = categories[categories.length - 1];
    expect(added.name).toBe(newCategory.name);
    expect(added.description).toBe(newCategory.description);
    expect(added.id).toBeGreaterThan(0);
    expect(new Date(added.createdAt).toString()).not.toBe('Invalid Date');
  });

  it('deve atualizar uma categoria existente', () => {
    const updateData = { name: 'Eletrônicos Atualizados', description: 'Novos produtos eletrônicos' };
    service.updateCategory(1, updateData);

    const updated = service.getCategories().find(c => c.id === 1);
    expect(updated).toBeTruthy();
    expect(updated?.name).toBe(updateData.name);
    expect(updated?.description).toBe(updateData.description);
  });

  it('deve lançar erro ao atualizar categoria inexistente', () => {
    expect(() => service.updateCategory(999, { name: 'X', description: 'Y' })).toThrowError('Categoria não encontrada');
  });

  it('deve deletar uma categoria existente', () => {
    const beforeCount = service.getCategories().length;
    service.deleteCategory(2);
    const categories = service.getCategories();
    expect(categories.length).toBe(beforeCount - 1);
    expect(categories.find(c => c.id === 2)).toBeUndefined();
  });
});
