// src/app/components/product/product-form.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- IMPORTAR FORMSMODULE
import { Category } from '../../types/category.model';
import { Brand } from '../../types/brand.model';
import { Product } from '../../types/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- ADICIONAR FORMSMODULE
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent {
  @Input() initialProduct: Product = {
    id: 0,
    name: '',
    description: '',
    sku: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    brandId: 0,
    isActive: true,
  };
  @Input() categories: Category[] = [];
  @Input() brands: Brand[] = [];

  @Output() submitEvent = new EventEmitter<Product>();
  @Output() cancelEvent = new EventEmitter<void>();

  product: Product = { ...this.initialProduct };
  errors: Partial<Record<keyof Product, string>> = {};

  ngOnInit() {
    this.product = { ...this.initialProduct };
  }

  handleSubmit() {
    this.errors = {};

    if (!this.product.name.trim()) this.errors.name = 'O nome é obrigatório.';
    if (!this.product.sku.trim()) this.errors.sku = 'SKU é obrigatório.';
    if (this.product.price <= 0) this.errors.price = 'Preço deve ser maior que zero.';
    if (this.product.stock < 0) this.errors.stock = 'Estoque não pode ser negativo.';

    if (Object.keys(this.errors).length > 0) return;

    this.submitEvent.emit({ ...this.product });
  }

  handleCancel() {
    this.cancelEvent.emit();
  }
}
