// src/app/components/product/product-form.component.ts

import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../types/product.model';
import { Brand } from '../../types/brand.model';
import { Category } from '../../types/category.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() initialData!: Product;
  @Input() categories: Category[] = [];
  @Input() brands: Brand[] = [];
  @Input() submitLabel: string = 'Salvar';

  @Output() onSubmit = new EventEmitter<Product>();
  @Output() onCancel = new EventEmitter<void>();

  product!: Product;
  errors: Partial<Record<keyof Product, string>> = {};

  ngOnInit() {
    this.product = { ...this.initialData };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData'] && changes['initialData'].currentValue) {
      this.product = { ...changes['initialData'].currentValue };
    }
  }

  handleSubmit() {
    const errs: Partial<Record<keyof Product, string>> = {};

    if (!this.product.name?.trim()) errs.name = 'Nome obrigatório';
    if (!this.product.sku?.trim()) errs.sku = 'SKU obrigatório';
    if (this.product.price == null || this.product.price <= 0) errs.price = 'Preço deve ser maior que 0';
    if (this.product.stock == null || this.product.stock < 0) errs.stock = 'Estoque não pode ser negativo';
    if (!this.product.categoryId) errs.categoryId = 'Categoria obrigatória';
    if (!this.product.brandId) errs.brandId = 'Marca obrigatória';

    if (Object.keys(errs).length > 0) {
      this.errors = errs;
      return;
    }

    this.errors = {};
    this.onSubmit.emit(this.product);
  }

  handleCancel() {
    this.onCancel.emit();
  }
}
