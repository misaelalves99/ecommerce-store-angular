// src/app/components/product/product-details.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { ProductDetailsComponent } from './product-details.component';
import type { Product } from '../../types/product.model';
import type { Brand } from '../../types/brand.model';
import type { Category } from '../../types/category.model';

describe('ProductDetailsComponent', () => {
  const mockCategory: Category = {
    id: 1,
    name: 'Categoria Teste',
    description: 'Descrição da categoria',
    createdAt: '2025-08-23'
  };

  const mockBrand: Brand = {
    id: 1,
    name: 'Marca Teste',
    createdAt: '2025-08-23'
  };

  const mockProduct: Product = {
    id: 1,
    name: 'Produto Teste',
    description: 'Descrição do produto teste',
    sku: 'SKU123',
    price: 199.9,
    stock: 50,
    categoryId: mockCategory.id,
    brandId: mockBrand.id,
    category: mockCategory,
    brand: mockBrand,
    isActive: true,
  };

  it('should render product details correctly', async () => {
    await render(ProductDetailsComponent, {
      componentProperties: { product: mockProduct }
    });

    expect(screen.getByText(mockProduct.name)).toBeTruthy();
    expect(screen.getByText(`Descrição:`).nextSibling?.textContent).toContain(mockProduct.description);
    expect(screen.getByText(`SKU:`).nextSibling?.textContent).toContain(mockProduct.sku);
    expect(screen.getByText(`Preço:`).nextSibling?.textContent).toContain('R$');
    expect(screen.getByText(`Estoque:`).nextSibling?.textContent).toContain(mockProduct.stock.toString());
    expect(screen.getByText(`Categoria:`).nextSibling?.textContent).toContain(mockCategory.name);
    expect(screen.getByText(`Marca:`).nextSibling?.textContent).toContain(mockBrand.name);
    expect(screen.getByText(`Status:`).nextSibling?.textContent).toContain('Ativo');
  });

  it('should format price correctly', async () => {
    const { fixture } = await render(ProductDetailsComponent, {
      componentProperties: { product: mockProduct }
    });

    const instance = fixture.componentInstance;
    const formatted = instance.formatPrice(1234.56);
    expect(formatted).toBe('R$ 1.234,56'); // formato pt-BR
  });

  it('should display "-" when category or brand is missing', async () => {
    const productNoCatBrand: Product = {
      ...mockProduct,
      category: undefined,
      brand: undefined
    };
    await render(ProductDetailsComponent, { componentProperties: { product: productNoCatBrand } });

    expect(screen.getByText(`Categoria:`).nextSibling?.textContent).toContain('-');
    expect(screen.getByText(`Marca:`).nextSibling?.textContent).toContain('-');
  });

  it('should display "Inativo" when product is not active', async () => {
    const inactiveProduct: Product = { ...mockProduct, isActive: false };
    await render(ProductDetailsComponent, { componentProperties: { product: inactiveProduct } });

    expect(screen.getByText(`Status:`).nextSibling?.textContent).toContain('Inativo');
  });
});
