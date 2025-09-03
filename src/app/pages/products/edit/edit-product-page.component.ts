// src/app/pages/products/edit/edit-product-page.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../types/product.model';
import { Category } from '../../../types/category.model';
import { Brand } from '../../../types/brand.model';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { ProductFormComponent } from '../../../components/product/product-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './edit-product-page.component.html',
  styleUrls: ['./edit-product-page.component.css'],
})
export class EditProductPageComponent implements OnInit {
  product?: Product;
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
    const idParam = Number(this.route.snapshot.paramMap.get('id'));

    // Carrega categorias e marcas
    this.categoryService.getCategories().subscribe(cats => (this.categories = cats));
    this.brandService.getBrands().subscribe(bs => (this.brands = bs));

    // Carrega produto
    this.productService.getProducts().subscribe(products => {
      this.product = products.find(p => p.id === idParam);
      if (!this.product) {
        alert('Produto não encontrado.');
        this.router.navigate(['/products']);
      }
    });
  }

  handleSave(updatedProduct: Product) {
    if (!this.product) return;

    this.productService.updateProduct(this.product.id, updatedProduct).subscribe(() => {
      this.router.navigate(['/products']);
    });
  }

  handleCancel() {
    this.router.navigate(['/products']);
  }
}
