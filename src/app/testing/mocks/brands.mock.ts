// src/app/testing/mocks/brands.mock.ts
import { Brand } from '../../core/models/brand.model';

export const BRANDS_MOCK: Brand[] = [
  {
    id: 'brand-acme',
    name: 'ACME Wear',
    slug: 'acme-wear',
    description: 'Marca própria focada em básicos premium.',
    isActive: true,
    createdAt: new Date('2025-01-01T08:00:00Z'),
    updatedAt: new Date('2025-01-10T08:00:00Z'),
  } as Brand,
  {
    id: 'brand-runfast',
    name: 'RunFast',
    slug: 'runfast',
    description: 'Linha esportiva focada em performance.',
    isActive: true,
    createdAt: new Date('2025-01-02T08:00:00Z'),
    updatedAt: new Date('2025-01-11T08:00:00Z'),
  } as Brand,
  {
    id: 'brand-soundmax',
    name: 'SoundMax',
    slug: 'soundmax',
    description: 'Especialista em áudio e equipamentos de som.',
    isActive: true,
    createdAt: new Date('2025-01-03T08:00:00Z'),
    updatedAt: new Date('2025-01-12T08:00:00Z'),
  } as Brand,
  {
    id: 'brand-urbanstyle',
    name: 'Urban Style Co.',
    slug: 'urban-style',
    description: 'Moda casual urbana para o dia a dia.',
    isActive: true,
    createdAt: new Date('2025-01-04T08:00:00Z'),
    updatedAt: new Date('2025-01-15T08:00:00Z'),
  } as Brand,
  {
    id: 'brand-gametech',
    name: 'GameTech Gear',
    slug: 'gametech-gear',
    description: 'Acessórios e periféricos focados em gamers.',
    isActive: true,
    createdAt: new Date('2025-01-05T08:00:00Z'),
    updatedAt: new Date('2025-01-16T08:00:00Z'),
  } as Brand,
  {
    id: 'brand-homeplus',
    name: 'HomePlus Essentials',
    slug: 'homeplus-essentials',
    description: 'Linha de utilidades domésticas e conforto para casa.',
    isActive: true,
    createdAt: new Date('2025-01-06T08:00:00Z'),
    updatedAt: new Date('2025-01-18T08:00:00Z'),
  } as Brand,
];
