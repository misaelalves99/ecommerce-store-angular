// src/app/testing/mocks/categories.mock.ts
import { Category } from '../../core/models/category.model';

export const CATEGORIES_MOCK: Category[] = [
  {
    id: 'cat-fashion',
    name: 'Moda & Vestuário',
    slug: 'moda-vestuario',
    description: 'Roupas, camisetas, calças e acessórios de moda.',
    isActive: true,
    createdAt: new Date('2025-01-01T09:00:00Z'),
    updatedAt: new Date('2025-01-08T09:00:00Z'),
  } as Category,
  {
    id: 'cat-shoes',
    name: 'Calçados',
    slug: 'calcados',
    description: 'Tênis, sapatos sociais, botas e chinelos.',
    isActive: true,
    createdAt: new Date('2025-01-01T09:15:00Z'),
    updatedAt: new Date('2025-01-09T09:15:00Z'),
  } as Category,
  {
    id: 'cat-eletronics',
    name: 'Eletrônicos',
    slug: 'eletronicos',
    description: 'Fones, celulares, tablets, notebooks e mais.',
    isActive: true,
    createdAt: new Date('2025-01-01T09:30:00Z'),
    updatedAt: new Date('2025-01-11T09:30:00Z'),
  } as Category,
  {
    id: 'cat-accessories',
    name: 'Acessórios',
    slug: 'acessorios',
    description: 'Bonés, cintos, carteiras, mochilas e pequenos itens.',
    isActive: true,
    createdAt: new Date('2025-01-02T09:00:00Z'),
    updatedAt: new Date('2025-01-12T09:00:00Z'),
  } as Category,
  {
    id: 'cat-home',
    name: 'Casa & Conforto',
    slug: 'casa-conforto',
    description: 'Itens para casa, decoração e utilidades domésticas.',
    isActive: true,
    createdAt: new Date('2025-01-02T09:20:00Z'),
    updatedAt: new Date('2025-01-13T09:20:00Z'),
  } as Category,
  {
    id: 'cat-gaming',
    name: 'Games & Streaming',
    slug: 'games-streaming',
    description: 'Periféricos, cadeiras gamers, microfones e iluminação.',
    isActive: true,
    createdAt: new Date('2025-01-02T09:40:00Z'),
    updatedAt: new Date('2025-01-14T09:40:00Z'),
  } as Category,
];
