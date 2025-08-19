// src/app/pages/products/create-product-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductFormComponent } from '../../../components/product/product-form.component';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { Product } from '../../../types/product.model';
import { Category } from '../../../types/category.model';
import { Brand } from '../../../types/brand.model';

@Component({
  selector: 'app-create-product-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './create-product-page.component.html',
  styleUrls: ['./create-product-page.component.css'],
})
export class CreateProductPageComponent {
  categories: Category[] = [];
  brands: Brand[] = [];
  emptyProduct: Product = {
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

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {
    this.categories = this.categoryService.getCategories();
    this.brands = this.brandService.getBrands();
  }

  handleSave(newProduct: Product) {
    this.productService.addProduct(newProduct);
    this.router.navigate(['/products']);
  }

  handleCancel() {
    this.router.navigate(['/products']);
  }
}
