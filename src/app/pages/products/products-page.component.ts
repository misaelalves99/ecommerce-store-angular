// src/app/pages/products/products-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductListComponent } from '../../components/product/product-list.component';
import { ProductService } from '../../services/product.service'; // <-- corrigido
import { Product } from '../../types/product.model';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductListComponent],
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
})
export class ProductsPageComponent {
  products: Product[] = [];

  // injetar o serviço correto
  constructor(private productService: ProductService) {
    this.products = this.productService.getProducts();
  }
}
