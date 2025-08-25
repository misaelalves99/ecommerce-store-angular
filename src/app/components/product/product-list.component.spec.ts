// src/app/components/product/product-list.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { ProductListComponent } from './product-list.component';
import type { Product } from '../../types/product.model';
import type { Category } from '../../types/category.model';
import type { Brand } from '../../types/brand.model';

describe('ProductListComponent', () => {
  const categories: Category[] = [
    { id: 1, name: 'Categoria 1', description: 'Desc 1', createdAt: '2025-08-23' },
    { id: 2, name: 'Categoria 2', description: 'Desc 2', createdAt: '2025-08-23' }
  ];

  const brands: Brand[] = [
    { id: 1, name: 'Marca 1', createdAt: '2025-08-23' },
    { id: 2, name: 'Marca 2', createdAt: '2025-08-23' }
  ];

  const products: Product[] = [
    {
      id: 1,
      name: 'Produto 1',
      description: 'Descrição 1',
      sku: 'SKU1',
      price: 100,
      stock: 10,
      categoryId: 1,
      brandId: 1,
      isActive: true,
      category: categories[0],
      brand: brands[0],
    },
    {
      id: 2,
      name: 'Produto 2',
      description: 'Descrição 2',
      sku: 'SKU2',
      price: 50,
      stock: 0,
      categoryId: 2,
      brandId: 2,
      isActive: false,
      category: categories[1],
      brand: brands[1],
    },
  ];

  it('should render product rows', async () => {
    await render(ProductListComponent, {
      componentProperties: { products },
    });

    expect(screen.getByText('Produto 1')).toBeTruthy();
    expect(screen.getByText('Produto 2')).toBeTruthy();

    expect(screen.getAllByText('Ativo').length).toBe(1);
    expect(screen.getAllByText('Inativo').length).toBe(1);

    expect(screen.getByText('R$ 100,00')).toBeTruthy();
    expect(screen.getByText('R$ 50,00')).toBeTruthy();
  });

  it('should display category and brand names', async () => {
    await render(ProductListComponent, {
      componentProperties: { products },
    });

    expect(screen.getByText('Categoria 1')).toBeTruthy();
    expect(screen.getByText('Marca 2')).toBeTruthy();
  });

  it('should format currency correctly', () => {
    const instance = new ProductListComponent();
    expect(instance.formatCurrency(1234.56)).toBe('R$ 1.234,56');
  });
});
