// src/app/pages/products/edit-product-page.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductFormComponent } from '../../../components/product/product-form.component';
import { ProductService } from '../../../services/product.service';
import { BrandService } from '../../../services/brand.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../types/product.model';
import { Brand } from '../../../types/brand.model';
import { Category } from '../../../types/category.model';

@Component({
  selector: 'app-edit-product-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductFormComponent],
  templateUrl: './edit-product-page.component.html',
  styleUrls: ['./edit-product-page.component.css']
})
export class EditProductPageComponent implements OnInit {
  product: Product | null = null;
  categories: Category[] = [];
  brands: Brand[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const foundProduct = this.productService.getProducts().find(p => p.id === Number(idParam));
      if (foundProduct) {
        this.product = foundProduct;
      } else {
        alert('Produto não encontrado.');
        this.router.navigate(['/products']);
      }
      this.categories = this.categoryService.getCategories();
      this.brands = this.brandService.getBrands();
    }
  }

  handleSave(updatedProduct: Product): void {
    // Atualiza produto via service
    this.productService.addProduct(updatedProduct); // ou criar método update se existir
    this.router.navigate(['/products']);
  }

  handleCancel(): void {
    this.router.navigate(['/products']);
  }
}
