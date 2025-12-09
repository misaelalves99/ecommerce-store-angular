// src/app/features/catalog/products/components/product-form/product-form.component.ts

import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';
import { CurrencyBrPipe } from '../../../../../shared/pipes/currency-br.pipe';

import { Category } from '../../../../../core/models/category.model';
import { Brand } from '../../../../../core/models/brand.model';
import { Product } from '../../../../../core/models/product.model';
import { CatalogService } from '../../../../../core/services/catalog.service';

@Component({
  standalone: true,
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CatalogService);

  @Input() title = 'Novo produto';
  @Input() submitLabel = 'Salvar produto';
  @Input() initialValue: Product | null = null;

  /**
   * Para não ficar brigando com o modelo rico de Product (Price/Stock),
   * aqui emitimos um payload “flat” que a página pai converte para Product.
   */
  @Output() submitted = new EventEmitter<{
    name: string;
    sku: string;
    price: number;
    brandId: string;
    categoryId: string;
    stock: number;
    minStock: number;
    isActive: boolean;
  }>();

  // Listas para selects (já desembrulhadas em Category[] / Brand[])
  readonly categoriesSig = toSignal(
    this.catalogService.getCategories(),
    { initialValue: [] as Category[] },
  );

  readonly brandsSig = toSignal(
    this.catalogService.getBrands(),
    { initialValue: [] as Brand[] },
  );

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    sku: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    brandId: ['', [Validators.required]],
    categoryId: ['', [Validators.required]],
    stock: [0, [Validators.required, Validators.min(0)]],
    minStock: [0, [Validators.min(0)]],
    isActive: [true],
  });

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.initialValue) return;

    const product = this.initialValue as any;

    this.form.patchValue({
      name: product.name ?? '',
      sku: product.sku ?? '',
      // Considera modelo Price: { amount, ... }
      price: product.price?.amount ?? 0,
      // Tenta usar brandId/categoryId diretos; se não tiver, cai para brand.id/category.id
      brandId: product.brandId ?? product.brand?.id ?? '',
      categoryId: product.categoryId ?? product.category?.id ?? '',
      // Considera modelo Stock: { quantityAvailable, lowStockThreshold, ... }
      stock: product.stock?.quantityAvailable ?? product.stock?.currentStock ?? 0,
      minStock:
        product.stock?.lowStockThreshold ?? product.stock?.minStock ?? 0,
      isActive: product.isActive ?? true,
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.submitted.emit({
      name: value.name,
      sku: value.sku,
      price: value.price,
      brandId: value.brandId,
      categoryId: value.categoryId,
      stock: value.stock,
      minStock: value.minStock,
      isActive: value.isActive,
    });
  }

  // Getters helpers para template, se precisar
  get nameCtrl() {
    return this.form.controls.name;
  }

  get skuCtrl() {
    return this.form.controls.sku;
  }

  get priceCtrl() {
    return this.form.controls.price;
  }

  get brandIdCtrl() {
    return this.form.controls.brandId;
  }

  get categoryIdCtrl() {
    return this.form.controls.categoryId;
  }

  get stockCtrl() {
    return this.form.controls.stock;
  }

  get minStockCtrl() {
    return this.form.controls.minStock;
  }
}
