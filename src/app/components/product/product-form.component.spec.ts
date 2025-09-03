import { render, screen, fireEvent } from '@testing-library/angular';
import { ProductFormComponent } from './product-form.component';
import type { Product } from '../../types/product.model';
import type { Category } from '../../types/category.model';
import type { Brand } from '../../types/brand.model';

describe('ProductFormComponent', () => {
  const categories: Category[] = [
    { id: 1, name: 'Categoria 1', description: 'Descrição 1', createdAt: '2025-08-23', isActive: true } // corrigido
  ];

  const brands: Brand[] = [
    { id: 1, name: 'Marca 1', createdAt: '2025-08-23', isActive: true }
  ];

  const initialData: Product = {
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
      componentProperties: { initialData, categories, brands }
    });

    const nameInput = screen.getByRole('textbox', { name: /Nome/i }) as HTMLInputElement;
    expect(nameInput.value).toBe(initialData.name);

    const priceInput = screen.getByRole('spinbutton', { name: /Preço/i }) as HTMLInputElement;
    expect(priceInput.value).toBe(initialData.price.toString());

    const stockInput = screen.getByRole('spinbutton', { name: /Estoque/i }) as HTMLInputElement;
    expect(stockInput.value).toBe(initialData.stock.toString());

    const activeCheckbox = screen.getByRole('checkbox', { name: /Ativo/i }) as HTMLInputElement;
    expect(activeCheckbox.checked).toBeTrue();
  });

  it('should show validation errors for empty fields', async () => {
    const invalidData: Product = { ...initialData, name: '', sku: '', price: 0, stock: -1 };
    await render(ProductFormComponent, {
      componentProperties: { initialData: invalidData, categories, brands }
    });

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(screen.getByText('Nome obrigatório')).toBeTruthy();
    expect(screen.getByText('SKU obrigatório')).toBeTruthy();
    expect(screen.getByText('Preço deve ser maior que 0')).toBeTruthy();
    expect(screen.getByText('Estoque não pode ser negativo')).toBeTruthy();
  });

  it('should emit onSubmit with valid data', async () => {
    const submitSpy = jasmine.createSpy('onSubmit');
    await render(ProductFormComponent, {
      componentProperties: { initialData, categories, brands, onSubmit: { emit: submitSpy } as any }
    });

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));
    expect(submitSpy).toHaveBeenCalledWith(initialData);
  });

  it('should emit onCancel when cancel button is clicked', async () => {
    const cancelSpy = jasmine.createSpy('onCancel');
    await render(ProductFormComponent, {
      componentProperties: { initialData, categories, brands, onCancel: { emit: cancelSpy } as any }
    });

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(cancelSpy).toHaveBeenCalled();
  });
});
