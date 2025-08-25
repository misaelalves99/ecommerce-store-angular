// src/app/components/product/product-form.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { ProductFormComponent } from './product-form.component';
import type { Product } from '../../types/product.model';
import type { Category } from '../../types/category.model';
import type { Brand } from '../../types/brand.model';

describe('ProductFormComponent', () => {
  const categories: Category[] = [
    { id: 1, name: 'Categoria 1', description: 'Descrição 1', createdAt: '2025-08-23' }
  ];

  const brands: Brand[] = [
    { id: 1, name: 'Marca 1', createdAt: '2025-08-23' }
  ];

  const initialProduct: Product = {
    id: 0,
    name: 'Produto Teste',
    description: 'Descrição teste',
    sku: 'SKU123',
    price: 100,
    stock: 10,
    categoryId: 1,
    brandId: 1,
    isActive: true,
    category: categories[0],
    brand: brands[0],
  };

  it('should render initial values', async () => {
    await render(ProductFormComponent, {
      componentProperties: { initialProduct, categories, brands }
    });

    const nameInput = screen.getByRole('textbox', { name: /Nome/i }) as HTMLInputElement;
    expect(nameInput.value).toBe(initialProduct.name);

    const priceInput = screen.getByRole('spinbutton', { name: /Preço/i }) as HTMLInputElement;
    expect(priceInput.value).toBe(initialProduct.price.toString());

    const stockInput = screen.getByRole('spinbutton', { name: /Estoque/i }) as HTMLInputElement;
    expect(stockInput.value).toBe(initialProduct.stock.toString());

    const activeCheckbox = screen.getByRole('checkbox', { name: /Ativo/i }) as HTMLInputElement;
    expect(activeCheckbox.checked).toBeTrue();
  });

  it('should show validation errors for empty fields', async () => {
    const invalidProduct: Product = { ...initialProduct, name: '', sku: '', price: 0, stock: -1 };
    await render(ProductFormComponent, {
      componentProperties: { initialProduct: invalidProduct, categories, brands }
    });

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(screen.getByText('O nome é obrigatório.')).toBeTruthy();
    expect(screen.getByText('SKU é obrigatório.')).toBeTruthy();
    expect(screen.getByText('Preço deve ser maior que zero.')).toBeTruthy();
    expect(screen.getByText('Estoque não pode ser negativo.')).toBeTruthy();
  });

  it('should emit submitEvent with valid data', async () => {
    const submitSpy = jasmine.createSpy('submitEvent');
    await render(ProductFormComponent, {
      componentProperties: { initialProduct, categories, brands, submitEvent: { emit: submitSpy } as any }
    });

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));
    expect(submitSpy).toHaveBeenCalledWith(initialProduct);
  });

  it('should emit cancelEvent when cancel button is clicked', async () => {
    const cancelSpy = jasmine.createSpy('cancelEvent');
    await render(ProductFormComponent, {
      componentProperties: { initialProduct, categories, brands, cancelEvent: { emit: cancelSpy } as any }
    });

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(cancelSpy).toHaveBeenCalled();
  });
});
