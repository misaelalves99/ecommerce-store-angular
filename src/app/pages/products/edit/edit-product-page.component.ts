// src/app/pages/products/edit/edit-product-page.component.ts

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../types/product.model';
import { Category } from '../../../types/category.model';
import { Brand } from '../../../types/brand.model';
import { ProductService } from '../../../services/product.service';
import { ProductFormComponent } from '../../../components/product/product-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './edit-product-page.component.html',
  styleUrls: ['./edit-product-page.component.css'],
})
export class EditProductPageComponent {
  product?: Product;
  categories: Category[] = [];
  brands: Brand[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    // Tipagem correta
    this.categories = this.productService['categoryService'].getCategories();
    this.brands = this.productService['brandService'].getBrands();

    const idParam = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProducts().subscribe(products => {
      this.product = products.find(p => p.id === idParam);
    });
  }

  handleSave(updatedProduct: Product) {
    if (this.product) {
      this.productService.updateProduct(this.product.id, updatedProduct);
      this.router.navigate(['/products']);
    }
  }

  handleCancel() {
    this.router.navigate(['/products']);
  }
}
